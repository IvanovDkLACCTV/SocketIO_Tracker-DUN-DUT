const io = require('socket.io-client');

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
  const deviceno = Math.floor(Math.random() * 0xFFFFFFFF)
                        .toString(16)
                        .toUpperCase()
                        .padStart(8, '0');

  const interval = setInterval(() => {
    socket.emit('gps_tracker', {
      msgId:      Math.floor(Math.random() * 1000),
      deviceno:   deviceno,
      imei:       Math.floor(Math.random() * 1000000000000000000),
      lat:        (59.2 + Math.random() / 100).toFixed(6),
      lng:        (39.6 + Math.random() / 100).toFixed(6),
      speed:      60 + Math.floor(Math.random() * 20),
      direction:  60 + Math.random() * 20,
      altitude:   140 + Math.floor(Math.random() * 10),
      dateTime:   new Date().toISOString().slice(0, 19).replace('T', ' '),
      saltelite:  Math.floor(Math.random() * 100),
      params:    [
        'cntD:0.093',
        'fls_t0:0',
        'fls_t3:0',
        'fls_t2:0',
        'fls_t5:0',
        'fls_t4:0',
        'can_d22:262',
        'rel_fls3:0',
        'status_bit6:0',
        'rel_fls4:0',
        'prim_serv:1',
        'status_bit4:0',
        'd_id:256',
        'status_bit3:0',
        'ext_tag_12852:0.5',
        'status_bit5:0',
        'ext_tag_13109:24695409.15',
        'fls_t12:0',
        'status_bit8:0',
        'status_bit9:1',
        'ext_tag_12592:9598531.04',
        'rcv_tm:1755517003',
        'fls_t1:0',
        'valid:0',
        'gsm_sign:0',
        'status_bit10:0',
        'status_bit1:0',
        'ext_tag_13113:8589939.71',
        'rel_fls6:0',
        'rel_fls12:0',
        'fls_t7:0',
        'fls_t15:0',
        'rel_fls10:0',
        'status_bit14:0',
        'status_bit0:0',
        'fls_t10:0',
        'fls_t13:0',
        'fls_t11:0',
        'ext_tag_13874:8589950.01',
        'status_bit11:1',
        'rel_fls7:0',
        'rel_fls5:0',
        'fls0:0',
        'ext_tag_146:8084657.14',
        'status_bit15:0',
        'rel_fls8:0',
        'ext_tag_143:8072747.62',
        'hw:155',
        'status_bit7:0',
        'ext_tag_142:7398374.49',
        'fls1:0',
        'fls_t9:0',
        'ext_tag_256:9264825.8',
        'sw:39',
        'ibutton:0',
        'gprs_stat:1',
        'rel_fls15:0',
        'rel_fls9:0',
        'rel_fls14:0',
        'rel_fls13:0',
        'fls_t8:0',
        'rel_fls11:0',
        'status_bit12_13:2',
        'fls_t6:0',
        'status_bit2:0',
        'fls_t14:0',
        'fls2:0'
      ].join(';'),
      odometer: Math.floor(Math.random() ** 2 * 10000),
      checked: (Math.random() > 0.5),
      actual: (Math.random() > 0.5),
      moving: (Math.random() > 0.5),
    });
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