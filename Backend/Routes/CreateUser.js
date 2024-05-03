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
    body("name")
      .notEmpty()
      .withMessage("name is required")
      .isLength({ min: 3 })
      .withMessage("name must be atleast 3 characters long")
      .trim(),
  ],
  validatecreateuser,
  async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    let secpassword = await bcrypt.hash(req.body.password, salt);
    const userExists = await user.findOne({
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
    });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: { usercreation: ["User already exist."] },
      });
    }
    const emailExists = await user.findOne({ email: req.body.email });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: { email: ["Email already exists."] },
      });
    }
    await user
      .create({
        name: req.body.name,
        email: req.body.email,
        password: secpassword,
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
