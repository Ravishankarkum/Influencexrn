import mongoose from 'mongoose';

const campaignSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    budget: { type: Number },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Campaign = mongoose.model('Campaign', campaignSchema);
export default Campaign;