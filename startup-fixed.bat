@echo off
echo ========================================
echo   AgriPulseX - Fixed Startup
echo ========================================
echo.

echo [1/2] Stopping all servers...
taskkill /f /im python.exe 2>nul
taskkill /f /im node.exe 2>nul
echo    - Servers stopped

echo [2/2] Starting unified server...
cd /d "%~dp0backend"
start "AgriPulseX Backend" cmd /c "python unified_server.py"

cd /d "%~dp0"
start "AgriPulseX Frontend" cmd /c "npm run dev"

echo.
echo ✅ FIXED SYSTEM STARTING!
echo ✅ Login page will show every time
echo ✅ Backend: http://localhost:8000
echo ✅ Frontend: http://localhost:5173
echo.
pause
