package webhound_instagram_transport

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
	database "go.mod/entities/instagram/database"
	webhound_fetching "go.mod/services/fetching"
)

func GetInstagramUserOrFetch(db *pgxpool.Pool, ctx context.Context, fetching *webhound_fetching.Client, username string) (*InstagramUserPublicInfo, error) {
	user, err := database.SelectInstagramUserByUsername(db, ctx, username)
	if err == nil && user.Kind != "short" {
		return buildInstagramUserInfo(db, ctx, user)
	}

	fetched, err := fetching.GetInstagramUser(ctx, username)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch instagram user @%s from external service: %w", username, err)
	}

	if err := persistInstagramUser(db, ctx, fetched); err != nil {
		return nil, fmt.Errorf("failed to store fetched instagram user @%s: %w", username, err)
	}

	user, err = database.SelectInstagramUserByUsername(db, ctx, username)
	if err != nil {
		return nil, fmt.Errorf("failed to select instagram user @%s after fetching: %w", username, err)
	}

	return buildInstagramUserInfo(db, ctx, user)
}

func buildInstagramUserInfo(db *pgxpool.Pool, ctx context.Context, user *database.InstagramUser) (*InstagramUserPublicInfo, error) {
	if user.Kind == "private" {
		return &InstagramUserPublicInfo{Kind: user.Kind, Username: user.Username, PfpUrl: user.PfpUrl}, nil
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

	return &InstagramUserPublicInfo{
		Kind:      user.Kind,
		Username:  user.Username,
		PfpUrl:    user.PfpUrl,
		Followees: followees,
		Followers: followers,
	}, nil
}

func persistInstagramUser(db *pgxpool.Pool, ctx context.Context, fetched *webhound_fetching.InstagramUser) error {
	user, err := database.InsertInstagramUser(db, ctx, &database.InsertInstagramUserInput{Kind: "public", Username: fetched.Username, PfpUrl: fetched.AvatarUrl})
	if err != nil {
		return err
	}

	for _, followee := range fetched.Followees {
		followee_entity, err := database.InsertInstagramUser(db, ctx, &database.InsertInstagramUserInput{Kind: "short", Username: followee.Username, PfpUrl: followee.AvatarUrl})
		if err != nil {
			return fmt.Errorf("failed to store followee %s: %w", followee.Username, err)
		}

		if err := database.InsertInstagramFollows(db, ctx, &database.InsertInstagramFollowsInput{FolloweeId: followee_entity.Id, FollowerId: user.Id}); err != nil {
			return fmt.Errorf("failed to store follows %s->%s: %w", user.Username, followee.Username, err)
		}
	}

	for _, follower := range fetched.Followers {
		follower_entity, err := database.InsertInstagramUser(db, ctx, &database.InsertInstagramUserInput{Kind: "short", Username: follower.Username, PfpUrl: follower.AvatarUrl})
		if err != nil {
			return fmt.Errorf("failed to store follower %s: %w", follower.Username, err)
		}

		if err := database.InsertInstagramFollows(db, ctx, &database.InsertInstagramFollowsInput{FolloweeId: user.Id, FollowerId: follower_entity.Id}); err != nil {
			return fmt.Errorf("failed to store follows %s->%s: %w", follower.Username, user.Username, err)
		}
	}

	return nil
}
