
const express = require("express");
const router = express.Router();

// Validate YYYY-MM-DD dates
function isValidDate(date) {
    if (
        typeof date !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(date)
    ) {
        return false;
    }

    const parsedDate = new Date(date + "T00:00:00Z");

    return (
        !Number.isNaN(parsedDate.getTime()) &&
        parsedDate.toISOString().slice(0, 10) === date
    );
}

// GET all loans with reader and book details (JOIN)
router.get("/", async (req, res) => {
    try {
        const db = req.app.locals.db;

        const loans = await db.all(`
            SELECT
                loans.id,
                readers.name AS reader_name,
                readers.email AS reader_email,
                books.name AS book_name,
                books.genre,
                loans.start_date,
                loans.end_date
            FROM loans
            JOIN readers ON loans.reader_id = readers.id
            JOIN books ON loans.book_id = books.id
            ORDER BY loans.id
        `);

        res.status(200).json(loans);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET loan by ID with reader and book details
router.get("/:id", async (req, res) => {
    try {
        const db = req.app.locals.db;

        const loan = await db.get(`
            SELECT
                loans.id,
                loans.reader_id,
                readers.name AS reader_name,
                readers.email AS reader_email,
                loans.book_id,
                books.name AS book_name,
                books.genre,
                loans.start_date,
                loans.end_date
            FROM loans
            JOIN readers ON loans.reader_id = readers.id
            JOIN books ON loans.book_id = books.id
            WHERE loans.id = ?
        `, [req.params.id]);

        if (!loan) {
            return res.status(404).json({
                error: "Loan not found"
            });
        }

        res.status(200).json(loan);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create a new loan
router.post("/", async (req, res) => {
    try {
        const {
            reader_id,
            book_id,
            start_date,
            end_date
        } = req.body;

        // Check required fields
        if (
            reader_id == null ||
            book_id == null ||
            !start_date ||
            !end_date
        ) {
            return res.status(400).json({
                error: "Reader ID, Book ID, start date and end date are required"
            });
        }

        // Validate dates
        if (!isValidDate(start_date) || !isValidDate(end_date)) {
            return res.status(400).json({
                error: "Dates must be valid and follow YYYY-MM-DD format"
            });
        }

        // Check loan date order
        if (end_date < start_date) {
            return res.status(400).json({
                error: "End date cannot be earlier than start date"
            });
        }

        const db = req.app.locals.db;

        // Check whether reader exists
        const reader = await db.get(
            "SELECT id FROM readers WHERE id = ?",
            [reader_id]
        );

        if (!reader) {
            return res.status(404).json({
                error: "Reader not found"
            });
        }

        // Check whether book exists
        const book = await db.get(
            "SELECT id FROM books WHERE id = ?",
            [book_id]
        );

        if (!book) {
            return res.status(404).json({
                error: "Book not found"
            });
        }

        // Insert loan into database
        const result = await db.run(
            `INSERT INTO loans
             (reader_id, book_id, start_date, end_date)
             VALUES (?, ?, ?, ?)`,
            [reader_id, book_id, start_date, end_date]
        );

        res.status(201).json({
            message: "Loan created successfully",
            id: result.lastID,
            reader_id,
            book_id,
            start_date,
            end_date
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

module.exports = router;
