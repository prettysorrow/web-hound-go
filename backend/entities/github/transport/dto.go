package webhound_github_transport

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
	database "go.mod/entities/github/database"
)

type User struct {
	Username  string `json:"username"`
	Verbose   bool   `json:"verbose"`
	PfpUrl    string `json:"pfp_url"`
	Followers []User `json:"followers"`
	Followees []User `json:"followees"`
}

func GetUserDto(db *pgxpool.Pool, ctx context.Context, username string) (*User, error) {
	user_entity, err := database.GetUserByUsername(db, ctx, username)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch user @%s: %w", username, err)
	}

	var user_dto User
	user_dto.Username = user_entity.Username
	user_dto.Verbose = user_entity.Verbose
	user_dto.PfpUrl = user_entity.PfpUrl

	if !user_dto.Verbose { // it means followers and followees are not specified in db
		return &user_dto, nil
	}

	followers_entity, err := database.GetFollowers(db, ctx, user_entity.Id)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch followers for user @%s: %w", username, err)
	}

	followees_entity, err := database.GetFollowees(db, ctx, user_entity.Id)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch followees for user @%s: %w", username, err)
	}

	for _, follower_entity := range followers_entity {
		follower_dto := User{Username: follower_entity.Username, PfpUrl: follower_entity.PfpUrl, Verbose: false}
		user_dto.Followers = append(user_dto.Followers, follower_dto)
	}

	for _, followee_entity := range followees_entity {
		followee_dto := User{Username: followee_entity.Username, PfpUrl: followee_entity.PfpUrl, Verbose: false}
		user_dto.Followees = append(user_dto.Followees, followee_dto)
	}

	return &user_dto, nil
}

func PostUserDto(db *pgxpool.Pool, ctx context.Context, user_dto *User) (*database.User, error) {
	user_entity, err := database.PostUser(db, ctx, database.PostUserInput{Username: user_dto.Username, PfpUrl: user_dto.PfpUrl, Verbose: true})
	if err != nil {
		return nil, fmt.Errorf("failed to post user %s: %w", user_dto.Username, err)
	}

	for _, followee_dto := range user_dto.Followees {
		followee_entity, err := database.PostUser(db, ctx, database.PostUserInput{Username: followee_dto.Username, PfpUrl: followee_dto.PfpUrl, Verbose: false})
		if err != nil {
			return nil, fmt.Errorf("failed to post followee %s for user %s: %w", followee_dto.Username, user_dto.Username, err)
		}

		_, err = database.PostFollows(db, ctx, database.PostFollowsInput{Followee: followee_entity.Id, Follower: user_entity.Id})
		if err != nil {
			return nil, fmt.Errorf("failed to post follows %s->%s: %w", user_dto.Username, followee_dto.Username, err)
		}
	}

	for _, follower_dto := range user_dto.Followers {
		follower_entity, err := database.PostUser(db, ctx, database.PostUserInput{Username: follower_dto.Username, PfpUrl: follower_dto.PfpUrl, Verbose: false})
		if err != nil {
			return nil, fmt.Errorf("failed to post follower %s for user %s: %w", follower_dto.Username, user_dto.Username, err)
		}

		_, err = database.PostFollows(db, ctx, database.PostFollowsInput{Followee: user_entity.Id, Follower: follower_entity.Id})
		if err != nil {
			return nil, fmt.Errorf("failed to post follows %s->%s: %w", follower_dto.Username, user_dto.Username, err)
		}
	}

	return user_entity, nil
}

func GetUsersDto(db *pgxpool.Pool, ctx context.Context) ([]*User, error) {
	users_entities, err := database.GetUsers(db, ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch users: %w", err)
	}

	users := []*User{}
	for _, user_entity := range users_entities {
		user_dto, err := GetUserDto(db, ctx, user_entity.Username)

		if err != nil {
			return nil, fmt.Errorf("failed to fetch users: failed to fetch a single user: %w", err)
		}

		users = append(users, user_dto)
	}

	return users, nil
}
