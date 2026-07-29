package webhound_requests_transport

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
	database "go.mod/entities/requests/database"
	users_database "go.mod/entities/users/database"
	users "go.mod/entities/users/transport"
)

type Request struct {
	CreatedAt time.Time   `json:"created_at"`
	CreatedOn string      `json:"created_on"`
	CreatedBy *users.User `json:"created_by"`
	Results   []Result    `json:"results"`
}

type Result struct {
	Service string `json:"service"`
	UserId  string `json:"user_id"`
}

func RequestEntityToDto(db *pgx.Conn, ctx context.Context, request_entity database.Request) (*Request, error) {
	created_by, err := users.GetUserByIdDto(db, ctx, request_entity.CreatedBy)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch request with id=%d: failed to fetch user with id=%d: %w", request_entity.Id, request_entity.CreatedBy, err)
	}

	results_entities, err := database.GetResultsByIds(db, ctx, request_entity.ResultsIds)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch request with id=%d: failed to fetch results for request: %v", request_entity.Id, err)
	}

	results_dtos := []Result{}
	for _, result_entity := range results_entities {
		results_dtos = append(results_dtos, Result{Service: result_entity.Service, UserId: result_entity.UserId})
	}

	return &Request{CreatedOn: request_entity.CreatedOn, CreatedBy: created_by, Results: results_dtos}, nil
}

func PostRequest(db *pgx.Conn, ctx context.Context, request Request) (*database.Request, error) {
	results_ids := []int64{}

	for _, result_dto := range request.Results {
		result_entity, err := database.PostResult(db, ctx, database.PostResultRequest{Service: result_dto.Service, UserId: result_dto.UserId})
		if err != nil {
			return nil, fmt.Errorf("failed to post request: failed to post result: %v", err)
		}

		results_ids = append(results_ids, result_entity.Id)
	}

	user_entity, err := users_database.GetUser(db, ctx, users_database.GetUserInput{UsedService: request.CreatedBy.UsedService, ServiceId: request.CreatedBy.ServiceId})

	if err != nil {
		return nil, fmt.Errorf("failed to post request: failed to fetch request author: %v", err)
	}

	request_entity, err := database.PostRequest(db, ctx, database.PostRequestInput{CreatedOn: request.CreatedOn, CreatedBy: user_entity.Id, ResultsIds: results_ids})

	if err != nil {
		return nil, fmt.Errorf("failed to post request: %v", err)
	}

	return request_entity, nil
}
