import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import fs from 'fs';
import mongoose from 'mongoose';

import Brand from '../models/brand.js';
import Campaign from '../models/Campaign.js';
import Collaboration from '../models/Collaboration.js';
import User from '../models/User.js';

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
console.log('MongoDB connected');

const importData = async () => {
    try {
        await User.deleteMany();
        await Brand.deleteMany();
        await Campaign.deleteMany();
        await Collaboration.deleteMany();

        const users = JSON.parse(fs.readFileSync('./seeder/users.json', 'utf-8'));
        for (let user of users) {
            user.password = await bcrypt.hash(user.password, 10);
        }
        const createdUsers = await User.insertMany(users);
        console.log('Users seeded');

        const brands = JSON.parse(fs.readFileSync('./seeder/brands.json', 'utf-8'));
        brands[0].user = createdUsers[0]._id;
        brands[1].user = createdUsers[0]._id;
        const createdBrands = await Brand.insertMany(brands);
        console.log('Brands seeded');

        const campaigns = JSON.parse(fs.readFileSync('./seeder/campaigns.json', 'utf-8'));
        campaigns[0].brand = createdBrands[0]._id;
        campaigns[1].brand = createdBrands[1]._id;
        const createdCampaigns = await Campaign.insertMany(campaigns);
        console.log('Campaigns seeded');

        const collaborations = JSON.parse(fs.readFileSync('./seeder/collaborations.json', 'utf-8'));
        collaborations[0].campaign = createdCampaigns[0]._id;
        collaborations[0].influencer = createdUsers[1]._id;
        collaborations[1].campaign = createdCampaigns[1]._id;
        collaborations[1].influencer = createdUsers[2]._id;
        await Collaboration.insertMany(collaborations);
        console.log('Collaborations seeded');

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

importData();
