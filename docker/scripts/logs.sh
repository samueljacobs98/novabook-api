#!/usr/bin/env sh

if [ -z "$APP_NAME" ]; then
  echo "APP_NAME is not set. Please provide it in the Makefile."
  exit 1
fi

if [ -z "$ENVIRONMENT" ]; then
  echo "ENVIRONMENT is not set. Please provide it in the Makefile."
  exit 1
fi

export NODE_ENV="$ENVIRONMENT"

cd "$(dirname "$0")/.."

if [ "$ENVIRONMENT" = "local" ]; then
    docker_compose_file="docker-compose.local.yml"
else
    docker_compose_file="docker-compose.yml"
fi

docker-compose -p "${APP_NAME}-${ENVIRONMENT}" -f "$docker_compose_file" logs app
