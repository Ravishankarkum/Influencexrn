import Campaign from "../models/Campaign.js";
import Collaboration from "../models/Collaboration.js";
import Earning from "../models/Earning.js";
import User from "../models/User.js";

export const brandDashboard = async (req, res) => {
  try {
    const brandId = req.user.id;

    // Get brand campaigns
    const activeCampaigns = await Campaign.countDocuments({
      brand_id: brandId,
      ended_at: { $gte: new Date() }
    });

    // Get collaborating influencers
    const collaboratingInfluencers = await Collaboration.distinct("influencer_id", {
      brand_id: brandId,
      status: "active"
    });

    // Calculate total reach
    const influencers = await User.find({ _id: { $in: collaboratingInfluencers } });
    const totalReach = influencers.reduce((acc, influencer) => acc + (influencer.followers || 0), 0);

    // Calculate budget spent
    const collaborations = await Collaboration.find({ brand_id: brandId, status: "completed" });
    const budgetSpent = collaborations.reduce((acc, collab) => acc + (collab.deal_amount || 0), 0);

    res.json({
      message: `Welcome to the Brand Dashboard, ${req.user.name}`,
      activeCampaigns,
      collaboratingInfluencers: collaboratingInfluencers.length,
      totalReach,
      budgetSpent
    });
  } catch (error) {
    console.error("Error in brandDashboard:", error);
    res.status(500).json({ message: "Error loading brand dashboard" });
  }
};

export const influencerDashboard = async (req, res) => {
  try {
    const influencerId = req.user.id;

    // Get active collaborations
    const activeCollaborations = await Collaboration.countDocuments({
      influencer_id: influencerId,
      status: "active"
    });

    // Get earnings
    const earningData = await Earning.findOne({ influencer_id: influencerId });
    const totalEarnings = earningData ? earningData.total_earned : 0;
    const pendingPayouts = earningData
      ? earningData.payouts.filter((p) => p.status === "pending")
          .reduce((acc, p) => acc + p.amount, 0)
      : 0;

    // Fetch user for additional details
    const user = await User.findById(influencerId);

    // Count completed campaigns
    const campaignsCompleted = await Collaboration.countDocuments({
      influencer_id: influencerId,
      status: "completed"
    });

    res.json({
      message: `Welcome to the Influencer Dashboard, ${req.user.name}`,
      totalEarnings,
      activeCollaborations,
      pendingPayouts,
      followers: user.followers || 0,
      engagementRate: user.engagement_rate || 0,
      campaignsCompleted
    });
  } catch (error) {
    console.error("Error in influencerDashboard:", error);
    res.status(500).json({ message: "Error loading influencer dashboard" });
  }
};

// Rename this to avoid conflict
export const adminDashboardMessage = (req, res) => {
  res.json({ message: `Welcome Admin, you have access to all dashboards` });
};
