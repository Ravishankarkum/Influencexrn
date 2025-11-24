// EARNINGS ROUTES
// This file manages all API routes related to earnings.
// Only authenticated users with the 'brand' role 
// are allowed to create earnings records.

import express from 'express';
import { createEarning } from '../controllers/earningController.js';
import protect from '../middleware/authMiddleware.js';

import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();
// earnings //
router.post('/', protect, authorizeRoles('brand'), createEarning);

export default router;
