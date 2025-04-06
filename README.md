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

All requests have a unique request ID which is logged with all corresponding logs that can be used to track a request through the system.

### Database

- PostgreSQL - for the database - selected for its reliability and performance which is crucial for handling financial transactions
- Prisma - for ORM and database migrations - selected for its type safety and ease of use

Rather than operating on data in the database when amendments are provided, these amendments are stored. This ensures that the original data is preserved and can be audited. This creates some run-time overhead, but it is worth it for the added safety and reliability.

When running the `local` setup, the database is automatically created and seeded with test data.

### Containerization and Deployment

- Docker - for containerization
- Docker Compose - for container orchestration
- Shell scripts - for deployment automation
- Makefile - for task automation
- nvm - for managing Node.js versions

By combining Docker, Docker Compose, Shell scripts, Makefile, and nvm, we can create a powerful and flexible development and deployment environment. This allows us to easily manage dependencies, automate tasks, and ensure that our application runs consistently across different environments. It should be noted that even in 'deployed' environments (i.e. any non-local environment), the database is still running in a Docker container. However, in a real scenario, the database would be hosted on a separate server or service (e.g. AWS RDS, Azure SQL Database, etc.) for better performance and reliability.

### Testing

- Jest - for unit and integration testing
- Supertest - for testing HTTP requests

### CI/CD

- GitHub Actions - for continuous integration and deployment

GitHub Actions is used to automatically run tests whenever code is pushed to the repository. This ensures that the code is always tested and ready for deployment. The Action used checks all unit and integration tests pass, tests the build, and checks for linting errors.

### Documentation

- Swagger - for API documentation
- Swagger UI - for interactive API documentation

## Setup

1. Clone the repository

```bash
https://github.com/samueljacobs98/novabook-api.git
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

Each .env file should contain the required environment variables for the application. Here is what the `.env` file should look like:

```env
DATABASE_URL=<postgresql_connection_url>
```

5. Set up the database:

Run the following command to set up the database:

```bash
npm prisma:generate
```

6. Run the application:

Use `make` followed by the corresponding environment:

```bash
make local
```

This will start the application in local mode. You can also use `make development`, `make staging`, or `make production` to run the application in the respective environments.

To view the logs in the running application, run

```bash
make logs env=<environment>
```

If no environment is provided it will default to local.

7. Stop the application

```bash
make stop env=<environment>
```

8. Run unit and integration tests

```bash
npm test
```

9. View the API documentation

Run the API in any environment and navigate to `http://localhost:3000/api/docs/`. Alternatively, you can import the `swagger.yaml` file to `editor.swagger.io` to view the API documentation.
