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
module.exports = router;