<<<<<<< HEAD
const express = require("express");
const router = express.Router();
const axios = require("axios");
const { verifyauthtoken } = require("../Middleware/authtoken");
const user = require("../Models/User");
const { getCoinsData } = require("../Middleware/latestCoins");

router.get("/crypto-data", verifyauthtoken, async (req, res) => {
  try {
    const getresult = await getCoinsData();
    const userinfo = await user.findOne({ _id: req.payload._id });

    if (!userinfo) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const name = userinfo.name;
    const email = userinfo.email;

    res.status(200).json({
      success: true,
      getresult,
      name,
      email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
=======
const express = require("express");
const router = express.Router();
const axios = require("axios");
const { verifyauthtoken } = require("../Middleware/authtoken");
const user = require("../Models/User");
const { getCoinsData } = require("../Middleware/latestCoins");

router.get("/crypto-data", verifyauthtoken, async (req, res) => {
  try {
    const getresult = await getCoinsData();
    const userinfo = await user.findOne({ _id: req.payload._id });

    if (!userinfo) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const name = userinfo.name;
    const email = userinfo.email;

    res.status(200).json({
      success: true,
      getresult
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;

>>>>>>> 465c35f9ce83da72e5252f6a7cfebdc2f5c3993d
