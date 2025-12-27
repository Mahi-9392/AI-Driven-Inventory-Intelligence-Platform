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

    // Delete all existing data for this user before inserting new CSV data
    const deletedInventoryCount = await InventoryData.deleteMany({ userId: userObjectId });
    
    if (typeof userId === 'string' && !mongoose.Types.ObjectId.isValid(userId)) {
      await InventoryData.deleteMany({ userId: userId.toString() });
    }

    const deletedForecastsCount = await Forecast.deleteMany({ userId: userObjectId });
    
    if (typeof userId === 'string' && !mongoose.Types.ObjectId.isValid(userId)) {
      await Forecast.deleteMany({ userId: userId.toString() });
    }

    const insertedResult = await InventoryData.insertMany(results, { ordered: false });
    const insertedCount = insertedResult.length;

    res.json({
      message: 'CSV uploaded successfully. All previous data has been replaced with this fresh snapshot.',
      recordsInserted: insertedCount,
      recordsDeleted: deletedInventoryCount.deletedCount + (deletedForecastsCount.deletedCount || 0),
      totalProcessed: results.length,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('CSV upload error:', error);
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

    const data = await InventoryData.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .select('-userId -__v');

    if (data.length === 0 && typeof userId === 'string') {
      const queryStr = { ...query, userId: userId };
      const dataStr = await InventoryData.find(queryStr)
        .sort({ date: -1 })
        .limit(parseInt(limit))
        .select('-userId -__v');
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

    const totalRecords = await InventoryData.countDocuments({ userId: userObjectId });

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

    if (productDetails.length === 0 && totalRecords > 0) {
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
      return res.json({ products: altProductDetails });
    }

    res.json({ products: productDetails });
  } catch (error) {
    console.error('getProducts error:', error);
    next(error);
  }
};

