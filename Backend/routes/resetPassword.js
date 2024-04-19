const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Verify OTP 
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body; 
  try {
    const user = await User.findOne({ email });
    if (!user || user.resetPasswordOTP !== otp) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }
    res.json({ msg: "OTP verified successfully"});
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Reset Password
router.post("/reset", async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear OTP after reset password
    user.resetPasswordOTP = null;
    
    await user.save();

    res.status(200).json({ msg: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message});
  }
});

module.exports = router;
