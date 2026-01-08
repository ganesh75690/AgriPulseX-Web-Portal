# 🚀 Quick Deploy AgriPulseX

## One-Click Deployment Steps

### 1. Deploy Backend (Render)
1. Go to [render.com](https://render.com)
2. Connect GitHub → Select this repo
3. **Root Directory**: `backend`
4. **Runtime**: Python 3
5. **Build Command**: `pip install -r requirements.txt`
6. **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
7. Add Environment Variable: `FRONTEND_URL=https://your-app.netlify.app`

### 2. Deploy Frontend (Netlify)
1. Go to [netlify.com](https://netlify.com)
2. Drag & drop the `build` folder
3. Set Environment Variable: `VITE_API_URL=https://your-backend.onrender.com`

### 3. Update URLs
- Replace `your-backend.onrender.com` with your actual backend URL
- Replace `your-app.netlify.app` with your actual frontend URL
- Update CORS origins in `backend/main.py` if needed

## Local Development

```bash
# Backend
cd backend
.\venv\Scripts\activate
uvicorn main:app --reload --port 8000

# Frontend (new terminal)
npm run dev
```

## Share Your App
Once deployed, share: `https://your-app.netlify.app`

✅ Works offline and online!
