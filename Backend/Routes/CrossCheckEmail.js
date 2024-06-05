const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const { body } = require("express-validator");

// Route for verifying email using verification token
router.post(
  "/crosscheckemail",
  [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid Email format"),
    body("verificationToken")
      .notEmpty()
      .withMessage("Verification token is required")
      .isNumeric()
      .withMessage("Verification token must be a 6-digit number"),
  ],
  async (req, res) => {
    try {
      const { email, verificationToken } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      // Check if verification token matches
      if (verificationToken !== user.verificationToken) {
        return res.status(400).json({ success: false, message: "Invalid verification token" });
      }

      // Check if verification token has expired
      if (user.verificationTokenExpiry < new Date()) {
        return res.status(400).json({ success: false, message: "Verification token has expired" });
      }

      // Update user's email verification status
      user.isEmailVerified = true;
      user.verificationToken = null;
      user.verificationTokenExpiry = null;
      await user.save();

      res.status(200).json({ success: true, message: "Email verified successfully" });
    } catch (error) {
      console.error("Error verifying email:", error);
      res.status(500).json({ success: false, message: "Failed to verify email" });
    }
  }
);

module.exports = router;
