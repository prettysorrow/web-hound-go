package webhound_requests_transport

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	database "go.mod/entities/requests/database"
	users_database "go.mod/entities/users/database"

	"github.com/jackc/pgx/v5"
)

func AddGetRequestHandler(mux *http.ServeMux, db *pgx.Conn, ctx context.Context) {
	mux.HandleFunc("GET /requests/{id}", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Content-Type", "application/json")
		encoder := json.NewEncoder(w)

		id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
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

func AddGetUserRequestsHandler(mux *http.ServeMux, db *pgx.Conn, ctx context.Context) {
	mux.HandleFunc("GET /users/{id}/requests", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Content-Type", "application/json")
		encoder := json.NewEncoder(w)

		user_id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
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

func AddPostRequestHandler(mux *http.ServeMux, db *pgx.Conn, ctx context.Context) {
	mux.HandleFunc("POST /requests", func(w http.ResponseWriter, r *http.Request) {
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
