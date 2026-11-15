# PageTurn Library

## Project Description

PageTurn Library is a Library Management REST API built using Node.js, Express.js, and SQLite. It allows users to manage readers, books, and book loans through API endpoints.

## Technologies Used

- Node.js
- Express.js
- SQLite
- REST API
- Postman
- Git and GitHub

## Installation and Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/kvnaveen20114691-web/pageturn-library.git
   ```

2. Navigate to the project folder:

   ```bash
   cd pageturn-library
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the server:

   ```bash
   npm start
   ```

5. The API server runs at:

   `http://localhost:3000`

## API Endpoints

### 1. Readers API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/readers` | Get all readers |
| GET | `/readers/:id` | Get a reader by ID |
| POST | `/readers` | Add a new reader |
| PUT | `/readers/:id` | Update a reader |
| DELETE | `/readers/:id` | Delete a reader |

### 2. Books API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/books` | Get all books |
| GET | `/books/:id` | Get a book by ID |
| POST | `/books` | Add a new book |
| PUT | `/books/:id` | Update a book |
| DELETE | `/books/:id` | Delete a book |
| GET | `/books?genre=fiction` | Search books by genre |
| GET | `/books/available?date=2026-11-11` | Get books available on a specific date |

### 3. Loans API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/loans` | Get all loans with reader and book details |
| GET | `/loans/:id` | Get a loan by ID |
| POST | `/loans` | Create a new loan |

## Twist Features

### 1. Available Books by Date

The API provides an endpoint to find books that are not loaned on a requested date.

Example:

`GET /books/available?date=2026-11-11`

The endpoint excludes books whose loan period includes the requested date.

### 2. Loan Date Validation

The API validates loan dates and rejects a request when the end date is earlier than the start date.

Expected response:

```json
{
  "error": "End date cannot be earlier than start date"
}
```

HTTP status: `400 Bad Request`

### 3. Book Search by Genre

Users can search for books by genre using the query parameter.

Example:

`GET /books?genre=fiction`

## Testing

The API can be tested using Postman.

1. Start the server using `npm start`.
2. Open Postman.
3. Import the collection from:

   `postman/PageTurn_Library.postman_collection.json`

4. Run the requests in the Readers API, Books API, Loans API, and Twist Tests folders.
5. Check the HTTP status codes and response data.

### Twist Test Cases

- Verify that invalid loan dates return HTTP 400.
- Verify that a book is unavailable during its loan period.
- Verify that the book becomes available after its loan period ends.

## Project Structure

```text
pageturn-library/
├── middleware/
├── postman/
│   └── PageTurn_Library.postman_collection.json
├── routes/
│   ├── books.js
│   ├── loans.js
│   └── readers.js
├── database.js
├── schema.sql
├── server.js
├── package.json
└── README.md
```

## Conclusion

PageTurn Library provides REST API functionality for managing books, readers, and loans, including date-based book availability and loan date validation.
