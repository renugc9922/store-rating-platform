# Store Rating Platform

A full-stack store discovery and rating application built with React, Express, and MySQL. It supports role-based experiences for normal users, store owners, and administrators.

## Features

### Authentication and access

- JWT authentication with bcrypt password hashing
- Role-based backend authorization for `USER`, `OWNER`, and `ADMIN`
- Password updates for authenticated users
- Logout that clears locally stored authentication data
- Protected React routes that redirect unauthenticated users to login and redirect users who open another role's route to their own dashboard

### Normal users

- Public registration for normal-user accounts
- Store search by name and address
- Store average-rating and personal-rating visibility
- Submit a rating from 1 to 5 or update an existing rating

### Store owners

- Owner dashboard for assigned stores
- Visibility into customer ratings and store average ratings

### Administrators

- Dashboard statistics for users, stores, and ratings
- User creation for `USER` and `ADMIN` accounts
- User search, filtering, sorting, and detail views
- Store search, filtering, sorting, and management

## Tech stack

- Frontend: React, React Router, Vite, Tailwind CSS, Axios
- Backend: Node.js, Express, MySQL, MySQL2
- Security and validation: JSON Web Tokens, bcrypt, express-validator

## Getting started

### Prerequisites

- Node.js and npm
- A MySQL database configured for the application

### 1. Configure environment variables

Copy the safe template and update it with your local MySQL credentials and JWT secret:

```bash
cp server/.env.example server/.env
```

`server/.env` uses `PORT`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, and `JWT_SECRET`. Keep this file local and do not commit it.

### 2. Start the backend

```bash
cd server
npm install
npm run dev
```

To run without Nodemon:

```bash
npm start
```

### 3. Start the frontend

In another terminal:

```bash
cd client
npm install
npm run dev
```

Create a production build with:

```bash
npm run build
```

## Available scripts

| Location | Command | Purpose |
| --- | --- | --- |
| `server` | `npm run dev` | Start the backend with Nodemon |
| `server` | `npm start` | Start the backend with Node.js |
| `client` | `npm run dev` | Start the Vite development server |
| `client` | `npm run build` | Create a production frontend build |
