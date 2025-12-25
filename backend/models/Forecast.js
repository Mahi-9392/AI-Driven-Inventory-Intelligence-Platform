import mongoose from 'mongoose';

const forecastSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  productId: {
    type: String,
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  region: {
    type: String,
    required: true
  },
  currentStock: {
    type: Number,
    required: true
  },
  predictedDemand: {
    type: Number,
    required: true
  },
  confidenceScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  riskLevel: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    required: true
  },
  reasoning: {
    type: String,
    required: true
  },
  recommendedAction: {
    type: String,
    required: true
  },
  analytics: {
    movingAverage: Number,
    growthRate: Number,
    salesVelocity: Number,
    regionalVolatility: Number
  },
  metadata: {
    forecastDate: {
      type: Date,
      default: Date.now
    },
    dataPointsUsed: Number
  }
}, {
  timestamps: true
});

forecastSchema.index({ userId: 1, productId: 1, region: 1 });
forecastSchema.index({ userId: 1, riskLevel: 1 });

export default mongoose.model('Forecast', forecastSchema);

