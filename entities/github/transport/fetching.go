package webhound_github_transport

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
	database "go.mod/entities/github/database"
	webhound_fetching "go.mod/services/fetching"
)

func GetUserDtoOrFetch(db *pgxpool.Pool, ctx context.Context, fetching *webhound_fetching.Client, username string, limit int) (*User, error) {
	user_dto, err := GetUserDto(db, ctx, username)
	if err == nil && user_dto.Verbose {
		return user_dto, nil
	}

	fetched, err := fetching.GetGitHubUser(ctx, username, limit)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch github user @%s from external service: %w", username, err)
	}

	if err := persistGitHubUser(db, ctx, fetched); err != nil {
		return nil, fmt.Errorf("failed to store fetched github user @%s: %w", username, err)
	}

	return GetUserDto(db, ctx, username)
}

func persistGitHubUser(db *pgxpool.Pool, ctx context.Context, fetched *webhound_fetching.GitHubUser) error {
	user, err := database.PostUser(db, ctx, database.PostUserInput{Username: fetched.Username, PfpUrl: fetched.AvatarUrl, Verbose: true})
	if err != nil {
		return err
	}

	for _, followee := range fetched.Followees {
		followee_entity, err := database.PostUser(db, ctx, database.PostUserInput{Username: followee.Username, PfpUrl: followee.AvatarUrl, Verbose: false})
		if err != nil {
			return fmt.Errorf("failed to store followee %s: %w", followee.Username, err)
		}

		_, err = database.PostFollows(db, ctx, database.PostFollowsInput{Followee: followee_entity.Id, Follower: user.Id})
		if err != nil {
			return fmt.Errorf("failed to store follows %s->%s: %w", user.Username, followee.Username, err)
		}
	}

	for _, follower := range fetched.Followers {
		follower_entity, err := database.PostUser(db, ctx, database.PostUserInput{Username: follower.Username, PfpUrl: follower.AvatarUrl, Verbose: false})
		if err != nil {
			return fmt.Errorf("failed to store follower %s: %w", follower.Username, err)
		}

		_, err = database.PostFollows(db, ctx, database.PostFollowsInput{Followee: user.Id, Follower: follower_entity.Id})
		if err != nil {
			return fmt.Errorf("failed to store follows %s->%s: %w", follower.Username, user.Username, err)
		}
	}

	return nil
}
