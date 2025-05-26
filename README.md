# Student Management System API

A simple and efficient RESTful API for managing student records with basic CRUD operations.

## Features

- **Student Management**
  - Create, read, update, and delete student records
  - View all students or a specific student by ID
  - Input validation using Joi
  - Email uniqueness validation
  - Age validation (16-100 years)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm (comes with Node.js)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd student-management-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the environment variables in `.env` as needed

4. Start the development server:
   ```bash
   npm run dev
   ```

## Database Setup

Make sure you have MongoDB installed and running locally or update the `MONGODB_URI` in the `.env` file to point to your MongoDB instance.

## API Endpoints

### Students

- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get a single student by ID
- `POST /api/students` - Create a new student
- `PUT /api/students/:id` - Update a student
- `DELETE /api/students/:id` - Delete a student

### Health Check
- `GET /health` - Check if the API is running

## API Documentation

### Student Object Structure
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "age": 20,
  "courseEnrolled": "Computer Science",
  "createdAt": "2023-06-01T12:00:00.000Z",
  "updatedAt": "2023-06-01T12:00:00.000Z"
}
```

### Create a Student

**Request:**
```http
POST /api/students
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "age": 20,
  "courseEnrolled": "Computer Science"
}
```

**Response (201 Created):**
```json
{
  "_id": "60d5ecb84264f640b8e8a1b2",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "age": 20,
  "courseEnrolled": "Computer Science",
  "createdAt": "2023-06-01T12:00:00.000Z",
  "updatedAt": "2023-06-01T12:00:00.000Z"
}
```

### Get All Students

**Request:**
```http
GET /api/students
```

**Response (200 OK):**
```json
[
  {
    "_id": "60d5ecb84264f640b8e8a1b2",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "age": 20,
    "courseEnrolled": "Computer Science",
    "createdAt": "2023-06-01T12:00:00.000Z",
    "updatedAt": "2023-06-01T12:00:00.000Z"
  }
]
```

## Error Handling

The API returns appropriate HTTP status codes along with error messages in the response body. Common status codes include:

- `400 Bad Request` - Invalid request data
- `404 Not Found` - Student not found
- `409 Conflict` - Email already exists
- `500 Internal Server Error` - Server error

## Environment Variables

- `PORT` - Port number for the server (default: 5000)
- `MONGODB_URI` - MongoDB connection string (default: 'mongodb://localhost:27017/student_management')
- `NODE_ENV` - Environment (development/production)

## Development

- Use `npm run dev` to start the development server with hot-reload
- The server will automatically restart when you make changes to the code

## License

ISC
