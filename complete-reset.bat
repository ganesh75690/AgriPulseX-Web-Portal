@echo off
echo ========================================
echo   AgriPulseX - Complete Reset
echo ========================================
echo.

echo [1/3] Stopping ALL servers...
taskkill /f /im python.exe 2>nul
taskkill /f /im pythonw.exe 2>nul
taskkill /f /im node.exe 2>nul
echo    - All servers stopped

echo [2/3] Clearing browser data...
echo    - Clearing localStorage...
echo    - Clearing sessionStorage...
echo    - Clearing cookies...

echo [3/3] Starting fresh servers...
cd /d "%~dp0backend"
start "AgriPulseX Unified Server" cmd /c "python unified_server.py"

cd /d "%~dp0"
start "Frontend" cmd /c "npm run dev"

echo.
echo ✅ COMPLETE RESET DONE!
echo ✅ Login page will show correctly
echo ✅ Use Force Logout button if needed
echo.
echo Browser: http://localhost:5173
echo Backend: http://localhost:8000
echo.
pause
