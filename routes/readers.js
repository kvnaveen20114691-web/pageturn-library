
const express = require('express');
const router = express.Router();

// GET all readers
router.get('/', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const readers = await db.all('SELECT * FROM readers');

        res.status(200).json(readers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET reader by ID
router.get('/:id', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const reader = await db.get(
            'SELECT * FROM readers WHERE id = ?',
            [req.params.id]
        );

        if (!reader) {
            return res.status(404).json({ error: 'Reader not found' });
        }

        res.status(200).json(reader);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST add a new reader
router.post('/', async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                error: 'Name and email are required'
            });
        }

        const db = req.app.locals.db;

        const result = await db.run(
            'INSERT INTO readers (name, email) VALUES (?, ?)',
            [name.trim(), email.trim()]
        );

        res.status(201).json({
            message: 'Reader added successfully',
            id: result.lastID
        });
    } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT') {
            return res.status(409).json({
                error: 'Email already exists'
            });
        }

        res.status(500).json({ error: error.message });
    }
});

// PUT update reader
router.put('/:id', async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                error: 'Name and email are required'
            });
        }

        const db = req.app.locals.db;

        const result = await db.run(
            'UPDATE readers SET name = ?, email = ? WHERE id = ?',
            [name.trim(), email.trim(), req.params.id]
        );

        if (result.changes === 0) {
            return res.status(404).json({
                error: 'Reader not found'
            });
        }

        res.status(200).json({
            message: 'Reader updated successfully'
        });
    } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT') {
            return res.status(409).json({
                error: 'Email already exists'
            });
        }

        res.status(500).json({ error: error.message });
    }
});

// DELETE reader
router.delete('/:id', async (req, res) => {
    try {
        const db = req.app.locals.db;

        const result = await db.run(
            'DELETE FROM readers WHERE id = ?',
            [req.params.id]
        );

        if (result.changes === 0) {
            return res.status(404).json({
                error: 'Reader not found'
            });
        }

        res.status(200).json({
            message: 'Reader deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
