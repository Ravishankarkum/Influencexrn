import express from 'express';
import {
    adminDashboard,
    brandDashboard,
    influencerDashboard
} from '../controllers/dashboardController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Unified dashboard route for all roles
router.get('/', protect, async (req, res) => {
  try {
    const role = req.user.role;
    if (role === 'brand') {
      return brandDashboard(req, res);
    }
    if (role === 'influencer') {
      return influencerDashboard(req, res);
    }
    if (role === 'admin') {
      return adminDashboard(req, res); // using detailed admin dashboard
    }
    return res.status(403).json({ message: 'Access denied.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
