.PHONY: local development staging production stop logs

export APP_NAME := novabook-api
NODE_VERSION := $(shell cat .nvmrc)
env ?= local

local:
	NODE_VERSION=$(NODE_VERSION) APP_NAME=$(APP_NAME) sh docker/scripts/start.local.sh

development:
	NODE_VERSION=$(NODE_VERSION) APP_NAME=$(APP_NAME) ENVIRONMENT=development sh docker/scripts/start.sh

staging:
	NODE_VERSION=$(NODE_VERSION) APP_NAME=$(APP_NAME) ENVIRONMENT=staging sh docker/scripts/start.sh

production:
	NODE_VERSION=$(NODE_VERSION) APP_NAME=$(APP_NAME) ENVIRONMENT=production sh docker/scripts/start.sh

logs:
	@echo "Fetching logs for '$(env)' environment..."; \
	NODE_VERSION=$(NODE_VERSION) APP_NAME=$(APP_NAME) ENVIRONMENT="$(env)" sh docker/scripts/logs.sh

stop:
	@echo "Stopping services for '$(env)' environment..."; \
	NODE_VERSION=$(NODE_VERSION) APP_NAME=$(APP_NAME) ENVIRONMENT="$(env)" sh docker/scripts/stop.sh

prune:
	docker builder prune -f  