@echo off
chcp 65001 >nul
echo Установка npm пакетов...
npm i socket.io express fs-extra dayjs socket.io-client
npm i
echo Установка завершена!
pause