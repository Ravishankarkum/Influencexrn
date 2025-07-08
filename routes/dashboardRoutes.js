import express from 'express';
import { brandDashboard, influencerDashboard } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/brand', protect, authorizeRoles('brand'), brandDashboard);

router.get('/influencer', protect, authorizeRoles('influencer'), influencerDashboard);

export default router;
