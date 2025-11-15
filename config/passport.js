import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

// Step 1: Redirect to Google Login
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 2: Callback after Google login
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "https://influencexrnfrontendnew.vercel.app/login" }),
  (req, res) => {
    const user = req.user;

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Redirect to frontend with token
    const redirectURL = `https://influencexrnfrontendnew.vercel.app/google-success?token=${token}`;

    res.redirect(redirectURL);
  }
);

export default router;
