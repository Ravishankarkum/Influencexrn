import express from 'express';
import { createEarning } from '../controllers/earningController.js';
import protect from '../middleware/authMiddleware.js';

import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', protect, authorizeRoles('brand'), createEarning);

export default router;
