const { io } = require('socket.io-client');
const socket = io('http://127.0.0.1:7070/receiver');

socket.on('connect', () => console.log('connected OK'));
socket.on('connect_error', err => console.error('connect_error', err.message));
