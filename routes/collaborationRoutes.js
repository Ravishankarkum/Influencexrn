import express from 'express';
import {
    createCollaboration,
    deleteCollaboration,
    getCollaborationById,
    getCollaborations,
    updateCollaboration
} from '../controllers/collaborationController.js';
import protect from '../middleware/authMiddleware.js';


const router = express.Router();
// router for collaborations
router.post('/', protect, createCollaboration);
router.get('/', protect, getCollaborations);
router.get('/:id', protect, getCollaborationById);
router.put('/:id', protect, updateCollaboration);
router.delete('/:id', protect, deleteCollaboration);

export default router;
