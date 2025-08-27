const fs       = require('fs-extra');
const path     = require('path');
const express  = require('express');
const app      = express();
const http     = require('http').createServer(app);
const io       = require('socket.io')(http, { cors: { origin: '*' } });
const dayjs    = require('dayjs');
const { db, initDB } = require('./lowdb')

// Счётчик сообщений
let messageCount = 0;

(async () => {
  await initDB();

  io.of('/sender').on('connection', socket => {
    console.log('→ sender connected', socket.id);

    socket.on('gps_tracker', async payload => {
      try {
        const {
          msgId, deviceno, imei, lat, lng, speed, direction,
          altitude, dateTime, saltelite, params, odometer,
          checked, actual, moving
        } = payload;

        const currentDate = dayjs(dateTime).format('YYYY-MM-DD HH:mm:ss');
        const sequenceId = ++messageCount;

        // формируем объект
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
          params // объект хранится как есть
        };

        // сохраняем в JSON
        db.data.messages.push(message);
        await db.write();

        // отправляем всем получателям
        io.of('/receiver').emit('gps_update', message);

      } catch (e) {
        console.error('Bad payload:', e);
      }
    });

    socket.on('disconnect', () => console.log('← sender disconnected', socket.id));
  });

  io.of('/receiver').on('connection', socket => {
    console.log('→ receiver connected', socket.id);
  });

  const IP_ADDRESS = process.env.IP_ADDRESS || '127.0.0.1';
  const PORT = process.env.PORT || 7070;
  http.listen(PORT, () => console.log(`Server ready on http://${IP_ADDRESS}:${PORT}`));
})();
