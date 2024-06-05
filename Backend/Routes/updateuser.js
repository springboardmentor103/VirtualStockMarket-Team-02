// const express = require("express");
// const router = express.Router();
// const { body } = require("express-validator");
// const User = require("../Models/User");
// const { verifyauthtoken } = require("../Middleware/authtoken");
// const { validateupdateuser } = require("../Middleware/validate");

// // Update user details
// router.put(
//   "/updateuser",
//   verifyauthtoken,
//   [
//     body("email").optional().isEmail().withMessage("Invalid Email format"),
//     body("name")
//       .optional()
//       .isLength({ min: 3 })
//       .withMessage("Name must be at least 3 characters long")
//       .trim(),
//   ],
//   validateupdateuser,
//   async (req, res) => {
//     try {
//       const updates = {};
//       const { name, email } = req.body;

//       if (name) updates.name = name;
//       if (email) {
//         const emailExists = await User.findOne({ email });
//         if (emailExists) {
//           return res.status(400).json({
//             success: false,
//             message: "Email already exists",
//           });
//         }
//         updates.email = email;
//       }

//       const updatedUser = await User.findByIdAndUpdate(
//         req.payload._id,
//         updates,
//         { new: true }
//       );
//       res.status(200).json({
//         success: true,
//         message: "User details updated successfully",
//         user: {
//           name: updatedUser.name,
//           email: updatedUser.email,
//         },
//       });
//     } catch (error) {
//       console.error("Error updating user details:", error);
//       res
//         .status(500)
//         .json({ success: false, message: "Internal server error" });
//     }
//   }
// );

// module.exports = router;


const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const User = require("../Models/User");
const { verifyauthtoken } = require("../Middleware/authtoken");
const { validateupdateuser } = require("../Middleware/validate");
const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
// Update user details
router.put(
  "/updateuser",
  verifyauthtoken,
  [
    body("email").optional().isEmail().withMessage("Invalid Email format"),
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
      const { name, email } = req.body;

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
      const randomColors = Array.from({ length: 10 }, generateRandomColor);
      const randomElement =
        randomColors[Math.floor(Math.random() * randomColors.length)];
      updates.profilepiccolor = randomElement;
      const updatedUser = await User.findByIdAndUpdate(
        req.payload._id,
        updates,
        { new: true }
      );
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
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);

module.exports = router;