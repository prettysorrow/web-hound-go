package webhound_requests_transport

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/jackc/pgx/v5"
	database "go.mod/entities/requests/database"
	users "go.mod/entities/users/transport"
)

type Request struct {
	CreatedOn string          `json:"created_on"`
	CreatedBy *users.User     `json:"created_by"`
	Results   json.RawMessage `json:"results"`
}

func RequestEntityToDto(db *pgx.Conn, ctx context.Context, request_entity database.Request) (*Request, error) {
	created_by, err := users.GetUserByIdDto(db, ctx, request_entity.CreatedBy)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch request with id=%d: failed to fetch user with id=%d: %w", request_entity.Id, request_entity.CreatedBy, err)
	}

	return &Request{CreatedOn: request_entity.CreatedOn, CreatedBy: created_by, Results: request_entity.Results}, nil
}

func GetRequestDto(db *pgx.Conn, ctx context.Context, id int64) (*Request, error) {
	request_entity, err := database.GetRequest(db, ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch request with id=%d: %w", id, err)
	}

	return RequestEntityToDto(db, ctx, *request_entity)
}
