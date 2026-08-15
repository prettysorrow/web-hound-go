package webhound_instagram_transport

import (
	"context"
	"fmt"
	"sync"
	"time"

	webhound_fetching "go.mod/services/fetching"
)

// instagramPageDelay paces the paginated follow-list requests so Instagram's
// rate limit is less likely to trip.
const instagramPageDelay = 1500 * time.Millisecond

// instagramFetchJob fills in a user's followers/followees in the background
// and keeps everything in process memory (nothing is written to the
// database). The main profile is stored before the job signals ready, so a
// request can return a partial graph right away; the frontend polls until the
// job finishes.
type instagramFetchJob struct {
	mu          sync.Mutex
	ready       chan struct{}
	closeReady  sync.Once
	followLimit int

	username  string
	userId    string
	pfpUrl    string
	isPrivate bool

	followers []InstagramUserShort
	followees []InstagramUserShort
	posts     *InstagramPost

	done bool
	err  error
}

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

func deleteInstagramJob(username string) {
	jobsMu.Lock()
	defer jobsMu.Unlock()
	delete(jobs, username)
}

// startInstagramJob returns the running job for the user, or registers and
// launches a new one. The job stores the main profile before signalling
// ready, so the caller can immediately serve a partial graph.
func startInstagramJob(fetching *webhound_fetching.Client, username string, followLimit int) *instagramFetchJob {
	jobsMu.Lock()
	if job := jobs[username]; job != nil && !job.finished() {
		jobsMu.Unlock()
		return job
	}
	job := &instagramFetchJob{ready: make(chan struct{}), followLimit: followLimit, username: username}
	jobs[username] = job
	jobsMu.Unlock()

	go job.run(fetching, username)
	return job
}

func (j *instagramFetchJob) run(fetching *webhound_fetching.Client, username string) {
	ctx := context.Background()

	info, err := fetching.GetInstagramUserInfo(ctx, username)
	if err != nil {
		j.finish(fmt.Errorf("failed to fetch instagram user info @%s: %w", username, err))
		return
	}

	j.mu.Lock()
	j.userId = info.UserId
	j.pfpUrl = info.AvatarUrl
	j.isPrivate = info.IsPrivate
	j.mu.Unlock()
	j.signalReady()

	if info.IsPrivate {
		j.finish(nil)
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
		j.fetchList(fetching, "followers", username, info.UserId, limit)
	}()
	go func() {
		defer wg.Done()
		j.fetchList(fetching, "followees", username, info.UserId, limit)
	}()
	wg.Wait()

	if _, err := j.state(); err != nil {
		return
	}

	if media, err := fetching.GetInstagramUserMedia(ctx, username); err == nil {
		post, err := buildInstagramPost(media)
		if err != nil {
			j.finish(err)
			return
		}
		j.mu.Lock()
		j.posts = post
		j.mu.Unlock()
	}

	j.finish(nil)
}

func (j *instagramFetchJob) fetchList(fetching *webhound_fetching.Client, list, username, userId string, limit int) {
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

		added := make([]InstagramUserShort, 0, len(chunk.Users))
		for _, u := range chunk.Users {
			if collected >= limit {
				break
			}
			added = append(added, InstagramUserShort{Kind: "short", Username: u.Username, PfpUrl: u.AvatarUrl})
			collected++
		}

		j.mu.Lock()
		if list == "followers" {
			j.followers = append(j.followers, added...)
		} else {
			j.followees = append(j.followees, added...)
		}
		j.mu.Unlock()

		if chunk.Done || chunk.NextMaxId == "" || len(chunk.Users) == 0 {
			return
		}
		maxId = chunk.NextMaxId
		time.Sleep(instagramPageDelay)
	}
}

func buildInstagramPost(fetched *webhound_fetching.InstagramUser) (*InstagramPost, error) {
	if len(fetched.Medias) == 0 {
		return nil, nil
	}

	media := make([]InstagramMedia, 0, len(fetched.Medias))
	for _, m := range fetched.Medias {
		media = append(media, InstagramMedia{Kind: m.Type, Url: m.Url})
	}

	return &InstagramPost{Description: "", Media: media}, nil
}
