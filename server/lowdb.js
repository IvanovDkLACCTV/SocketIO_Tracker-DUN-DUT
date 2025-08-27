const path = require('path');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');

// путь до файла с данными
const file = path.join(__dirname, 'db', 'messages.json');
const adapter = new JSONFile(file);

// создаём объект базы
const db = new Low(adapter, { messages: [] });

// функция инициализации
async function initDB() {
  await db.read();
  db.data ||= { messages: [] }; // если файл пустой
}

module.exports = { db, initDB };
