# Railway Backend Deployment Guide - End to End

## Complete Step-by-Step Guide

### Prerequisites Checklist
- ✅ MongoDB Atlas account and connection string ready
- ✅ GitHub repository: `Mahi-9392/AI-Driven-Inventory-Intelligence-Platform`
- ✅ Groq API key ready
- ✅ Google OAuth credentials (if using OAuth)

---

## Step 1: Sign Up for Railway

1. Go to **https://railway.app**
2. Click **"Start a New Project"** or **"Login"**
3. Choose **"Login with GitHub"**
4. Authorize Railway to access your GitHub account
5. You'll be redirected to Railway dashboard

---

## Step 2: Create New Project

1. In Railway dashboard, click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. You'll see a list of your repositories
4. Find and select: **`Mahi-9392/AI-Driven-Inventory-Intelligence-Platform`**
5. Click on it to deploy

---

## Step 3: Configure Service

Railway will auto-detect your project. Now configure it:

1. Railway will show your project
2. Click on the service (or create a new service)
3. Go to **Settings** tab
4. Configure:

   **Root Directory:**
   ```
   backend
   ```

   **Start Command:**
   ```
   npm start
   ```

   **Build Command:**
   ```
   npm install
   ```

---

## Step 4: Add Environment Variables

This is the most important step! Click **"Variables"** tab and add these:

### Required Environment Variables

#### 1. MongoDB Connection
```
MONGODB_URI=mongodb+srv://myAtlasDBUser:Mahia2025@myatlasclusteredu.hopdd.mongodb.net/inventoryDB?retryWrites=true&w=majority
```
**Note:** If your password has special characters, URL-encode them:
- `@` becomes `%40`
- `:` becomes `%3A`
- `/` becomes `%2F`

#### 2. JWT Secret
```
JWT_SECRET=6fc97e179bc2fb30443aa54e18d098031179aa1e012de11eb525cbb6247754b5e29d75c444c230ab99b8ed4ecbdee3e653b897b362bb66f35f4efc25ad39b91c
```
*(Use a strong random string - at least 32 characters)*

#### 3. Groq API Key
```
GROQ_API_KEY=your_groq_api_key_here
```
*(Get your API key from https://console.groq.com/)*

#### 4. Port (Optional - Railway auto-assigns)
```
PORT=5000
```

#### 5. Node Environment
```
NODE_ENV=production
```

#### 6. Frontend URL (Update after Vercel deployment)
```
FRONTEND_URL=https://your-vercel-app.vercel.app
```
**For now, use:** `http://localhost:3000` (update later)

#### 7. Google OAuth (If using OAuth)
```
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=https://your-railway-app.railway.app/api/auth/google/callback
```
*(Get OAuth credentials from https://console.cloud.google.com/)*
**Note:** Update `GOOGLE_REDIRECT_URI` after you get your Railway URL

---

## Step 5: Deploy

1. After adding all environment variables, Railway will automatically:
   - Install dependencies (`npm install`)
   - Start your server (`npm start`)
2. Watch the **"Deployments"** tab for build logs
3. Wait 2-3 minutes for deployment to complete
4. Check for any errors in the logs

---

## Step 6: Get Your Backend URL

1. Once deployed, go to **"Settings"** tab
2. Scroll down to **"Domains"** section
3. Railway will generate a domain like:
   ```
   https://your-app-name.up.railway.app
   ```
4. **Copy this URL** - you'll need it for:
   - Frontend environment variable (`VITE_API_BASE_URL`)
   - Google OAuth redirect URI
   - Testing your API

---

## Step 7: Test Your Deployment

### Test Health Endpoint
Open in browser or use curl:
```
https://your-app-name.up.railway.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-01-XX..."
}
```

### Test API Endpoints
Try the signup endpoint:
```bash
POST https://your-app-name.up.railway.app/api/auth/signup
```

---

## Step 8: Update Google OAuth (If Using)

1. Go to **Google Cloud Console**: https://console.cloud.google.com
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Add to **Authorized redirect URIs**:
   ```
   https://your-app-name.up.railway.app/api/auth/google/callback
   ```
5. Save changes
6. Update Railway environment variable:
   ```
   GOOGLE_REDIRECT_URI=https://your-app-name.up.railway.app/api/auth/google/callback
   ```

---

## Step 9: Update Frontend (Vercel)

After getting your Railway backend URL:

1. Go to **Vercel** dashboard
2. Your project → **Settings** → **Environment Variables**
3. Update `VITE_API_BASE_URL`:
   ```
   https://your-app-name.up.railway.app/api
   ```
4. Redeploy frontend

---

## Step 10: Update Backend CORS

1. Go back to **Railway** → **Variables**
2. Update `FRONTEND_URL` with your Vercel URL:
   ```
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```
3. Railway will auto-redeploy

---

## Troubleshooting

### Deployment Fails

**Check Build Logs:**
1. Go to **Deployments** tab
2. Click on failed deployment
3. Check error messages

**Common Issues:**

1. **"Module not found"**
   - Solution: Ensure `package.json` has all dependencies
   - Check `backend/package.json` exists

2. **"MongoDB connection failed"**
   - Solution: Check `MONGODB_URI` is correct
   - Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
   - URL-encode special characters in password

3. **"Port already in use"**
   - Solution: Remove `PORT` variable, Railway auto-assigns

4. **"JWT_SECRET not set"**
   - Solution: Add `JWT_SECRET` environment variable

### API Not Responding

1. Check **Deployments** tab - is deployment successful?
2. Check **Metrics** tab - is service running?
3. Test health endpoint: `/api/health`
4. Check logs in **Deployments** → **View Logs**

### CORS Errors

1. Verify `FRONTEND_URL` matches your Vercel URL exactly
2. Check backend logs for CORS errors
3. Ensure frontend uses correct `VITE_API_BASE_URL`

---

## Environment Variables Summary

Copy-paste ready list (update values):

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
JWT_SECRET=your_32_character_secret_key_here
GROQ_API_KEY=your_groq_api_key
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-vercel-app.vercel.app
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://your-railway-app.railway.app/api/auth/google/callback
```

---

## Quick Checklist

- [ ] Signed up for Railway with GitHub
- [ ] Created new project from GitHub repo
- [ ] Set Root Directory to `backend`
- [ ] Added all environment variables
- [ ] Deployment successful
- [ ] Got Railway backend URL
- [ ] Tested `/api/health` endpoint
- [ ] Updated Google OAuth redirect URI
- [ ] Updated Vercel `VITE_API_BASE_URL`
- [ ] Updated Railway `FRONTEND_URL`
- [ ] Tested full application

---

## Your Railway Backend URL Format

After deployment, your backend will be at:
```
https://[random-name].up.railway.app
```

API endpoints will be:
```
https://[random-name].up.railway.app/api/auth/...
https://[random-name].up.railway.app/api/inventory/...
https://[random-name].up.railway.app/api/forecasts/...
https://[random-name].up.railway.app/api/reports/...
```

---

## Support

If you encounter issues:
1. Check Railway deployment logs
2. Verify all environment variables are set
3. Test MongoDB connection separately
4. Check Railway status page: https://status.railway.app

---

## Next Steps After Deployment

1. ✅ Backend deployed on Railway
2. ✅ Frontend deployed on Vercel
3. ✅ Environment variables configured
4. ✅ Test signup/login
5. ✅ Test CSV upload
6. ✅ Test AI forecasting
7. ✅ Test PDF generation

Your application is now live! 🚀

