import Campaign from '../models/Campaign.js';
import Collaboration from '../models/Collaboration.js';
import Earning from '../models/Earning.js';
import User from '../models/User.js';

/**
 * Admin Dashboard Controller
 * Returns system-level aggregated statistics for admin
 */
export const adminDashboard = async (req, res) => {
  try {
    // Basic counts
    const userCount = await User.countDocuments();
    const influencerCount = await User.countDocuments({ role: 'influencer' });
    const brandCount = await User.countDocuments({ role: 'brand' });

    const campaignCount = await Campaign.countDocuments();
    const collaborationCount = await Collaboration.countDocuments();

    // Earnings aggregation
    const earnings = await Earning.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    res.json({
      success: true,
      data: {
        totalUsers: userCount,
        totalInfluencers: influencerCount,
        totalBrands: brandCount,
        totalCampaigns: campaignCount,
        totalCollaborations: collaborationCount,
        totalEarnings: earnings[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Admin Dashboard Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin dashboard data.',
      error: error.message
    });
  }
};//
