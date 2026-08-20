# HireLens AI

## Overview

HireLens AI is an AI-oriented recruitment and hiring platform that connects candidates and recruiters through a centralized, structured hiring workflow. The platform provides role-specific interfaces and functionality for each stage of the recruitment lifecycle, from job creation and discovery through application management and interviews.

The system is built as a full-stack web application with a React and TypeScript frontend, an Express.js REST API backend, and MongoDB as the primary database. AI capabilities are integrated as part of the HireLens AI recruitment workflow.

---

## Problem Statement

Traditional recruitment processes are fragmented across spreadsheets, email threads, and disconnected tools. Recruiters struggle to efficiently manage candidate pipelines, while candidates lack visibility into their application status. There is no unified platform that brings both sides of the hiring process together under a single, structured workflow with intelligent assistance.

---

## Solution

HireLens AI provides a unified platform where:

- Recruiters can create and manage job listings, review applications, and manage the recruitment pipeline.
- Candidates can browse available positions, submit applications, track application progress, and manage their profiles.
- AI capabilities are incorporated into the recruitment workflow to assist with recruitment-related intelligence.
- All data is persisted in MongoDB, ensuring consistency across sessions and page refreshes.

---

## Features

### Implemented

- Role-based user accounts (candidate and recruiter)
- JWT-based authentication and authorization
- Password hashing using bcryptjs
- Candidate registration and login
- Protected API routes with role-based access control
- Job creation and management by recruiters
- Job browsing for candidates
- Application workflow
- Candidate profile management
- Interview module
- Notification module
- MongoDB persistence for all recruitment data
- REST API backend with structured route groups
- Separate frontend and backend architecture
- CORS configuration
- Rate limiting on authentication endpoints
- Static file upload handling

### Planned or Evolving

- Advanced AI-assisted candidate matching
- Resume analysis and scoring
- Candidate ranking and recommendations
- Interview intelligence features
- Recruiter analytics dashboard
- Advanced notification delivery (email, push)
- Production deployment pipeline
- Automated testing suite

---

## User Roles

| Role | Description |
|---|---|
| `candidate` | Default role created during public registration. Can browse jobs, apply, track applications, and manage their profile. |
| `recruiter` | Can create and manage job listings and review candidate applications. |
| `hiring_manager` | Privileged role for hiring management responsibilities. |
| `interviewer` | Privileged role for conducting and managing interviews. |
| `admin` | Full administrative access to the platform. |

> Public registration creates a `candidate` account only. Privileged roles such as `recruiter`, `hiring_manager`, `interviewer`, and `admin` must be assigned through controlled administrative processes and must not be freely assignable through the public registration endpoint.

---

## Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| React | UI component library |
| TypeScript | Static typing |
| Vite | Build tool and development server |
| Axios | HTTP API communication |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API framework |
| MongoDB | Primary database |
| Mongoose | MongoDB ODM |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| express-rate-limit | Rate limiting |
| CORS | Cross-origin resource sharing |

### Development Tools

| Tool | Purpose |
|---|---|
| npm | Package management |
| Nodemon | Backend auto-reload during development |
| Thunder Client | API testing (optional) |
| MongoDB Atlas | Hosted MongoDB environment (optional) |

---

## System Architecture

```
User
 |
 v
React + TypeScript Frontend (Vite)
 |
 | HTTP / REST API (Axios)
 v
Express.js Backend (Node.js)
 |
 +----------------------+
 |                      |
 v                      v
Authentication       Application APIs
Middleware           (Jobs, Candidates,
(JWT, RBAC)          Applications,
 |                   Interviews,
 |                   Notifications)
 +----------+-----------+
            |
            v
         MongoDB (Mongoose ODM)
            |
            v
       AI Components
       (Integrated into recruitment workflow)
```

The exact AI integration architecture may vary depending on the implemented AI service configuration.

---

## Project Structure

