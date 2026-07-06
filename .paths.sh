export REPO_ROOT="/Users/psi/Desktop/go-demo"

export POSTGRES_SERVICE="postgres-server"
export POSTGRES_CONTAINER="go-postgres-server"
export MIGRATE_SERVICE="postgres-migrate"
export MIGRATE_CONTAINER="go-postgres-migrate"

export POSTGRES_HOST_PATH="$REPO_ROOT/postgres-db"
export POSTGRES_DOCKER_PATH="/var/lib/postgresql"
export POSTGRES_CONNECTION="postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@postgres-server:5432/$POSTGRES_DB?sslmode=disable"

export MIGRATE_HOST_PATH="$REPO_ROOT/postgres-migrations"
export MIGRATE_DOCKER_PATH="/migrations"
