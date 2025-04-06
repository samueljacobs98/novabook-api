# Novabook API

This is a simple API for handling sale and tax transactions and enable users to retrieve their current tax position for a given date.

## Technologies, Packages, and Tools

### Core Technologies:

- Node.js
- Express.js
- TypeScript

### Linting and Formatting:

- ESLint - for linting
- Prettier - for code formatting

### Validation and Error Handling

- http-status-codes - for HTTP status codes and messages - for better readability and maintainability
- express-async-errors - for handling async errors - for better error handling in async functions
- zod - for request validation - for type-safe validation of request data and custom error messages

### Logging

- winston - for logging
- express-winston - for logging HTTP requests and responses
- winston-daily-rotate-file - for rotating log files daily

All logs are stored in the `logs` directory. The logs are rotated daily and kept for 14 days. The log files are named in the format `app-YYYY-MM-DD.log`.

Every request is assigned a unique request ID, which is logged with all related events to enable traceability through the system.

### Database

- PostgreSQL - for the database - selected for its reliability and performance which is crucial for handling financial transactions
- Prisma - for ORM and database migrations - selected for its type safety and ease of use

Rather than mutating existing data, amendments are stored as new entries. This ensures that original data is preserved and auditable. While this adds some runtime overhead, it significantly enhances safety and traceability.

When running the local setup, the database is automatically created and seeded with test data.

### Containerization and Deployment

- Docker - for containerization
- Docker Compose - for orchestration
- Shell scripts - for environment setup and deployment automation
- Makefile - for task automation
- nvm - for managing Node.js versions

By combining Docker, Docker Compose, shell scripts, a Makefile, and nvm, we provide a consistent and portable development environment. Note: even in deployed environments (e.g., development, staging, production), the database runs inside a Docker container for simplicity. In a real-world deployment, the database would be hosted externally (e.g., AWS RDS, Azure Database) for better scalability and performance.

### Testing

- Jest - for unit testing
- Supertest - for e2e testing HTTP requests

### CI/CD

- GitHub Actions - for continuous integration and deployment

GitHub Actions is used to automatically run tests whenever code is pushed to the repository. This ensures that the code is always tested and ready for deployment. The Action used checks all unit and e2e tests pass, tests the build, and checks for linting errors.

### Documentation

- Swagger - for API documentation
- Swagger UI - for interactive API documentation

## Setup

1. Clone the repository

```bash
https://github.com/samueljacobs98/novabook-api.git
cd novabook-api
```

2. Install dependencies

```bash
npm install
```

3. Install Docker:

Follow the instructions at [Docker's official website](https://docs.docker.com/get-docker/) to install Docker on your machine.

4. Set up environment variables:

Create the necessary `.env` files in the root directory. You can create the following files based on the environments you intend to run:

- `.env.local`
- `.env.development`
- `.env.staging`
- `.env.production`

Each `.env` file should contain the required environment variables for the application. Here is what the `.env` file should look like:

```env
DATABASE_URL=<postgresql_connection_url>
```

5. Set up the database (optional for local dev):

Run the following command to set up the database:

This is handled automatically by `make local`, but if working outside Docker:

```bash
npx prisma generate
```

6. Run the application:

Use `make` followed by the corresponding environment:

```bash
make local
```

This will run the application in local mode, starting the API and Postgres container, applying migrations and seeding data. You can also use `make development`, `make staging`, or `make production` to run the application in the respective environments.

7. View logs

```bash
make logs env=<environment>
```

If no `env` is provided it will default to `local`.

8. Stop the application

```bash
make stop env=<environment>
```

9. Run tests

```bash
npm test
```

9. View the API documentation

Once the app is running, visit:

```bash
http://localhost:3000/api/docs/
```

Or import the `swagger.yaml` file into [Swagger Editor](https://editor.swagger.io/) to view the API documentation.
