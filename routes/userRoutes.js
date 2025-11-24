import express from 'express';
import { getProfile, login, register, updatePassword, deleteAccount } from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';
import { 
  loginValidationRules, 
  registerValidationRules, 
  validateRegistration,
  validate
} from '../middleware/validationMiddleware.js';

const router = express.Router();
// user routes
router.post('/register', registerValidationRules(), validateRegistration, register);
router.post('/login', loginValidationRules(), validate, login);
router.get('/profile', protect, getProfile);
router.put('/update-password', protect, updatePassword);
router.delete('/delete-account', protect, deleteAccount);

export default router;
