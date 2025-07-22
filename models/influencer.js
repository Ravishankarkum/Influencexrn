import mongoose from 'mongoose';

const influencerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  city: String,
  category: String,
  followers: Number,
  engagement_rate: Number,
  portfolio_links: [String],
  bio: String,
  visibility_tier: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low'
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Influencer = mongoose.model('Influencer', influencerSchema);
export default Influencer;