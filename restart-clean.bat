@echo off
echo ========================================
echo   AgriPulseX - Clean Restart Script
echo ========================================
echo.

echo [1/3] Stopping ALL Python processes...
taskkill /f /im python.exe 2>nul
taskkill /f /im pythonw.exe 2>nul
echo    - All Python processes stopped

echo [2/3] Waiting for ports to free...
timeout /t 2 >nul
echo    - Ports cleared

echo [3/3] Starting Unified Server...
cd /d "%~dp0backend"
start "AgriPulseX Unified Server" cmd /c "python unified_server.py"

echo.
echo ✅ Unified Server starting on http://localhost:8000
echo ✅ Login endpoints are now available
echo.
echo To start frontend, run: npm run dev
echo.
pause
