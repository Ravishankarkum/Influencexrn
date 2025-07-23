import express from 'express';
import {
  createInfluencer,
  deleteMyInfluencerProfile,
  getMyInfluencerProfile,
  updateMyInfluencerProfile
} from '../controllers/influencerController.js';
import protect from '../middleware/authMiddleware.js';

import upload from '../middleware/uploadMiddleware.js';
import Collaboration from '../models/Collaboration.js';

const router = express.Router();

router.post('/', protect, upload.single('mediaKit'), createInfluencer);
router.get('/me', protect, getMyInfluencerProfile);
router.put('/me', protect, upload.single('mediaKit'), updateMyInfluencerProfile);
router.delete('/me', protect, deleteMyInfluencerProfile);

router.get('/my-collaborations', protect, async (req, res) => {
  if (req.user.role !== 'influencer')
    return res.status(403).json({ message: 'Only influencers can view their collaborations' });

  const collaborations = await Collaboration.find({ influencer: req.user._id })
    .populate('campaign', 'title description');

  res.json(collaborations);
});

export default router;