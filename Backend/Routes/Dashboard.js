const express = require("express");
const router = express.Router();

const { verifyauthtoken } = require("../Middleware/authtoken");
const { getCoinsData } = require("../Middleware/latestCoins");
const user = require("../Models/User");
const purchase = require("../Models/Purchase");

router.get("/dashboard", verifyauthtoken, async (req, res) => {
  try {
    const userPurchases = await purchase.findOne({ UserId: req.payload._id });
    const userInfo = await user.findOne({ _id: req.payload._id });
    
    if (userPurchases.purchases.length === 0) {
      return res.status(200).json({
        success: true,
        totalloss: 0,
        todayprofit: 0,
        totalamount: userPurchases.cashBalance,
      });
    }

    const today = new Date();
    let todayProfit = 0;
    let totalLoss = 0;

    for (const purchase of userPurchases.purchases) {
      const timestamp = new Date(purchase.timestamp);
      const timeDifference = today - timestamp;
      const hoursDifference = timeDifference / (1000 * 60 * 60);
      let currentPrice = 0; 
      if (hoursDifference <= 24) {
        todayProfit += (currentPrice - purchase.purchasePrice) * purchase.quantity;
      }
      
      totalLoss += (currentPrice - purchase.purchasePrice) * purchase.quantity;
    }

    if (totalLoss > 0) {
      totalLoss = 0;
    }
    if (todayProfit < 0) {
      todayProfit = 0;
    }

    res.status(200).json({
      success: true,
      totalloss: totalLoss,
      todayprofit: todayProfit,
      totalamount: userPurchases.cashBalance,
      purchasehistory: userPurchases.purchases,
      name: userInfo.name,
      email: userInfo.email,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


module.exports = router;
