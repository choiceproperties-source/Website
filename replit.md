# Choice Properties - Real Estate Platform

## Overview
Choice Properties is a premium real estate platform with a React frontend built using Vite.

## Project Structure
- **frontend/**: Main React application (Vite + React + Tailwind CSS)
- **backend/**: Express.js API server (uses Supabase/PostgreSQL)
- **admin/**: Admin panel (separate Vite React app)

## Current State
- Frontend is configured and running on port 5000
- Backend is configured and running on port 8000
- Database: Supabase (PostgreSQL)

## Running the Project
- Frontend runs via the "Frontend" workflow which executes `npm run dev` in the frontend directory
- Backend runs via the "Backend" workflow which executes `npm start` in the backend directory

## Environment Variables Needed
- `VITE_API_BASE_URL`: Backend API URL for the frontend
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key

## Tech Stack
- Frontend: React 18, Vite 6, Tailwind CSS, Chakra UI, Framer Motion
- Backend: Express.js, Supabase (PostgreSQL), JWT authentication

## Recent Changes
- Updated branding to Choice Properties
- Updated email addresses to choiceproperties.com domain
- Database migrated from MongoDB to Supabase (PostgreSQL)
