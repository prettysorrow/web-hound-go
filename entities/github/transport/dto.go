package webhound_github_transport

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5"
	database "go.mod/entities/github/database"
)

type User struct {
	Username  string `json:"username"`
	Pfp       []byte `json:"pfp"`
	Followers []User `json:"followers"`
	Followees []User `json:"followees"`
}

func GetUserDto(db *pgx.Conn, ctx context.Context, username string) (*User, error) {
	user_entity, err := database.GetUserByUsername(db, ctx, username)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch user @%s: %w", username, err)
	}

	followers_entity, err := database.GetFollowers(db, ctx, user_entity.Id)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch followers for user @%s: %w", username, err)
	}

	followees_entity, err := database.GetFollowees(db, ctx, user_entity.Id)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch followees for user @%s: %w", username, err)
	}

	var user_dto User

	user_dto.Username = username
	user_dto.Pfp = user_entity.Pfp

	for _, follower_entity := range followers_entity {
		follower_dto := User{Username: follower_entity.Username}
		user_dto.Followers = append(user_dto.Followers, follower_dto)
	}

	for _, followee_entity := range followees_entity {
		followee_dto := User{Username: followee_entity.Username}
		user_dto.Followees = append(user_dto.Followees, followee_dto)
	}

	return &user_dto, nil
}

func PostUserDto(db *pgx.Conn, ctx context.Context, user_dto *User) (*database.User, error) {
	user_entity, err := database.PostUser(db, ctx, database.PostUserInput{Username: user_dto.Username, Pfp: user_dto.Pfp})
	if err != nil {
		return nil, fmt.Errorf("failed to post user %s: %w", user_dto.Username, err)
	}

	for _, followee_dto := range user_dto.Followees {
		followee_entity, err := database.PostUser(db, ctx, database.PostUserInput{Username: followee_dto.Username})
		if err != nil {
			return nil, fmt.Errorf("failed to post followee %s for user %s: %w", followee_dto.Username, user_dto.Username, err)
		}

		_, err = database.PostFollows(db, ctx, database.PostFollowsInput{Followee: followee_entity.Id, Follower: user_entity.Id})
		if err != nil {
			return nil, fmt.Errorf("failed to post follows %s->%s: %w", user_dto.Username, followee_dto.Username, err)
		}
	}

	for _, follower_dto := range user_dto.Followers {
		follower_entity, err := database.PostUser(db, ctx, database.PostUserInput{Username: follower_dto.Username})
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
