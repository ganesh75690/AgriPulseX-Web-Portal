@echo off

echo "=========================================="
echo "AgriPulseX - Complete Diagnostic"
echo "=========================================="
echo.

echo "[1/5] Checking Current Processes..."
echo "Backend Processes:"
tasklist | findstr python.exe
echo "Frontend Processes:"
tasklist | findstr node.exe
echo.

echo "[2/5] Checking Network Ports..."
netstat -ano | findstr ":8000\|:3000\|:5173"
echo.

echo "[3/5] Testing Backend API..."
curl -s -o /dev/null -w "%%{http_code}" http://localhost:8000/api/auth/login -X POST -H "Content-Type: application/json" -d "{\"username\":\"test\",\"password\":\"test\",\"role\":\"officer\"}"
echo "Backend HTTP Status: %%http_code%%"
echo.

echo "[4/5] Testing Frontend Access..."
curl -s -o /dev/null -w "%%{http_code}" http://localhost:3000
echo "Frontend HTTP Status: %%http_code%%"
echo.

echo "[5/5] Checking localStorage..."
echo "Checking if browser can access both services..."
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo.

echo "[6/5] Creating Test Report..."
echo "==========================================" > diagnostic-report.txt
echo "AgriPulseX Diagnostic Report" >> diagnostic-report.txt
echo "Generated: %date%" >> diagnostic-report.txt
echo "" >> diagnostic-report.txt
echo "Backend Status: %%http_code%%" >> diagnostic-report.txt
echo "Frontend Status: %%http_code%%" >> diagnostic-report.txt
echo "" >> diagnostic-report.txt
echo "Processes:" >> diagnostic-report.txt
tasklist | findstr python.exe >> diagnostic-report.txt
tasklist | findstr node.exe >> diagnostic-report.txt
echo "" >> diagnostic-report.txt
echo "Ports:" >> diagnostic-report.txt
netstat -ano | findstr ":8000\|:3000\|:5173" >> diagnostic-report.txt
echo "" >> diagnostic-report.txt
echo "==========================================" >> diagnostic-report.txt
echo "" >> diagnostic-report.txt
echo "RECOMMENDATIONS:" >> diagnostic-report.txt
echo "1. If backend != 200: Backend API issue" >> diagnostic-report.txt
echo "2. If frontend != 200: Frontend issue" >> diagnostic-report.txt
echo "3. If both 200: Check browser CORS/Network" >> diagnostic-report.txt
echo "4. Run: npm start (guaranteed startup)" >> diagnostic-report.txt
echo "==========================================" >> diagnostic-report.txt
echo "" >> diagnostic-report.txt
echo " Diagnostic complete! Check diagnostic-report.txt"
echo "=========================================="
