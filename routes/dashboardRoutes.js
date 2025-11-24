import express from 'express';
import {
    adminDashboard,
    brandDashboard,
    influencerDashboard
} from '../controllers/dashboardController.js';
import protect from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Specific routes for brand and influencer dashboards to match frontend expectations //
router.get('/brand', protect, authorizeRoles('brand'), brandDashboard);
router.get('/influencer', protect, authorizeRoles('influencer'), influencerDashboard);
router.get('/admin', protect, authorizeRoles('admin'), adminDashboard);

// Analytics route
router.get('/analytics', protect, (req, res) => {
    res.json({ message: 'Analytics data would be returned here' });
});

export default router;
