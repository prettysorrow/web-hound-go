package webhound_instagram_transport

import (
	"context"
	"fmt"

	webhound_fetching "go.mod/services/fetching"
)

func GetInstagramUserOrFetch(ctx context.Context, fetching *webhound_fetching.Client, username string, followLimit int) (*InstagramUserPublicInfo, error) {
	if job := getInstagramJob(username); job != nil {
		done, err := job.state()
		if done {
			if err != nil {
				// Forget a failed job so the next request can retry.
				deleteInstagramJob(username)
				return nil, err
			}
			return buildInstagramUserInfo(job)
		}
		return inProgressInstagramUserInfo(job)
	}

	// The user is not cached: start the fetch and wait until the main profile
	// is stored so the response can carry partial data.
	job := startInstagramJob(fetching, username, followLimit)
	if !job.waitReady(ctx) {
		return nil, fmt.Errorf("timed out waiting for instagram user @%s", username)
	}
	return inProgressInstagramUserInfo(job)
}

func inProgressInstagramUserInfo(job *instagramFetchJob) (*InstagramUserPublicInfo, error) {
	info, err := buildInstagramUserInfo(job)
	if err != nil {
		return nil, err
	}
	if !job.finished() {
		info.Status = "in_progress"
	}
	return info, nil
}

func buildInstagramUserInfo(job *instagramFetchJob) (*InstagramUserPublicInfo, error) {
	job.mu.Lock()
	defer job.mu.Unlock()

	if job.err != nil {
		return nil, job.err
	}

	info := &InstagramUserPublicInfo{
		Kind:      "public",
		Username:  job.username,
		PfpUrl:    job.pfpUrl,
		Followees: append([]InstagramUserShort(nil), job.followees...),
		Followers: append([]InstagramUserShort(nil), job.followers...),
		Posts:     job.posts,
		Status:    "complete",
	}

	if job.isPrivate {
		info.Kind = "private"
		info.Followees = nil
		info.Followers = nil
		info.Posts = nil
	}

	return info, nil
}
