const express = require("express");
const router = express.Router();
const user = require("../Models/User");
const { body } = require("express-validator");
const bcrypt = require("bcrypt");
const { validatenewpassword } = require("../Middleware/validate");
const {
  verifyauthtoken,
  verifyotpmatching,
} = require("../Middleware/authtoken");
router.post(
  "/newpassword",
  [
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
      .withMessage(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      )
      .trim(),
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid Email format"),
  ],
  validatenewpassword,
  verifyauthtoken,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      const existuser = await user.findOne({ email });
      if (!existuser) {
        return res.status(400).json({
          success: false,
          message: [{ email: ["User not exist."] }],
        });
      }
      const passwordMatch = await bcrypt.compare(password, existuser.password);
      if (passwordMatch) {
        return res.status(400).json({
          success: false,
          message: [{ password: "This password already exists. Try new one." }],
        });
      }
      const salt = await bcrypt.genSalt(10);
      let secpassword = await bcrypt.hash(req.body.password, salt);
      await user.updateOne({ email }, { password: secpassword });
      res
        .status(200)
        .json({ success: true, message: "New Password Created successfully." });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  }
);
module.exports = router;
