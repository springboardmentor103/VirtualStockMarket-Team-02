const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require("../Models/User");
const EmailVerification = require("../Models/EmailVerification");

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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    try {
      const { email, verificationToken } = req.body;
      const emailVerification = await EmailVerification.findOne({ email });

      if (!emailVerification) {
        return res.status(404).json({ success: false, message: "Verification entry not found" });
      }

      // Check if verification token matches
      if (verificationToken !== emailVerification.verificationToken) {
        return res.status(400).json({ success: false, message: "Invalid verification token" });
      }

      // Check if verification token has expired
      if (emailVerification.verificationTokenExpiry < new Date()) {
        return res.status(400).json({ success: false, message: "Verification token has expired" });
      }

      res.status(200).json({ success: true, message: "Verification token is valid" });
    } catch (error) {
      console.error("Error verifying email:", error);
      res.status(500).json({ success: false, message: "Failed to verify email" });
    }
  }
);

module.exports = router;
