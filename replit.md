# BuildEstate - Real Estate Platform

## Overview
BuildEstate is a premium real estate platform with a React frontend built using Vite.

## Project Structure
- **frontend/**: Main React application (Vite + React + Tailwind CSS)
- **backend/**: Express.js API server (requires MongoDB)
- **admin/**: Admin panel (separate Vite React app)

## Current State
- Frontend is configured and running on port 5000
- Backend requires MongoDB connection (MONGO_URI environment variable)

## Running the Project
The frontend runs via the "Frontend" workflow which executes `npm run dev` in the frontend directory.

## Environment Variables Needed
- `VITE_API_BASE_URL`: Backend API URL for the frontend
- `MONGO_URI`: MongoDB connection string for the backend (if running backend)

## Tech Stack
- Frontend: React 18, Vite 6, Tailwind CSS, Chakra UI, Framer Motion
- Backend: Express.js, MongoDB/Mongoose, JWT authentication
