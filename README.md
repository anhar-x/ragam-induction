# Library Management System

A full-stack web application for managing a library's book collection with user authentication.

## Live Demo

Check out the live demo: [Library Management System](https://ragam-induction-frontend.onrender.com/)


## Features

- User authentication (Register/Login)
- Book management (Create, Read, Update, Delete)
- Different membership types (Regular/Premium)
- Protected routes for authenticated users
- Responsive design

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16.20.1 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community)

## Installation

1. Clone the repository:
 - git clone <repository-url>
 - cd <project-directory>
2. Install dependencies:
 - npm install
3. Create a `.env` file in the root directory and add the following:
 - PORT=3000
 - MONGODB_URI=mongodb://localhost:27017/library
 - JWT_SECRET=your_jwt_secret_key
- JWT_EXPIRE=30d

## Running the Application

1. Start MongoDB service on your machine

2. Start the server in development mode:
```bash
npm run dev
```
Or in production mode:
```bash
npm start or node server.js
```

3. Open the frontend:
- Navigate to the `frontend` directory
- Open `index.html` in your web browser
- Or serve it using a local server (e.g., Live Server VS Code extension)

## API Endpoints

### Public Routes
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get a single book

### Protected Routes (Requires Authentication)
- `POST /api/books` - Create a new book
- `PUT /api/books/:id` - Update a book
- `DELETE /api/books/:id` - Delete a book
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get a single user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Project Structure

```
├── config/
│   └── db.js
├── controllers/
│   ├── bookController.js
│   └── userController.js
├── frontend/
│   ├── css/
│   ├── js/
│   ├── index.html
│   └── login.html
├── middleware/
│   └── auth.js
├── models/
│   ├── book.js
│   └── user.js
├── routes/
│   ├── bookRoutes.js
│   └── userRoutes.js
├── .env
├── .gitignore
├── package.json
└── server.js
```

## Technologies Used

- Backend:
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - JWT for authentication
  - bcryptjs for password hashing

- Frontend:
  - HTML5
  - CSS3
  - Vanilla JavaScript


