import express from 'express';
import Collaboration from '../models/Collaboration.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();
router.get('/my-collaborations', protect, async (req, res) => {
    if (req.user.role !== 'influencer') return res.status(403).json({ message: 'Only influencers can view their collaborations' });
    const collaborations = await Collaboration.find({ influencer: req.user._id }).populate('campaign', 'title description');
    res.json(collaborations);
});
export default router;