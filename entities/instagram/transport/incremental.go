package webhound_instagram_transport

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	database "go.mod/entities/instagram/database"
	webhound_fetching "go.mod/services/fetching"
)

// instagramFetchJob fills in a user's followers/followees in the background.
// The main profile is persisted before the job signals ready, so a request can
// return a partial graph right away; the frontend polls until the job
// finishes.
type instagramFetchJob struct {
	mu          sync.Mutex
	ready       chan struct{}
	closeReady  sync.Once
	followLimit int
	done        bool
	err         error
}

// instagramPageDelay paces the paginated follow-list requests so Instagram's
// rate limit is less likely to trip.
const instagramPageDelay = 1500 * time.Millisecond

func (j *instagramFetchJob) signalReady() {
	j.closeReady.Do(func() { close(j.ready) })
}

func (j *instagramFetchJob) finish(err error) {
	j.mu.Lock()
	j.done = true
	j.err = err
	j.mu.Unlock()
	j.signalReady()
}

func (j *instagramFetchJob) state() (done bool, err error) {
	j.mu.Lock()
	defer j.mu.Unlock()
	return j.done, j.err
}

func (j *instagramFetchJob) finished() bool {
	done, _ := j.state()
	return done
}

func (j *instagramFetchJob) waitReady(ctx context.Context) bool {
	select {
	case <-j.ready:
		return true
	case <-ctx.Done():
		return false
	}
}

var (
	jobsMu sync.Mutex
	jobs   = map[string]*instagramFetchJob{}
)

func getInstagramJob(username string) *instagramFetchJob {
	jobsMu.Lock()
	defer jobsMu.Unlock()
	return jobs[username]
}

// startInstagramJob returns the running job for the user, or registers and
// launches a new one. The job persists the main profile before signalling
// ready, so the caller can immediately serve a partial graph.
func startInstagramJob(db *pgxpool.Pool, fetching *webhound_fetching.Client, username string, followLimit int) *instagramFetchJob {
	jobsMu.Lock()
	if job := jobs[username]; job != nil && !job.finished() {
		jobsMu.Unlock()
		return job
	}
	job := &instagramFetchJob{ready: make(chan struct{}), followLimit: followLimit}
	jobs[username] = job
	jobsMu.Unlock()

	go job.run(db, fetching, username)
	return job
}

func (j *instagramFetchJob) run(db *pgxpool.Pool, fetching *webhound_fetching.Client, username string) {
	ctx := context.Background()

	info, err := fetching.GetInstagramUserInfo(ctx, username)
	if err != nil {
		j.finish(fmt.Errorf("failed to fetch instagram user info @%s: %w", username, err))
		return
	}

	kind := "public"
	if info.IsPrivate {
		kind = "private"
	}
	mainUser, err := database.InsertInstagramUser(db, ctx, &database.InsertInstagramUserInput{Kind: kind, Username: username, PfpUrl: info.AvatarUrl})
	if err != nil {
		j.finish(fmt.Errorf("failed to store instagram user @%s: %w", username, err))
		return
	}
	j.signalReady()

	if info.IsPrivate {
		j.finish(nil)
		return
	}

	// Reset edges from an earlier run so the graph reflects only this fetch.
	if err := database.DeleteInstagramConnections(db, ctx, mainUser.Id); err != nil {
		j.finish(fmt.Errorf("failed to reset instagram graph @%s: %w", username, err))
		return
	}

	limit := info.FollowLimit
	if j.followLimit > 0 {
		limit = j.followLimit
	}

	var wg sync.WaitGroup
	wg.Add(2)
	go func() {
		defer wg.Done()
		j.fetchList(db, fetching, "followers", username, info.UserId, mainUser.Id, limit)
	}()
	go func() {
		defer wg.Done()
		j.fetchList(db, fetching, "followees", username, info.UserId, mainUser.Id, limit)
	}()
	wg.Wait()

	if _, err := j.state(); err != nil {
		return
	}

	if media, err := fetching.GetInstagramUserMedia(ctx, username); err == nil {
		if err := persistInstagramMedias(db, ctx, mainUser.Id, media); err != nil {
			j.finish(fmt.Errorf("failed to store instagram media @%s: %w", username, err))
			return
		}
	}

	j.finish(nil)
}

func (j *instagramFetchJob) fetchList(db *pgxpool.Pool, fetching *webhound_fetching.Client, list, username, userId string, mainUserId int64, limit int) {
	ctx := context.Background()
	maxId := ""
	collected := 0

	for {
		if collected >= limit {
			return
		}

		chunk, err := fetching.GetInstagramUserChunk(ctx, list, username, userId, maxId)
		if err != nil {
			j.finish(fmt.Errorf("failed to fetch instagram %s chunk @%s: %w", list, username, err))
			return
		}

		for _, u := range chunk.Users {
			if collected >= limit {
				return
			}
			if err := persistInstagramConnection(db, ctx, list, mainUserId, u); err != nil {
				j.finish(err)
				return
			}
			collected++
		}

		if chunk.Done || chunk.NextMaxId == "" || len(chunk.Users) == 0 {
			return
		}
		maxId = chunk.NextMaxId
		time.Sleep(instagramPageDelay)
	}
}

func persistInstagramConnection(db *pgxpool.Pool, ctx context.Context, list string, mainUserId int64, u *webhound_fetching.InstagramUser) error {
	user, err := database.UpsertInstagramUserConnection(db, ctx, &database.InsertInstagramUserInput{Username: u.Username, PfpUrl: u.AvatarUrl})
	if err != nil {
		return fmt.Errorf("failed to store instagram %s %s: %w", list, u.Username, err)
	}

	if list == "followers" {
		return database.InsertInstagramFollows(db, ctx, &database.InsertInstagramFollowsInput{FolloweeId: mainUserId, FollowerId: user.Id})
	}
	return database.InsertInstagramFollows(db, ctx, &database.InsertInstagramFollowsInput{FolloweeId: user.Id, FollowerId: mainUserId})
}

func persistInstagramMedias(db *pgxpool.Pool, ctx context.Context, userId int64, fetched *webhound_fetching.InstagramUser) error {
	if len(fetched.Medias) == 0 {
		return nil
	}

	post, err := database.InsertInstagramPost(db, ctx, &database.InsertInstagramPostInput{UserId: userId, Description: ""})
	if err != nil {
		return err
	}

	for _, media := range fetched.Medias {
		if err := database.InsertInstagramMedia(db, ctx, &database.InsertInstagramMediaInput{PostId: post.Id, Kind: media.Type, Url: media.Url}); err != nil {
			return err
		}
	}

	return nil
}
