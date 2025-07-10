import mongoose from 'mongoose';

const influencerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  bio: String,
  socialLinks: [String],
  averageEngagement: Number,

  mediaKit: {
    type: String,
    default: null
  }

}, { timestamps: true });

const Influencer = mongoose.model('Influencer', influencerSchema);
export default Influencer;
