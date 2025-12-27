import InventoryData from '../models/InventoryData.js';
import mongoose from 'mongoose';

export const computeAnalytics = async (userId, productId, region) => {
  // Convert userId to ObjectId if needed
  const userObjectId = mongoose.Types.ObjectId.isValid(userId) 
    ? new mongoose.Types.ObjectId(userId) 
    : userId;

  const data = await InventoryData.find({
    userId: userObjectId,
    productId,
    region
  })
    .sort({ date: 1, _id: 1 })
    .lean();

  if (data.length === 0) {
    const dataStr = await InventoryData.find({
      userId: userId.toString(),
      productId,
      region
    })
      .sort({ date: 1, _id: 1 })
      .lean();
    
    if (dataStr.length === 0) {
      throw new Error(`No historical data found for product "${productId}" in region "${region}". Please upload CSV data for this product and region combination.`);
    }
    
    return calculateAnalytics(dataStr);
  }

  const analytics = calculateAnalytics(data);
  return analytics;
};

function calculateAnalytics(data) {
  // Ensure data is sorted by date (should already be sorted, but double-check for consistency)
  const sortedData = [...data].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    if (dateA.getTime() !== dateB.getTime()) {
      return dateA - dateB;
    }
    // If dates are equal, sort by _id for consistency
    return String(a._id || '').localeCompare(String(b._id || ''));
  });

  // Calculate moving average (7-day)
  const movingAverage = calculateMovingAverage(sortedData, 7);

  // Calculate growth rate (percentage change over time period)
  const growthRate = calculateGrowthRate(sortedData);

  // Calculate sales velocity (average units sold per day)
  const salesVelocity = calculateSalesVelocity(sortedData);

  // Calculate regional volatility (coefficient of variation)
  const regionalVolatility = calculateVolatility(sortedData);

  return {
    movingAverage,
    growthRate,
    salesVelocity,
    regionalVolatility,
    dataPoints: sortedData.length,
    currentStock: sortedData[sortedData.length - 1]?.stockAvailable || 0
  };
}

function calculateMovingAverage(data, window = 7) {
  if (data.length < window) {
    window = data.length;
  }

  const recentData = data.slice(-window);
  const sum = recentData.reduce((acc, item) => acc + item.unitsSold, 0);
  return sum / window;
}

function calculateGrowthRate(data) {
  if (data.length < 2) return 0;

  const firstPeriod = data.slice(0, Math.floor(data.length / 2));
  const secondPeriod = data.slice(Math.floor(data.length / 2));

  const firstAvg = firstPeriod.reduce((acc, item) => acc + item.unitsSold, 0) / firstPeriod.length;
  const secondAvg = secondPeriod.reduce((acc, item) => acc + item.unitsSold, 0) / secondPeriod.length;

  if (firstAvg === 0) return secondAvg > 0 ? 100 : 0;

  return ((secondAvg - firstAvg) / firstAvg) * 100;
}

function calculateSalesVelocity(data) {
  if (data.length === 0) return 0;

  // Group by day and sum units sold
  const dailySales = {};
  data.forEach(item => {
    const day = item.date.toISOString().split('T')[0];
    dailySales[day] = (dailySales[day] || 0) + item.unitsSold;
  });

  const totalUnits = Object.values(dailySales).reduce((acc, val) => acc + val, 0);
  const uniqueDays = Object.keys(dailySales).length;

  return uniqueDays > 0 ? totalUnits / uniqueDays : 0;
}

function calculateVolatility(data) {
  if (data.length < 2) return 0;

  const sales = data.map(item => item.unitsSold);
  const mean = sales.reduce((acc, val) => acc + val, 0) / sales.length;
  
  if (mean === 0) return 0;

  const variance = sales.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / sales.length;
  const stdDev = Math.sqrt(variance);

  // Coefficient of variation
  return (stdDev / mean) * 100;
}

