# User Management System

A full-stack User Management System built using Node.js, Express, SQLite, and vanilla JavaScript.

## Features
- User Signup & Login
- JWT-based Authentication
- Protected APIs
- Create, Read, Update, Delete (CRUD) users
- Secure password hashing using bcrypt
- Simple frontend dashboard

## Tech Stack
- Backend: Node.js, Express
- Database: SQLite
- Authentication: JWT
- Frontend: HTML, CSS, JavaScript
- Tools: Git, GitHub

## How to Run Locally
1. Clone the repository
2. Install dependencies  
   `npm install`
3. Start server  
   `node server.js`
4. Open `public/index.html` in browser

## API Endpoints
- POST `/api/users/signup`
- POST `/api/users/login`
- GET `/api/users/all` (protected)
- POST `/api/users/create` (protected)
- PUT `/api/users/update/:id` (protected)
- DELETE `/api/users/delete/:id` (protected)
