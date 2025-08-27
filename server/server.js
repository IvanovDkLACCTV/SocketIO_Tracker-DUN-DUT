const path     = require('path');
const express  = require('express');
const app      = express();
const http     = require('http').createServer(app);
const io       = require('socket.io')(http, { cors: { origin: '*' } });
const dayjs    = require('dayjs');
const { db, initDB } = require('./lowdb');

// Счётчик сообщений
let messageCount = 0;

// Раздаём клиент-ресивер
app.use('/', express.static(path.join(__dirname, '../client-reciever')));

// Инициализация базы и запуск сервера
(async () => {
  await initDB();

  // Восстанавливаем счётчик из базы
  messageCount = db.data?.messages?.length || 0;
  console.log(`💾 Восстановлен счётчик: ${messageCount} сообщений`);

  // Обработка подключений от отправителей
  io.of('/sender').on('connection', socket => {
    console.log('→ sender connected', socket.id);

    socket.on('gps_tracker', async payload => {
      try {
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

        // 1. Сразу отправляем на фронт
        io.of('/receiver').emit('gps_update', message);

        // 2. Пишем в базу в фоне
        db.data.messages.push(message);
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

  const IP_ADDRESS = process.env.IP_ADDRESS || '127.0.0.1';
  const PORT = process.env.PORT || 7070;
  http.listen(PORT, () => console.log(`🚀 Server ready on http://${IP_ADDRESS}:${PORT}`));
})();
