
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
const path = require("path");
const fs = require("fs");

async function connectDB() {
    const db = await open({
        filename: path.join(__dirname, "pageturn.db"),
        driver: sqlite3.Database
    });

    // Enable foreign key relationships
    await db.exec("PRAGMA foreign_keys = ON");

    // Create tables using schema.sql
    const schema = fs.readFileSync(
        path.join(__dirname, "schema.sql"),
        "utf8"
    );

    await db.exec(schema);

    console.log("SQLite database connected successfully!");

    return db;
}

module.exports = connectDB;
