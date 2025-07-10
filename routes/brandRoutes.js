import express from "express";
import {
    createBrand,
    deleteBrand,
    getBrandById,
    getBrands,
    updateBrand
} from "../controllers/brandController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBrand);
router.get("/", getBrands);
router.get("/:id", getBrandById);
router.put("/:id", protect, updateBrand);
router.delete("/:id", protect, deleteBrand);

export default router;
