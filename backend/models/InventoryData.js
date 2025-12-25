import mongoose from 'mongoose';

const inventoryDataSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    required: true
  },
  unitsSold: {
    type: Number,
    required: true,
    min: 0
  },
  stockAvailable: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
inventoryDataSchema.index({ userId: 1, productId: 1, date: 1 });
inventoryDataSchema.index({ userId: 1, region: 1 });

export default mongoose.model('InventoryData', inventoryDataSchema);

