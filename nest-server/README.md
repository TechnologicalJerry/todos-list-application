# NestJS Application Server (`nest-server`)

Production-ready NestJS 11 application implementing user authentication, session management, todo CRUD operations, product management, metrics, and Swagger documentation.

## Features & Architecture

- **Framework**: NestJS 11 with Express Platform
- **Database**: MongoDB with Mongoose (`@nestjs/mongoose`)
- **Authentication**: Passport JWT Strategy with Access & Refresh tokens
- **Validation**: Global `ValidationPipe` with `class-validator` & `class-transformer`
- **Documentation**: Swagger OpenAPI at `/docs` and raw JSON at `/docs.json`
- **Monitoring**: Prometheus metrics at `/metrics` and health check at `/healthcheck`
- **Error Handling**: Global `AllExceptionsFilter` providing clean, consistent JSON error responses
- **Logging**: `LoggingInterceptor` for HTTP request logging and latency measurement

## API Endpoints

### Health & Metrics
- `GET /healthcheck`: Application health check
- `GET /metrics`: Prometheus metrics output
- `GET /docs`: Swagger UI documentation
- `GET /docs.json`: Swagger JSON spec

### Users (`/api/users`)
- `POST /api/users`: Register a user

### Sessions & Auth (`/api/sessions`)
- `POST /api/sessions`: User Login / Create session
- `GET /api/sessions`: List active user sessions (Requires `Bearer` token)
- `DELETE /api/sessions`: Logout / Delete current session (Requires `Bearer` token)

### Todos (`/api/todos`)
- `GET /api/todos`: List user's todos (Supports `completed` and `search` filters)
- `POST /api/todos`: Create a new todo
- `GET /api/todos/:todoId`: Get a todo by ID
- `PUT /api/todos/:todoId`: Update a todo by ID
- `DELETE /api/todos/:todoId`: Delete a todo by ID

### Products (`/api/products`)
- `POST /api/products`: Create a product
- `GET /api/products/:productId`: Get product details by `productId`
- `PUT /api/products/:productId`: Update product
- `DELETE /api/products/:productId`: Delete product

## Getting Started

### Installation
```bash
npm install
```

### Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### Development
```bash
npm run start:dev
```

### Build & Production
```bash
npm run build
npm run start:prod
```

### Testing
```bash
npm run test
npm run test:e2e
```
