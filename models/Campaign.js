import mongoose from 'mongoose';

// Creating a schema for Campaign collection
// Schema tells MongoDB how the data will look
const campaignSchema = mongoose.Schema({

  // Reference to the brand/user who created the campaign
  // Storing ObjectId of User model using ref (relationship)
  brand: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  // Title of the campaign
  title: { 
    type: String, 
    required: true 
  },

  // Short explanation about the campaign
  description: String,

  // Budget allocated for the campaign
  budget: { 
    type: Number, 
    required: true 
  },

  // Campaign belongs to which category (tech, fashion, etc.)
  category: String,

  // What target audience this campaign is for
  targetMarket: String,

  // Status of the campaign with fixed allowed values
  status: { 
    type: String, 
    enum: ['active', 'completed', 'cancelled'], 
    default: 'active'  // Default status when new campaign is created
  },

  // Date when the campaign was created
  createdAt: {
    type: Date,
    default: Date.now
  }

}, { 
  // Adds createdAt and updatedAt automatically
  timestamps: true 
});

// Creating model from the schema
// This will create a 'campaigns' collection in MongoDB
const Campaign = mongoose.model('Campaign', campaignSchema);

export default Campaign;
