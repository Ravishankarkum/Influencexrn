import Campaign from '../models/Campaign.js';

export const createCampaign = async (req, res) => {
    try {
        if (req.user.role !== 'brand') return res.status(403).json({ message: 'Only brands can create campaigns' });
        const { title, description, budget } = req.body;
        const campaign = await Campaign.create({ title, description, budget, brand: req.user._id });
        res.status(201).json(campaign);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.find().populate('brand', 'name email');
        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};