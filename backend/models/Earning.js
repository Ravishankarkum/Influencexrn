import mongoose from 'mongoose';

const earningSchema = mongoose.Schema({
    influencer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    paidAt: { type: Date },
}, { timestamps: true });

const Earning = mongoose.model('Earning', earningSchema);
export default Earning;