const io = require('socket.io-client');
const GpsTracker = require('./model');

const IP_ADDRESS = process.env.IP_ADDRESS || '127.0.0.1';
const PORT       = process.env.PORT       || 7070;
const URL        = `http://${IP_ADDRESS}:${PORT}/sender`;

// ---------- helpers ----------
const sleep = ms => new Promise(r => setTimeout(r, ms));

function createConnection () {
  return new Promise((resolve, reject) => {
    const socket = io(URL, { transports: ['websocket'] });

    socket.once('connect',       () => resolve(socket));
    socket.once('connect_error', reject);
  });
}

// ---------- main loop ----------
async function run () {
  // 1. Подключаемся
  let socket = await createConnection();
  console.log(`Connected to ${URL}`);

  // 2. Запускаем отправку пакетов
  const interval = setInterval(() => {
    socket.emit('gps_tracker', new GpsTracker().toJSON());
  }, 3000);

  // 3. Через 60 секунд – отключаемся
  setTimeout(async () => {
    socket.disconnect();
    console.log('Disconnected on purpose');
    clearInterval(interval);

    // 4. Ждём 3 минуты
    await sleep(3 * 60 * 1000);

    // 5. Заново запускаем весь цикл
    run();
  }, 60_000);
}

run().catch(console.error);