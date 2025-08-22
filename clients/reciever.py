import socketio

sio = socketio.Client(logger=True, engineio_logger=True)

@sio.on('gps_update', namespace='/receiver')
def on_gps_update(data):
    print('📡 GPS-данные:')
    for k, v in data.items():
        print(f'{k}: {v}')
    print('-' * 40)

@sio.on('connect', namespace='/receiver')
def on_connect():
    print('✅ Подключено к /receiver')

@sio.on('disconnect', namespace='/receiver')
def on_disconnect():
    print('❌ Отключено от /receiver')

sio.connect('http://127.0.0.1:7070', namespaces=['/receiver'], transports=['websocket'])
sio.wait()
