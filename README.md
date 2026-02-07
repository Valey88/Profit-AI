# Profit Flow AI

Platform for business automation with AI agents.

## Prerequisites

- **Docker** & **Docker Compose** (for Backend & Database)
- **Node.js** (v18 or higher) (for Frontend)

## Quick Start

### 1. Start the Backend (Docker)

The backend runs in Docker containers (FastAPI, PostgreSQL, Redis).

1. Navigate to the project root:
   ```bash
   cd "Profit Flow"
   ```
2. Start the services:
   ```bash
   docker-compose up -d --build
   ```
   *This command builds the backend image and starts PostgreSQL, Redis, and the FastAPI server.*

3. Check if backend is running:
   - API Docs: [http://localhost:8001/docs](http://localhost:8001/docs)
   - Health Check: `docker ps` should show `profit_flow_backend`, `profit_flow_db`, and `profit_flow_redis` as healthy/up.

### 2. Start the Frontend

The frontend is a React application.

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies (first time only):
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the application in your browser: [http://localhost:5173](http://localhost:5173)

## Configuration

### Backend `.env`
The backend configuration is located in `backend/.env`. Key variables:
- `OPENAI_API_KEY`: Your OpenRouter/OpenAI API key.
- `DATABASE_URL`: Connection string for PostgreSQL (automatically set in Docker).

### Frontend
Frontend connects to `http://localhost:8001` by default (configured in `src/shared/api/client.ts`).

## Useful Commands

- **Stop Backend**: `docker-compose down`
- **View Backend Logs**: `docker-compose logs -f backend`
- **Restart Backend**: `docker-compose restart backend`
- **Rebuild Backend** (after new pip packages): `docker-compose up -d --build backend`
