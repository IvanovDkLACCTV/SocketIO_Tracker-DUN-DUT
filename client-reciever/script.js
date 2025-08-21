const socket = io('/receiver');
const tbody = document.querySelector('#table tbody');

// Очистка таблицы
document.getElementById('clearBtn').addEventListener('click', () => {
  tbody.innerHTML = '';
});

// Форматирование параметров с переносом строк
const formatParams = (text, chunkSize = 40) => {
  return text.match(new RegExp(`.{1,${chunkSize}}`, 'g')).join('\n');
};

// Сокращённый вариант параметров
const shortParams = (params) => {
  return params.length > 40 ? params.slice(0, 40) + '…' : params;
};

// Обработка входящих данных
socket.on('gps_update', data => {
  const tr = document.createElement('tr');

  const fullParams = formatParams(data.params);
  const shortText = shortParams(data.params);

  const paramCell = document.createElement('td');
  paramCell.textContent = shortText;
  paramCell.style.cursor = 'pointer';
  paramCell.style.whiteSpace = 'pre-wrap'; // перенос строк
  paramCell.style.wordBreak = 'break-word'; // перенос длинных слов
  paramCell.style.maxWidth = '300px'; // ограничение ширины
  paramCell.addEventListener('click', () => {
    paramCell.textContent = paramCell.textContent === shortText ? fullParams : shortText;
  });

  tr.innerHTML = `
    <td style="text-align:center">${data.msgId}</td>
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
