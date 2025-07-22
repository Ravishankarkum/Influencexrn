import express from 'express';
import { adminDashboard } from '../controllers/adminDashboardController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, authorizeRoles('admin'), adminDashboard);

export default router;
