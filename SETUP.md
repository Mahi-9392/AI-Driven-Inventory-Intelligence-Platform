# Setup Guide - Step by Step

## Prerequisites Check

Before starting, make sure you have:
- ✅ Node.js installed (v18 or higher) - Check with: `node --version`
- ✅ MongoDB installed and running OR MongoDB Atlas account
- ✅ Groq API key (get it from https://console.groq.com/ - free tier available!)

---

## Step 1: Set Up Backend

### 1.1 Install Backend Dependencies

Open a terminal and run:

```bash
cd AI-Driven-Inventory-Intelligence-Platform/backend
npm install
```

### 1.2 Create Backend Environment File

Create a file named `.env` in the `backend/` folder with this content:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/inventory-intelligence
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NODE_ENV=development

# Optional: Google OAuth 2.0 (see GOOGLE_OAUTH_SETUP.md for setup)
# GOOGLE_CLIENT_ID=your-google-client-id
# GOOGLE_CLIENT_SECRET=your-google-client-secret
# GOOGLE_REDIRECT_URI=http://localhost:4001/api/auth/google/callback
# FRONTEND_URL=http://localhost:3000
```

**Important:**
- Replace `MONGODB_URI` with your MongoDB connection string
  - Local MongoDB: `mongodb://localhost:27017/inventory-intelligence`
  - MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/inventory-intelligence`
- Replace `JWT_SECRET` with a long random string (at least 32 characters)
- Replace `GROQ_API_KEY` with your actual Groq API key from https://console.groq.com/
- **Google OAuth is optional**: The platform works with email/password authentication. To enable Google OAuth, see `GOOGLE_OAUTH_SETUP.md`

### 1.3 Start MongoDB (if using local MongoDB)

**Windows:**
- MongoDB should start automatically as a service
- Or run: `net start MongoDB` (in Administrator PowerShell)

**macOS/Linux:**
```bash
brew services start mongodb-community
# or
sudo systemctl start mongod
```

### 1.4 Start Backend Server

```bash
npm start
```

You should see: `Server running on port 5000` and `MongoDB connected successfully`

**Keep this terminal open!**

---

## Step 2: Set Up Frontend

### 2.1 Install Frontend Dependencies

Open a **NEW terminal window** and run:

```bash
cd AI-Driven-Inventory-Intelligence-Platform/frontend
npm install
```

### 2.2 Start Frontend Development Server

```bash
npm run dev
```

You should see: `Local: http://localhost:3000`

**Keep this terminal open too!**

---

## Step 3: Test the Application

### 3.1 Open the Application

Open your browser and go to: **http://localhost:3000**

### 3.2 Create an Account

1. Click "Sign up" or go to `/signup`
2. Enter your name, email, and password (min 6 characters)
3. Click "Sign up"
4. You'll be automatically logged in and redirected to the dashboard

### 3.3 Upload Sample Data

1. Go to the **Inventory** page (click "Inventory" in the navigation)
2. Click "Choose File" and select: `backend/sample-data.csv`
3. Click "Upload CSV"
4. Wait for the success message showing records inserted

### 3.4 Generate Your First Forecast

1. Go to the **Forecasts** page
2. Select a product from the dropdown (e.g., "Wireless Headphones")
3. Select a region (e.g., "North")
4. Click "Generate Forecast"
5. Wait for the AI to analyze and generate the forecast (may take 10-30 seconds)
6. View the forecast details with AI reasoning and recommendations

### 3.5 View Dashboard

1. Go to the **Dashboard** page
2. See your insight cards, risk levels, and reorder alerts
3. View recent forecasts with AI reasoning

---

## Troubleshooting

### Backend Issues

**"MongoDB connection error"**
- Make sure MongoDB is running
- Check your `MONGODB_URI` in `.env` file
- For MongoDB Atlas, ensure your IP is whitelisted

**"Groq API error"**
- Verify your `GROQ_API_KEY` in `.env` file
- Check your Groq account has API access enabled
- Groq offers a generous free tier - check your usage at https://console.groq.com/

**"Port 5000 already in use"**
- Change `PORT=5001` in `.env` file
- Update frontend proxy in `frontend/vite.config.js` if needed

### Frontend Issues

**"Cannot connect to API"**
- Make sure backend is running on port 5000
- Check `frontend/vite.config.js` has correct proxy settings
- Verify CORS is enabled in backend

**"Module not found" errors**
- Run `npm install` again in the frontend directory
- Delete `node_modules` and `package-lock.json`, then `npm install`

---

## Next Steps

1. ✅ Upload your own CSV data with real inventory information
2. ✅ Generate forecasts for different products and regions
3. ✅ Download PDF reports from the Forecasts page
4. ✅ Monitor the dashboard for reorder alerts
5. ✅ Customize the UI colors and branding in `frontend/src/styles/index.css`

---

## Production Deployment

When ready for production:

1. **Backend:**
   - Use a strong `JWT_SECRET` (generate with: `openssl rand -base64 32`)
   - Set `NODE_ENV=production`
   - Use environment variables for all secrets
   - Deploy to services like Heroku, Railway, or AWS

2. **Frontend:**
   - Build: `npm run build`
   - Deploy `dist/` folder to Vercel, Netlify, or similar
   - Update API URL in production environment

---

## Need Help?

- Check the main `README.md` for more details
- Review the code comments in the source files
- Ensure all environment variables are set correctly

