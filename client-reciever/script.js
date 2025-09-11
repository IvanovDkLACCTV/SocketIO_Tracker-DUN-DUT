const socket = io('/receiver', {
  transports: ['websocket', 'polling']
});
const tbody = document.querySelector('#table tbody');
const counter = document.getElementById('counter');
const clearBtn = document.getElementById('clearBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

const pageSize = 20;
let currentPage = 0;
let allMessages = [];

// Очистка таблицы и данных
clearBtn.addEventListener('click', () => {
  allMessages = [];
  currentPage = 0;
  renderPage();
});

// Навигация
prevBtn.addEventListener('click', () => {
  if (currentPage > 0) {
    currentPage--;
    renderPage();
  }
});

nextBtn.addEventListener('click', () => {
  if ((currentPage + 1) * pageSize < allMessages.length) {
    currentPage++;
    renderPage();
  }
});

// Форматирование параметров
const formatParamsObject = (paramsObj) =>
  Object.entries(paramsObj).map(([k, v]) => `${k}: ${v}`).join('\n');

const shortParamsObject = (paramsObj, limit = 10) => {
  const entries = Object.entries(paramsObj).slice(0, limit);
  return entries.map(([k, v]) => `${k}: ${v}`).join('\n') + '…';
};

// Обработка входящих данных
socket.on('gps_update', data => {
  allMessages.unshift(data);
  renderPage();
});

// Отображение текущей страницы
function renderPage() {
  tbody.innerHTML = '';
  const start = currentPage * pageSize;
  const end = start + pageSize;
  const visibleMessages = allMessages.slice(start, end);

  visibleMessages.forEach(data => {
    const tr = document.createElement('tr');

    const fullParams = formatParamsObject(data.params);
    const shortText = shortParamsObject(data.params);

    const paramCell = document.createElement('td');
    paramCell.textContent = shortText;
    paramCell.style.cursor = 'pointer';
    paramCell.style.whiteSpace = 'pre-wrap';
    paramCell.style.wordBreak = 'break-word';
    paramCell.style.maxWidth = '300px';
    paramCell.addEventListener('click', () => {
      paramCell.textContent = paramCell.textContent === shortText ? fullParams : shortText;
    });

    tr.innerHTML = `
      <td style="text-align:center">${data.msgId}<br>${data.sequenceId}</td>
      <td style="text-align:center">${data.dateTime}</td>
      <td style="text-align:center">${data.currentDate}</td>
      <td style="text-align:center">${data.deviceno}</td>
      <td style="text-align:center">${data.imei}</td>
      <td style="text-align:center">${data.lat}</td>
      <td style="text-align:center">${data.lng}</td>
      <td style="text-align:center">${data.altitude}</td>
      <td style="text-align:center">${data.speed}</td>
      <td style="text-align:center">${data.direction}</td>
      <td style="text-align:center">${data.saltelite}</td>
      <td style="text-align:center">${data.odometer}</td>
      <td style="text-align:center">${data.checked}</td>
      <td style="text-align:center">${data.actual}</td>
      <td style="text-align:center">${data.moving}</td>
    `;
    tr.appendChild(paramCell);
    tbody.appendChild(tr);
  });

  // Обновление счётчиков
  const totalPages = Math.max(1, Math.ceil(allMessages.length / pageSize));
  counter.textContent = `Получено: ${allMessages.length} | Отображается: ${visibleMessages.length} | Страница: ${currentPage + 1} / ${totalPages}`;
}
