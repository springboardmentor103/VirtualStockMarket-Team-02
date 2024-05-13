const express = require("express");
const router = express.Router();

router.delete(
  "/logoutuser",
  async (req, res) => {
    try {
      if (req.cookies && req.cookies.authToken) {
        // Clear the authToken cookie
        res.clearCookie("authToken");
        return res.status(200).send({ success: true, message: "User logged out successfully." });
      }
      return res.status(400).send({ success: false, message: "User not logged in." });
    } catch (error) {
      res.status(500).json({ success: false, error });
    }
  }
);

module.exports = router;
