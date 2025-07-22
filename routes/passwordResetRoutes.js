import express from 'express';
import { forgotPassword, resetPassword } from '../controllers/passwordResetController.js';

const router = express.Router();

router.post('/forgot', forgotPassword);
router.post('/reset/:token', resetPassword);

export default router;