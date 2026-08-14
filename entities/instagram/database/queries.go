package webhound_instagram_database

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
)

type InsertInstagramUserInput struct {
	Kind     string
	Username string
	PfpUrl   string
}

func InsertInstagramUser(db *pgxpool.Pool, ctx context.Context, user *InsertInstagramUserInput) (*InstagramUser, error) {
	var id int64
	row := db.QueryRow(ctx,
		`insert into instagram."user" (kind, username, pfp_url)
		values ($1, $2, $3)
		on conflict (username)
		do update set
			kind = excluded.kind,
			pfp_url = excluded.pfp_url
		returning id;`,
		user.Kind, user.Username, user.PfpUrl)
	if err := row.Scan(&id); err != nil {
		return nil, fmt.Errorf("failed to insert instagram user: %w", err)
	}

	return &InstagramUser{Id: id, Kind: user.Kind, Username: user.Username, PfpUrl: user.PfpUrl}, nil
}

func SelectInstagramUserByUsername(db *pgxpool.Pool, ctx context.Context, username string) (*InstagramUser, error) {
	var user InstagramUser
	row := db.QueryRow(ctx, "select id, kind, username, pfp_url from instagram.user where username = $1;", username)
	if err := row.Scan(&user.Id, &user.Kind, &user.Username, &user.PfpUrl); err != nil {
		return nil, fmt.Errorf("failed to select instagram user: %w", err)
	}

	return &user, nil
}

func SelectInstagramUserById(db *pgxpool.Pool, ctx context.Context, id int64) (*InstagramUser, error) {
	var user InstagramUser
	row := db.QueryRow(ctx, "select id, kind, username, pfp_url from instagram.user where id = $1;", id)
	if err := row.Scan(&user.Id, &user.Kind, &user.Username, &user.PfpUrl); err != nil {
		return nil, fmt.Errorf("failed to select instagram user: %w", err)
	}

	return &user, nil
}

type InsertInstagramFollowsInput struct {
	FolloweeId int64
	FollowerId int64
}

func InsertInstagramFollows(db *pgxpool.Pool, ctx context.Context, input *InsertInstagramFollowsInput) error {
	_, err := db.Exec(ctx, "insert into instagram.follows (followee_id, follower_id) values ($1, $2);", input.FolloweeId, input.FollowerId)
	if err != nil {
		return fmt.Errorf("failed to insert instagram follows: %w", err)
	}

	return nil
}

func SelectInstagramFollowees(db *pgxpool.Pool, ctx context.Context, id int64) ([]InstagramUser, error) {
	followees := []InstagramUser{}
	rows, err := db.Query(ctx, `select u.id, u.kind, u.username, u.pfp_url from instagram.follows left join instagram."user" u on follows.followee_id = u.id where follows.follower_id = $1;`, id)
	if err != nil {
		return nil, fmt.Errorf("failed to select instagram followees: %w", err)
	}

	for rows.Next() {
		var user InstagramUser
		if err := rows.Scan(&user.Id, &user.Kind, &user.Username, &user.PfpUrl); err != nil {
			return nil, fmt.Errorf("failed to select instagram followees: failed to scan a single row: %w", err)
		}
		followees = append(followees, user)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("failed to select instagram followees: failed to scan rows: %w", err)
	}

	return followees, nil
}

func SelectInstagramFollowers(db *pgxpool.Pool, ctx context.Context, id int64) ([]InstagramUser, error) {
	followers := []InstagramUser{}
	rows, err := db.Query(ctx, `select u.id, u.kind, u.username, u.pfp_url from instagram.follows left join instagram."user" u on follows.follower_id = u.id where follows.followee_id = $1;`, id)
	if err != nil {
		return nil, fmt.Errorf("failed to select instagram followers: %w", err)
	}

	for rows.Next() {
		var user InstagramUser
		if err := rows.Scan(&user.Id, &user.Kind, &user.Username, &user.PfpUrl); err != nil {
			return nil, fmt.Errorf("failed to select instagram followers: failed to scan a single row: %w", err)
		}
		followers = append(followers, user)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("failed to select instagram followers: failed to scan rows: %w", err)
	}

	return followers, nil
}

func SelectInstagramPostsByUserId(db *pgxpool.Pool, ctx context.Context, id int64) ([]InstagramPost, error) {
	posts := []InstagramPost{}
	rows, err := db.Query(ctx, "select id, user_id, description from instagram.post where user_id = $1 order by id;", id)
	if err != nil {
		return nil, fmt.Errorf("failed to select instagram posts: %w", err)
	}

	for rows.Next() {
		var post InstagramPost
		if err := rows.Scan(&post.Id, &post.UserId, &post.Description); err != nil {
			return nil, fmt.Errorf("failed to select instagram posts: failed to scan a single row: %w", err)
		}
		posts = append(posts, post)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("failed to select instagram posts: failed to scan rows: %w", err)
	}

	return posts, nil
}

func SelectInstagramMediaByPostId(db *pgxpool.Pool, ctx context.Context, postId int64) ([]InstagramMedia, error) {
	media := []InstagramMedia{}
	rows, err := db.Query(ctx, "select id, post_id, kind, url from instagram.media where post_id = $1 order by id;", postId)
	if err != nil {
		return nil, fmt.Errorf("failed to select instagram media: %w", err)
	}

	for rows.Next() {
		var m InstagramMedia
		if err := rows.Scan(&m.Id, &m.PostId, &m.Kind, &m.Url); err != nil {
			return nil, fmt.Errorf("failed to select instagram media: failed to scan a single row: %w", err)
		}
		media = append(media, m)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("failed to select instagram media: failed to scan rows: %w", err)
	}

	return media, nil
}
