
const express = require('express');
const connectDB = require('./database');

const readersRouter = require('./routes/readers');
const booksRouter = require('./routes/books');

const app = express();

app.use(express.json());

// Welcome route
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to PageTurn Library API'
    });
});

// Readers routes
app.use('/readers', readersRouter);

// Books routes
app.use('/books', booksRouter);

// Start server after database connection
const PORT = 3000;

async function startServer() {
    try {
        const db = await connectDB();

        app.locals.db = db;

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
}

startServer();
