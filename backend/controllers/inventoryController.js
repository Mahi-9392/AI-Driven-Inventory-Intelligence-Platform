import InventoryData from '../models/InventoryData.js';
import Forecast from '../models/Forecast.js';
import multer from 'multer';
import csv from 'csv-parser';
import { Readable } from 'stream';
import mongoose from 'mongoose';

// Configure multer for memory storage
const storage = multer.memoryStorage();
export const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  }
});

export const uploadCSV = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'CSV file is required' });
    }

    const userId = req.userId;
    // Ensure userId is ObjectId
    const userObjectId = mongoose.Types.ObjectId.isValid(userId) 
      ? new mongoose.Types.ObjectId(userId) 
      : userId;
    
    const results = [];
    const errors = [];

    // Parse CSV
    const buffer = req.file.buffer;
    const stream = Readable.from(buffer.toString());

    await new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on('data', (row) => {
          // Validate required fields
          const requiredFields = ['productId', 'productName', 'region', 'date', 'unitsSold', 'stockAvailable'];
          const missingFields = requiredFields.filter(field => !row[field]);

          if (missingFields.length > 0) {
            errors.push(`Row missing fields: ${missingFields.join(', ')}`);
            return;
          }

          // Validate data types
          const unitsSold = parseFloat(row.unitsSold);
          const stockAvailable = parseFloat(row.stockAvailable);
          const date = new Date(row.date);

          if (isNaN(unitsSold) || unitsSold < 0) {
            errors.push(`Invalid unitsSold for product ${row.productId}`);
            return;
          }

          if (isNaN(stockAvailable) || stockAvailable < 0) {
            errors.push(`Invalid stockAvailable for product ${row.productId}`);
            return;
          }

          if (isNaN(date.getTime())) {
            errors.push(`Invalid date for product ${row.productId}`);
            return;
          }

          results.push({
            userId: userObjectId,
            productId: row.productId.trim(),
            productName: row.productName.trim(),
            region: row.region.trim(),
            date,
            unitsSold,
            stockAvailable
          });
        })
        .on('end', resolve)
        .on('error', reject);
    });

    if (results.length === 0) {
      return res.status(400).json({ 
        message: 'No valid data found in CSV',
        errors 
      });
    }

    // STRICT DATA LIFECYCLE ENFORCEMENT:
    // Delete ALL existing data for this user before inserting new CSV data
    // This ensures each CSV upload represents a complete, fresh snapshot
    console.log(`[DATA LIFECYCLE] Starting fresh data snapshot for user ${userId}`);
    
    // Delete all existing inventory data for this user
    const deletedInventoryCount = await InventoryData.deleteMany({ userId: userObjectId });
    console.log(`[DATA LIFECYCLE] Deleted ${deletedInventoryCount.deletedCount} existing inventory records for user ${userId}`);
    
    // Also try with string userId as fallback (for data consistency)
    if (typeof userId === 'string' && !mongoose.Types.ObjectId.isValid(userId)) {
      const deletedInventoryCountStr = await InventoryData.deleteMany({ userId: userId.toString() });
      if (deletedInventoryCountStr.deletedCount > 0) {
        console.log(`[DATA LIFECYCLE] Deleted ${deletedInventoryCountStr.deletedCount} additional inventory records (string userId)`);
      }
    }

    // Delete all existing forecasts for this user (forecasts must be regenerated from new data)
    const deletedForecastsCount = await Forecast.deleteMany({ userId: userObjectId });
    console.log(`[DATA LIFECYCLE] Deleted ${deletedForecastsCount.deletedCount} existing forecast records for user ${userId}`);
    
    // Also try with string userId as fallback
    if (typeof userId === 'string' && !mongoose.Types.ObjectId.isValid(userId)) {
      const deletedForecastsCountStr = await Forecast.deleteMany({ userId: userId.toString() });
      if (deletedForecastsCountStr.deletedCount > 0) {
        console.log(`[DATA LIFECYCLE] Deleted ${deletedForecastsCountStr.deletedCount} additional forecast records (string userId)`);
      }
    }

    // Insert only the new CSV data (fresh snapshot)
    const insertedResult = await InventoryData.insertMany(results, { ordered: false });
    const insertedCount = insertedResult.length;

    console.log(`[DATA LIFECYCLE] Inserted ${insertedCount} new inventory records (fresh snapshot)`);
    console.log(`[DATA LIFECYCLE] Data lifecycle complete: Old data deleted, new snapshot created`);

    res.json({
      message: 'CSV uploaded successfully. All previous data has been replaced with this fresh snapshot.',
      recordsInserted: insertedCount,
      recordsDeleted: deletedInventoryCount.deletedCount + (deletedForecastsCount.deletedCount || 0),
      totalProcessed: results.length,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('[DATA LIFECYCLE] Error during CSV upload:', error);
    next(error);
  }
};

