const startLoop = require('./loop');

const IP_ADDRESS = process.env.IP_ADDRESS || '127.0.0.1';
const PORT       = process.env.PORT || 7070;
const URL        = `http://${IP_ADDRESS}:${PORT}/sender`;

const LOOPS_COUNT = 10;           // количество параллельных циклов
const MESSAGES_PER_SECOND = 60;  // общая нагрузка
const INTERVAL_MS = 1000 / (MESSAGES_PER_SECOND / LOOPS_COUNT);

(async () => {
  const stoppers = [];

  for (let i = 0; i < LOOPS_COUNT; i++) {
    const stop = await startLoop(URL, INTERVAL_MS);
    stoppers.push(stop);
  }

  // Остановка через 1 минуту
  setTimeout(() => {
    stoppers.forEach(stop => stop());
    console.log('✅ Все циклы остановлены');
  }, 60_000);
})();
