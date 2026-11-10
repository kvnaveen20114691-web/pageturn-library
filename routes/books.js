
const express = require("express");
const router = express.Router();
const connectDB = require("../database");

// GET all books
router.get("/", async (req, res) => {
    try {
        const db = await connectDB();
        const books = await db.all("SELECT * FROM books");

        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
router.post("/", async (req, res) => {
    try {
        const { name, genre } = req.body;

        if (!name || !genre) {
            return res.status(400).json({
                message: "Name and genre are required"
            });
        }

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
router.put("/:id", async (req, res) => {
    try {
        const { name, genre } = req.body;

        if (!name || !genre) {
            return res.status(400).json({
                message: "Name and genre are required"
            });
        }

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
            "UPDATE books SET name = ?, genre = ? WHERE id = ?",
            [name, genre, req.params.id]
        );

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
