const path = require('path');
const Database = require('better-sqlite3');

const DB_PATH = path.join(__dirname, 'gps_messages.db');
const db = new Database(DB_PATH);

// Создание таблицы, если не существует
db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sequenceId INTEGER UNIQUE,
    timestamp INTEGER,
    msgId INTEGER,
    deviceno TEXT,
    imei TEXT,
    lat REAL,
    lng REAL,
    speed REAL,
    direction REAL,
    altitude REAL,
    dateTime TEXT,
    currentDate TEXT,
    saltelite INTEGER,
    odometer INTEGER,
    checked INTEGER,
    actual INTEGER,
    moving INTEGER,
    deliveredToClient INTEGER DEFAULT 0
  );
`);

module.exports = db;
