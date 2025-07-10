import express from 'express';
import {
    createCampaign,
    deleteCampaign,
    getCampaignById,
    getCampaigns,
    updateCampaign,
} from '../controllers/campaignController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createCampaign);
router.get('/', getCampaigns);
router.get('/:id', getCampaignById);
router.put('/:id', protect, updateCampaign);
router.delete('/:id', protect, deleteCampaign);

export default router;
