#!/usr/bin/env sh

if [ -z "$APP_NAME" ]; then
  echo "APP_NAME is not set. Please provide it in the Makefile."
  exit 1
fi

if [ -z "$NODE_VERSION" ]; then
  echo "NODE_VERSION is not set. Please ensure your Makefile reads from .nvmrc"
  exit 1
fi

ENVIRONMENT="local"

cd "$(dirname "$0")/.."

docker-compose \
  -p "${APP_NAME}-${ENVIRONMENT}" \
  -f docker-compose.local.yml \
  --env-file "../.env.${ENVIRONMENT}" \
  build --build-arg NODE_VERSION="${NODE_VERSION}"

docker-compose \
  -p "${APP_NAME}-${ENVIRONMENT}" \
  -f docker-compose.local.yml \
  --env-file "../.env.${ENVIRONMENT}" \
  up
