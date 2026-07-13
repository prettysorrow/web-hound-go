package webhound_users_database

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5"
)

type GetUserInput struct {
	UsedService string
	ServiceId   string
}

func GetUser(db *pgx.Conn, ctx context.Context, input GetUserInput) (*User, error) {
	var user User
	row := db.QueryRow(ctx, "select * from core.user where used_service = $1 and service_id = $2;", input.UsedService, input.ServiceId)
	err := row.Scan(&user.Id, &user.DisplayName, &user.UsedService, &user.ServiceId)

	if err != nil {
		return nil, fmt.Errorf("failed to select user with (service, service id) = (%s, %s): %w", input.UsedService, input.ServiceId, err)
	}

	return &user, nil
}

func GetUserById(db *pgx.Conn, ctx context.Context, id int64) (*User, error) {
	var user User
	row := db.QueryRow(ctx, "select * from core.user where id = $1;", id)
	err := row.Scan(&user.Id, &user.DisplayName, &user.UsedService, &user.ServiceId)

	if err != nil {
		return nil, fmt.Errorf("failed to select user with id = %d: %w", id, err)
	}

	return &user, nil
}

type PostUserInput struct {
	DisplayName string
	UsedService string
	ServiceId   string
}

func PostUser(db *pgx.Conn, ctx context.Context, input PostUserInput) (*User, error) {
	var user User
	row := db.QueryRow(ctx, "insert into core.user (display_name, used_service, service_id) values ($1, $2, $3) returning id, display_name, used_service, service_id;", input.DisplayName, input.UsedService, input.ServiceId)
	err := row.Scan(&user.Id, &user.DisplayName, &user.UsedService, &user.ServiceId)

	if err != nil {
		return nil, fmt.Errorf("failed to insert user with (service, service id) = (%s, %s): %w", input.UsedService, input.ServiceId, err)
	}

	return &user, nil
}

func GetUsers(db *pgx.Conn, ctx context.Context) ([]User, error) {
	rows, err := db.Query(ctx, "select * from core.user;")
	if err != nil {
		return nil, fmt.Errorf("failed to select all users: %w", err)
	}

	var users []User
	for rows.Next() {
		var user User
		err := rows.Scan(&user.Id, &user.DisplayName, &user.UsedService, &user.ServiceId)

		if err != nil {
			return nil, fmt.Errorf("failed to scan a single user: %w", err)
		}

		users = append(users, user)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("failed to scan users: %w", err)
	}

	return users, nil
}
