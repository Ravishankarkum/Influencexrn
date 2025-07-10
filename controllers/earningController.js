import Earning from '../models/Earning.js';

export const createEarning = async (req, res) => {
    try {
        if (req.user.role !== 'brand') return res.status(403).json({ message: 'Only brands can create earnings' });
        const { influencer, campaign, amount } = req.body;
        const earning = await Earning.create({ influencer, campaign, amount });
        res.status(201).json(earning);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};