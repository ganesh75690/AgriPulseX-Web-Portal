@echo off
echo ========================================
echo   AgriPulseX - GUARANTEED STARTUP
echo ========================================
echo.

echo [1/3] Killing ALL processes...
taskkill /f /im python.exe 2>nul
taskkill /f /im pythonw.exe 2>nul
taskkill /f /im node.exe 2>nul
echo    - All processes killed

echo [2/3] Waiting for ports to clear...
timeout /t 3 >nul
echo    - Ports cleared

echo [3/3] Starting BACKEND...
cd /d "%~dp0backend"
start "AgriPulseX Backend" /min cmd /c "python unified_server.py"

echo [4/3] Waiting for backend...
timeout /t 5 >nul
echo    - Backend should be ready

echo [5/3] Starting FRONTEND...
cd /d "%~dp0"
start "AgriPulseX Frontend" /min cmd /c "npm run dev"

echo [6/3] Verifying frontend...
timeout /t 10 >nul
echo    - Frontend starting...

echo.
echo ✅ COMPLETE! Both servers running
echo ✅ Backend: http://localhost:8000
echo ✅ Frontend: http://localhost:3000
echo ✅ Login: http://localhost:3000
echo.
echo If you still see issues, wait 30 seconds and refresh browser
echo.
pause
