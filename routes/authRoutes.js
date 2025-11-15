import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

// Step 1 – Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 2 – Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Redirect back to frontend with JWT
    res.redirect(
      `https://influencexrnfrontendnew.vercel.app/google-success?token=${token}`
    );
  }
);

export default router;
