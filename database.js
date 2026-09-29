const Database = require("better-sqlite3");

const db = new Database("database.db");

db.prepare(`
    CREATE TABLE IF NOT EXISTS mods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        version TEXT NOT NULL,
        loader TEXT NOT NULL,
        image TEXT,
        download TEXT,
        description TEXT
    )
`).run();

console.log("Database created successfully!");

db.close();