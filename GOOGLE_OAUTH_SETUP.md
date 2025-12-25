# Google OAuth 2.0 Setup Guide

This guide will help you set up Google OAuth 2.0 authentication for the AI-Driven Inventory Intelligence Platform.

## Prerequisites

- A Google Cloud Platform (GCP) account
- Access to Google Cloud Console

## Step 1: Create OAuth 2.0 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. If prompted, configure the OAuth consent screen:
   - Choose **External** (unless you have a Google Workspace)
   - Fill in the required information:
     - App name: "Inventory Intelligence Platform"
     - User support email: Your email
     - Developer contact: Your email
   - Add scopes:
     - `userinfo.email`
     - `userinfo.profile`
   - Add test users (if in testing mode)
6. Create OAuth client ID:
   - Application type: **Web application**
   - Name: "Inventory Intelligence Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - `https://yourdomain.com` (for production)
   - Authorized redirect URIs:
     - `http://localhost:4001/api/auth/google/callback` (for development)
     - `https://yourdomain.com/api/auth/google/callback` (for production)
7. Click **Create**
8. Copy the **Client ID** and **Client Secret**

## Step 2: Configure Environment Variables

Add the following to your `.env` file in the `backend` directory:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_REDIRECT_URI=http://localhost:4001/api/auth/google/callback

# Frontend URL (for OAuth redirects)
FRONTEND_URL=http://localhost:3000
```

**Important Notes:**
- For production, update `GOOGLE_REDIRECT_URI` and `FRONTEND_URL` to your production URLs
- The redirect URI must exactly match what you configured in Google Cloud Console
- Keep your `GOOGLE_CLIENT_SECRET` secure and never commit it to version control

## Step 3: Install Dependencies

The Google OAuth library is already added to `package.json`. Install it:

```bash
cd backend
npm install
```

## Step 4: Test the Integration

1. Start your backend server:
   ```bash
   npm start
   ```

2. Start your frontend:
   ```bash
   cd ../frontend
   npm run dev
   ```

3. Navigate to the login or signup page
4. Click "Continue with Google"
5. You should be redirected to Google's sign-in page
6. After signing in, you'll be redirected back to the application

## How It Works

### Authentication Flow

1. **User clicks "Continue with Google"**
   - Frontend requests OAuth URL from backend
   - Backend generates Google OAuth URL
   - User is redirected to Google

2. **User signs in with Google**
   - Google authenticates the user
   - Google redirects back with authorization code

3. **Backend handles callback**
   - Exchanges code for access token
   - Retrieves user profile from Google
   - Checks if user exists by email
   - If exists: logs them in
   - If not: creates new user account
   - Issues JWT token

4. **Frontend receives token**
   - Token is stored in localStorage
   - User is redirected to dashboard
   - All subsequent requests use JWT token

### User Account Handling

- **Existing email/password user using Google**: The account is updated to support Google OAuth while preserving existing data
- **New Google user**: A new account is created automatically with `authProvider: "google"`
- **OAuth-only users**: Cannot use password login (they must use Google)

## Troubleshooting

### "Redirect URI mismatch" error
- Ensure the redirect URI in `.env` exactly matches Google Cloud Console
- Check that the URI includes the full path: `/api/auth/google/callback`

### "Invalid client" error
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Ensure credentials are for a "Web application" type

### OAuth consent screen issues
- If in testing mode, add your email as a test user
- For production, submit your app for verification

### CORS errors
- Ensure `FRONTEND_URL` in `.env` matches your frontend URL
- Check that CORS is properly configured in `backend/index.js`

## Security Best Practices

1. **Never commit secrets**: Add `.env` to `.gitignore`
2. **Use environment variables**: Never hardcode credentials
3. **HTTPS in production**: Always use HTTPS for OAuth in production
4. **Regular credential rotation**: Rotate OAuth credentials periodically
5. **Monitor OAuth usage**: Check Google Cloud Console for suspicious activity

## Production Deployment

When deploying to production:

1. Update Google Cloud Console with production URLs
2. Update `.env` with production values:
   ```env
   GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/google/callback
   FRONTEND_URL=https://yourdomain.com
   ```
3. Ensure your production server uses HTTPS
4. Submit OAuth consent screen for verification (if needed)

## Support

For issues or questions:
- Check Google OAuth documentation: https://developers.google.com/identity/protocols/oauth2
- Review backend logs for detailed error messages
- Ensure all environment variables are set correctly

