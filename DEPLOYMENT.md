# Deployment Guide for AI-Driven Inventory Intelligence Platform

## Deployment Architecture

This application consists of:
- **Backend**: Node.js/Express API (Port 5000 or environment variable)
- **Frontend**: React/Vite application
- **Database**: MongoDB (MongoDB Atlas recommended for production)

## Recommended Deployment Platforms

### Option 1: Vercel (Frontend) + Railway (Backend) - Recommended
- **Frontend**: Vercel (free tier, excellent for React)
- **Backend**: Railway (free tier, easy MongoDB integration)
- **Database**: MongoDB Atlas (free tier available)

### Option 2: Render (Full Stack)
- **Frontend**: Render Static Site
- **Backend**: Render Web Service
- **Database**: MongoDB Atlas

### Option 3: Netlify (Frontend) + Render (Backend)
- **Frontend**: Netlify (free tier)
- **Backend**: Render (free tier)
- **Database**: MongoDB Atlas

---

## Step-by-Step Deployment

### 1. Set Up MongoDB Atlas (Required)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (Free tier: M0)
4. Create a database user
5. Whitelist IP addresses (use `0.0.0.0/0` for all IPs during development)
6. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`

### 2. Deploy Backend (Railway - Recommended)

1. Go to [Railway](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_random_secret_key_here
   GROQ_API_KEY=your_groq_api_key
   PORT=5000
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   GOOGLE_CLIENT_ID=your_google_oauth_client_id
   GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
   GOOGLE_REDIRECT_URI=https://your-backend-url.railway.app/api/auth/google/callback
   ```
6. Railway will automatically detect Node.js and deploy
7. Note your backend URL (e.g., `https://your-app.railway.app`)

### 3. Deploy Frontend (Vercel - Recommended)

1. Go to [Vercel](https://vercel.com)
2. Sign up with GitHub
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add environment variable:
   ```
   VITE_API_BASE_URL=https://your-backend-url.railway.app/api
   ```
7. Deploy

### 4. Update Google OAuth Settings

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Update OAuth 2.0 redirect URIs:
   - `https://your-backend-url.railway.app/api/auth/google/callback`
   - `https://your-frontend-url.vercel.app/auth/google/success`
   - `https://your-frontend-url.vercel.app/auth/google/error`

---

## Alternative: Deploy Backend on Render

1. Go to [Render](https://render.com)
2. Create a new "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. Add environment variables (same as Railway)
6. Deploy

---

## Environment Variables Reference

### Backend (.env)
```env
# Server
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_random_secret_key_minimum_32_characters

# Groq AI
GROQ_API_KEY=your_groq_api_key

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend-domain.vercel.app

# Google OAuth
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GOOGLE_REDIRECT_URI=https://your-backend-url.railway.app/api/auth/google/callback
```

### Frontend (.env)
```env
VITE_API_BASE_URL=https://your-backend-url.railway.app/api
```

---

## Post-Deployment Checklist

- [ ] Backend is accessible and returns 200 on health check
- [ ] Frontend can connect to backend API
- [ ] MongoDB connection is working
- [ ] Authentication (signup/login) works
- [ ] Google OAuth redirects work correctly
- [ ] CSV upload works
- [ ] AI forecasting works
- [ ] PDF generation works
- [ ] CORS is configured correctly

---

## Troubleshooting

### Backend not connecting to MongoDB
- Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Verify connection string is correct
- Check database user credentials

### CORS errors
- Ensure `FRONTEND_URL` in backend matches your frontend domain
- Check backend CORS configuration allows your frontend origin

### Google OAuth not working
- Verify redirect URIs in Google Cloud Console
- Check `GOOGLE_REDIRECT_URI` matches backend URL
- Ensure OAuth consent screen is configured

### Frontend can't reach backend
- Verify `VITE_API_BASE_URL` is set correctly
- Check backend is running and accessible
- Verify API routes are correct

---

## Quick Deploy Commands

### Local Testing Before Deployment

**Backend:**
```bash
cd backend
npm install
npm start
```

**Frontend:**
```bash
cd frontend
npm install
npm run build
npm run preview
```

---

## Support

For issues, check:
- Backend logs on Railway/Render dashboard
- Frontend build logs on Vercel dashboard
- MongoDB Atlas connection logs
- Browser console for frontend errors

