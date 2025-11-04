import mongoose from 'mongoose';

const campaignSchema = mongoose.Schema({
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  budget: { type: Number, required: true },
  category: String,
  targetMarket: String,
  status: { 
    type: String, 
    enum: ['active', 'completed', 'cancelled'], 
    default: 'active' 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Campaign = mongoose.model('Campaign', campaignSchema);
export default Campaign;