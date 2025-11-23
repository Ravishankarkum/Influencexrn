import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

// ---------------------------------------------
// STEP 1 — GOOGLE LOGIN
// ---------------------------------------------
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
    session: false
  })
);

// ---------------------------------------------
// STEP 2 — GOOGLE CALLBACK
// ---------------------------------------------
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/auth/failure"
  }),
  (req, res) => {
    try {
      if (!req.user) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/login?error=NoUser`
        );
      }

      // Generate JWT
      const token = jwt.sign(
        { id: req.user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      const encodedToken = encodeURIComponent(token);

      // Redirect back to frontend with JWT token
      return res.redirect(
        `${process.env.FRONTEND_URL}/google-success?token=${encodedToken}`
      );

    } catch (error) {
      console.error("Google Auth Error:", error);
      return res.redirect(
        `${process.env.FRONTEND_URL}/login?error=AuthFailed`
      );
    }
  }
);

// ---------------------------------------------
// OPTIONAL FAILURE ROUTE
// ---------------------------------------------
router.get("/failure", (req, res) => {
  res.status(400).json({
    success: false,
    message: "Google Authentication Failed ❌"
  });
});

export default router;
