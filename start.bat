@echo off
echo ==============================================
echo  Starting Labour Management System
echo ==============================================
echo Starting Backend on port 5000...
start "Labour Management Backend" cmd /k "cd /d %~dp0backend && npm run start:dev"

echo Starting Frontend on port 3000...
start "Labour Management Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Both services are starting iFrontend UI: http://localhost:3000
echo Backend API: http://localhost:5000n separate windows.
echo 
echo ==============================================
