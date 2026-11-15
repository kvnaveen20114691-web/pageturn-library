
const express = require("express");
const router = express.Router();
const connectDB = require("../database");
const validateBook = require("../middleware/validation");

// GET all books OR search books by genre
router.get("/", async (req, res) => {
    try {
        const db = await connectDB();
        const { genre } = req.query;

        let books;

        if (genre && genre.trim()) {
            books = await db.all(
                "SELECT * FROM books WHERE LOWER(genre) = LOWER(?)",
                [genre.trim()]
            );
        } else {
            books = await db.all("SELECT * FROM books");
        }

        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET available books by date
router.get("/available", async (req, res) => {
    try {
        const { date } = req.query;

        // Validate requested date
        if (
            typeof date !== "string" ||
            !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
            !Number.isFinite(Date.parse(date)) ||
            new Date(date + "T00:00:00Z").toISOString().slice(0, 10) !== date
        ) {
            return res.status(400).json({
                error: "Please provide a valid date in YYYY-MM-DD format"
            });
        }

        const db = await connectDB();

        // Find books that have no loan covering the requested date
        const books = await db.all(
            `SELECT *
             FROM books b
             WHERE NOT EXISTS (
                 SELECT 1
                 FROM loans l
                 WHERE l.book_id = b.id
                 AND date(l.start_date) <= date(?)
                 AND date(l.end_date) >= date(?)
             )`,
            [date, date]
        );

        res.status(200).json(books);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// GET book by ID
router.get("/:id", async (req, res) => {
    try {
        const db = await connectDB();

        const book = await db.get(
            "SELECT * FROM books WHERE id = ?",
            [req.params.id]
        );

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST a new book
router.post("/", validateBook, async (req, res) => {
    try {
        const { name, genre } = req.body;
        const db = await connectDB();

        const result = await db.run(
            "INSERT INTO books (name, genre) VALUES (?, ?)",
            [name, genre]
        );

        res.status(201).json({
            message: "Book added successfully",
            id: result.lastID,
            name,
            genre
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT update book
router.put("/:id", validateBook, async (req, res) => {
    try {
        const { name, genre } = req.body;
        const db = await connectDB();

        const result = await db.run(
            "UPDATE books SET name = ?, genre = ? WHERE id = ?",
            [name, genre, req.params.id]
        );

        if (result.changes === 0) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.status(200).json({
            message: "Book updated successfully"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE book
router.delete("/:id", async (req, res) => {
    try {
        const db = await connectDB();

        const book = await db.get(
            "SELECT * FROM books WHERE id = ?",
            [req.params.id]
        );

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        await db.run(
            "DELETE FROM books WHERE id = ?",
            [req.params.id]
        );

        res.status(200).json({
            message: "Book deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            error: "Cannot delete book. It may be referenced by an existing loan."
        });
    }
});

module.exports = router;
