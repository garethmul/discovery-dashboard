# Local Backend Setup

This dashboard includes a local mock backend for development purposes. The backend provides mock data and API endpoints to simulate the real API.

## Setup Instructions

1. Install the backend dependencies:
   ```bash
   npm run install:backend
   ```

2. Start both the frontend and backend together:
   ```bash
   npm run dev:all
   ```

## For Production

When building for production, you should:

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Copy the frontend build to the backend's public directory:
   ```bash
   npm run setup
   ```

3. The backend can then serve the frontend files along with the API.

## Backend Structure

The backend is a simplified version that provides:

- Mock API endpoints for domain data
- Socket.IO support for real-time updates
- Static file serving for the frontend

## Environment Variables

The backend uses its own `.env` file in the `backend` directory. Make sure this file contains the necessary API keys and configuration values. 