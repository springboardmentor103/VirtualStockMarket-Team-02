const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const bcrypt = require("bcrypt");
const User = require("../Models/User");
const { verifyauthtoken } = require("../Middleware/authtoken");
const { validateupdateuser } = require("../Middleware/validate");

// Update user details
router.put(
  "/updateuser",
  verifyauthtoken,
  [
    body("email")
      .optional()
      .isEmail()
      .withMessage("Invalid Email format"),
    body("password")
      .optional()
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/)
      .withMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")
      .trim(),
    body("name")
      .optional()
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 characters long")
      .trim(),
  ],
  validateupdateuser,
  async (req, res) => {
    try {
      const updates = {};
      const { name, email, password } = req.body;

      if (name) updates.name = name;
      if (email) {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
          return res.status(400).json({
            success: false,
            message: "Email already exists",
          });
        }
        updates.email = email;
      }
      if (password) {
        const salt = await bcrypt.genSalt(10);
        const secPassword = await bcrypt.hash(password, salt);
        updates.password = secPassword;
      }

      const updatedUser = await User.findByIdAndUpdate(req.payload._id, updates, { new: true });
      res.status(200).json({
        success: true,
        message: "User details updated successfully",
        user: {
          name: updatedUser.name,
          email: updatedUser.email,
        },
      });
    } catch (error) {
      console.error("Error updating user details:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
);

module.exports = router;
