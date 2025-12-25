# Fix Google OAuth 404 Error

## Problem
Getting "404 Not Found" or "Unexpected Application Error" when clicking Google OAuth button.

## Solutions

### 1. Check Backend is Running
Test your backend health endpoint:
```
https://ai-driven-inventory-intelligence-platform.onrender.com/api/health
```
Should return: `{"status":"ok",...}`

### 2. Update Google OAuth Redirect URIs

Go to **Google Cloud Console**: https://console.cloud.google.com

1. **APIs & Services** → **Credentials**
2. Click on your **OAuth 2.0 Client ID**
3. Under **Authorized redirect URIs**, add these (make sure all are added):

```
https://ai-driven-inventory-intelligence-platform.onrender.com/api/auth/google/callback
https://your-vercel-app.vercel.app/auth/google/success
https://your-vercel-app.vercel.app/auth/google/error
```

Replace `your-vercel-app.vercel.app` with your actual Vercel frontend URL.

4. Click **Save**

### 3. Update Render Environment Variables

In **Render Dashboard** → Your Service → **Environment** tab:

Make sure these are set correctly:

```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=https://ai-driven-inventory-intelligence-platform.onrender.com/api/auth/google/callback
FRONTEND_URL=https://your-vercel-app.vercel.app
```

**Important:**
- `GOOGLE_REDIRECT_URI` must match your Render backend URL
- `FRONTEND_URL` must match your Vercel frontend URL

### 4. Update Vercel Environment Variable

In **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**:

```env
VITE_API_BASE_URL=https://ai-driven-inventory-intelligence-platform.onrender.com/api
```

### 5. Test OAuth Flow

1. Go to your Vercel frontend
2. Click "Continue with Google"
3. You should be redirected to Google login
4. After login, Google redirects to: `https://ai-driven-inventory-intelligence-platform.onrender.com/api/auth/google/callback`
5. Backend processes and redirects to: `https://your-vercel-app.vercel.app/auth/google/success?token=...`
6. Frontend handles the callback and redirects to dashboard

### 6. Common Issues

#### Issue: 404 on `/api/auth/google/callback`
**Solution:**
- Check backend is running
- Verify route exists: `app.use('/api/auth', authRoutes)`
- Check Render logs for errors

#### Issue: 404 on `/auth/google/success`
**Solution:**
- This is a frontend route, should exist in `router/index.jsx`
- Verify Vercel deployment includes all routes
- Check React Router configuration

#### Issue: CORS Error
**Solution:**
- Update `FRONTEND_URL` in Render to match Vercel URL exactly
- Check backend CORS configuration allows your Vercel origin

#### Issue: "Cannot GET /"
**Solution:**
- This is normal - backend API doesn't have a root route
- Use `/api/health` to test backend
- Frontend should access `/api/*` endpoints

### 7. Debug Steps

1. **Check Render Logs:**
   - Go to Render → Your Service → **Logs** tab
   - Look for OAuth-related errors
   - Check if callback route is being hit

2. **Check Browser Console:**
   - Open browser DevTools (F12)
   - Go to Console tab
   - Look for errors when clicking Google OAuth

3. **Check Network Tab:**
   - Open browser DevTools → Network tab
   - Click Google OAuth button
   - See which requests fail (404, 500, etc.)

4. **Test Backend Directly:**
   ```
   GET https://ai-driven-inventory-intelligence-platform.onrender.com/api/auth/google/url
   ```
   Should return: `{"authUrl":"https://accounts.google.com/..."}`

### 8. Verify Routes Exist

**Backend Routes (should exist):**
- ✅ `GET /api/auth/google/url` - Get Google OAuth URL
- ✅ `GET /api/auth/google/callback` - Handle OAuth callback

**Frontend Routes (should exist):**
- ✅ `GET /auth/google/success` - Success callback page
- ✅ `GET /auth/google/error` - Error callback page

### 9. Quick Checklist

- [ ] Backend running on Render
- [ ] `/api/health` endpoint works
- [ ] Google OAuth redirect URIs updated in Google Cloud Console
- [ ] Render environment variables set correctly
- [ ] Vercel `VITE_API_BASE_URL` set correctly
- [ ] Frontend routes for `/auth/google/success` and `/auth/google/error` exist
- [ ] CORS configured correctly
- [ ] Test OAuth flow end-to-end

### 10. If Still Not Working

Check Render logs for specific error messages:
1. Go to Render → Your Service → **Logs**
2. Look for errors related to:
   - Google OAuth
   - Missing environment variables
   - Database connection issues
   - CORS errors

Common log errors to look for:
- `GOOGLE_CLIENT_ID is not set`
- `GOOGLE_CLIENT_SECRET is not set`
- `Invalid redirect URI`
- `CORS error`

---

## Summary

The 404 error usually means:
1. Google OAuth redirect URI not added in Google Cloud Console
2. Render environment variables not set correctly
3. Backend route not accessible
4. Frontend route missing

Fix these and OAuth should work! 🚀

