import mongoose from 'mongoose';

const campaignSchema = mongoose.Schema({
  brand_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
  campaign_title: { type: String, required: true },
  description: String,
  category: String,
  ended_at: Date,
  created_at: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Campaign = mongoose.model('Campaign', campaignSchema);
export default Campaign;