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
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

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

