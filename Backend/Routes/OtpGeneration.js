const express = require("express");
const router = express.Router();
const user = require("../Models/User");
const { body } = require("express-validator");
const otp = require("otp-generator");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const rateLimit = require("express-rate-limit");
const { validateotpgeneration } = require("../Middleware/validate");

const {
  verifyauthtoken,
  generateotptoken,
} = require("../Middleware/authtoken");
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: "Too many requests from this IP, please try again later",
});
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
const encryptOTP = (otpValue) => {
  const algorithm = "aes-256-cbc";
  const key = crypto
    .createHash("sha256")
    .update(process.env.ENCRYPTION_KEY)
    .digest("hex")
    .slice(0, 32);

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(otpValue);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
};
const otpgenerate = () => {
  const generatedOTP = otp.generate(6);
  return generatedOTP;
};

router.post(
  "/otpgenerate",
  [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid Email format"),
  ],
  validateotpgeneration,
  verifyauthtoken,
  limiter,
  async (req, res) => {
    try {
      const EmailExists = await user.findOne({ email: req.body.email });
      if (!EmailExists) {
        return res.status(400).json({
          success: false,
          message: {
            email: ["Use the email used for creating the account."],
          },
        });
      }
      const otpValue = otpgenerate();
      const encryptedotp = encryptOTP(otpValue);
      encryptedotp.expiry = new Date(Date.now() + 600000);
      await transporter.sendMail({
        from: process.env.USER,
        to: req.body.email,
        subject: "Your OTP for Verification",
        text: `Your OTP is: ${otpValue}`,
      });
      await user.updateOne({ email: req.body.email }, { otp: encryptedotp });
      const otpToken = await generateotptoken(EmailExists._id);
      const cookieOptions = {
        httpOnly: true,
        maxAge: 10 * 60 * 1000,
      };
      res.cookie("otpToken", otpToken, cookieOptions);
      return res.status(200).json({
        success: true,
        message: { result: ["OTP sent successfully."] },
        _id: EmailExists._id,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: { error: ["Failed to send OTP."] },
        error,
      });
    }
  }
);
module.exports = router;
