package webhound_users_transport

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5"
	database "go.mod/entities/users/database"
)

// @Summary      Get user by used service and service id
// @Description  Retrieve a user by their authentication service name and service-specific ID
// @Tags         users
// @Accept       json
// @Produce      json
// @Param        used_service path string true "Authentication service name (e.g. telegram)"
// @Param        service_id   path string true "User ID within the specified service (e.g. telegram username)"
// @Success      200 {object} webhound_users_transport.User "User found"
// @Failure      400 {object} string "User not found or invalid parameters"
// @Router       /users/{used_service}/{service_id} [get]
func AddGetUserHandler(r *chi.Mux, db *pgx.Conn, ctx context.Context) {
	r.Get("/users/{used_service}/{service_id}", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		encoder := json.NewEncoder(w)

		used_service, service_id := chi.URLParam(r, "used_service"), chi.URLParam(r, "service_id")

		user_dto, err := GetUserDto(db, ctx, GetUserDtoInput{UsedService: used_service, ServiceId: service_id})
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			err = fmt.Errorf("failed to handle GET /users/{used_service}/{service_id} request: %w", err)
			encoder.Encode(err.Error())
			return
		}

		w.WriteHeader(http.StatusOK)
		encoder.Encode(user_dto)
	})
}

// @Summary      Create a new user
// @Description  Register a new user with a service name and service-specific ID
// @Tags         users
// @Accept       json
// @Produce      json
// @Param        user body webhound_users_transport.User true "User to create"
// @Success      200 {object} webhound_users_transport.User "User created successfully"
// @Failure      400 {object} string "Invalid input or database error"
// @Router       /users [post]
func AddPostUserHandler(r *chi.Mux, db *pgx.Conn, ctx context.Context) {
	r.Post("/users", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Content-Type", "application/json")
		encoder := json.NewEncoder(w)
		decoder := json.NewDecoder(r.Body)

		var user_dto User
		err := decoder.Decode(&user_dto)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			err = fmt.Errorf("failed to handle POST /users request: failed to parse user: %w", err)
			encoder.Encode(err.Error())
			return
		}

		_, err = PostUserDto(db, ctx, &user_dto)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			err = fmt.Errorf("failed to handle POST /users request: failed to insert user into database: %w", err)
			encoder.Encode(err.Error())
			return
		}

		w.WriteHeader(http.StatusOK)
		encoder.Encode(user_dto)
	})
}

// @Summary      List all users
// @Description  Retrieve a list of all registered users
// @Tags         users
// @Accept       json
// @Produce      json
// @Success      200 {array} webhound_users_transport.User "List of users"
// @Failure      400 {object} string "Database error"
// @Router       /users [get]
func AddGetUsersHandler(r *chi.Mux, db *pgx.Conn, ctx context.Context) {
	r.Get("/users", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Content-Type", "application/json")
		encoder := json.NewEncoder(w)

		user_entities, err := database.GetUsers(db, ctx)

		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			err = fmt.Errorf("failed to handle GET /users request: %w", err)
			encoder.Encode(err.Error())
			return
		}

		var user_dtos []User
		for _, user_entity := range user_entities {
			user_dto := UserEntityToDto(&user_entity)
			user_dtos = append(user_dtos, user_dto)
		}

		w.WriteHeader(http.StatusOK)
		encoder.Encode(user_dtos)
	})
}
