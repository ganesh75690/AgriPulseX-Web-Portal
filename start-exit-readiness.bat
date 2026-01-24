@echo off
echo Starting AgriPulseX with Containment Exit Readiness Meter...
echo.
echo ========================================
echo 🚀 AgriPulseX Intelligence Platform
echo ========================================
echo.
echo ✅ New Feature: Containment Exit Readiness Meter
echo 📍 Location: Containment Control Room
echo 🎯 Purpose: Helps decide when to safely lift containment
echo.
echo Starting servers...
echo.

cd /d "%~dp0"

echo [1/3] Starting Backend Server...
start "Backend Server" cmd /c "cd backend && python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

timeout /t 3 /nobreak > nul

echo [2/3] Starting Frontend Development Server...
start "Frontend Server" cmd /c "npm start"

timeout /t 3 /nobreak > nul

echo [3/3] Opening Application...
timeout /t 2 /nobreak > nul
start http://localhost:3000

echo.
echo ========================================
echo 🌟 AgriPulseX Started Successfully!
echo ========================================
echo.
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:8000
echo 📚 API Docs: http://localhost:8000/docs
echo.
echo 🆕 Test the new Containment Exit Readiness Meter:
echo    1. Go to Containment Control Room
echo    2. Select disease and region
echo    3. View the Exit Readiness Meter
echo    4. Check the calculated score and recommendations
echo.
echo Press any key to exit...
pause > nul
