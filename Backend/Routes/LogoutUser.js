<<<<<<< HEAD
const express = require("express");
const router = express.Router();
router.delete(
  "/logoutuser",

  async (req, res) => {
    try {
      if (req.cookies.authToken) {
        res.clearCookie("authToken");
        return res.status(200).send({
          success: true,
          message: "User Logged Out Successfully.",
        });
      }
      return res.status(400).send({
        success: false,
        message: "User Not Logged In",
      });
    } catch (error) {
      res.status(500).json({ success: false, error });
    }
  }
);
=======
const express = require("express");
const router = express.Router();
router.delete(
  "/logoutuser",

  async (req, res) => {
    try {
      if (req.cookies.authToken) {
        res.clearCookie("authToken");
        return res.status(200).send({
          success: true,
          message: "User Logged Out Successfully.",
        });
      }
      return res.status(400).send({
        success: false,
        message: "User Not Logged In",
      });
    } catch (error) {
      res.status(500).json({ success: false, error });
    }
  }
);
>>>>>>> 465c35f9ce83da72e5252f6a7cfebdc2f5c3993d
module.exports = router;