const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const { body, validationResult } = require("express-validator");
const User = require("../Models/User");
const EmailVerification = require("../Models/EmailVerification");

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Route for sending verification email
router.post(
  "/checkemail",
  [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid Email format"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, message: errors.array()[0].msg });
    }

    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (user) {
        return res
          .status(404)
          .json({ success: false, message: "Email already exist" });
      }

      // Generate a 6-digit numeric verification token
      const verificationToken = generateVerificationToken();

      // Send verification email
      await sendVerificationEmail(email, verificationToken);

      // Try to find the email verification entry in the database
      let emailVerification = await EmailVerification.findOne({ email });

      // If the entry exists, update the verification token and expiry
      if (emailVerification) {
        emailVerification.verificationToken = verificationToken;
        emailVerification.verificationTokenExpiry = new Date(
          Date.now() + 10 * 60 * 1000
        ); // 10 minutes from now
      } else {
        // If the entry does not exist, create a new one
        emailVerification = new EmailVerification({
          email,
          verificationToken,
          verificationTokenExpiry: new Date(Date.now() + 10 * 60 * 1000),
        });
      }

      await emailVerification.save();

      res.status(200).json({
        success: true,
        message: "Verification email sent successfully",
      });
    } catch (error) {
      console.error("Error sending verification email:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to send verification email" });
    }
  }
);

// Function to generate a 6-digit numeric verification token
function generateVerificationToken() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Function to send verification email
async function sendVerificationEmail(email, verificationToken) {
  try {
    const emailInfo = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification",
      text: `Your verification token for valid email id check is: ${verificationToken}`,
    });

    if (emailInfo.accepted.length !== 1) {
      throw new Error("Failed to send verification email");
    }
  } catch (error) {
    throw error;
  }
}

module.exports = router;
