# NestJS Project

## Project setup

### Using pnpm

```bash
$ pnpm install
```

### Using Docker

```bash
# Build docker image
$ docker build -t nest-app .

# Run container
$ docker run -p 3000:3000 nest-app
```

## Running the app

### Local Development

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

### Docker Environment

```bash
# Basic run
$ docker run -p 3000:3000 nest-app

# Run with environment variables
$ docker run -p 3000:3000 --env-file .env nest-app

# Run in background
$ docker run -d -p 3000:3000 nest-app

# Stop container
$ docker stop <container_id>
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## License

[MIT licensed](LICENSE)
