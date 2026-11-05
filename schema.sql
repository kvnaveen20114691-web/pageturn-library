
-- TABLE 1: READERS
CREATE TABLE IF NOT EXISTS readers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

-- TABLE 2: BOOKS
CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    genre TEXT NOT NULL
);

-- TABLE 3: LOANS
CREATE TABLE IF NOT EXISTS loans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reader_id INTEGER NOT NULL,
    book_id INTEGER NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,

    FOREIGN KEY (reader_id) REFERENCES readers(id),
    FOREIGN KEY (book_id) REFERENCES books(id),

    CHECK (date(end_date) >= date(start_date))
);
