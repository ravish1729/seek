import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import config from '../../config/index.js';

// Ensure the data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Database file path
const dbPath = path.join(dataDir, config.sqlite_database || 'hashx.db');

// Create and configure the database connection
const db = new Database(dbPath, {
    verbose: config.environment === 'development' ? console.log : undefined
});

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

console.log(`Connected to SQLite database: ${dbPath}`);

export default db; 