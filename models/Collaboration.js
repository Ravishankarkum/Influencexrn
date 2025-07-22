import mongoose from 'mongoose';

const collaborationSchema = mongoose.Schema({
  influencer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Influencer', required: true },
  brand_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
  campaign_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  deal_amount: Number,
  commission_charged: Number,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  completed_on: Date,
  applied_influencers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Influencer' }],
  selected_influencer: { type: mongoose.Schema.Types.ObjectId, ref: 'Influencer' },
  created_at: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Collaboration = mongoose.model('Collaboration', collaborationSchema);
export default Collaboration;