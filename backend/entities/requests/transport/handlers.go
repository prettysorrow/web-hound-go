package webhound_requests_transport

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	database "go.mod/entities/requests/database"
)

// @Summary      List requests by user ID
// @Description  Retrieve all requests created by a specific user
// @Tags         requests
// @Accept       json
// @Produce      json
// @Param        id path int true "User ID"
// @Success      200 {array} webhound_requests_transport.Request "List of user requests"
// @Failure      400 {object} string "Invalid ID or database error"
// @Router       /users/{id}/requests [get]
func AddGetUserRequestsHandler(r *chi.Mux, db *pgxpool.Pool, ctx context.Context) {
	r.Get("/users/{id}/requests", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Content-Type", "application/json")
		encoder := json.NewEncoder(w)

		user_id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
		if err != nil {
			err = fmt.Errorf("failed to parse id for GET /users/{id}/requests: %w", err)
			w.WriteHeader(http.StatusBadRequest)
			encoder.Encode(err.Error())
			return
		}

		requests_entities, err := database.GetUserRequests(db, ctx, user_id)
		if err != nil {
			err = fmt.Errorf("failed to fetch data from database GET /users/{id}/requests: %w", err)
			w.WriteHeader(http.StatusBadRequest)
			encoder.Encode(err.Error())
			return
		}

		requests_dtos := []Request{}
		for _, request_entity := range requests_entities {
			request_dto, err := RequestEntityToDto(db, ctx, request_entity)
			if err != nil {
				err = fmt.Errorf("failed to fetch data from database GET /users/{id}/requests: %w", err)
				w.WriteHeader(http.StatusBadRequest)
				encoder.Encode(err.Error())
				return
			}

			requests_dtos = append(requests_dtos, *request_dto)
		}

		w.WriteHeader(http.StatusOK)
		encoder.Encode(requests_dtos)
	})
}

// @Summary      Create a new request
// @Description  Submit a new request linked to an existing user
// @Tags         requests
// @Accept       json
// @Produce      json
// @Param        request body webhound_requests_transport.Request true "Request to create"
// @Success      200 {object} webhound_requests_transport.Request "Request created successfully"
// @Failure      400 {object} string "Invalid input or database error"
// @Failure      500 {object} string "Referenced user not found"
// @Router       /requests [post]
func AddPostRequestHandler(r *chi.Mux, db *pgxpool.Pool, ctx context.Context) {
	r.Post("/requests", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Content-Type", "application/json")
		encoder := json.NewEncoder(w)
		decoder := json.NewDecoder(r.Body)

		var request Request
		err := decoder.Decode(&request)
		if err != nil {
			err = fmt.Errorf("failed to parse request: %w", err)
			w.WriteHeader(http.StatusBadRequest)
			fmt.Fprint(w, err.Error())
			return
		}

		_, err = PostRequest(db, ctx, request)
		if err != nil {
			err := fmt.Errorf("failed to post request: %w", err)
			w.WriteHeader(http.StatusBadRequest)
			fmt.Fprint(w, err.Error())
			return
		}

		w.WriteHeader(http.StatusOK)
		encoder.Encode(request)
	})
}

// @Summary      List all requests
// @Description  Retrieve all requests created by any user
// @Tags         requests
// @Accept       json
// @Produce      json
// @Success      200 {array} webhound_requests_transport.Request "List of requests"
// @Failure      500 {object} string "Database error"
// @Router       /requests [get]
func AddGetRequestsHandler(r *chi.Mux, db *pgxpool.Pool, ctx context.Context) {
	r.Get("/requests", func(w http.ResponseWriter, r *http.Request) {
		r.Header.Add("Content-Type", "application/json")
		encoder := json.NewEncoder(w)

		requests_entities, err := database.GetRequests(db, ctx)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			encoder.Encode(fmt.Errorf("failed to get requests: failed to fetch requests from database: %v", err).Error())
			return
		}

		requests_dtos := []Request{}
		for _, request_entity := range requests_entities {
			request_dto, err := RequestEntityToDto(db, ctx, request_entity)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				encoder.Encode(fmt.Errorf("failed to get requests: %v", err).Error())
				return
			}

			requests_dtos = append(requests_dtos, *request_dto)
		}

		encoder.Encode(requests_dtos)
	})
}
