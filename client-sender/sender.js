const startLoop = require('./loop');

const IP_ADDRESS = process.env.IP_ADDRESS || '127.0.0.1';
const PORT       = process.env.PORT || 7070;
const URL        = `http://${IP_ADDRESS}:${PORT}/sender`;

const LOOPS_COUNT = 20;
const MESSAGES_PER_SECOND = 60;
const INTERVAL_MS = 1000 / (MESSAGES_PER_SECOND / LOOPS_COUNT);

const RUN_DURATION_MS = 60_000 * 10; // 10 минут
const PAUSE_DURATION_MS = 60_000 * 2; // 2 минуты

async function runLoopsCycle() {
  const stoppers = [];

  console.log('🚀 Запуск циклов...');
  for (let i = 0; i < LOOPS_COUNT; i++) {
    const stop = await startLoop(URL, INTERVAL_MS, i + 1);
    stoppers.push(stop);
  }

  setTimeout(async () => {
    console.log('🛑 Остановка циклов...');
    stoppers.forEach(stop => stop());

    console.log(`⏳ Ожидание ${PAUSE_DURATION_MS / 60_000} минут...`);
    setTimeout(() => {
      runLoopsCycle(); // 🔁 Перезапуск
    }, PAUSE_DURATION_MS);
  }, RUN_DURATION_MS);
}

runLoopsCycle();
