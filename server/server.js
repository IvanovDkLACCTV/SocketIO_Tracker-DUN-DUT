const path     = require('path');
const express  = require('express');
const app      = express();
const http     = require('http').createServer(app);
const io       = require('socket.io')(http, { cors: { origin: '*' }, transports: ['websocket', 'polling'] });
const dayjs    = require('dayjs');
const fs       = require('fs');
const { initDB } = require('./lowdb');

let receivedCount = 0;
let sentCount     = 0;
let messageCount  = 0;

(async () => {
  // Уникальный ключ для текущей сессии
  const sessionKey = `messages_${dayjs().format('YYYYMMDD_HHmmss')}`;
  const db = await initDB(sessionKey);

  // Раздаём клиент-ресивер
  app.use('/', express.static(path.join(__dirname, '../client-reciever')));

  // Логирование
  function writeLog(log) {
    const logsDir = path.join(__dirname, 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    const logFile = path.join(logsDir, 'session.log');
    const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');
    fs.appendFileSync(logFile, `${timestamp} — ${log}\n`);
  }

  // Создаём новую таблицу для текущей сессии
  db.data[sessionKey] = [];
  console.log(`📁 Создана новая таблица: ${sessionKey}`);

  // Обработка подключений от отправителей
  io.of('/sender').on('connection', socket => {
    console.log('→ sender connected', socket.id);

    socket.on('gps_tracker', async payload => {
      try {
        receivedCount++;

        const {
          msgId, deviceno, imei, lat, lng, speed, direction,
          altitude, dateTime, saltelite, params, odometer,
          checked, actual, moving
        } = payload;

        const currentDate = dayjs(dateTime).isValid()
          ? dayjs(dateTime).format('YYYY-MM-DD HH:mm:ss')
          : null;

        const sequenceId = ++messageCount;

        const message = {
          sequenceId,
          timestamp: Date.now(),
          msgId,
          deviceno,
          imei,
          lat,
          lng,
          speed,
          direction,
          altitude,
          dateTime,
          currentDate,
          saltelite,
          odometer,
          checked,
          actual,
          moving,
          params
        };

        io.of('/receiver').emit('gps_update', message);
        sentCount++;

        db.data[sessionKey].push(message);
        db.write().catch(err => {
          console.error(`❌ Ошибка записи sequenceId ${sequenceId}:`, err);
        });

      } catch (e) {
        console.error('Bad payload:', e);
      }
    });

    socket.on('disconnect', () => console.log('← sender disconnected', socket.id));
  });

  // Обработка подключений от получателей
  io.of('/receiver').on('connection', socket => {
    console.log('→ receiver connected', socket.id);
  });

  // Логирование при остановке
  process.on('SIGINT', () => {
    const log = `🛑 Сервер остановлен\n📥 Получено: ${receivedCount}\n📤 Отправлено: ${sentCount}\n📁 Таблица: ${sessionKey}\n`;
    console.log(log);
    writeLog(log);
    process.exit();
  });

  const IP_ADDRESS = process.env.IP_ADDRESS || '127.0.0.1';
  const PORT = process.env.PORT || 7070;
  http.listen(PORT, () => console.log(`🚀 Server ready on http://${IP_ADDRESS}:${PORT}`));
})();
