import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        website: {
            type: String,
        },
        industry: {
            type: String,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to the user who owns the brand
        },
    },
    { timestamps: true }
);

const Brand = mongoose.model('Brand', brandSchema);
export default Brand;
