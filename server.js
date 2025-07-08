import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import brandRoutes from './routes/brandRoutes.js';
import campaignRoutes from './routes/campaignRoutes.js';
import collaborationRoutes from './routes/collaborationRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import earningRoutes from './routes/earningRoutes.js';
import influencerRoutes from './routes/influencerRoutes.js';

import userRoutes from './routes/userRoutes.js';


dotenv.config();
connectDB();
const app = express();
app.use(express.json());
app.use('/api/users', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/collaborations', collaborationRoutes);
app.use('/api/earnings', earningRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/influencers', influencerRoutes);
app.use('/api/dashboard', dashboardRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));