```
hirelens-ai/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts
│
└── backend/
    ├── src/
    │   ├── config/
    │   ├── controllers/
    │   ├── middleware/
    │   ├── models/
    │   ├── routes/
    │   ├── services/
    │   ├── utils/
    │   ├── app.js
    │   └── server.js
    ├── .env
    ├── .env.example
    └── package.json
```

> The structure above reflects the intended organization. Individual files may vary as the project evolves.

---

## Authentication and Authorization

Authentication is implemented using JSON Web Tokens (JWT).

### Registration

```
POST /api/auth/register
```

Accepts `name`, `email`, and `password`. Creates a `candidate` account. The role is assigned server-side and must not be accepted from the public request body.

### Login

```
POST /api/auth/login
```

Accepts `email` and `password`. Returns a JWT token and user information on success.

### Authenticated User

```
GET /api/auth/me
```

Returns the currently authenticated user. Requires a valid JWT token in the Authorization header.

### Using the Token

All protected requests must include the following header:

```
Authorization: Bearer <JWT_TOKEN>
```

### Authorization Flow

1. Client submits credentials to `/api/auth/login`.
2. Backend validates credentials and returns a signed JWT.
3. Client stores the JWT and attaches it to subsequent requests.
4. Backend middleware verifies the JWT on protected routes.
5. Role-based authorization middleware restricts access based on the authenticated user's role.

### Password Security

Passwords are hashed using bcryptjs before being stored in MongoDB. Plaintext passwords are never stored or logged.

---

## API Overview

| Module | Base Route | Purpose |
|---|---|---|
| Authentication | `/api/auth` | Registration, login, and authenticated user information |
| Candidates | `/api/candidates` | Candidate-related operations |
| Jobs | `/api/jobs` | Job management and retrieval |
| Applications | `/api/applications` | Application workflow |
| Interviews | `/api/interviews` | Interview-related operations |
| Notifications | `/api/notifications` | Recruitment-related notifications |

Individual endpoint documentation for each module should be maintained separately as the API evolves. Use Thunder Client or a similar tool to explore and test available endpoints during development.

---

## Database

MongoDB is used as the primary database. Mongoose is used as the ODM for schema definition, validation, and querying.

The backend connects to MongoDB using a connection string provided through environment configuration.

MongoDB Atlas may be used as the hosted MongoDB environment for both development and production deployments.

> Never commit your actual MongoDB connection string to version control.

---

## Environment Variables

### Backend

Create a `.env` file in the `backend/` directory. Use `.env.example` as a reference.

```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
CLIENT_URL=http://localhost:5173
UPLOAD_DIR=uploads
```

| Variable | Description |
|---|---|
| `PORT` | Port the backend server listens on |
| `MONGODB_URI` | MongoDB connection string (Atlas or local) |
| `JWT_SECRET` | Secret key used to sign and verify JWT tokens |
| `CLIENT_URL` | Frontend origin allowed by CORS |
| `UPLOAD_DIR` | Directory for uploaded static files |

### Frontend

Create a `.env` file in the `frontend/` directory. Use `.env.example` as a reference.

```env
VITE_API_URL=http://localhost:4000/api
```

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL for all backend API requests |

> `.env` files must not be committed to version control. Only `.env.example` files with placeholder values should be committed.

---

## Installation

### Prerequisites

- Node.js (LTS version recommended)
- npm
- MongoDB instance or MongoDB Atlas account
- Git

### Steps

**1. Clone the repository**

```bash
git clone <repository-url>
cd hirelens-ai
```

**2. Install backend dependencies**

```bash
cd backend
npm install
```

**3. Configure backend environment**

```bash
cp .env.example .env
```

Edit `.env` and fill in your MongoDB connection string, JWT secret, and other required values.

**4. Install frontend dependencies**

```bash
cd ../frontend
npm install
```

**5. Configure frontend environment**

```bash
cp .env.example .env
```

Edit `.env` and set `VITE_API_URL` to point to your backend API.

---

## Running the Application

Run the backend and frontend in separate terminal windows.

### Backend

```bash
cd backend
npm run dev
```

