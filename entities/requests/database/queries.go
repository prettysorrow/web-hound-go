package webhound_requests_database

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
)

func GetRequest(db *pgxpool.Pool, ctx context.Context, id int64) (*Request, error) {
	var request Request

	row := db.QueryRow(ctx, "select * from core.request where id = $1;", id)
	err := row.Scan(&request.Id, &request.CreatedAt, &request.CreatedOn, &request.CreatedBy, &request.ResultsIds)

	if err != nil {
		err = fmt.Errorf("failed to select request with id=%d: %w", id, err)
		return nil, err
	}

	return &request, nil
}

func GetRequests(db *pgxpool.Pool, ctx context.Context) ([]Request, error) {
	requests := []Request{}

	rows, err := db.Query(ctx, "select * from core.request;")

	if err != nil {
		err = fmt.Errorf("failed to select all requests: %w", err)
		return nil, err
	}

	for rows.Next() {
		var request Request

		err := rows.Scan(&request.Id, &request.CreatedAt, &request.CreatedOn, &request.CreatedBy, &request.ResultsIds)

		if err != nil {
			err = fmt.Errorf("failed to select a single request while selecting all requests: %w", err)
			return nil, err
		}

		requests = append(requests, request)
	}

	if err = rows.Err(); err != nil {
		err = fmt.Errorf("failed to select all requests: %w", err)
		return nil, err
	}

	return requests, nil
}

func GetUserRequests(db *pgxpool.Pool, ctx context.Context, user_id int64) ([]Request, error) {
	requests := []Request{}

	rows, err := db.Query(ctx, "select * from core.request where created_by = $1;", user_id)

	if err != nil {
		err = fmt.Errorf("failed to select requests for user with user_id=%d: %w", user_id, err)
		return nil, err
	}

	for rows.Next() {
		var request Request

		err := rows.Scan(&request.Id, &request.CreatedAt, &request.CreatedOn, &request.CreatedBy, &request.ResultsIds)

		if err != nil {
			err = fmt.Errorf("failed to select a single request for user with user_id=%d: %w", user_id, err)
			return nil, err
		}

		requests = append(requests, request)
	}

	if err = rows.Err(); err != nil {
		err = fmt.Errorf("failed to select requests for user with user_id=%d: %w", user_id, err)
		return nil, err
	}

	return requests, nil
}

type PostRequestInput struct {
	CreatedOn  string
	CreatedBy  int64
	ResultsIds []int64
}

func PostRequest(db *pgxpool.Pool, ctx context.Context, input PostRequestInput) (*Request, error) {
	var request Request

	row := db.QueryRow(ctx, "insert into core.request (created_on, created_by, results_ids) values ($1, $2, $3) returning id, created_at, created_on, created_by, results_ids;", input.CreatedOn, input.CreatedBy, input.ResultsIds)
	err := row.Scan(&request.Id, &request.CreatedAt, &request.CreatedOn, &request.CreatedBy, &request.ResultsIds)

	if err != nil {
		err = fmt.Errorf("failed to insert request created on %s: %w", input.CreatedOn, err)
		return nil, err
	}

	return &request, nil
}

func GetResultsByIds(db *pgxpool.Pool, ctx context.Context, resultsIds []int64) ([]Result, error) {
	results := []Result{}

	rows, err := db.Query(ctx, "select * from core.result where core.result.id = any($1);", resultsIds)
	if err != nil {
		return nil, fmt.Errorf("failed to select results: %v", err)
	}

	for rows.Next() {
		var result Result

		err := rows.Scan(&result.Id, &result.Service, &result.UserId)
		if err != nil {
			return nil, fmt.Errorf("failed to select results: failed to scan a single result: %v", err)
		}

		results = append(results, result)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("failed to select results: failed to scan results: %v", err)
	}

	return results, nil
}

type PostResultRequest struct {
	Service string
	UserId  string
}

func PostResult(db *pgxpool.Pool, ctx context.Context, request PostResultRequest) (*Result, error) {
	var result Result
	row := db.QueryRow(ctx, "insert into core.result (service, user_id) values ($1, $2) returning id, service, user_id;", request.Service, request.UserId)
	err := row.Scan(&result.Id, &result.Service, &result.UserId)
	if err != nil {
		return nil, fmt.Errorf("failed to insert result: %v", err)
	}

	return &result, nil
}
