# AI-Driven Inventory Intelligence Platform

A production-grade, AI-powered inventory management platform with demand forecasting, risk analysis, and intelligent recommendations.

## Features

- **Secure Authentication**: JWT-based authentication with email/password and Google OAuth 2.0
- **CSV Data Upload**: Bulk import of historical sales and inventory data
- **AI-Powered Forecasting**: Groq AI integration for demand prediction (free tier available)
- **Risk Analysis**: Automated risk level assessment (LOW/MEDIUM/HIGH)
- **Analytics Dashboard**: Real-time insights and visualizations
- **PDF Reports**: Executive-ready reports with forecasts and recommendations
- **Multi-tenant Ready**: All data scoped by user ID

## Project Structure

```
AI-Driven-Inventory-Intelligence-Platform/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── index.js
└── frontend/
    └── src/
        ├── apps/
        ├── auth/
        ├── components/
        ├── config/
        ├── context/
        ├── forms/
        ├── hooks/
        ├── layout/
        ├── locale/
        ├── modules/
        ├── pages/
        ├── redux/
        ├── request/
        ├── router/
        ├── settings/
        └── styles/
```

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (running locally or connection string)
- Groq API key (free tier available at https://console.groq.com/)

### Backend Setup

1. Navigate to `backend/` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/inventory-intelligence
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   GROQ_API_KEY=your-groq-api-key-here
   NODE_ENV=development
   ```

4. Start MongoDB (if running locally):
   ```bash
   # On macOS/Linux with Homebrew
   brew services start mongodb-community
   
   # On Windows, start MongoDB service
   # Or use MongoDB Atlas connection string
   ```

5. Start the backend server:
   ```bash
   npm start
   # Or for development with auto-reload:
   npm run dev
   ```

   The API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to `frontend/` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Create `.env` file if you need to customize API URL:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

### First Steps

1. **Sign Up**: Create a new account at `/signup`
2. **Upload Data**: Go to the Inventory page and upload the sample CSV file (`backend/sample-data.csv`)
3. **Generate Forecast**: Navigate to Forecasts page and generate your first AI-powered forecast
4. **View Dashboard**: Check the Dashboard for insights and reorder alerts

## CSV Format

Upload CSV files with the following columns:
- `productId`: Unique product identifier
- `productName`: Product name
- `region`: Sales region
- `date`: Date (YYYY-MM-DD)
- `unitsSold`: Number of units sold
- `stockAvailable`: Current stock level

## Technology Stack

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Groq AI API (free tier available)
- jsPDF for reports

**Frontend:**
- React + Vite
- Tailwind CSS
- Chart.js
- Axios
- React Router

## License

MIT

