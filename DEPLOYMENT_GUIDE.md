# AgriPulseX Deployment Guide

## Overview
Deploy AgriPulseX with both offline local development and online production capabilities.

## Architecture
- **Backend**: FastAPI on Render/Railway
- **Frontend**: React/Vite on Netlify/Vercel
- **Database**: Built-in file storage (no external DB needed)

---

## Backend Deployment (FastAPI)

### Option 1: Render (Recommended)
1. **Prepare Repository**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Render**
   - Go to [render.com](https://render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the `backend` folder as root directory
   - Use these settings:
     - **Runtime**: Python 3
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
     - **Instance Type**: Free

3. **Set Environment Variables**
   ```
   FRONTEND_URL=https://your-frontend-url.netlify.app
   ```

### Option 2: Railway
1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Deploy**
   ```bash
   cd backend
   railway init
   railway up
   ```

---

## Frontend Deployment (React)

### Option 1: Netlify (Recommended)
1. **Build for Production**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `build` folder
   - Or connect GitHub repository for auto-deploys

3. **Set Environment Variables**
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

### Option 2: Vercel
1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

---

## Local Development Setup

### Backend (Offline)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend (Offline)
```bash
npm install
npm run dev
```

### Environment Setup
1. Copy `.env.example` to `.env`
2. Update with your local settings:
   ```
   VITE_API_URL=http://localhost:8000
   ```

---

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:3000`
- `http://localhost:5173`
- `https://your-frontend-url.netlify.app`
- `https://your-frontend-url.vercel.app`

Update the `allowed_origins` list in `backend/main.py` if needed.

---

## Final Verification Checklist

### Backend Tests
- [ ] Health check: `GET /` returns status
- [ ] API docs: Visit `/docs`
- [ ] Image analysis: Test with sample image
- [ ] PDF generation: Test report download

### Frontend Tests
- [ ] Login page loads
- [ ] Dashboard accessible
- [ ] Image upload works
- [ ] Analysis results display
- [ ] PDF download functions

### Integration Tests
- [ ] Frontend connects to backend
- [ ] CORS headers properly set
- [ ] File uploads work cross-origin
- [ ] Error handling works

### Production Tests
- [ ] Deployed URLs accessible
- [ ] HTTPS works correctly
- [ ] Mobile responsive
- [ ] Shareable URL works on any device

---

## Environment Variables Reference

### Backend
- `FRONTEND_URL`: Your deployed frontend URL
- `PORT`: Server port (set by platform)

### Frontend
- `VITE_API_URL`: Backend API URL
- `VITE_APP_NAME`: Application name
- `NODE_ENV`: Environment (development/production)

---

## Troubleshooting

### Common Issues
1. **CORS Errors**: Update allowed origins in backend
2. **Build Failures**: Check Node.js version (use 18+)
3. **API Timeouts**: Increase timeout in frontend config
4. **File Upload Issues**: Check file size limits

### Debug Commands
```bash
# Backend logs
curl https://your-backend-url.onrender.com/

# Frontend build check
npm run build && npm run preview
```

---

## Shareable URLs

Once deployed:
- **Frontend**: `https://your-app.netlify.app`
- **Backend API**: `https://your-backend.onrender.com`
- **API Docs**: `https://your-backend.onrender.com/docs`

The same codebase works offline and online - just update the environment variables!
