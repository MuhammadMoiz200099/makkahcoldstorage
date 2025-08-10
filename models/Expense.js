import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  serialNo: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Transportation', 'Storage', 'Labor', 'Utilities', 'Maintenance', 'Office', 'Other'],
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Bank Transfer', 'Cheque', 'UPI', 'Card'],
    default: 'Cash'
  },
  vendor: {
    type: String,
    trim: true
  },
  billNumber: {
    type: String,
    trim: true
  },
  remarks: {
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

// Index for better search and reporting performance
ExpenseSchema.index({ date: -1 });
ExpenseSchema.index({ category: 1 });
ExpenseSchema.index({ createdAt: -1 });
ExpenseSchema.index({ description: 'text', vendor: 'text', serialNo: 'text' });

export default mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);