import express from 'express';
import { adminDashboard } from '../controllers/adminDashboardController.js';
import { adminDashboardMessage } from '../controllers/dashboardController.js';
import protect from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Analytics data for admin
router.get('/', protect, authorizeRoles('admin'), adminDashboard);

// Simple message for admin dashboard
router.get('/message', protect, authorizeRoles('admin'), adminDashboardMessage);

export default router;
