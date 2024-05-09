const express = require("express");
const router = express.Router();
const purchase = require("../Models/Purchase");
const user = require("../Models/User");

router.get("/top-users", async (req, res) => {
  try {
    const users = await user.find();
    const topUsers = [];

    for (const currentUser of users) {
      const userPurchases = await purchase.findOne({ UserId: currentUser._id });

      if (!userPurchases) {
        continue;
      }

      let totalProfit = 0;

      userPurchases.purchases.forEach((purchase) => {
        totalProfit += (purchase.currentPrice - purchase.purchasePrice) * purchase.quantity;
      });

      topUsers.push({
        userId: currentUser._id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        totalProfit: totalProfit.toFixed(2),
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
