const socket = io('/receiver');
const tbody = document.querySelector('#table tbody');

// Очистка таблицы
document.getElementById('clearBtn').addEventListener('click', () => {
  tbody.innerHTML = '';
});

// Форматирование объекта параметров
const formatParamsObject = (paramsObj) => {
  return Object.entries(paramsObj)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
};

// Сокращённый вариант (первые N параметров)
const shortParamsObject = (paramsObj, limit = 10) => {
  const entries = Object.entries(paramsObj).slice(0, limit);
  return entries.map(([key, value]) => `${key}: ${value}`).join('\n') + '…';
};

// Обработка входящих данных
socket.on('gps_update', data => {
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
  tbody.prepend(tr);
});
