@echo off
echo Starting AgriPulseX Unified Server...
echo.

echo [1/2] Starting Unified Backend Server on port 8000...
cd /d "%~dp0backend"
start "AgriPulseX Unified Server" cmd /c "python unified_server.py"

echo [2/2] Starting Frontend on port 5173...
cd /d "%~dp0"
start "Frontend" cmd /c "npm run dev"

echo.
echo Unified Server: http://localhost:8000 (Auth + Analysis + Reports)
echo Frontend: http://localhost:5173 (Website)
echo.
echo All servers starting...
echo Press any key to exit...
pause
