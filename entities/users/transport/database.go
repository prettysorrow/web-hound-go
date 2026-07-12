package webhound_users_transport

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5"
	models "go.mod/entities/users/models"
)

func GetUser(db *pgx.Conn, input GetUserInput) (*models.User, error) {
	var user models.User
	result := db.QueryRow(context.Background(), "select * from core.user where id = $1;", input.Id)
	err := result.Scan(&user.Id, &user.DisplayName, &user.UsedService)

	if err != nil {
		err = fmt.Errorf("failed to select user with id=%d: %w", input.Id, err)
		return nil, err
	}

	return &user, nil
}

func PostUser(db *pgx.Conn, input PostUserInput) (*models.User, error) {
	var user models.User
	result := db.QueryRow(context.Background(), "insert into core.user (display_name, used_service) values ($1, $2) returning id, display_name, used_service;", input.DisplayName, input.UsedService)
	err := result.Scan(&user.Id, &user.DisplayName, &user.UsedService)

	if err != nil {
		err = fmt.Errorf("failed to scan inserted user with display_name=%s: %w", input.DisplayName, err)
		return nil, err
	}

	return &user, nil
}

func GetUsers(db *pgx.Conn, input GetUsersInput) (users []models.User, err error) {
	rows, err := db.Query(context.Background(), "select * from core.user;")
	if err != nil {
		err = fmt.Errorf("failed to get all users: %w", err)
		return nil, err
	}

	for rows.Next() {
		var user models.User
		err := rows.Scan(&user.Id, &user.DisplayName, &user.UsedService)

		if err != nil {
			err = fmt.Errorf("failed to scan a single user: %w", err)
			return nil, err
		}

		users = append(users, user)
	}

	if err = rows.Err(); err != nil {
		err = fmt.Errorf("failed to get all users: %w", err)
		return nil, err
	}

	return users, nil
}
