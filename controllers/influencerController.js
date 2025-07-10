import Influencer from '../models/influencer.js';

export const createInfluencer = async (req, res) => {
  try {
    const existing = await Influencer.findOne({ user: req.user._id });
    if (existing) return res.status(400).json({ message: 'Profile already exists' });

    const influencer = new Influencer({
      user: req.user._id,
      bio: req.body.bio,
      socialLinks: req.body.socialLinks,
      averageEngagement: req.body.averageEngagement,
      mediaKit: req.file?.path || null 
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
    influencer.socialLinks = req.body.socialLinks || influencer.socialLinks;
    influencer.averageEngagement = req.body.averageEngagement ?? influencer.averageEngagement;
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
