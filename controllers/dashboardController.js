export const brandDashboard = (req, res) => {
  res.json({ message: `Welcome to the Brand Dashboard, ${req.user.name}` });
};

export const influencerDashboard = (req, res) => {
  res.json({ message: `Welcome to the Influencer Dashboard, ${req.user.name}` });
};

// Rename this to avoid conflict
export const adminDashboardMessage = (req, res) => {
  res.json({ message: `Welcome Admin, you have access to all dashboards` });
};
