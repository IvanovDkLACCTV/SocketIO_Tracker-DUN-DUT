### Простое описание API для получателя (Receiver)

#### Подключение:
```javascript
const socket = io('http://<IP_ADRESS>:7070/receiver');
```

#### Получаемый объект при событии `gps_update`:
```javascript
{
  sequenceId: number,     // Уникальный ID сообщения
  timestamp: number,      // Время получения (в мс)
  msgId: number,          // ID сообщения от устройства
  deviceno: string,       // Серийный номер (8-значный hex)
  imei: number,           // IMEI устройства
  lat: string,            // Широта
  lng: string,            // Долгота
  speed: number,          // Скорость
  direction: number,      // Направление
  altitude: number,       // Высота
  dateTime: string,       // Время с устройства
  currentDate: string,    // Время в формате "YYYY-MM-DD HH:mm:ss"
  saltelite: number,      // Количество спутников
  odometer: number,       // Пробег
  checked: boolean,       // Статус проверки
  actual: boolean,        // Актуальность данных
  moving: boolean,        // В движении
  params: {              // Дополнительные параметры
    cntD: number,
    fls_t0: number,
    fls_t3: number,
    // ... и прочие параметры
  }
}
```

#### Пример использования:
```javascript
// Подключаемся к серверу
const socket = io('http://localhost:7070/receiver');

// Слушаем обновления GPS
socket.on('gps_update', (data) => {
  console.log('Получены данные:', data);
  console.log('Координаты:', data.lat, data.lng);
  console.log('Параметры:', data.params);
});
```