import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema({
  brand_name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: String,
  city: String,
  industry: String,
  website: String,
  campaigns_posted: { type: Number, default: 0 },
  created_at: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Brand = mongoose.model('Brand', brandSchema);
export default Brand;
