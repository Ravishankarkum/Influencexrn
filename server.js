import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import connectDB from './config/db.js';

import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import brandRoutes from './routes/brandRoutes.js';
import campaignRoutes from './routes/campaignRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import collaborationRoutes from './routes/collaborationRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import earningRoutes from './routes/earningRoutes.js';
import influencerRoutes from './routes/influencerRoutes.js';
import passwordResetRoutes from './routes/passwordResetRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

import googleAuthRoutes from "./routes/authRoutes.js";

import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import { apiLimiter } from './middleware/rateLimiter.js';

import passport from "passport";
import "./config/passport.js";

dotenv.config();
connectDB();

const app = express();

// TRUST RENDER PROXY
app.set("trust proxy", 1);

// CORS
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://influencexrnfrontendnew.vercel.app",
  ],
  credentials: true,
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// NO SESSION NEEDED (we use JWT)
app.use(passport.initialize());

// Static uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Rate limit
app.use('/api', apiLimiter);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/collaborations', collaborationRoutes);
app.use('/api/earnings', earningRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/influencers', influencerRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/password', passwordResetRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// GOOGLE AUTH
app.use("/auth", googleAuthRoutes);

// ROOT ROUTE
app.get("/", (req, res) => {
  res.send("API is running ✅");
});

// Error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
