const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const path = require('path');
const fs = require('fs');

async function initDB(sessionKey) {
  const dbDir = path.join(__dirname, 'db');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const filePath = path.join(dbDir, `${sessionKey}.json`);
  const adapter = new JSONFile(filePath);
  const db = new Low(adapter, {}); // ← вот здесь добавлен пустой объект как defaultData

  await db.read();
  db.data ||= {}; // ← если файл пустой, создаём корневой объект

  return db;
}

module.exports = { initDB };
