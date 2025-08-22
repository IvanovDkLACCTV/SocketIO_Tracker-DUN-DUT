@echo off
chcp 65001 >nul
echo Запуск клиента-отправителя...
node client-sender/sender.js
pause