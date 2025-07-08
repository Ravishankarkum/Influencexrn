import express from 'express';
import { applyForCollaboration } from '../controllers/collaborationController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();
router.post('/', protect, applyForCollaboration);
export default router;