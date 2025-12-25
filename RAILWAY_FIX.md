# Fix Railway Deployment Error - npm: command not found

## Problem
Railway service `inventory-intelligence-frontend` is trying to build backend but npm is not found.

## Solution: Reconfigure Service in Railway

### Option 1: Fix Current Service (Recommended)

1. **Go to Railway Dashboard**
   - Open your Railway project
   - Click on the service `inventory-intelligence-frontend`

2. **Delete the Service** (we'll recreate it properly)
   - Go to **Settings** tab
   - Scroll to bottom
   - Click **"Delete Service"**
   - Confirm deletion

3. **Create New Backend Service**
   - Click **"+ New"** button
   - Select **"GitHub Repo"**
   - Choose your repository: `Mahi-9392/AI-Driven-Inventory-Intelligence-Platform`
   - Click **"Deploy Now"**

4. **Configure Service Settings**
   - Go to **Settings** tab
   - Set **Root Directory**: `backend`
   - **Start Command**: Leave empty (Railway will auto-detect `npm start`)
   - **Build Command**: Leave empty (Railway will auto-detect)

5. **Rename Service** (Optional but recommended)
   - In Settings, change service name to: `inventory-intelligence-backend`

6. **Add Environment Variables**
   - Go to **Variables** tab
   - Add all required variables (see RAILWAY_DEPLOY.md)

7. **Redeploy**
   - Railway will auto-detect Node.js and npm
   - Build should succeed

---

### Option 2: Fix Service Settings (If you want to keep current service)

1. **Go to Service Settings**
   - Click on `inventory-intelligence-frontend` service
   - Go to **Settings** tab

2. **Update Configuration**
   - **Root Directory**: Set to `backend`
   - **Start Command**: `npm start` (or leave empty)
   - **Build Command**: Leave empty (Railway auto-detects)

3. **Check Nixpacks Configuration**
   - Railway should auto-detect Node.js from `backend/package.json`
   - If not, go to **Settings** → **Build**
   - Ensure **Builder** is set to **Nixpacks** (auto-detected)

4. **Redeploy**
   - Go to **Deployments** tab
   - Click **"Redeploy"** or push a new commit

---

## Why This Happens

Railway needs to:
1. Know the **Root Directory** is `backend` (not root)
2. Auto-detect Node.js from `backend/package.json`
3. Have npm available in the build environment

When Root Directory is wrong, Railway tries to build from root and can't find npm.

---

## Quick Fix Steps

1. ✅ Delete `inventory-intelligence-frontend` service
2. ✅ Create new service from GitHub repo
3. ✅ Set **Root Directory** = `backend`
4. ✅ Add environment variables
5. ✅ Deploy

---

## Verification

After fixing, check:
- ✅ Build logs show "Installing Node.js"
- ✅ Build logs show "Running npm install"
- ✅ Deployment succeeds
- ✅ Service shows "Active" status
- ✅ `/api/health` endpoint works

---

## Alternative: Use Railway CLI

If dashboard doesn't work, you can use Railway CLI:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Set root directory
railway variables set RAILWAY_SERVICE_ROOT_DIRECTORY=backend

# Deploy
railway up
```

But the dashboard method is easier for first-time setup.

