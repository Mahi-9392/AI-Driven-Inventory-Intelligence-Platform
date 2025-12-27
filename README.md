<div align="center">

# 🚀 AI-Driven Inventory Intelligence Platform

### **Make Data-Driven Inventory Decisions with Explainable AI Insights**

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![Groq AI](https://img.shields.io/badge/Groq-AI-FF6B6B?style=flat)](https://groq.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

*An intelligent inventory management platform that uses AI to predict demand, analyze risks, and provide actionable recommendations for optimal inventory control.*

[Features](#-key-features) • [Demo](#-screenshots--demo) • [Installation](#-quick-start) • [Usage](#-how-it-works) • [Tech Stack](#-technology-stack)

</div>

---

## 📖 What is This Project?

The **AI-Driven Inventory Intelligence Platform** is a modern, production-ready web application that helps businesses make smarter inventory decisions. Instead of guessing how much stock to order, this platform uses **artificial intelligence** to analyze your historical sales data and predict future demand with confidence scores.

### 🎯 The Problem It Solves

Managing inventory is challenging because you need to balance:
- **Overstocking** → Wastes money, storage space, and can lead to obsolescence
- **Understocking** → Lost sales, disappointed customers, and missed opportunities

Traditional inventory management relies on basic spreadsheets and guesswork. This platform brings **AI-powered intelligence** to help you:
- 📊 Predict demand accurately
- ⚠️ Identify stockout risks before they happen
- 💡 Get actionable recommendations
- 📈 Visualize trends and patterns
- 📄 Generate executive-ready reports

---

## ✨ Key Features

### 🔐 **Secure Authentication**
- Email/password authentication with JWT tokens
- Google OAuth 2.0 single-sign-on support
- Protected routes and user data isolation

### 📤 **Easy Data Import**
- Bulk CSV upload for historical sales data
- Automatic data validation and processing
- Fresh snapshot system (each upload replaces old data)

### 🤖 **AI-Powered Forecasting**
- Advanced demand prediction using Groq AI (Llama models)
- Confidence scores for each forecast
- Explainable AI reasoning for transparency
- Risk level classification (LOW/MEDIUM/HIGH)

### 📊 **Interactive Dashboard**
- Real-time analytics and insights
- Visual charts and trend analysis
- Reorder alerts for low stock items
- Product and region-specific metrics

### 📈 **Advanced Analytics**
- Moving average calculations
- Growth rate analysis
- Sales velocity tracking
- Regional volatility metrics

### 📄 **PDF Reports**
- Executive-ready forecast reports
- Downloadable insights and recommendations
- Professional formatting for presentations

### 🎨 **Modern UI/UX**
- Clean, responsive design with Tailwind CSS
- Intuitive navigation and user experience
- Mobile-friendly interface
- Smooth animations and transitions

---

## 🖼️ Screenshots & Demo

### 🏠 Landing Page
The beautiful landing page welcomes users with a clean, modern design.

![Landing Page](./docs/screenshots/Landing_Page.png)

---

### 🔐 Authentication Pages

#### Login Page
Secure login with email/password or Google OAuth.

![Login Page](./docs/screenshots/Login_Page.png)

#### Signup Page
Easy account creation with multiple authentication options.

![Signup Page](./docs/screenshots/Signup_page.png)

---

### 📊 Dashboard
Get a comprehensive overview of your inventory with real-time insights and analytics.

![Dashboard](./docs/screenshots/Dashboard.png)

![Dashboard Overview](./docs/screenshots/Dashboard1.png)

---

### 📦 Inventory Management
Upload CSV files and manage your inventory data with ease.

![Inventory Page](./docs/screenshots/Inventory.png)

![Inventory Details](./docs/screenshots/Inventory1.png)

---

### 🔮 AI-Powered Forecasts
Generate intelligent demand forecasts with AI-powered predictions and risk analysis.

![Forecasts Page](./docs/screenshots/Forecasts.png)

![Forecast Generation](./docs/screenshots/Forecasts1.png)

![Forecast Details](./docs/screenshots/Forecasts2.png)

---

## 🎯 Who Can Use This?

### **Perfect For:**
- 📦 **E-commerce businesses** managing product inventory
- 🏪 **Retail stores** optimizing stock levels
- 📊 **Supply chain managers** needing demand forecasts
- 💼 **Businesses** wanting data-driven inventory decisions
- 🎓 **Students/Developers** learning full-stack AI applications

### **Use Cases:**
- Predicting seasonal demand spikes
- Preventing stockouts during peak periods
- Optimizing warehouse inventory levels
- Planning purchase orders based on forecasts
- Analyzing sales trends across regions
- Generating reports for stakeholders

---

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - Either locally installed or MongoDB Atlas account - [Sign Up](https://www.mongodb.com/cloud/atlas/register)
- **Groq API Key** (Free tier available) - [Get API Key](https://console.groq.com/)
- **Google OAuth Credentials** (Optional, for Google sign-in) - [Google Cloud Console](https://console.cloud.google.com/)

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/AI-Driven-Inventory-Intelligence-Platform.git
cd AI-Driven-Inventory-Intelligence-Platform
```

### Step 2: Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/inventory-intelligence
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/inventory-intelligence

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# AI Service
GROQ_API_KEY=your-groq-api-key-here

# Frontend URL (for CORS and OAuth redirects)
FRONTEND_URL=http://localhost:5173

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
```

Start the backend server:

```bash
npm start
# Or for development with auto-reload:
npm run dev
```

✅ Backend should be running at `http://localhost:5000`

### Step 3: Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

(Optional) Create `.env` file in `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the development server:

```bash
npm run dev
```

✅ Frontend should be running at `http://localhost:5173` (or the port shown in terminal)

### Step 4: First Steps

1. **Create an Account**
   - Navigate to `http://localhost:5173/signup`
   - Sign up with email/password or use Google OAuth

2. **Upload Your Data**
   - Go to the **Inventory** page
   - Upload a CSV file with your historical sales data
   - Format: `productId`, `productName`, `region`, `date`, `unitsSold`, `stockAvailable`
   - See sample data in `backend/sample-data.csv`

3. **Generate Forecasts**
   - Navigate to the **Forecasts** page
   - Select a product and region
   - Click "Generate Forecast" to get AI-powered predictions

4. **View Dashboard**
   - Check the **Dashboard** for insights and analytics
   - View reorder alerts and risk assessments

---

## 📋 CSV Data Format

Your CSV file should have the following columns:

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `productId` | String | Unique product identifier | `PROD001` |
| `productName` | String | Name of the product | `Wireless Mouse` |
| `region` | String | Sales region | `North America` |
| `date` | Date (YYYY-MM-DD) | Date of the record | `2024-01-15` |
| `unitsSold` | Number | Units sold on that date | `150` |
| `stockAvailable` | Number | Stock level on that date | `500` |

**Sample CSV:**
```csv
productId,productName,region,date,unitsSold,stockAvailable
PROD001,Wireless Mouse,North America,2024-01-15,150,500
PROD001,Wireless Mouse,North America,2024-01-16,120,350
PROD002,Keyboard,Europe,2024-01-15,200,800
```

---

## 🔧 How It Works

### Architecture Overview

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│   React Frontend│◄───────►│  Express Backend│◄───────►│   MongoDB       │
│   (Vite)        │  HTTP   │   (Node.js)     │  API    │   Database      │
│                 │         │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
                                      │
                                      │ AI API Call
                                      ▼
                              ┌─────────────────┐
                              │                 │
                              │   Groq AI       │
                              │   (Llama 3.1)   │
                              │                 │
                              └─────────────────┘
```

### Data Flow

1. **Data Upload**: CSV files are uploaded and parsed
2. **Data Processing**: Historical data is cleaned and stored in MongoDB
3. **Analytics Computation**: Statistical metrics are calculated (moving averages, growth rates, etc.)
4. **AI Forecasting**: Groq AI analyzes the data and generates demand predictions
5. **Risk Assessment**: System automatically classifies risk levels based on predicted demand vs. current stock
6. **Insights & Recommendations**: Actionable insights are generated with confidence scores

### Key Algorithms

- **Moving Average**: 7-day rolling average for trend smoothing
- **Growth Rate**: Percentage change analysis over time periods
- **Sales Velocity**: Average units sold per day
- **Volatility Analysis**: Coefficient of variation for regional stability
- **AI Prompt Engineering**: Business-focused prompts for accurate forecasts

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Chart.js** - Data visualization
- **Axios** - HTTP client
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB + Mongoose** - Database and ODM
- **JWT** - Authentication tokens
- **Groq SDK** - AI integration (Llama 3.1 models)
- **jsPDF** - PDF report generation
- **Multer** - File upload handling
- **bcryptjs** - Password hashing

### Infrastructure
- **MongoDB Atlas** - Cloud database (or local MongoDB)
- **Vercel** - Frontend hosting
- **Render/Railway** - Backend hosting

---

## 📦 Project Structure

```
AI-Driven-Inventory-Intelligence-Platform/
├── backend/
│   ├── controllers/        # Business logic
│   │   ├── authController.js
│   │   ├── inventoryController.js
│   │   ├── forecastController.js
│   │   ├── analyticsController.js
│   │   └── reportController.js
│   ├── models/            # Database schemas
│   │   ├── User.js
│   │   ├── InventoryData.js
│   │   └── Forecast.js
│   ├── routes/            # API routes
│   ├── middleware/        # Auth middleware
│   ├── index.js           # Entry point
│   └── .env               # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── pages/         # Page components
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── inventory/
│   │   │   └── forecasts/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context (Auth)
│   │   ├── request/       # API client
│   │   ├── router/        # Routes configuration
│   │   └── styles/        # Global styles
│   └── package.json
│
└── README.md
```

---

## 🚀 Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Import repository in [Vercel](https://vercel.com/)
3. Set build settings:
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/dist`
4. Add environment variable:
   - `VITE_API_BASE_URL`: Your backend API URL
5. Deploy!

### Backend (Render/Railway)

1. Create a new service in [Render](https://render.com/) or [Railway](https://railway.app/)
2. Connect your GitHub repository
3. Set root directory to `backend/`
4. Add environment variables from `.env` file
5. Deploy!

📖 For detailed deployment guides, check the deployment documentation.

---

## 🔮 Future Improvements

### Planned Features
- [ ] 📧 Email notifications for low stock alerts
- [ ] 🔔 Real-time push notifications
- [ ] 📊 Advanced analytics dashboard with custom date ranges
- [ ] 🔄 Automated reorder suggestions with supplier integration
- [ ] 🌍 Multi-language support (i18n)
- [ ] 📱 Mobile app (React Native)
- [ ] 🤝 Multi-user collaboration and role-based access control
- [ ] 📈 Historical forecast accuracy tracking
- [ ] 🎯 Customizable forecast models and parameters
- [ ] 📥 Excel import/export functionality
- [ ] 🔗 API integration with e-commerce platforms (Shopify, WooCommerce)
- [ ] 💾 Data backup and restore functionality
- [ ] 🎨 Customizable themes and branding
- [ ] 📊 Advanced reporting with scheduled exports
- [ ] 🤖 Multiple AI model support (OpenAI, Anthropic, etc.)

### Technical Improvements
- [ ] Unit and integration tests
- [ ] API rate limiting and caching
- [ ] WebSocket support for real-time updates
- [ ] GraphQL API option
- [ ] Microservices architecture migration
- [ ] Containerization with Docker
- [ ] CI/CD pipeline setup
- [ ] Performance monitoring and optimization
- [ ] Enhanced error handling and logging
- [ ] API documentation with Swagger/OpenAPI

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add some amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

Please make sure your code follows the existing style and includes tests where applicable.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Your Name**
- GitHub: [@your-username](https://github.com/your-username)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- [Groq](https://groq.com/) for providing fast AI inference
- [Tailwind CSS](https://tailwindcss.com/) for the beautiful UI framework
- [React](https://reactjs.org/) team for the amazing library
- All open-source contributors whose packages made this possible

---

<div align="center">

**⭐ Star this repository if you find it helpful! ⭐**

Made with ❤️ and 🤖 AI

</div>
