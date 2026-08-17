.PHONY: up down stop start help

POSTGRES_DATA_PATH := $(shell grep '^POSTGRES_HOST_PATH=' .env | cut -d= -f2-)

help: ## show this message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "} {printf "%-15s %s\n", $$1, $$2}'

up:	## fresh start
	@echo "=== begin up services ==="
	@echo "=== wiping containers ==="
	docker-compose down -v
	@echo "=== wiping database ==="
	find $(POSTGRES_DATA_PATH) -mindepth 1 -delete
	@echo "=== building + starting services ==="
	docker-compose up -d --build
	@echo "=== end up services ==="

down: ## full teardown
	@echo "=== begin down services ==="
	@echo "=== wiping containers ==="
	docker-compose down -v
	@echo "=== wiping database ==="
	find $(POSTGRES_DATA_PATH) -mindepth 1 -delete
	@echo "=== end down services ==="

stop: ## stop services
	@echo "=== begin stop services ==="
	docker-compose stop
	@echo "=== end stop services ==="

start: ## start services again
	@echo "=== begin start services ==="
	docker-compose up -d
	@echo "=== end start services ==="