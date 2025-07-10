import express from 'express';
import protect from '../middleware/authMiddleware.js';
import Campaign from '../models/Campaign.js';
const router = express.Router();
router.get('/my-campaigns', protect, async (req, res) => {
    if (req.user.role !== 'brand') return res.status(403).json({ message: 'Only brands can view their campaigns' });
    const campaigns = await Campaign.find({ brand: req.user._id });
    res.json(campaigns);
});
export default router;
