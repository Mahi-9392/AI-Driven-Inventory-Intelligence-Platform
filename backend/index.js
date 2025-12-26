import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import forecastRoutes from './routes/forecastRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
// Support multiple frontend URLs (production + preview deployments)
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173', // Vite dev server
  'https://ai-driven-inventory-intelligence.vercel.app', // Production
];

// Add FRONTEND_URL from environment if provided
if (process.env.FRONTEND_URL) {
  const frontendUrl = process.env.FRONTEND_URL.trim();
  // Remove trailing slash if present
  const cleanUrl = frontendUrl.endsWith('/') ? frontendUrl.slice(0, -1) : frontendUrl;
  if (!allowedOrigins.includes(cleanUrl)) {
    allowedOrigins.push(cleanUrl);
  }
}

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, etc.)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Allow Vercel preview deployments (any *.vercel.app subdomain)
    if (origin.includes('.vercel.app')) {
      return callback(null, true);
    }
    
    // Reject other origins
    console.warn(`⚠️  CORS blocked origin: ${origin}`);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

console.log('🌐 CORS allowed origins:', allowedOrigins);
console.log('🌐 CORS also allows: *.vercel.app (preview deployments)');

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/inventory-intelligence';

// Connection options - removed deprecated options
const mongoOptions = {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
};

// For MongoDB Atlas (mongodb+srv), ensure proper connection
if (mongoUri.includes('mongodb+srv://')) {
  console.log('Connecting to MongoDB Atlas...');
}

mongoose.connect(mongoUri, mongoOptions)
.then(() => {
  console.log('✅ MongoDB connected successfully');
  console.log(`   Database: ${mongoose.connection.name}`);
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  if (mongoUri.includes('mongodb+srv://')) {
    console.error('\n📋 MongoDB Atlas Troubleshooting:');
    console.error('   1. IP Address Not Whitelisted (MOST COMMON):');
    console.error('      → Go to https://cloud.mongodb.com/');
    console.error('      → Network Access → Add IP Address');
    console.error('      → Use "Allow Access from Anywhere" (0.0.0.0/0) for testing');
    console.error('      → Wait 1-2 minutes after adding');
    console.error('');
    console.error('   2. Check Username/Password:');
    console.error('      → Verify in .env file');
    console.error('      → Special chars must be URL-encoded (@ = %40, : = %3A)');
    console.error('');
    console.error('   3. Test connection: node test-mongodb-connection.js');
    console.error('');
    console.error('   💡 Tip: If issues persist, use local MongoDB for testing:');
    console.error('      MONGODB_URI=mongodb://localhost:27017/inventory-intelligence');
  } else {
    console.error('\n📋 Local MongoDB Troubleshooting:');
    console.error('   1. Make sure MongoDB is running locally');
    console.error('   2. Check the connection string in .env file');
    console.error('   3. Try: mongosh (to test MongoDB CLI)');
  }
  // Don't exit - allow server to start (some endpoints might work without DB)
  console.error('\n⚠️  Server will continue, but database operations will fail.');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/forecasts', forecastRoutes);
app.use('/api/reports', reportRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'AI-Driven Inventory Intelligence Platform API',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      inventory: '/api/inventory',
      forecasts: '/api/forecasts',
      reports: '/api/reports'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

