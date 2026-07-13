package webhound_users_transport

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5"
	database "go.mod/entities/users/database"
)

type User struct {
	DisplayName string `json:"display_name"`
	UsedService string `json:"used_service"`
	ServiceId   string `json:"service_id"`
}

func UserEntityToDto(entity *database.User) User {
	return User{DisplayName: entity.DisplayName, UsedService: entity.UsedService, ServiceId: entity.ServiceId}
}

type GetUserDtoInput struct {
	UsedService string
	ServiceId   string
}

func GetUserDto(db *pgx.Conn, ctx context.Context, input GetUserDtoInput) (*User, error) {
	user_entity, err := database.GetUser(db, ctx, database.GetUserInput{UsedService: input.UsedService, ServiceId: input.ServiceId})
	if err != nil {
		return nil, fmt.Errorf("failed to get user with (service, service id) = (%s, %s): %w", input.UsedService, input.ServiceId, err)
	}

	user_dto := UserEntityToDto(user_entity)
	return &user_dto, nil
}

func GetUserByIdDto(db *pgx.Conn, ctx context.Context, id int64) (*User, error) {
	user_entity, err := database.GetUserById(db, ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get user with id = %d: %w", id, err)
	}

	user_dto := UserEntityToDto(user_entity)
	return &user_dto, nil
}

func PostUserDto(db *pgx.Conn, ctx context.Context, user *User) (*database.User, error) {
	db_input := database.PostUserInput{DisplayName: user.DisplayName, UsedService: user.UsedService, ServiceId: user.ServiceId}
	user_entity, err := database.PostUser(db, ctx, db_input)
	if err != nil {
		return nil, fmt.Errorf("failed to post user with (service, service id) = (%s, %s): %w", user.UsedService, user.ServiceId, err)
	}

	return user_entity, err
}
