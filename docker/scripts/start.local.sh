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
COMPOSE_PROJECT_NAME="${APP_NAME}-${ENVIRONMENT}"

cd "$(dirname "$0")/.."

echo "Building containers..."
docker-compose \
  -p "${COMPOSE_PROJECT_NAME}" \
  -f docker-compose.local.yml \
  --env-file "../.env.${ENVIRONMENT}" \
  build --build-arg NODE_VERSION="${NODE_VERSION}"

echo "Starting containers..."
docker-compose \
  -p "${COMPOSE_PROJECT_NAME}" \
  -f docker-compose.local.yml \
  --env-file "../.env.${ENVIRONMENT}" \
  up -d

echo "Waiting for Postgres to be ready..."
until docker exec novabook-db pg_isready -U postgres >/dev/null 2>&1; do
  sleep 1
done

echo "Running migrations and seeding..."

docker-compose \
  -p "${COMPOSE_PROJECT_NAME}" \
  -f docker-compose.local.yml \
  exec app sh -c "npx prisma migrate deploy && npx prisma generate && npx ts-node prisma/seed.ts"


docker-compose \
  -p "${COMPOSE_PROJECT_NAME}" \
  -f docker-compose.local.yml \
  exec app npx ts-node prisma/seed.ts
