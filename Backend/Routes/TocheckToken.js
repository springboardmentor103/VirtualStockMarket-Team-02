//tocheckToken.js
const express = require("express");
const router = express.Router();
router.get("/authstatus", async (req, res) => {
  try {
    const authToken = req.cookies.authToken;
    if (authToken) {
      return res.status(200).json({ success: true, authToken });
    }
    res.status(400).json({ success: false });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});
module.exports = router;
