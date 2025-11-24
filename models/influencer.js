import mongoose from 'mongoose';

// Schema for storing influencer details
const influencerSchema = new mongoose.Schema({

  // Unique username of the influencer
  username: { type: String, required: true, unique: true },

  // Full name of the influencer
  name: { type: String, required: true },

  // Influencer's email (must be unique)
  email: { type: String, required: true, unique: true },

  // Contact number
  phone: String,

  // City where the influencer is based
  city: String,

  // Influencer niche/category (fashion, tech, fitness, etc.)
  category: String,

  // Number of followers
  followers: Number,

  // Engagement rate (likes + comments / followers)
  engagement_rate: Number,

  // List of portfolio or social media links
  portfolio_links: [String],

  // Short description / bio of the influencer
  bio: String,

  // Influencer visibility tier (low | medium | high)
  visibility_tier: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low'
  },

  // When the influencer account was created
  created_at: {
    type: Date,
    default: Date.now
  }

}, { 
  // Automatically adds createdAt and updatedAt timestamps
  timestamps: true 
});

// Creating and exporting the Influencer model
const Influencer = mongoose.model('Influencer', influencerSchema);
export default Influencer;
