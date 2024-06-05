

const express = require("express");
const router = express.Router();
const Purchase = require("../Models/Purchase");
const User = require("../Models/User");

router.get("/leaderboard", async (req, res) => {
  try {
    const users = await User.find();
    const topUsers = [];

    for (const currentUser of users) {
      const userPurchases = await Purchase.findOne({ UserId: currentUser._id });

      if (!userPurchases) {
        continue;
      }

      let totalBuyAmount = 0;
      let totalSellAmount = 0;

      if (userPurchases.purchases) {
        userPurchases.purchases.forEach((transaction) => {
          if (transaction.purchasetype === "BUY") {
            totalBuyAmount += transaction.quantity * transaction.purchasePrice;
          } else if (transaction.purchasetype === "SELL") {
            totalSellAmount += transaction.quantity * transaction.purchasePrice;
          }
        });
      }

      const totalProfit = totalSellAmount - totalBuyAmount;

      topUsers.push({
        userId: currentUser._id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        userProfile: currentUser.profilepiccolor,
        totalProfit: totalProfit.toFixed(6),
      });
    }

    topUsers.sort((a, b) => b.totalProfit - a.totalProfit);
    const top10Users = topUsers.slice(0, 10);

    res.status(200).json({ success: true, topUsers: top10Users });
  } catch (error) {
    console.error("Error fetching top users:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;