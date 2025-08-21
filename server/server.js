// npm i socket.io express fs-extra dayjs
const fs       = require('fs-extra');
const path     = require('path');
const express  = require('express');
const app      = express();
const http     = require('http').createServer(app);
const io       = require('socket.io')(http, { cors: { origin: '*' } });
const dayjs    = require('dayjs');

const LOG_DIR = path.join(__dirname, 'logs');
fs.ensureDirSync(LOG_DIR);

const logToFile = (data) => {
  const dateTag = dayjs(data.dateTime).format('YYYY-MM-DD');
  const file    = path.join(LOG_DIR, `${dateTag}.log`);
  fs.appendFileSync(file, JSON.stringify(data) + '\n');
};

// клиент-отправитель
io.of('/sender').on('connection', socket => {
  console.log('→ sender connected', socket.id);

  socket.on('gps_tracker', payload => {
    try {
      // 1. сохраняем всё как есть
      logToFile(payload);

      // 2. готовим к нужные поля
      const currentDate = dayjs(payload.dateTime).format('YYYY-MM-DD HH:mm:ss');
      const { msgId, deviceno, imei, lat, lng, speed, direction, altitude, dateTime, saltelite, params, odometer, checked, actual, moving } = payload;
      const sendPayload = {
        deviceno,
        msgId,
        imei,
        lat,
        lng,
        speed,
        direction,
        altitude,
        dateTime,
        currentDate,
        saltelite,
        params,
        odometer,
        checked,
        actual,
        moving,
      }

      // 3. рассылаем всем клиентам-получателям
      io.of('/receiver').emit('gps_update', sendPayload);
    } catch (e) {
      console.error('Bad payload:', e);
    }
  });

  socket.on('disconnect', () => console.log('← sender disconnected', socket.id));
});

// клиент-получатель
io.of('/receiver').on('connection', socket => {
  console.log('→ receiver connected', socket.id);
});

// host static для клиента-получателя
app.use('/', express.static(path.join(__dirname, '../client-reciever')));

const IP_ADDRESS = process.env.IP_ADDRESS || '127.0.0.1';
const PORT = process.env.PORT || 7070;
http.listen(PORT, () => console.log(`Server ready on http://${IP_ADDRESS}:${PORT}`));