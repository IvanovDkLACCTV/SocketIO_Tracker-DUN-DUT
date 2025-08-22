@echo off
chcp 65001 >nul
echo Установка npm пакетов...
npm i socket.io socket.io-client express fs-extra dayjs sqlite3 better-sqlite3
npm i
echo Установка завершена!
pause