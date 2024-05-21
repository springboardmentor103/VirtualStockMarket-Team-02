//loginAttempts.js
const express = require("express");
const router = express.Router();
const user = require("../Models/User");
const bcrypt = require("bcrypt");

router.post("/loginAttempts", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userData = await user.findOne({ email });

    if (!userData) {
      return res.status(400).json({ success: false, message: "Email Invalid" });
    }

    const currentTimestamp = new Date();
    const lockoutDuration = 5 * 60 * 1000; // 30 minutes in milliseconds

    if (userData.accountLocked) {
      if (currentTimestamp - userData.lastFailedLoginAttempt > lockoutDuration) {
        await user.updateOne({ email }, { $set: { accountLocked: false, failedLoginAttempts: 0 } });
      } else {
        return res.status(400).json({ success: false, message: "Account is locked. Please try again later." });
      }
    }

    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) {
      userData.failedLoginAttempts += 1;
      userData.lastFailedLoginAttempt = currentTimestamp;

      if (userData.failedLoginAttempts >= 5) {
        await user.updateOne({ email }, { $set: { accountLocked: true } });
        return res.status(400).json({ success: false, message: "Account is locked due to multiple failed login attempts. Please try again later." });
      }

      await userData.save();

      return res.status(400).json({ success: false, message: "Password Invalid" });
    }

    await user.updateOne({ email }, { $set: { failedLoginAttempts: 0, lastFailedLoginAttempt: null } });

    return res.status(200).json({ success: true, message: "Login successful." });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
