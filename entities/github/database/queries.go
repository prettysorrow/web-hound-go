package webhound_github_database

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5"
)

func GetUserById(db *pgx.Conn, ctx context.Context, id int64) (*User, error) {
	var user User
	row := db.QueryRow(ctx, "select * from github.user where id = $1;", id)
	err := row.Scan(&user.Id, &user.Username, &user.Pfp)
	if err != nil {
		err = fmt.Errorf("failed to select github user with id=%d: %w", id, err)
		return nil, err
	}

	return &user, nil
}

func GetUserByUsername(db *pgx.Conn, ctx context.Context, username string) (*User, error) {
	var user User
	row := db.QueryRow(ctx, "select * from github.user where username = $1;", username)
	err := row.Scan(&user.Id, &user.Username, &user.Pfp)
	if err != nil {
		err = fmt.Errorf("failed to select github user with username=%s: %w", username, err)
		return nil, err
	}

	return &user, nil
}

func GetFollowers(db *pgx.Conn, ctx context.Context, user_id int64) ([]User, error) {
	rows, err := db.Query(ctx, "select * from github.user where id in (select follower_id as id from github.follows where followee_id = $1);", user_id)
	if err != nil {
		err = fmt.Errorf("failed to select followers for user with user_id=%d: %w", user_id, err)
		return nil, err
	}

	var followers []User
	for rows.Next() {
		var follower User
		err := rows.Scan(&follower.Id, &follower.Username, &follower.Pfp)
		if err != nil {
			err = fmt.Errorf("failed to select a single follower for user with user_id=%d: %w", user_id, err)
			return nil, err
		}

		followers = append(followers, follower)
	}

	if err = rows.Err(); err != nil {
		err = fmt.Errorf("failed to select followers for user with user_id=%d: %w", user_id, err)
		return nil, err
	}

	return followers, nil
}

func GetFollowees(db *pgx.Conn, ctx context.Context, user_id int64) ([]User, error) {
	rows, err := db.Query(ctx, "select * from github.user where id in (select followee_id as id from github.follows where follower_id = $1);", user_id)
	if err != nil {
		err = fmt.Errorf("failed to select followees for user with user_id=%d: %w", user_id, err)
		return nil, err
	}

	var followees []User
	for rows.Next() {
		var followee User
		err := rows.Scan(&followee.Id, &followee.Username, &followee.Pfp)
		if err != nil {
			err = fmt.Errorf("failed to select a single followee for user with user_id=%d: %w", user_id, err)
			return nil, err
		}

		followees = append(followees, followee)
	}

	if err = rows.Err(); err != nil {
		err = fmt.Errorf("failed to select followees for user with user_id=%d: %w", user_id, err)
		return nil, err
	}

	return followees, nil
}

type PostUserInput struct {
	Username string
	Pfp      []byte
}

func PostUser(db *pgx.Conn, ctx context.Context, input PostUserInput) (*User, error) {
	var user User
	row := db.QueryRow(ctx, "insert into github.user (username, pfp) values ($1, $2) returning id, username, pfp;", input.Username, input.Pfp)
	err := row.Scan(&user.Id, &user.Username, &user.Pfp)
	if err != nil {
		err = fmt.Errorf("failed to insert github user with username=%s: %w", input.Username, err)
		return nil, err
	}

	return &user, nil
}

type PostFollowsInput struct {
	Followee int64
	Follower int64
}

func PostFollows(db *pgx.Conn, ctx context.Context, input PostFollowsInput) (*Follows, error) {
	var follows Follows
	row := db.QueryRow(ctx, "insert into github.follows (followee_id, follower_id) values ($1, $2) returning followee_id, follower_id;", input.Followee, input.Follower)
	err := row.Scan(&follows.FolloweeId, &follows.FollowerId)
	if err != nil {
		err = fmt.Errorf("failed to insert follows for users with ids %d and %d: %w", input.Followee, input.Follower, err)
		return nil, err
	}

	return &follows, nil
}
