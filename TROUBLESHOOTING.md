# Troubleshooting Guide

## "Cannot connect to server" Error

This error means the frontend cannot reach the backend API. Here's how to fix it:

### Step 1: Check Backend is Running

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd AI-Driven-Inventory-Intelligence-Platform/backend
   ```

2. Start the backend server:
   ```bash
   node index.js
   ```

3. You should see:
   ```
   ✅ MongoDB connected successfully
   Server running on port 5000
   ```
   (or whatever port is in your .env file)

### Step 2: Check Backend Port

1. Check your `.env` file in the `backend/` folder:
   ```env
   PORT=5000
   ```

2. Make sure the backend is running on the port specified in `.env`

### Step 3: Check Frontend is Running

1. Open a **NEW terminal** and navigate to the frontend folder:
   ```bash
   cd AI-Driven-Inventory-Intelligence-Platform/frontend
   ```

2. Start the frontend:
   ```bash
   npm run dev
   ```

3. You should see:
   ```
   Local: http://localhost:3000
   ```

### Step 4: Verify Both Servers are Running

- **Backend**: Should be running on `http://localhost:5000` (or your configured port)
- **Frontend**: Should be running on `http://localhost:3000`

### Step 5: Test Backend Connection

Open your browser and go to:
```
http://localhost:5000/api/health
```

You should see:
```json
{"status":"ok","timestamp":"..."}
```

If this doesn't work, the backend is not running or not accessible.

### Common Issues

#### Issue 1: Backend on Different Port
If your backend is running on a different port (e.g., 4001), update the frontend:

**Option A**: Update `.env` in backend to use port 5000:
```env
PORT=5000
```

**Option B**: Update `vite.config.js` in frontend:
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:4001', // Your actual backend port
    changeOrigin: true
  }
}
```

#### Issue 2: CORS Error
If you see CORS errors in the browser console, make sure:
- Backend has `cors()` middleware enabled (it should be in `index.js`)
- Backend is running and accessible

#### Issue 3: Firewall/Antivirus Blocking
- Temporarily disable firewall/antivirus to test
- Add Node.js to firewall exceptions

#### Issue 4: Port Already in Use
If you get "port already in use" error:
- Find what's using the port: `netstat -ano | findstr :5000` (Windows)
- Kill the process or change the port in `.env`

### Quick Test

Run these commands in order:

**Terminal 1 (Backend):**
```bash
cd AI-Driven-Inventory-Intelligence-Platform/backend
node index.js
```

**Terminal 2 (Frontend):**
```bash
cd AI-Driven-Inventory-Intelligence-Platform/frontend
npm run dev
```

**Browser:**
- Open `http://localhost:3000`
- Try to sign up
- Check browser console (F12) for errors
- Check backend terminal for request logs

### Still Not Working?

1. Check browser console (F12 → Console tab) for detailed errors
2. Check backend terminal for any error messages
3. Verify MongoDB is connected (you should see "✅ MongoDB connected successfully")
4. Make sure both servers are running simultaneously

