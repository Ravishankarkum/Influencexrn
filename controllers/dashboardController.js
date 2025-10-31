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

    // Return data in format expected by frontend
    res.json({
      stats: [
        { label: "Active Campaigns", value: activeCampaigns, icon: "Target", change: "+12%" },
        { label: "Collaborating Influencers", value: collaboratingInfluencers.length, icon: "Users", change: "+5%" },
        { label: "Total Reach", value: totalReach.toLocaleString(), icon: "MessageSquare", change: "+18%" },
        { label: "Budget Spent", value: `$${budgetSpent.toLocaleString()}`, icon: "DollarSign", change: "+3%" }
      ],
      profileStats: {
        total_campaigns: activeCampaigns,
        collaborating_influencers: collaboratingInfluencers.length,
        total_reach: totalReach,
        budget_spent: budgetSpent
      }
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

    // Get active campaigns for the influencer
    const activeCampaignsData = await Collaboration.find({ 
      influencer_id: influencerId, 
      status: "active" 
    }).populate('campaign_id');

    // Format active campaigns for frontend
    const formattedActiveCampaigns = activeCampaignsData.map(collab => ({
      _id: collab._id,
      campaign_title: collab.campaign_id?.title || 'Untitled Campaign',
      brand_name: collab.brand_name || 'Unknown Brand',
      category: collab.campaign_id?.category || 'General',
      status: collab.status,
      deadline: collab.campaign_id?.ended_at || new Date(),
      deal_amount: collab.deal_amount || 0
    }));

    // Get recent earnings
    const recentEarningsData = earningData ? earningData.payouts.slice(-5).reverse() : [];

    // Format recent earnings for frontend
    const formattedRecentEarnings = recentEarningsData.map(payout => ({
      campaign: payout.campaign_title || 'Unknown Campaign',
      date: payout.date || new Date(),
      amount: payout.amount || 0,
      status: payout.status || 'pending'
    }));

    // Return data in format expected by frontend
    res.json({
      stats: [
        { label: "Total Earnings", value: `$${totalEarnings.toLocaleString()}`, icon: "DollarSign", change: "+15%" },
        { label: "Active Collaborations", value: activeCollaborations, icon: "Clock", change: "+3%" },
        { label: "Followers", value: ((user.followers || 0) / 1000).toFixed(1) + "K", icon: "Users", change: "+8%" },
        { label: "Engagement Rate", value: `${user.engagement_rate || 0}%`, icon: "Target", change: "+2%" }
      ],
      profileStats: {
        followers: user.followers || 0,
        engagement_rate: user.engagement_rate || 0,
        total_posts: 0, // This would need to be calculated from another source
        campaigns_completed: campaignsCompleted,
        visibility_tier: user.visibility_tier || 'standard'
      },
      activeCampaigns: formattedActiveCampaigns,
      recentEarnings: formattedRecentEarnings
    });
  } catch (error) {
    console.error("Error in influencerDashboard:", error);
    res.status(500).json({ message: "Error loading influencer dashboard" });
  }
};

export const adminDashboard = async (req, res) => {
  try {
    // Get counts for various entities
    const userCount = await User.countDocuments();
    const campaignCount = await Campaign.countDocuments();
    const collaborationCount = await Collaboration.countDocuments();
    
    // Get earnings data
    const earnings = await Earning.aggregate([
      { $group: { _id: null, total: { $sum: "$total_earned" } } }
    ]);
    const totalEarnings = earnings.length > 0 ? earnings[0].total : 0;

    res.json({
      stats: [
        { label: "Total Users", value: userCount, icon: "Users", change: "+10%" },
        { label: "Active Campaigns", value: campaignCount, icon: "Target", change: "+7%" },
        { label: "Collaborations", value: collaborationCount, icon: "Clock", change: "+12%" },
        { label: "Total Earnings", value: `$${totalEarnings.toLocaleString()}`, icon: "DollarSign", change: "+5%" }
      ],
      profileStats: {
        total_users: userCount,
        total_campaigns: campaignCount,
        total_collaborations: collaborationCount,
        total_earnings: totalEarnings
      }
    });
  } catch (error) {
    console.error("Error in adminDashboard:", error);
    res.status(500).json({ message: "Error loading admin dashboard" });
  }
};