# AgriPulseX - Quick Start Guide

## 🚀 Starting the Application

### Method 1: Using npm Scripts (Recommended)
```bash
# Start backend only
npm start

# Start backend with different name
npm run start:backend

# Start full application (backend + frontend)
npm run start:full

# Start frontend only
npm run dev
```

### Method 2: Using Batch Files
```bash
# Start unified server + frontend (recommended)
start-servers.bat

# Alternative unified server startup
start-unified-server.bat
```

## 📡 Server URLs
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🔧 Important Notes
- **Always use the unified server** - it contains both authentication and analysis endpoints
- The old separate server setup (auth.py + main.py) is deprecated
- Login will fail if you use the wrong backend server

## 🐛 Troubleshooting
If you see "Not Found" error on login:
1. Stop all running servers
2. Run `npm start` or `start-servers.bat`
3. Wait for servers to fully start
4. Try login again

## 📁 Project Structure
```
├── backend/
│   ├── unified_server.py    # ✅ CORRECT - Contains auth + analysis
│   ├── main.py            # ❌ OLD - Analysis only
│   └── api/auth.py        # ❌ OLD - Auth only
├── src/                   # Frontend React code
└── package.json           # Updated with correct scripts
```
