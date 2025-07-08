import express from 'express';
import { createCampaign, getCampaigns } from '../controllers/campaignController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();
router.route('/').post(protect, createCampaign).get(getCampaigns);
export default router;