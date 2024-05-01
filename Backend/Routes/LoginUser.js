const express = require("express");
const router = express.Router();
const user = require("../Models/User");
const { body } = require("express-validator");
const bcrypt = require("bcrypt");
const { generateauthtoken } = require("../Middleware/authtoken");
const { validateloginuser } = require("../Middleware/validate");
router.post(
  "/loginuser",
  [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid Email format"),
    body("password")
      .notEmpty()
      .withMessage("Password is required.")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
      .withMessage(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
  ],
  validateloginuser,
  async (req, res) => {
    const { email, password } = req.body;
    try {
      const userData = await user.findOne({ email: email });

      if (!userData) {
        return res.status(400).json({
          success: false,
          message: { email: ["Email Invalid"] },
        });
      }

      const isMatch = await bcrypt.compare(password, userData.password);

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: { password: ["password Invalid"] },
        });
      }
      if (req.cookies.authToken) {
        return res
          .status(400)
          .json({ success: false, message: "you have already logged in." });
      }
      const authToken = await generateauthtoken(userData._id);
      const cookieOptions = {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      };
      res.cookie("authToken", authToken, cookieOptions);
      return res.json({
        success: true,
        message: "Login successfull.",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error" });
    }
  }
);

module.exports = router;
