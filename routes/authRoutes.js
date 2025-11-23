import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

// GOOGLE LOGIN - STEP 1
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account"
  })
);

// GOOGLE CALLBACK - STEP 2
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/auth/failure" }),
  (req, res) => {
    try {
      if (!req.user) {
        return res.redirect(
          "https://influencexrnfrontendnew.vercel.app/login?error=NoUser"
        );
      }

      // Create JWT
      const token = jwt.sign(
        { id: req.user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // URL safe token
      const encodedToken = encodeURIComponent(token);

      // Redirect to frontend with token
      res.redirect(
        `https://influencexrnfrontendnew.vercel.app/google-success?token=${encodedToken}`
      );
    } catch (error) {
      console.error("Google Auth Error:", error);
      res.redirect(
        "https://influencexrnfrontendnew.vercel.app/login?error=AuthFailed"
      );
    }
  }
);

// FAILURE ROUTE (optional)
router.get("/failure", (req, res) => {
  res.send("Google Authentication Failed ❌");
});

export default router;
