const path = require('path');
const Database = require('better-sqlite3');

const DB_PATH = path.join(__dirname, 'db', 'gps_messages.db');
const db = new Database(DB_PATH);

// Создание таблицы, если не существует
db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    sequenceId INTEGER PRIMARY KEY,
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
    odometer REAL,
    checked INTEGER,
    actual INTEGER,
    moving INTEGER,
    params TEXT
  );
`);

module.exports = db;