The backend development server will start on:

```
http://localhost:4000
```

The API is available at:

```
http://localhost:4000/api
```

### Frontend

```bash
cd frontend
npm run dev
```

The Vite development server will start on:

```
http://localhost:5173
```

If port 5173 is already in use, Vite will automatically select another available port. Update `CLIENT_URL` in the backend `.env` to match the actual frontend URL if this occurs.

---

## Testing

The following test sequence is recommended for verifying the full system after setup.

### 1. Backend Startup

Confirm the backend is running:

```
http://localhost:4000/api
```

Verify the server starts without errors and the MongoDB connection is established.

### 2. Register a Candidate

```
POST http://localhost:4000/api/auth/register
Content-Type: application/json

{
  "name": "Test Candidate",
  "email": "test@example.com",
  "password": "Test123456"
}
```

Expect a success response confirming account creation.

### 3. Login

```
POST http://localhost:4000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test123456"
}
```

Expect a response containing a JWT token.

### 4. Access a Protected Route

```
GET http://localhost:4000/api/auth/me
Authorization: Bearer <TOKEN>
```

Expect the authenticated user's information to be returned.

### 5. Job Management

Using a recruiter-authorized account, test job creation via:

```
POST http://localhost:4000/api/jobs
Authorization: Bearer <RECRUITER_TOKEN>
```

Then retrieve jobs:

```
GET http://localhost:4000/api/jobs
```

### 6. Frontend Tests

- Open the frontend in a browser.
- Register a new candidate account.
- Log in with the registered credentials.
- Browse available jobs.
- Submit an application.
- Refresh the page and confirm that data persists correctly from the backend.

---

## Troubleshooting

### Port 4000 Already in Use

**Error:** `EADDRINUSE: address already in use :::4000`

Another process is occupying port 4000. Stop the existing process or change the `PORT` value in the backend `.env` file.

### Port 5173 Already in Use

Vite automatically selects another available port. Check the terminal output for the actual URL and update `CLIENT_URL` in the backend `.env` to match.

### MongoDB Connection Failure

- Confirm the `MONGODB_URI` value in the backend `.env` is correct.
- If using MongoDB Atlas, verify that your current IP address is in the Atlas network access allowlist.
- SRV record resolution (`mongodb+srv://`) may fail depending on local DNS configuration. Try switching to a direct connection string if SRV resolution fails.

### JWT Authentication Errors

- Confirm `JWT_SECRET` is set in the backend `.env`.
- Ensure the `Authorization` header is formatted as `Bearer <TOKEN>`.
- Check whether the token has expired.
- Restart the backend after modifying `.env`.

### CORS Errors

- Confirm `CLIENT_URL` in the backend `.env` matches the exact origin of the frontend, including the protocol and port.
- Do not include a trailing slash in `CLIENT_URL`.
- Restart the backend after changing `CLIENT_URL`.

### API Requests Returning 401

- Confirm the user is logged in and a valid JWT token is present.
- Confirm the `Authorization` header is included in the request.
- Verify the token has not expired.
- Check that the backend authentication middleware is applied to the route.

### API Requests Returning 404

- Confirm the backend is running.
- Verify `VITE_API_URL` in the frontend `.env` includes the `/api` prefix.
- Confirm the route exists in the backend.

### Data Disappearing After Page Refresh

Frontend state is not persistent storage. Data must be fetched from the backend on each page load. If data disappears after refresh, confirm that the relevant frontend component fetches data from the backend API when it mounts.

---

## Security

### Practices Applied

- JWT-based authentication with server-side token verification
- Password hashing using bcryptjs before storage
- Plaintext passwords are never stored
- Protected API routes using authentication middleware
- Role-based authorization for privileged operations
- Rate limiting on authentication endpoints (15-minute window, 20 requests maximum)
- CORS restricted to configured client origin
- Secrets managed through environment variables

### Rules

