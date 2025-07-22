import mongoose from 'mongoose';

const earningSchema = mongoose.Schema({
  influencer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Influencer', required: true },
  total_earned: { type: Number, default: 0 },
  payouts: [
    {
      amount: Number,
      date: Date,
      method: String
    }
  ]
}, { timestamps: true });

const Earning = mongoose.model('Earning', earningSchema);
export default Earning;
