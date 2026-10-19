@echo off
title CaddiePro - Servidor Frontend Local
color 0A

echo =========================================================================
echo       CADDIEPRO: INICIANDO SERVIDOR FRONTEND (PUERTO 5500 / 8000)
echo =========================================================================
echo.

start http://localhost:5500
node serve_frontend.js

pause
