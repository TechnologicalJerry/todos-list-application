## Todos List Application - Express Backend (TypeScript)

A scalable Express + TypeScript backend with MongoDB, JWT auth, validation, metrics, and Swagger docs. Includes Users, Sessions (auth), Products, and Todos CRUD for the frontend app.

### Prerequisites
- Node.js 18+
- MongoDB running locally (or provide a connection string)

### Install
```
npm install
```

### Configuration
Runtime config via `config/`:
- `config/default.ts`
  - `port`: 5050
  - `dbUri`: mongodb://localhost:27017/todos-list-application
  - `accessTokenTtl`, `refreshTokenTtl`
  - `accessTokenPrivateKey`, `accessTokenPublicKey`, `refreshTokenPrivateKey`, `refreshTokenPublicKey`

You can override via environment variables using `config/custom-environment-variables.ts`.

### Scripts
```
# Development (watch + ts-node)
npm run dev

# Build to build/
npm run build

# Start compiled server
npm start
```

### Postman
- Collection file: `postman/Todos List API.postman_collection.json`
- Variables:
  - `baseUrl` (default `http://localhost:5050`)
  - `accessToken` (set after login)
  - `productId`, `todoId` (set from created resources)
- Import into Postman and run requests in order: Register → Login → set `accessToken` → CRUD endpoints.

### Tech
- Express 5, TypeScript (strict), Mongoose 8
- Validation with Zod
- JWT auth (access/refresh), bcrypt
- Pino logging, response-time metrics (Prometheus)
- Swagger/OpenAPI docs

### API Overview
Base URL: `http://localhost:5050`

- Health
  - GET `/healthcheck` → 200 if server is up

- Users
  - POST `/api/users`
    - body: `{ name, email, password }`

- Sessions (Auth)
  - POST `/api/sessions` → login
    - body: `{ email, password }`
    - returns `accessToken`, `refreshToken`
  - GET `/api/sessions` (Auth) → list sessions for current user
  - DELETE `/api/sessions` (Auth) → logout

- Products (Auth)
  - POST `/api/products`
  - GET `/api/products/:productId`
  - PUT `/api/products/:productId`
  - DELETE `/api/products/:productId`

- Todos (Auth)
  - GET `/api/todos` → list (supports `?completed=true|false`)
  - POST `/api/todos`
    - body: `{ title, description?, completed?, dueDate? }`
  - GET `/api/todos/:todoId`
  - PUT `/api/todos/:todoId`
    - body: any of `{ title, description, completed, dueDate }`
  - DELETE `/api/todos/:todoId`

All Auth endpoints expect header:
```
Authorization: Bearer <accessToken>
```

### Quick Test (cURL)
```
# Health
curl -i http://localhost:5050/healthcheck

# Register
curl -i -X POST http://localhost:5050/api/users \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Alice\",\"email\":\"alice@example.com\",\"password\":\"Passw0rd!\"}"

# Login
curl -s -X POST http://localhost:5050/api/sessions \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"alice@example.com\",\"password\":\"Passw0rd!\"}"
```

Use the returned `accessToken` for authorized requests.

### Notes
- Ensure MongoDB is running and `dbUri` is reachable.
- For production, set real RSA keys for JWTs (private/public).
- Metrics and Swagger helpers are included; wire Swagger UI if desired.
