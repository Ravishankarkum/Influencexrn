import Brand from "../models/brand.js";


export const createBrand = async (req, res) => {
    try {
        const brand = new Brand(req.body);
        await brand.save();
        res.status(201).json(brand);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getBrands = async (req, res) => {
    try {
        const brands = await Brand.find();
        res.json(brands);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getBrandById = async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);
        if (!brand) return res.status(404).json({ error: "Brand not found" });
        res.json(brand);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateBrand = async (req, res) => {
    try {
        const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!brand) return res.status(404).json({ error: "Brand not found" });
        res.json(brand);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteBrand = async (req, res) => {
    try {
        const brand = await Brand.findByIdAndDelete(req.params.id);
        if (!brand) return res.status(404).json({ error: "Brand not found" });
        res.json({ message: "Brand deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
