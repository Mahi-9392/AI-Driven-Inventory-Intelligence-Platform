# Fix "Cannot connect to server" Error in Vercel Frontend

## Problem
Frontend shows: "Cannot connect to server. Please check if the backend is running."

## Solution: Add Environment Variable in Vercel

### Step 1: Go to Vercel Dashboard

1. Go to **https://vercel.com**
2. Sign in
3. Click on your project: `AI-Driven-Inventory-Intelligence-Platform` (or whatever it's named)

### Step 2: Add Environment Variable

1. Click **"Settings"** tab (top navigation)
2. Click **"Environment Variables"** (left sidebar)
3. Click **"Add New"** button

### Step 3: Add the Variable

**Variable Name:**
```
VITE_API_BASE_URL
```

**Value:**
```
https://ai-driven-inventory-intelligence-platform.onrender.com/api
```

**Environments:**
- ✅ Production
- ✅ Preview  
- ✅ Development

### Step 4: Save and Redeploy

1. Click **"Save"**
2. Go to **"Deployments"** tab
3. Find the latest deployment
4. Click the **"..."** menu (three dots)
5. Click **"Redeploy"**
6. Wait for deployment to complete

## Alternative: Add via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Add environment variable
vercel env add VITE_API_BASE_URL production
# When prompted, enter: https://ai-driven-inventory-intelligence-platform.onrender.com/api
```

## Verify Backend is Running

Test your backend health endpoint:
```
https://ai-driven-inventory-intelligence-platform.onrender.com/api/health
```

Should return:
```json
{"status":"ok","timestamp":"..."}
```

If this doesn't work, your backend might be sleeping (Render free tier spins down after inactivity).

## Check Browser Console

1. Open your frontend in browser
2. Press **F12** to open DevTools
3. Go to **Console** tab
4. Look for errors like:
   - `Failed to fetch`
   - `Network Error`
   - `CORS error`

## Check Network Tab

1. Open DevTools → **Network** tab
2. Try to sign up
3. Look for API requests
4. Check if they're going to the correct backend URL
5. Check the status code (should be 200, not 404 or 500)

## Common Issues

### Issue 1: Environment Variable Not Set
**Solution:** Add `VITE_API_BASE_URL` in Vercel environment variables

### Issue 2: Backend Sleeping (Render Free Tier)
**Solution:** 
- Wait 30-60 seconds after first request
- Backend will wake up
- Subsequent requests will be fast

### Issue 3: CORS Error
**Solution:**
1. Check Render environment variable `FRONTEND_URL` matches your Vercel URL exactly
2. Example: `FRONTEND_URL=https://ai-driven-inventory-intelligence.vercel.app`
3. Redeploy backend after updating

### Issue 4: Wrong Backend URL
**Solution:**
- Verify backend URL: `https://ai-driven-inventory-intelligence-platform.onrender.com`
- Make sure it includes `/api` at the end in `VITE_API_BASE_URL`
- Should be: `https://ai-driven-inventory-intelligence-platform.onrender.com/api`

## Quick Checklist

- [ ] Added `VITE_API_BASE_URL` in Vercel
- [ ] Value is: `https://ai-driven-inventory-intelligence-platform.onrender.com/api`
- [ ] Selected all environments (Production, Preview, Development)
- [ ] Saved the variable
- [ ] Redeployed frontend after adding variable
- [ ] Backend is running (test `/api/health`)
- [ ] `FRONTEND_URL` is set correctly in Render
- [ ] Test signup again

## After Fixing

Once you add the environment variable and redeploy:
1. Frontend will use the correct backend URL
2. API calls will go to Render backend
3. Signup/login should work

---

**Most Important:** The `VITE_API_BASE_URL` environment variable **MUST** be set in Vercel for the frontend to know where the backend is!

