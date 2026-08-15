package webhound_instagram_transport

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
	database "go.mod/entities/instagram/database"
	webhound_fetching "go.mod/services/fetching"
)

func GetInstagramUserOrFetch(db *pgxpool.Pool, ctx context.Context, fetching *webhound_fetching.Client, username string, followLimit int) (*InstagramUserPublicInfo, error) {
	user, err := database.SelectInstagramUserByUsername(db, ctx, username)
	if err == nil && user.Kind != "short" {
		// An in-flight background fetch keeps the graph "in_progress" so the
		// frontend keeps polling; otherwise serve the cached graph.
		if job := getInstagramJob(username); job != nil && !job.finished() {
			return inProgressInstagramUserInfo(db, ctx, user)
		}
		return buildInstagramUserInfo(db, ctx, user)
	}

	// The user is not cached (or is a "short" connection-only record): start
	// the fetch and wait until the main profile is persisted so the response
	// can carry partial data.
	job := startInstagramJob(db, fetching, username, followLimit)
	if !job.waitReady(ctx) {
		return nil, fmt.Errorf("timed out waiting for instagram user @%s", username)
	}
	if _, err := job.state(); err != nil {
		return nil, err
	}

	user, err = database.SelectInstagramUserByUsername(db, ctx, username)
	if err != nil {
		return nil, fmt.Errorf("failed to select instagram user @%s after fetching: %w", username, err)
	}
	return inProgressInstagramUserInfo(db, ctx, user)
}

func inProgressInstagramUserInfo(db *pgxpool.Pool, ctx context.Context, user *database.InstagramUser) (*InstagramUserPublicInfo, error) {
	info, err := buildInstagramUserInfo(db, ctx, user)
	if err != nil {
		return nil, err
	}
	info.Status = "in_progress"
	return info, nil
}

func buildInstagramUserInfo(db *pgxpool.Pool, ctx context.Context, user *database.InstagramUser) (*InstagramUserPublicInfo, error) {
	if user.Kind == "private" {
		return &InstagramUserPublicInfo{
			Kind:     user.Kind,
			Username: user.Username,
			PfpUrl:   user.PfpUrl,
			Status:   "complete",
		}, nil
	}

	followees_entity, err := database.SelectInstagramFollowees(db, ctx, user.Id)
	if err != nil {
		return nil, fmt.Errorf("failed to select followees: %w", err)
	}

	followers_entity, err := database.SelectInstagramFollowers(db, ctx, user.Id)
	if err != nil {
		return nil, fmt.Errorf("failed to select followers: %w", err)
	}

	followees := make([]InstagramUserShort, 0, len(followees_entity))
	for _, followee := range followees_entity {
		followees = append(followees, InstagramUserShort{Kind: "short", Username: followee.Username, PfpUrl: followee.PfpUrl})
	}

	followers := make([]InstagramUserShort, 0, len(followers_entity))
	for _, follower := range followers_entity {
		followers = append(followers, InstagramUserShort{Kind: "short", Username: follower.Username, PfpUrl: follower.PfpUrl})
	}

	posts_entity, err := database.SelectInstagramPostsByUserId(db, ctx, user.Id)
	if err != nil {
		return nil, fmt.Errorf("failed to select posts: %w", err)
	}

	var posts *InstagramPost
	if len(posts_entity) > 0 {
		post_entity := posts_entity[0]

		media_entity, err := database.SelectInstagramMediaByPostId(db, ctx, post_entity.Id)
		if err != nil {
			return nil, fmt.Errorf("failed to select media: %w", err)
		}

		media := make([]InstagramMedia, 0, len(media_entity))
		for _, m := range media_entity {
			media = append(media, InstagramMedia{Kind: m.Kind, Url: m.Url})
		}

		posts = &InstagramPost{Description: post_entity.Description, Media: media}
	}

	return &InstagramUserPublicInfo{
		Kind:      user.Kind,
		Username:  user.Username,
		PfpUrl:    user.PfpUrl,
		Followees: followees,
		Followers: followers,
		Posts:     posts,
		Status:    "complete",
	}, nil
}
