const express = require('express');

const app = express();

// Middleware to read JSON data
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to PageTurn Library API'
    });
});

// Start server
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});