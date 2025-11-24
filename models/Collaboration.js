import mongoose from 'mongoose';

// Schema for storing collaboration details between influencer and brand
const collaborationSchema = mongoose.Schema({

  // The influencer who is part of this collaboration
  influencer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Influencer', required: true },

  // The brand involved in the collaboration
  brand_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },

  // The campaign under which the collaboration is happening
  campaign_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },

  // Amount paid to influencer or deal value
  deal_amount: Number,

  // Commission charged by platform/agency
  commission_charged: Number,

  // Current status of the collaboration
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },

  // When the collaboration was completed
  completed_on: Date,

  // List of all influencers who applied for this campaign
  applied_influencers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Influencer' }],

  // Final selected influencer for the collaboration
  selected_influencer: { type: mongoose.Schema.Types.ObjectId, ref: 'Influencer' },

  // When the collaboration document was created
  created_at: {
    type: Date,
    default: Date.now
  }

}, { 
  // Adds createdAt and updatedAt fields automatically
  timestamps: true 
});

// Creating and exporting the Collaboration model
const Collaboration = mongoose.model('Collaboration', collaborationSchema);
export default Collaboration;
