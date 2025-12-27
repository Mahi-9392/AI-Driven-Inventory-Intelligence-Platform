# Security Fix: Groq API Key Exposure

## ⚠️ URGENT ACTION REQUIRED

Your Groq API key has been exposed and will be disabled soon. Follow these steps immediately:

## Step 1: Create a New API Key

1. Go to https://console.groq.com/
2. Navigate to API Keys section
3. Create a new API key
4. **Copy the new key immediately** (you won't be able to see it again)

## Step 2: Update Environment Variables

### For Local Development:

1. Open `backend/.env` file
2. Update the `GROQ_API_KEY` value:
   ```
   GROQ_API_KEY=your-new-groq-api-key-here
   ```
3. Save the file

### For Render Deployment:

1. Go to your Render Dashboard: https://dashboard.render.com/
2. Select your backend service
3. Go to **Environment** tab
4. Find `GROQ_API_KEY` variable
5. Click **Edit** and paste your new API key
6. Click **Save Changes**
7. **Redeploy** your service (Render should auto-redeploy)

### For Railway Deployment:

1. Go to your Railway Dashboard: https://railway.app/
2. Select your project
3. Select your backend service
4. Go to **Variables** tab
5. Find `GROQ_API_KEY` variable
6. Click **Edit** and paste your new API key
7. Click **Save**
8. Railway will auto-redeploy

## Step 3: Verify the Fix

1. Check that your application still works
2. Generate a forecast to test Groq API connection
3. Monitor for any errors

## Prevention:

✅ `.env` files are already in `.gitignore`
✅ API keys are stored in environment variables only
✅ Never commit API keys to Git

## Important Notes:

- The old API key (`gsk_**Ajgm`) will be disabled soon
- Update it **before** the revocation date to avoid service interruption
- Keep your API keys secure and never share them publicly

