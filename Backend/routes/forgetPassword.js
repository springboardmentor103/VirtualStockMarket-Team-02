const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const User = require("../models/User");

// Forgot Password Route
router.post("/forgot", async (req, res) => {
  const { email } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false, expiresIn: 300 });

    // Send OTP to user's email
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is ${otp}. This OTP is valid for 5 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ msg: "Error sending OTP. Please try again later." });
      } else {
        console.log("Email sent: " + info.response);
        return res.status(200).json({ msg: "OTP sent to your email. Please check your inbox." });
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
