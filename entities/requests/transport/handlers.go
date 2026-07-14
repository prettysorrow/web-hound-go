package webhound_requests_transport

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5"
	database "go.mod/entities/requests/database"
	users_database "go.mod/entities/users/database"
)

// @Summary      Get request by ID
// @Description  Retrieve a request by its numeric ID, including creator info and results
// @Tags         requests
// @Accept       json
// @Produce      json
// @Param        id path int true "Request ID"
// @Success      200 {object} webhound_requests_transport.Request "Request found"
// @Failure      400 {object} string "Invalid ID or request not found"
// @Router       /requests/{id} [get]
func AddGetRequestHandler(r *chi.Mux, db *pgx.Conn, ctx context.Context) {
	r.Get("/requests/{id}", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Content-Type", "application/json")
		encoder := json.NewEncoder(w)

		id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
		if err != nil {
			err = fmt.Errorf("request on 'GET /requests/{id}' failed: failed to parse id: %w", err)
			w.WriteHeader(http.StatusBadRequest)
			encoder.Encode(err.Error())
			return
		}

		request_dto, err := GetRequestDto(db, ctx, id)
		if err != nil {
			err = fmt.Errorf("request on 'GET /requests/{id}' failed: %w", err)
			w.WriteHeader(http.StatusBadRequest)
			encoder.Encode(err.Error())
			return
		}

		w.WriteHeader(http.StatusOK)
		encoder.Encode(request_dto)
	})
}

// @Summary      List requests by user ID
// @Description  Retrieve all requests created by a specific user
// @Tags         requests
// @Accept       json
// @Produce      json
// @Param        id path int true "User ID"
// @Success      200 {array} webhound_requests_transport.Request "List of user requests"
// @Failure      400 {object} string "Invalid ID or database error"
// @Router       /users/{id}/requests [get]
func AddGetUserRequestsHandler(r *chi.Mux, db *pgx.Conn, ctx context.Context) {
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

		var requests_dtos []Request
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
func AddPostRequestHandler(r *chi.Mux, db *pgx.Conn, ctx context.Context) {
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

		user_entity, err := users_database.GetUser(db, ctx, users_database.GetUserInput{UsedService: request.CreatedBy.UsedService, ServiceId: request.CreatedBy.ServiceId})
		if err != nil {
			err = fmt.Errorf("failed to post request: failed to find id of user with (service, service id) = (%s, %s): %w", request.CreatedBy.UsedService, request.CreatedBy.ServiceId, err)
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprint(w, err.Error())
			return
		}

		_, err = database.PostRequest(db, ctx, database.PostRequestInput{CreatedBy: user_entity.Id, CreatedOn: request.CreatedOn, Results: request.Results})
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
