const io = require('socket.io-client');
const GpsTracker = require('./model');

const sleep = ms => new Promise(r => setTimeout(r, ms));

module.exports = async function startLoop(url, intervalMs, id) {
  const socket = io(url, {
    reconnection: true, // Автоматическое переподключение
    reconnectionAttempts: Infinity, // Бесконечные попытки переподключения
    reconnectionDelay: 1000, // Задержка перед первой попыткой переподключения
    reconnectionDelayMax: 5000, // Максимальная задержка между попытками
    timeout: 20000, // Увеличенный таймаут (по умолчанию 20000 мс)
    transports: ['websocket'] // Использовать только websocket
  });

  await new Promise((resolve, reject) => {
    socket.once('connect', () => resolve());
    socket.once('connect_error', reject);
  });

  console.log(`→ Loop ${id} started on ${url}`);

  const timer = setInterval(() => {
    const tracker = new GpsTracker();
    socket.emit('gps_tracker', tracker.getGpsTracker());
  }, intervalMs);

  return () => {
    clearInterval(timer);
    socket.disconnect();
  };
};


