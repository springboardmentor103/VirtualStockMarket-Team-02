<<<<<<< HEAD
const express = require("express");
const router = express.Router();
router.get("/authstatus", async (req, res) => {
  try {
    const authToken = req.cookies.authToken;
    const otpToken = req.cookies.otpToken;
    const otpmatchToken = req.cookies.otpmatchToken;

    if (authToken) {
      return res.status(200).json({ success: true, token: "authToken" });
    } else if (otpToken) {
      return res.status(200).json({ success: true, token: "otpToken" });
    } else if (otpmatchToken) {
      return res.status(200).json({ success: true, token: "otpmatchToken" });
    } else {
      return res.status(400).json({ success: false });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});
module.exports = router;
=======
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
>>>>>>> 465c35f9ce83da72e5252f6a7cfebdc2f5c3993d
