import mongoose from 'mongoose';

const collaborationSchema = mongoose.Schema({
    campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
    influencer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

const Collaboration = mongoose.model('Collaboration', collaborationSchema);
export default Collaboration;