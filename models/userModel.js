const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db/database.sqlite', (err) => {
    if (err) {
        console.error("Database opening error:", err);
    } else {
        console.log("Connected to SQLite database");
    }
});

// Create users table
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT
    )
`);

module.exports = db;
