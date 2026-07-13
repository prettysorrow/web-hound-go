package webhound_requests_database

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5"
)

func GetRequest(db *pgx.Conn, ctx context.Context, id int64) (*Request, error) {
	var request Request

	row := db.QueryRow(ctx, "select * from core.request where id = $1;", id)
	err := row.Scan(&request.Id, &request.CreatedAt, &request.CreatedOn, &request.CreatedBy, &request.Results)

	if err != nil {
		err = fmt.Errorf("failed to select request with id=%d: %w", id, err)
		return nil, err
	}

	return &request, nil
}

func GetUserRequests(db *pgx.Conn, ctx context.Context, user_id int64) ([]Request, error) {
	var requests []Request

	rows, err := db.Query(ctx, "select * from core.request where created_by = $1;", user_id)

	if err != nil {
		err = fmt.Errorf("failed to select requests for user with user_id=%d: %w", user_id, err)
		return nil, err
	}

	for rows.Next() {
		var request Request

		err := rows.Scan(&request.Id, &request.CreatedAt, &request.CreatedOn, &request.CreatedBy, &request.Results)

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
	CreatedOn string
	CreatedBy int64
	Results   []byte
}

func PostRequest(db *pgx.Conn, ctx context.Context, input PostRequestInput) (*Request, error) {
	var request Request

	row := db.QueryRow(ctx, "insert into core.request (created_on, created_by, results) values ($1, $2, $3) returning id, created_at, created_on, created_by, results;", input.CreatedOn, input.CreatedBy, input.Results)
	err := row.Scan(&request.Id, &request.CreatedAt, &request.CreatedOn, &request.CreatedBy, &request.Results)

	if err != nil {
		err = fmt.Errorf("failed to insert request created on %s: %w", input.CreatedOn, err)
		return nil, err
	}

	return &request, nil
}
