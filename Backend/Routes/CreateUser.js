const express = require("express");
const router = express.Router();
const user = require("../Models/User");
const { body } = require("express-validator");
const bcrypt = require("bcrypt");
const { validatecreateuser } = require("../Middleware/validate");
router.post(
  "/createuser",
  [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid Email format"),
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
    body("confirmpassword")
      .notEmpty()
      .withMessage("Confirm Password must not be empty."),
    body("name").notEmpty().withMessage("Name is required").trim(),
    body("username")
      .notEmpty()
      .withMessage("username is required")
      .isLength({ min: 3 })
      .withMessage("username must be atleast 3 characters long")
      .trim(),
    body("phone")
      .notEmpty()
      .withMessage("phone is required")
      .isMobilePhone()
      .withMessage("Not a valid phone number"),
  ],
  validatecreateuser,
  async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    let secpassword = await bcrypt.hash(req.body.password, salt);
    const userExists = await user.findOne({
      email: req.body.email,
      phone: req.body.phone,
      username: req.body.username,
    });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: { usercreation: ["User already exist."] },
      });
    }
    const emailExists = await user.findOne({ email: req.body.email });
    const phoneExists = await user.findOne({ phone: req.body.phone });
    const usernameExists = await user.findOne({ username: req.body.username });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: { email: ["Email already exists."] },
      });
    }
    if (phoneExists) {
      return res.status(400).json({
        success: false,
        message: { phone: ["phone number already exists."] },
      });
    }
    if (usernameExists) {
      return res.status(400).json({
        success: false,
        message: { username: ["username already exists."] },
      });
    }
    if (req.body.password !== req.body.confirmpassword) {
      return res.status(400).json({
        success: false,
        message: {
          confirmpassword: ["Confirm password and password are not same"],
        },
      });
    }
    await user
      .create({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
        password: secpassword,
        confirmpassword: secpassword,
      })
      .then(() => {
        res.status(201).json({
          success: true,
          message: { usercreation: ["you created account successfully"] },
        });
      })
      .catch((error) => {
        res.status(500).json({
          success: false,
          message: { servererror: ["Internal Server Error"] },
        });
      });
  }
);
module.exports = router;
