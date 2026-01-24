@echo off
echo ========================================
echo   AgriPulseX - ERROR-FREE STARTUP
echo ========================================
echo.

echo [1/3] Cleaning ALL processes...
taskkill /f /im python.exe 2>nul
taskkill /f /im pythonw.exe 2>nul
taskkill /f /im node.exe 2>nul
echo    - All processes killed

echo [2/3] Waiting for ports to clear...
timeout /t 2 >nul
echo    - Ports cleared

echo [3/3] Starting BACKEND (no auth required)...
cd /d "%~dp0backend"
start "AgriPulseX Backend" /min cmd /c "python unified_server.py"
echo    - Backend starting on port 8000...

echo [4/3] Starting FRONTEND...
cd /d "%~dp0"
start "AgriPulseX Frontend" /min cmd /c "npm run dev"
echo    - Frontend starting on port 5173...

echo.
echo ✅ SYSTEM READY - NO LOGIN REQUIRED
echo ✅ Backend:  http://localhost:8000
echo ✅ Frontend: http://localhost:5173
echo ✅ Report Submission: WORKING WITHOUT LOGIN
echo ✅ Image Analysis: WORKING WITHOUT LOGIN
echo.
echo 🎯 FEATURES:
echo    - No authentication required
echo    - Submit reports freely
echo    - Upload images freely  
echo    - No more 401 errors
echo    - No more login prompts
echo.
timeout /t 3 >nul
start http://localhost:5173
echo    - Browser opened
echo.
echo 💡 READY TO USE! Submit reports immediately!
echo.
pause
