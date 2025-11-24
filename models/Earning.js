import mongoose from 'mongoose';

// Schema to track an influencer's earnings and payout history
const earningSchema = mongoose.Schema({

  // Reference to the influencer whose earnings are being tracked
  influencer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Influencer', required: true },

  // Total amount earned by the influencer so far
  total_earned: { type: Number, default: 0 },

  // List of individual payout records
  payouts: [
    {
      amount: Number,   // Amount paid out
      date: Date,       // Date of payout
      method: String    // Payment method (UPI, bank, etc.)
    }
  ]

}, { 
  // Automatically adds createdAt and updatedAt timestamps
  timestamps: true 
});

// Creating model for the Earning collection
const Earning = mongoose.model('Earning', earningSchema);

export default Earning;