- Never commit `.env` files to version control.
- Never expose MongoDB credentials, JWT secrets, or API keys in code or commits.
- Do not allow normal users to assign privileged roles through public registration.
- Validate and sanitize inputs where applicable.
- Protect all sensitive routes using authentication and authorization middleware.
- Use HTTPS in all production environments.
- Configure CORS to allow only trusted origins in production.
- Replace all development secrets with strong, unique values before deployment.

---

## Git Workflow

```bash
# Start from the latest main branch
git checkout main
git pull origin main

# Create a feature branch
git checkout -b feature/<feature-name>

# Make your changes, then stage and commit
git status
git add .
git commit -m "feat: describe the change clearly"

# Push the branch
git push origin feature/<feature-name>
```

Open a Pull Request from your feature branch into `main` for review.

Avoid pushing incomplete or untested work directly to `main`. All changes should go through a Pull Request unless the project workflow explicitly permits direct commits.

---

## Development Guidelines

- Keep frontend and backend concerns strictly separated.
- Do not commit `.env` files. Keep `.env.example` updated with all required variable names and placeholder values.
- Do not hardcode secrets, API keys, or connection strings in source code.
- Reuse existing services, middleware, and utilities instead of duplicating logic.
- Follow the existing project folder structure and naming conventions.
- Write meaningful, descriptive commit messages.
- Test backend API changes using Thunder Client or equivalent before integrating frontend changes.
- Test authentication flows after any modifications to authentication middleware or controllers.
- Do not remove or break working functionality when adding new features.
- Maintain compatibility between frontend API calls and backend route definitions.

---

## Production Considerations

The following items should be reviewed and addressed before deploying to a production environment.

| Area | Consideration |
|---|---|
| Environment variables | All secrets must use production-grade values, not development defaults |
| JWT secret | Must be a long, cryptographically random string |
| HTTPS | All traffic must be served over HTTPS |
| MongoDB security | Enable authentication, restrict network access, use Atlas or equivalent managed service |
| CORS | Restrict allowed origins to the actual production frontend URL |
| Rate limiting | Review and tune limits appropriate for production traffic |
| Logging | Implement structured server-side logging for errors and requests |
| Error handling | Ensure internal stack traces and sensitive details are not exposed in API responses |
| File uploads | Validate file types, sizes, and storage paths |
| API input validation | Validate all incoming request bodies on the backend |
| Frontend build | Run `npm run build` and serve the production build, not the Vite dev server |
| Backend deployment | Deploy behind a process manager or containerized environment |
| Database backups | Configure automated MongoDB backups |
| Monitoring | Set up uptime and error monitoring |

---

## Future Enhancements

The following capabilities are identified as potential future improvements. None of these are currently implemented unless explicitly stated elsewhere in this document.

- Advanced AI-assisted candidate and job matching
- Resume parsing and analysis
- Automated candidate ranking and shortlisting
- Interview intelligence and feedback analysis
- Skill extraction from candidate profiles
- Personalized job recommendations for candidates
- Recruiter analytics and pipeline reporting
- Advanced notification delivery (email, in-app, push)
- Comprehensive automated testing (unit, integration, end-to-end)
- Production CI/CD pipeline
- Audit logging and activity history
- Admin management interface
- Multi-language support

---

## Contributing

1. Fork or clone the repository.
2. Create a feature branch from `main`.
3. Make your changes following the development guidelines in this document.
4. Test all changes locally, including backend API tests and frontend integration.
5. Commit your changes with a clear, descriptive commit message.
6. Push your feature branch to the remote repository.
7. Open a Pull Request targeting `main`.
8. Wait for review and address any requested changes before the branch is merged.

---

## Project Status

HireLens AI is under active development. The platform currently includes a functional frontend, a REST API backend, JWT-based authentication, MongoDB database integration, and modules for jobs, applications, candidates, interviews, and notifications. AI-oriented recruitment functionality is integrated into the workflow and continues to evolve.

The project is not yet production-ready. Features, APIs, and architecture are subject to change as development progresses.

---

## License

License information has not yet been specified.
