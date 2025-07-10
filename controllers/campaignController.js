import Campaign from '../models/Campaign.js';

export const createCampaign = async (req, res) => {
    try {
        if (req.user.role !== 'brand') {
            return res.status(403).json({ message: 'Only brands can create campaigns' });
        }
        const { title, description, budget } = req.body;
        const campaign = await Campaign.create({
            title,
            description,
            budget,
            brand: req.user._id,
        });
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

export const getCampaignById = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id).populate('brand', 'name email');
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }
        res.json(campaign);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        if (
            campaign.brand.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({ message: 'Not authorized to update this campaign' });
        }

        const { title, description, budget } = req.body;
        if (title) campaign.title = title;
        if (description) campaign.description = description;
        if (budget) campaign.budget = budget;

        const updatedCampaign = await campaign.save();
        res.json(updatedCampaign);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        if (
            campaign.brand.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({ message: 'Not authorized to delete this campaign' });
        }

        await campaign.deleteOne();
        res.json({ message: 'Campaign deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
