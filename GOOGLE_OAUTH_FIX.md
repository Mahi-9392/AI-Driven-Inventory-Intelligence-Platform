# Fix "Cannot connect to server" for Google OAuth

## Problem
When clicking "Continue with Google", you see: **"Cannot connect to server. Please check if the backend is running."**

This means the frontend cannot reach the backend API.

## Solution

### Step 1: Verify Backend is Running

Open this URL in your browser:
```
https://ai-driven-inventory-intelligence-platform.onrender.com/api/health
```

**Expected response:**
```json
{"status":"ok","timestamp":"..."}
```

**If you get an error:**
- Backend might be sleeping (Render free tier)
- Wait 30-60 seconds and try again
- Check Render dashboard → Logs for errors

### Step 2: Set Environment Variable in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add/Update this variable:

   **Name:** `VITE_API_BASE_URL`
   
   **Value:** `https://ai-driven-inventory-intelligence-platform.onrender.com/api`
   
   **Environment:** Select **Production**, **Preview**, and **Development**

5. Click **Save**
6. **IMPORTANT:** Redeploy your frontend:
   - Go to **Deployments** tab
   - Click the **3 dots** (⋯) on the latest deployment
   - Click **Redeploy**

### Step 3: Verify the Variable is Being Used

After redeploying, check if the variable is loaded:

1. Open your frontend: `https://your-app.vercel.app/login`
2. Press **F12** to open DevTools
3. Go to **Console** tab
4. Type: `console.log(import.meta.env.VITE_API_BASE_URL)`
5. Press Enter

**Expected:** `https://ai-driven-inventory-intelligence-platform.onrender.com/api`

**If it shows `undefined`:**
- The variable is not set correctly
- Go back to Step 2 and verify the variable name (must be exactly `VITE_API_BASE_URL`)
- Make sure you redeployed after adding the variable

### Step 4: Check Network Request

1. In DevTools, go to **Network** tab
2. Click "Continue with Google"
3. Look for a request to `/auth/google/url`
4. Click on it
5. Check the **Request URL**:

**Correct:** `https://ai-driven-inventory-intelligence-platform.onrender.com/api/auth/google/url`

**Wrong:** `https://your-app.vercel.app/api/auth/google/url` (this means `VITE_API_BASE_URL` is not set)

### Step 5: Verify CORS Settings

Check Render environment variables:

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your backend service
3. Go to **Environment** tab
4. Verify `FRONTEND_URL` is set to your Vercel frontend URL:
   ```
   https://your-app.vercel.app
   ```
5. If not set, add it and redeploy

### Step 6: Test Again

After completing all steps:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+F5)
3. Try "Continue with Google" again

## Quick Checklist

- [ ] Backend is accessible at `/api/health`
- [ ] `VITE_API_BASE_URL` is set in Vercel
- [ ] Frontend was redeployed after setting the variable
- [ ] Browser console shows the correct API URL
- [ ] Network tab shows requests going to Render backend
- [ ] `FRONTEND_URL` is set in Render

## Still Not Working?

If it still doesn't work, check:

1. **Browser Console Errors:** Copy any red error messages
2. **Network Tab:** Check the failed request URL and status code
3. **Render Logs:** Check if backend is receiving the request
4. **Vercel Logs:** Check if frontend build completed successfully

