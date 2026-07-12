export REPO_ROOT="/Users/psi/Desktop/go-demo"

export POSTGRES_SERVICE="postgres-server"
export POSTGRES_CONTAINER="go-postgres-server"
export MIGRATE_SERVICE="postgres-migrate"
export MIGRATE_CONTAINER="go-postgres-migrate"

export POSTGRES_HOST_PATH="$REPO_ROOT/postgres-db"
export POSTGRES_DOCKER_PATH="/var/lib/postgresql"

export POSTGRES_HOST_PORT="5433"
export POSTGRES_DOCKER_PORT="5432"

export POSTGRES_DOCKER_CONNECTION="postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_SERVICE:$POSTGRES_DOCKER_PORT/$POSTGRES_DB?sslmode=disable"
export POSTGRES_HOST_CONNECTION="postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@localhost:$POSTGRES_HOST_PORT/$POSTGRES_DB?sslmode=disable"

export MIGRATE_HOST_PATH="$REPO_ROOT/postgres-migrations"
export MIGRATE_DOCKER_PATH="/migrations"

export BACKEND_SERVER_HOST="localhost"
export BACKEND_SERVER_PORT="8080"
