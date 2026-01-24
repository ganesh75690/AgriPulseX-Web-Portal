@echo off
echo Starting AgriPulseX Servers...
echo.

echo [1/2] Starting Unified Server on port 8000...
start "AgriPulseX Unified Server" cmd /c "cd /d "%~dp0backend" && python unified_server.py"

echo [2/2] Starting Frontend on port 5173...
start "Frontend" cmd /c "cd /d "%~dp0" && npm run dev"

echo.
echo All servers starting...
echo Unified Server: http://localhost:8000 (Auth + Analysis + Reports)
echo Frontend: http://localhost:5173 (Website)
echo.
echo Press any key to exit...
pause
