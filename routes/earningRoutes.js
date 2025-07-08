import express from 'express';
import { createEarning } from '../controllers/earningController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();
router.post('/', protect, createEarning);
export default router;