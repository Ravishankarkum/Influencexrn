import Influencer from '../models/influencer.js';

export const createInfluencer = async (req, res) => {
  try {
    const existing = await Influencer.findOne({ user: req.user._id });
    if (existing) return res.status(400).json({ message: 'Profile already exists' });

    const influencer = new Influencer({
      user: req.user._id,
      bio: req.body.bio,
      portfolio_links: req.body.portfolio_links,
      engagement_rate: req.body.engagement_rate,
      mediaKit: req.file?.path || null,
      visibility_tier: req.body.visibility_tier || 'low',
    });

    const savedInfluencer = await influencer.save();
    res.status(201).json(savedInfluencer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyInfluencerProfile = async (req, res) => {
  try {
    const influencer = await Influencer.findOne({ user: req.user._id }).populate('user', 'name email');
    if (!influencer) return res.status(404).json({ message: 'Profile not found' });

    res.json(influencer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMyInfluencerProfile = async (req, res) => {
  try {
    const influencer = await Influencer.findOne({ user: req.user._id });
    if (!influencer) return res.status(404).json({ message: 'Profile not found' });

    influencer.bio = req.body.bio || influencer.bio;
    influencer.portfolio_links = req.body.portfolio_links || influencer.portfolio_links;
    influencer.engagement_rate = req.body.engagement_rate ?? influencer.engagement_rate;
    influencer.visibility_tier = req.body.visibility_tier || influencer.visibility_tier;
    influencer.mediaKit = req.file?.path || influencer.mediaKit;

    const updated = await influencer.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMyInfluencerProfile = async (req, res) => {
  try {
    const deleted = await Influencer.findOneAndDelete({ user: req.user._id });
    if (!deleted) return res.status(404).json({ message: 'Profile not found' });

    res.json({ message: 'Influencer profile deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};