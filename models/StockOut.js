import mongoose from 'mongoose';

const StockOutSchema = new mongoose.Schema({
  serialNo: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    required: true
  },
  partyName: {
    type: String,
    required: true,
    trim: true
  },
  subPartyName: {
    type: String,
    required: true,
    trim: true
  },
  goodDeliveredTo: {
    type: String,
    required: true,
    trim: true
  },
  partyDeliveryOn: {
    type: Date,
    required: true
  },
  coldStoreDeliveryOn: {
    type: Date,
    required: true
  },
  vehicle: {
    type: String,
    required: true,
    trim: true
  },
  driverName: {
    type: String,
    required: true,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for better search performance
StockOutSchema.index({ partyName: 'text', subPartyName: 'text', driverName: 'text', serialNo: 'text' });
StockOutSchema.index({ date: -1 });
StockOutSchema.index({ createdAt: -1 });

export default mongoose.models.StockOut || mongoose.model('StockOut', StockOutSchema);