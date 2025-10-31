import express from 'express';
import { getProfile, login, register } from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';
import { 
  loginValidationRules, 
  registerValidationRules, 
  validateRegistration,
  validate
} from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post('/register', registerValidationRules(), validateRegistration, register);
router.post('/login', loginValidationRules(), validate, login);
router.get('/profile', protect, getProfile);

export default router;