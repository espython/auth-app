# Full Stack Auth App

A simple, production-ready authentication module built with:

- **Frontend:** React Router + TypeScript + Tailwind CSS + shadcn/ui
- **Backend:** NestJS + MongoDB (Mongoose) + JWT
- **Architecture:** Nx Monorepo with integrated tooling

This app lets users sign up, sign in, and access a protected page. It includes input validation, password hashing, JWT authentication, a protected endpoint, basic security hardening, and API docs.

## Architecture

This project uses **Nx** as a monorepo build system, providing:
- **Unified workspace** for frontend and backend applications
- **Integrated testing** with shared configuration
- **Code generation** and scaffolding tools
- **Dependency graph** visualization
- **Efficient caching** for builds and tests
- **Parallel execution** of tasks across projects

## Requirements implemented

- Sign up with Email, Name (min 3 chars), Password (min 8 chars, 1 letter, 1 number, 1 special char)
- Sign in with Email + Password
- Protected application page with welcome message and logout
- NestJS backend with MongoDB, Mongoose, JWT, password hashing (Node.js native crypto/scrypt)
- One protected endpoint: `GET /api/auth/me`
- Basic security: Helmet, global validation pipe, CORS
- API documentation via Swagger at `/api/docs`

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB (local or remote). If local, default used is `mongodb://localhost:27017/authapp`.

### Environment Variables
Create a `.env` file in the repo root (or `apps/backend/.env`). See `.env.example`.

Required variables:

```
MONGODB_URI=mongodb://localhost:27017/authapp
JWT_SECRET=change_me_to_a_long_random_string
PORT=3000
```

### Install dependencies

```bash
npm install
```

### Run the app (frontend + backend concurrently)

```bash
npm run dev
```

- Frontend: http://localhost:4200
- Backend API: http://localhost:3000/api
- API Docs (Swagger): http://localhost:3000/api/docs

## API Overview

- POST `/api/auth/signup` — body: `{ email, name, password }` — returns `{ access_token, user }`
- POST `/api/auth/signin` — body: `{ email, password }` — returns `{ access_token, user }`
- GET `/api/auth/me` — requires `Authorization: Bearer <token>` — returns `{ userId, email }`

Passwords are hashed using Node.js native scrypt (with random salt) and never returned by the API.

## Frontend

Routes:
- `/signin` (index) — Sign in form with validation
- `/signup` — Sign up form with validation
- `/app` — Protected page that shows "Welcome to the application." and a Logout button

A JWT token is stored in `localStorage` on successful auth. The `/app` page verifies the token by calling the protected `GET /api/auth/me` endpoint and redirects to `/signin` if unauthorized.

## Security & Production Notes

- Helmet enabled for basic HTTP headers security
- Global validation pipe with whitelist+transform
- CORS enabled for `http://localhost:4200` (adjust in `apps/backend/src/main.ts` for production)
- Keep `JWT_SECRET` long and random; rotate regularly in production
- Use TLS/HTTPS and secure cookie storage for tokens in real production systems

## Project Structure

This is an **Nx monorepo** with the following structure:

- `apps/frontend` — React Router app with Vite
- `apps/backend` — NestJS app (Mongoose, Auth, Users)
- `apps/frontend-e2e` — Cypress E2E tests for frontend
- `apps/backend-e2e` — Jest E2E tests for backend API

### Nx Commands

Nx provides powerful commands for managing the monorepo:

```bash
# Run specific project
npx nx serve @auth-app/backend
npx nx serve @auth-app/frontend

# Run targets across all projects
npx nx run-many --target=build --all
npx nx run-many --target=test --all
npx nx run-many --target=lint --all

# View dependency graph
npx nx graph
```

## Scripts

- `npm run dev` — Run frontend and backend together (Nx run-many)
- `npm start` — Start backend only
- `npm test` — Run all unit tests
- `npm run test:e2e` — Run E2E tests
- `npm run test:coverage` — Run tests with coverage report

## Testing

### Unit Tests
Run unit tests for the AuthService:
```bash
npx nx test @auth-app/backend
```

With coverage:
```bash
npx nx test @auth-app/backend --coverage
```

### E2E Tests
Run end-to-end tests for authentication flows:
```bash
# Start the backend first
npm start

# In another terminal, run E2E tests
npx nx e2e @auth-app/backend-e2e
```

The E2E tests cover:
- User signup with validation
- User signin with various scenarios
- Protected endpoint access
- Complete authentication flow
- Security tests

### CI/CD
GitHub Actions workflow automatically runs on push/PR:
- Linting
- Unit tests with coverage
- Build verification
- E2E tests with MongoDB service

## Testing the Flow (manual)
1. Start MongoDB locally (or set MONGODB_URI to remote)
2. `npm run dev`
3. Open http://localhost:4200
4. Go to Sign Up, create a user
5. You should be redirected to the app page and see the protected content
6. Logout and try Sign In with the same credentials

## Nice-to-haves included
- ✅ Logging via Nest Logger (startup) and structured module separation
- ✅ Swagger API docs at `/api/docs`
- ✅ Unit tests for AuthService
- ✅ E2E tests for authentication flows
- ✅ GitHub Actions CI/CD pipeline
- ✅ Error handling throughout the application

## License
MIT
