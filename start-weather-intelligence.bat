@echo off
echo Starting AgriPulseX Weather Intelligence System...
echo.
echo ========================================
echo    AgriPulseX Weather Intelligence
echo ========================================
echo.

echo Starting Weather Intelligence Backend...
cd backend
python weather_intelligence.py

pause
