import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import brandRoutes from './routes/brandRoutes.js';
import campaignRoutes from './routes/campaignRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import collaborationRoutes from './routes/collaborationRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import earningRoutes from './routes/earningRoutes.js';
import influencerRoutes from './routes/influencerRoutes.js';
import passwordResetRoutes from './routes/passwordResetRoutes.js';
import userRoutes from './routes/userRoutes.js';

import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import { apiLimiter } from './middleware/rateLimiter.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'https://your-frontend.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/api', apiLimiter);

// Routes
app.use('/api/users', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/collaborations', collaborationRoutes);
app.use('/api/earnings', earningRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/influencers', influencerRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/password', passwordResetRoutes);
app.use('/api/chat', chatRoutes);

app.get("/", (req, res) => {
  res.send("API is running ✅");
});

// 404 & Error handling (keep at end)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
