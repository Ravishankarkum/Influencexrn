import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import fs from 'fs';
import mongoose from 'mongoose';

import Brand from '../models/brand.js';
import Campaign from '../models/Campaign.js';
import Collaboration from '../models/Collaboration.js';
import User from '../models/User.js';

dotenv.config();

// Connect to MongoDB using environment variable
await mongoose.connect(process.env.MONGO_URI);
console.log('MongoDB connected');

const importData = async () => {
    try {
        // Clear existing data to avoid duplicates before seeding
        await User.deleteMany();
        await Brand.deleteMany();
        await Campaign.deleteMany();
        await Collaboration.deleteMany();

        // Read and parse users JSON file
        const users = JSON.parse(fs.readFileSync('./seeder/users.json', 'utf-8'));
        
        // Hash all user passwords before inserting into DB
        for (let user of users) {
            user.password = await bcrypt.hash(user.password, 10);
        }

        // Insert new users into database
        const createdUsers = await User.insertMany(users);
        console.log('Users seeded');

        // Read brands JSON file and assign user reference to each brand
        const brands = JSON.parse(fs.readFileSync('./seeder/brands.json', 'utf-8'));
        brands[0].user = createdUsers[0]._id; // Assign brand owner
        brands[1].user = createdUsers[0]._id;
        const createdBrands = await Brand.insertMany(brands);
        console.log('Brands seeded');

        // Read campaign data and assign correct brand reference
        const campaigns = JSON.parse(fs.readFileSync('./seeder/campaigns.json', 'utf-8'));
        campaigns[0].brand = createdBrands[0]._id;
        campaigns[1].brand = createdBrands[1]._id;
        const createdCampaigns = await Campaign.insertMany(campaigns);
        console.log('Campaigns seeded');

        // Read collaboration data and attach campaign + influencer references
        const collaborations = JSON.parse(fs.readFileSync('./seeder/collaborations.json', 'utf-8'));
        collaborations[0].campaign = createdCampaigns[0]._id;
        collaborations[0].influencer = createdUsers[1]._id;
        collaborations[1].campaign = createdCampaigns[1]._id;
        collaborations[1].influencer = createdUsers[2]._id;

        // Insert collaborations
        await Collaboration.insertMany(collaborations);
        console.log('Collaborations seeded');

        // Exit process when done
        process.exit();
    } catch (error) {
        // Log error and exit with failure status
        console.error(error);
        process.exit(1);
    }
};

// Run the seeding function
importData();
