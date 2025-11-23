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

// Trust Render proxy
app.set("trust proxy", 1);

// CORS (Frontend URLs)
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

// Passport (no session, JWT only)
app.use(passport.initialize());

// Static uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Rate limiter
app.use('/api', apiLimiter);

// API Routes
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

// Google Auth Routes
app.use("/auth", googleAuthRoutes);

// Root route (also warms server)
app.get("/", (req, res) => {
  res.send("API is running and awake 🟢");
});

// "Warm-up" endpoint to prevent Render cold-start OAuth failure
app.get("/warmup", (req, res) => {
  res.json({ status: "warmed" });
});

// Error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
