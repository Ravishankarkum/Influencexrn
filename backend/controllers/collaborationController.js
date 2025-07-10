import Collaboration from '../models/Collaboration.js';

export const applyForCollaboration = async (req, res) => {
    try {
        if (req.user.role !== 'influencer') return res.status(403).json({ message: 'Only influencers can apply' });
        const { campaign } = req.body;
        const collaboration = await Collaboration.create({ campaign, influencer: req.user._id });
        res.status(201).json(collaboration);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};