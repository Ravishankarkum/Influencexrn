import express from 'express';
import {
    createBrand,
    deleteBrand,
    getBrandById,
    getBrands,
    updateBrand
} from '../controllers/brandController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', protect, authorizeRoles('brand', 'admin'), createBrand);
router.get('/', getBrands);
router.get('/:id', getBrandById);
router.put('/:id', protect, authorizeRoles('brand', 'admin'), updateBrand);
router.delete('/:id', protect, authorizeRoles('brand', 'admin'), deleteBrand);

export default router;
