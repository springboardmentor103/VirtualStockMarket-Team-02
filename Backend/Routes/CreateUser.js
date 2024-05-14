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
    body("name").notEmpty().withMessage("Name is required").trim(),
    body("username")
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long")
      .trim(),
    body("phone")
      .notEmpty()
      .withMessage("Phone is required")
      .isMobilePhone()
      .withMessage("Not a valid phone number"),
  ],
  validatecreateuser,
  async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      let secpassword = await bcrypt.hash(req.body.password, salt);
      
      const confirmpassword = req.body.password;

      const userExists = await user.findOne({
        $or: [
          { email: req.body.email },
          { phone: req.body.phone },
          { username: req.body.username }
        ]
      });
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: { usercreation: ["User already exists."] },
        });
      }

      await user.create({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
        password: secpassword,
        confirmpassword: secpassword, 
      });

    
      return res.status(201).json({
        success: true,
        message: { usercreation: ["You created account successfully"] },
      });
    } catch (error) {
     
      console.error(error);
    
      return res.status(500).json({
        success: false,
        message: { servererror: ["Internal Server Error"] },
      });
    }
  }
);

module.exports = router;

