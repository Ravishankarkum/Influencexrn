import mongoose from 'mongoose';

// Schema for storing brand details
const brandSchema = new mongoose.Schema({

  // Name of the brand (required field)
  brand_name: { type: String, required: true, trim: true },

  // Brand email (unique + formatted properly)
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },

  // Contact number of the brand
  phone: String,

  // City where the brand is located
  city: String,

  // Industry type (fashion, tech, cosmetics, etc.)
  industry: String,

  // Brand website URL
  website: String,

  // Number of campaigns posted by the brand
  campaigns_posted: { type: Number, default: 0 },

  // When the brand profile was created
  created_at: {
    type: Date,
    default: Date.now
  }

}, { 
  // Automatically adds createdAt & updatedAt timestamps
  timestamps: true 
});

// Creating and exporting the Brand model
const Brand = mongoose.model('Brand', brandSchema);
export default Brand;
