const io = require('socket.io-client');
const GpsTracker = require('./model');

const sleep = ms => new Promise(r => setTimeout(r, ms));

module.exports = async function startLoop(url, intervalMs, id) {
  const socket = io(url, { transports: ['websocket'] });

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


