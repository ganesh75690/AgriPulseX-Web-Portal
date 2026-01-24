@echo off
echo ========================================
echo   AgriPulseX - PERSISTENT STARTUP
echo ========================================
echo.

echo [1/4] Cleaning up ALL processes...
taskkill /f /im python.exe 2>nul
taskkill /f /im pythonw.exe 2>nul
taskkill /f /im node.exe 2>nul
echo    - Processes killed

echo [2/4] Waiting for ports to clear...
timeout /t 2 >nul
echo    - Ports cleared

echo [3/4] Starting BACKEND (persistent)...
cd /d "%~dp0backend"
start "AgriPulseX Backend" /min cmd /c "python unified_server.py"
echo    - Backend starting on port 8000...

echo [4/4] Starting FRONTEND (persistent)...
cd /d "%~dp0"
start "AgriPulseX Frontend" /min cmd /c "npm run dev"
echo    - Frontend starting on port 5173...

echo.
echo ✅ SERVERS STARTED PERSISTENTLY
echo ✅ Backend:  http://localhost:8000
echo ✅ Frontend: http://localhost:5173
echo ✅ Both will auto-restart on file changes
echo.
echo 💡 TIPS:
echo    - Keep these terminal windows open
echo    - They will auto-restart when you save files
echo    - Close windows to stop servers
echo.
timeout /t 3 >nul
start http://localhost:5173
echo    - Browser opened
echo.
pause
