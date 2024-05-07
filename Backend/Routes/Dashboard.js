const express = require("express");
const router = express.Router();

const { verifyauthtoken } = require("../Middleware/authtoken");
const { getCoinsData } = require("../Middleware/latestCoins");
const user = require("../Models/User");
const purchase = require("../Models/Purchase");
router.get("/dashboard", verifyauthtoken, async (req, res) => {
  try {
    const userpurchases = await purchase.find({ UserId: req.payload._id });
    const userinfo = await user.find({ _id: req.payload._id });
    if (userpurchases[0].purchases.length === 0) {
      return res.status(200).json({
        success: true,
        totalloss: 0,
        todayprofit: 0,
        totalamount: userpurchases[0].cashBalance,
      });
    }
    const getresult = await getCoinsData();
    const today = new Date();
    var todayprofit = 0;
    var totalloss = 0;
    userpurchases[0].purchases.map((purchase) => {
      const timestamp = new Date(purchase.timestamp);
      const timeDifference = today - timestamp;
      const hoursDifference = timeDifference / (1000 * 60 * 60);
      if (hoursDifference <= 24) {
        todayprofit = todayprofit + purchase.purchasePrice;
      }
      totalloss = totalloss + purchase.purchasePrice;
    });
    if (totalloss > 0) {
      totalloss = 0;
    }
    if (todayprofit < 0) {
      todayprofit = 0;
    }

    res.status(200).json({
      success: true,
      totalloss,
      todayprofit,
      totalamount: userpurchases[0].cashBalance,
      purchasehistory: userpurchases[0].purchases,
      // getresult,
      name: userinfo[0].name,
      email: userinfo[0].email,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
module.exports = router;
