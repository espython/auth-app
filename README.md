# Full Stack Auth App

A simple, production-ready authentication module built with:

- Frontend: React Router + TypeScript
- Backend: NestJS + MongoDB (Mongoose) + JWT

This app lets users sign up, sign in, and access a protected page. It includes input validation, password hashing, JWT authentication, a protected endpoint, basic security hardening, and API docs.

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

- `apps/frontend` — React Router app
- `apps/backend` — NestJS app (Mongoose, Auth, Users)

## Scripts

- `npm run dev` — Run frontend and backend together (Nx run-many)
- `npm start` — Start backend only

## Testing the Flow (manual)
1. Start MongoDB locally (or set MONGODB_URI to remote)
2. `npm run dev`
3. Open http://localhost:4200
4. Go to Sign Up, create a user
5. You should be redirected to the app page and see the protected content
6. Logout and try Sign In with the same credentials

## Nice-to-haves included
- Logging via Nest Logger (startup) and structured module separation
- Swagger API docs at `/api/docs`

## License
MIT
