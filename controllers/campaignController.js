import Campaign from '../models/Campaign.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

export const createCampaign = async (req, res) => {
    try {
        if (req.user.role !== 'brand') {
            return res.status(403).json({ message: 'Only brands can create campaigns' });
        }
        
        const { title, description, budget, category, targetMarket } = req.body;
        
        // Create the campaign
        const campaign = await Campaign.create({
            brand: req.user._id,
            title,
            description,
            budget,
            category,
            targetMarket
        });
        
        // Send notifications to eligible influencers
        await sendCampaignNotifications(campaign, req.user);
        
        // Populate the brand information before sending response
        await campaign.populate('brand', 'name brand_name email');
        
        res.status(201).json(campaign);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Function to send notifications to eligible influencers
const sendCampaignNotifications = async (campaign, brand) => {
    try {
        // Find all influencers (in a real app, you might filter by category, location, etc.)
        const influencers = await User.find({ role: 'influencer' });
        
        // Create notification for each influencer
        const notifications = influencers.map(influencer => ({
            recipient: influencer._id,
            sender: brand._id,
            type: 'campaign_created',
            title: 'New Campaign Available',
            message: `A new campaign "${campaign.title}" has been created by ${brand.brand_name || brand.name}. Budget: $${campaign.budget}`,
            campaign: campaign._id
        }));
        
        // Insert all notifications at once for better performance
        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
        }
        
        console.log(`Sent notifications to ${influencers.length} influencers about campaign ${campaign._id}`);
    } catch (error) {
        console.error('Error sending campaign notifications:', error);
        // Don't throw error here as we don't want to fail campaign creation if notifications fail
    }
};

export const getCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.find().populate('brand', 'name brand_name email');
        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCampaignById = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id).populate('brand', 'name brand_name email');
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

        const { title, description, budget, category, targetMarket } = req.body;
        if (title) campaign.title = title;
        if (description) campaign.description = description;
        if (budget) campaign.budget = budget;
        if (category) campaign.category = category;
        if (targetMarket) campaign.targetMarket = targetMarket;

        const updatedCampaign = await campaign.save();
        // Populate the brand information before sending response
        await updatedCampaign.populate('brand', 'name brand_name email');
        
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