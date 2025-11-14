import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

// Step 1 – Google login redirect
router.get("/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));

// Step 2 – Callback URL
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET);

    // Redirect user back to frontend with JWT
    res.redirect(`http://localhost:3000/google-success?token=${token}`);
  }
);

export default router;
