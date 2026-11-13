
function validateBook(req, res, next) {
    const { name, genre } = req.body;

    if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
            message: "Book name is required"
        });
    }

    if (typeof genre !== "string" || !genre.trim()) {
        return res.status(400).json({
            message: "Book genre is required"
        });
    }

    // Remove unnecessary spaces
    req.body.name = name.trim();
    req.body.genre = genre.trim();

    next();
}

module.exports = validateBook;
