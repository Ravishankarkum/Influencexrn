import express from 'express';
import {
    createCampaign,
    deleteCampaign,
    getCampaignById,
    getCampaigns,
    updateCampaign
} from '../controllers/campaignController.js';

import protect from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', protect, authorizeRoles('brand'), createCampaign);
router.get('/', getCampaigns);
router.get('/:id', getCampaignById);
router.put('/:id', protect, authorizeRoles('brand', 'admin'), updateCampaign);
router.delete('/:id', protect, authorizeRoles('brand', 'admin'), deleteCampaign);

export default router;