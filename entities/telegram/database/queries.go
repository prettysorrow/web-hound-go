package webhound_telegram_database

import (
	"context"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5"
)

func scanUser(dest *User, row pgx.Row) error {
	return row.Scan(&dest.Id, &dest.Username, &dest.FirstName, &dest.LastName, &dest.Phone, &dest.Bio, &dest.ChannelId)
}

type InsertUserRequest struct {
	Username  string
	FirstName string
	LastName  *string
	Phone     *string
	Bio       *string
	ChannelId *int64
}

func InsertUser(db *pgx.Conn, ctx context.Context, request *InsertUserRequest) (*User, error) {
	if request == nil {
		return nil, errors.New("failed to insert user: unexpected null ptr")
	}

	var user User
	err := scanUser(&user, db.QueryRow(ctx, "insert into telegram.user (username, first_name, last_name, phone, bio, channel_id) values ($1, $2, $3, $4, $5, $6) returning id, username, first_name, last_name, phone, bio, channel_id;", request.Username, request.FirstName, request.LastName, request.Phone, request.Bio, request.ChannelId))
	if err != nil {
		return nil, fmt.Errorf("failed to insert user: %v", err)
	}

	return &user, nil
}

func SelectUserById(db *pgx.Conn, ctx context.Context, id int64) (*User, error) {
	var user User
	err := scanUser(&user, db.QueryRow(ctx, "select id, username, first_name, last_name, phone, bio, channel_id from telegram.user where id = $1 ;", id))
	if err != nil {
		return nil, fmt.Errorf("failed to select user: %v", err)
	}

	return &user, nil
}

func SelectUserByUsername(db *pgx.Conn, ctx context.Context, username string) (*User, error) {
	var user User
	err := scanUser(&user, db.QueryRow(ctx, "select id, username, first_name, last_name, phone, bio, channel_id from telegram.user where username = $1 ;", username))
	if err != nil {
		return nil, fmt.Errorf("failed to select user: %v", err)
	}

	return &user, nil
}

func scanChannel(dest *Channel, row pgx.Row) error {
	return row.Scan(&dest.Id, &dest.Url, &dest.Name, &dest.Bio)
}

type InsertChannelRequest struct {
	Url  string
	Name string
	Bio  *string
}

func InsertChannel(db *pgx.Conn, ctx context.Context, request *InsertChannelRequest) (*Channel, error) {
	if request == nil {
		return nil, errors.New("failed to insert channel: unexpected null ptr")
	}

	var channel Channel

	err := scanChannel(&channel, db.QueryRow(ctx, "insert into telegram.channel (url, name, bio) values ($1, $2, $3) returning id, url, name, bio;", request.Url, request.Name, request.Bio))
	if err != nil {
		return nil, fmt.Errorf("failed to insert channel: %v", err)
	}

	return &channel, nil
}

func SelectChannelById(db *pgx.Conn, ctx context.Context, id int64) (*Channel, error) {
	var channel Channel
	if err := scanChannel(&channel, db.QueryRow(ctx, "select id, url, name, bio from telegram.channel where id = $1;", id)); err != nil {
		return nil, fmt.Errorf("failed to select channel: %v", err)
	}

	return &channel, nil
}

type InsertProfilePhotoRequest struct {
	UserId    int64
	ImageData []byte
}

func InsertProfilePhoto(db *pgx.Conn, ctx context.Context, request *InsertProfilePhotoRequest) (*ProfilePhoto, error) {
	if request == nil {
		return nil, errors.New("failed to insert profile photo: unexpected null ptr")
	}

	var photo_id int64
	if err := db.QueryRow(ctx, "insert into telegram.photo (image_data) values ($1) returning id; ", request.ImageData).Scan(&photo_id); err != nil {
		return nil, fmt.Errorf("failed to insert photo: %v", err)
	}

	var profile_photo ProfilePhoto
	if err := db.QueryRow(ctx, "insert into telegram.profile_photo (user_id, photo_id) values ($1, $2) returning user_id, photo_id;", request.UserId, photo_id).Scan(&profile_photo.UserId, &profile_photo.PhotoId); err != nil {
		return nil, fmt.Errorf("failed to insert profile photo: %v", err)
	}

	return &profile_photo, nil
}

