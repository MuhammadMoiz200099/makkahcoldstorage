import mongoose from 'mongoose';

const StockInSchema = new mongoose.Schema({
  serialNo: {
    type: String,
    required: true,
    unique: true
  },
  inwardDate: {
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
  roomNo: {
    type: String,
    required: true,
    trim: true
  },
  rackNo: {
    type: String,
    required: true,
    trim: true
  },
  received: {
    type: Number,
    required: true,
    min: 0
  },
  crates: {
    type: Number,
    required: true,
    min: 0
  },
  rupees: {
    type: Number,
    required: true,
    min: 0
  },
  cratesPerMonth: {
    type: Number,
    required: true,
    min: 0
  },
  customerMark: {
    type: String,
    trim: true
  },
  issuedDate: {
    type: Date
  },
  cmNo: {
    type: String,
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
StockInSchema.index({ partyName: 'text', subPartyName: 'text', serialNo: 'text' });
StockInSchema.index({ inwardDate: -1 });
StockInSchema.index({ createdAt: -1 });

export default mongoose.models.StockIn || mongoose.model('StockIn', StockInSchema);