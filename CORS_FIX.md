# Fix CORS Error for Google OAuth

## Problem
```
Access to XMLHttpRequest at 'https://ai-driven-inventory-intelligence-platform.onrender.com/api/auth/google/url' 
from origin 'https://ai-driven-inventory-intelligence.vercel.app' has been blocked by CORS policy: 
The 'Access-Control-Allow-Origin' header has a value 'https://ai-driven-inventory-intelligence-m9oyu8lt5.vercel.app/' 
that is not equal to the supplied origin.
```

## Solution

The backend CORS configuration has been updated to:
1. ✅ Allow the production URL: `https://ai-driven-inventory-intelligence.vercel.app`
2. ✅ Allow all Vercel preview deployments (`*.vercel.app`)
3. ✅ Support multiple origins from environment variables

## Steps to Fix

### Step 1: Update Render Environment Variable

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your backend service
3. Go to **Environment** tab
4. Update `FRONTEND_URL` to:
   ```
   https://ai-driven-inventory-intelligence.vercel.app
   ```
   **Important:** Remove any trailing slash `/` if present

5. Click **Save Changes**

### Step 2: Redeploy Backend

After updating the environment variable:
1. Go to **Manual Deploy** or wait for auto-deploy
2. Click **Deploy latest commit** (or push a new commit)
3. Wait for deployment to complete

### Step 3: Verify CORS is Working

1. Open your frontend: `https://ai-driven-inventory-intelligence.vercel.app/login`
2. Open DevTools (F12) → **Console** tab
3. You should see logs showing allowed origins
4. Try "Continue with Google" again

## What Changed

The backend now:
- ✅ Explicitly allows `https://ai-driven-inventory-intelligence.vercel.app`
- ✅ Allows any Vercel preview URL (`*.vercel.app`)
- ✅ Logs allowed origins on startup for debugging
- ✅ Shows warnings when blocking unauthorized origins

## Testing

After redeploying, check the Render logs. You should see:
```
🌐 CORS allowed origins: [ 'http://localhost:3000', 'http://localhost:5173', 'https://ai-driven-inventory-intelligence.vercel.app' ]
🌐 CORS also allows: *.vercel.app (preview deployments)
```

## Still Not Working?

1. **Check Render Logs:** Look for CORS warnings
2. **Verify FRONTEND_URL:** Make sure it's set correctly (no trailing slash)
3. **Clear Browser Cache:** Hard refresh (Ctrl+F5)
4. **Check Network Tab:** Verify the request is going to the correct backend URL