func SelectProfilePhotos(db *pgx.Conn, ctx context.Context, user_id int64) ([]Photo, error) {
	rows, err := db.Query(ctx, "select telegram.photo.id, telegram.photo.image_data from telegram.profile_photo left join telegram.photo on telegram.profile_photo.photo_id = telegram.photo.id where telegram.profile_photo.user_id = $1 ;", user_id)
	if err != nil {
		return nil, fmt.Errorf("failed to select profile photos: %v", err)
	}

	var photos []Photo
	for rows.Next() {
		var photo Photo
		if err := rows.Scan(&photo.Id, &photo.ImageData); err != nil {
			return nil, fmt.Errorf("failed to select profile photos: failed to scan a single photo: %v", err)
		}

		photos = append(photos, photo)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("failed to select profile photos: failed to scan photos: %v", err)
	}

	return photos, nil
}

type InsertChannelPhotoRequest struct {
	ChannelId int64
	ImageData []byte
}

func InsertChannelPhoto(db *pgx.Conn, ctx context.Context, request *InsertChannelPhotoRequest) (*ChannelPhoto, error) {
	if request == nil {
		return nil, errors.New("failed to insert channel photo: unexpected null ptr")
	}

	var photo_id int64
	if err := db.QueryRow(ctx, "insert into telegram.photo (image_data) values ($1) returning id; ", request.ImageData).Scan(&photo_id); err != nil {
		return nil, fmt.Errorf("failed to insert photo: %v", err)
	}

	var channel_photo ChannelPhoto
	if err := db.QueryRow(ctx, "insert into telegram.channel_photo (channel_id, photo_id) values ($1, $2) returning channel_id, photo_id ;", request.ChannelId, photo_id).Scan(&channel_photo.ChannelId, &channel_photo.PhotoId); err != nil {
		return nil, fmt.Errorf("failed to insert channel photo: %v", err)
	}

	return &channel_photo, nil
}

func SelectChannelPhotos(db *pgx.Conn, ctx context.Context, channel_id int64) ([]Photo, error) {
	rows, err := db.Query(ctx, "select telegram.photo.id, telegram.photo.image_data from telegram.channel_photo left join telegram.photo on telegram.channel_photo.photo_id = telegram.photo.id where telegram.channel_photo.channel_id = $1 ;", channel_id)
	if err != nil {
		return nil, fmt.Errorf("failed to select channel photos: %v", err)
	}

	var photos []Photo
	for rows.Next() {
		var photo Photo
		if err := rows.Scan(&photo.Id, &photo.ImageData); err != nil {
			return nil, fmt.Errorf("failed to select channel photos: failed to scan a single photo: %v", err)
		}

		photos = append(photos, photo)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("failed to select channel photos: failed to scan photos: %v", err)
	}

	return photos, nil
}

type InsertChannelPostPhotoRequest struct {
	ChannelId int64
	ImageData []byte
}

func InsertChannelPostPhoto(db *pgx.Conn, ctx context.Context, request *InsertChannelPostPhotoRequest) (*ChannelPostPhoto, error) {
	if request == nil {
		return nil, errors.New("failed to insert channel post photo: unexpected null ptr")
	}

	var photo_id int64
	if err := db.QueryRow(ctx, "insert into telegram.photo (image_data) values ($1) returning id; ", request.ImageData).Scan(&photo_id); err != nil {
		return nil, fmt.Errorf("failed to insert photo: %v", err)
	}

	var channel_post_photo ChannelPostPhoto
	if err := db.QueryRow(ctx, "insert into telegram.channel_post_photo (channel_id, photo_id) values ($1, $2) returning channel_id, photo_id ;", request.ChannelId, photo_id).Scan(&channel_post_photo.ChannelId, &channel_post_photo.PhotoId); err != nil {
		return nil, fmt.Errorf("failed to insert channel post photo: %v", err)
	}

	return &channel_post_photo, nil
}

func SelectChannelPostsPhotos(db *pgx.Conn, ctx context.Context, channel_id int64) ([]Photo, error) {
	rows, err := db.Query(ctx, "select telegram.photo.id, telegram.photo.image_data from telegram.channel_post_photo left join telegram.photo on telegram.channel_post_photo.photo_id = telegram.photo.id where telegram.channel_post_photo.channel_id = $1 ;", channel_id)
	if err != nil {
		return nil, fmt.Errorf("failed to select channel posts photos: %v", err)
	}

	var photos []Photo
	for rows.Next() {
		var photo Photo
		if err := rows.Scan(&photo.Id, &photo.ImageData); err != nil {
			return nil, fmt.Errorf("failed to select channel posts photos: failed to scan a single photo: %v", err)
		}

		photos = append(photos, photo)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("failed to select channel posts photos: failed to scan photos: %v", err)
	}

	return photos, nil
}