export const getInventoryData = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { productId, region, startDate, endDate, limit = 1000 } = req.query;

    // Convert userId to ObjectId if needed
    const userObjectId = mongoose.Types.ObjectId.isValid(userId) 
      ? new mongoose.Types.ObjectId(userId) 
      : userId;

    const query = { userId: userObjectId };

    if (productId) query.productId = productId;
    if (region) query.region = region;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    console.log(`getInventoryData: Query for userId=${userId}, productId=${productId}, region=${region}`);

    const data = await InventoryData.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .select('-userId -__v');

    console.log(`getInventoryData: Found ${data.length} records`);

    // If no data with ObjectId, try with string userId
    if (data.length === 0 && typeof userId === 'string') {
      const queryStr = { ...query, userId: userId };
      const dataStr = await InventoryData.find(queryStr)
        .sort({ date: -1 })
        .limit(parseInt(limit))
        .select('-userId -__v');
      console.log(`getInventoryData: Found ${dataStr.length} records with string userId`);
      return res.json({ data: dataStr, count: dataStr.length });
    }

    res.json({ data, count: data.length });
  } catch (error) {
    console.error('getInventoryData error:', error);
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const userId = req.userId;

    // Convert userId to ObjectId for proper matching
    const userObjectId = mongoose.Types.ObjectId.isValid(userId) 
      ? new mongoose.Types.ObjectId(userId) 
      : userId;

    // Check if user has any data
    const totalRecords = await InventoryData.countDocuments({ userId: userObjectId });
    console.log(`getProducts: User ${userId} has ${totalRecords} total records`);

    // Debug: Check a sample record
    const sampleRecord = await InventoryData.findOne({ userId: userObjectId });
    if (sampleRecord) {
      console.log(`Sample record - userId: ${sampleRecord.userId}, productId: ${sampleRecord.productId}, productName: ${sampleRecord.productName}`);
    } else {
      console.log(`No records found with userId: ${userObjectId}`);
      // Try with string userId
      const sampleRecordStr = await InventoryData.findOne({ userId: userId.toString() });
      if (sampleRecordStr) {
        console.log(`Found record with string userId: ${userId}`);
      }
    }

    const productDetails = await InventoryData.aggregate([
      { $match: { userId: userObjectId } },
      {
        $group: {
          _id: '$productId',
          productName: { $first: '$productName' },
          regions: { $addToSet: '$region' },
          lastUpdated: { $max: '$date' }
        }
      },
      { $sort: { productName: 1 } }
    ]);

    console.log(`getProducts: Found ${productDetails.length} products for user ${userId}`);

    // If no products found, try alternative query
    if (productDetails.length === 0 && totalRecords > 0) {
      console.log('Trying alternative aggregation with string userId...');
      const altProductDetails = await InventoryData.aggregate([
        { $match: { userId: userId.toString() } },
        {
          $group: {
            _id: '$productId',
            productName: { $first: '$productName' },
            regions: { $addToSet: '$region' },
            lastUpdated: { $max: '$date' }
          }
        },
        { $sort: { productName: 1 } }
      ]);
      console.log(`Alternative query found ${altProductDetails.length} products`);
      return res.json({ products: altProductDetails });
    }

    res.json({ products: productDetails });
  } catch (error) {
    console.error('getProducts error:', error);
    next(error);
  }
};

