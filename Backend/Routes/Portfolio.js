const express = require("express");
const router = express.Router();
const { verifyauthtoken } = require("../Middleware/authtoken");
const user = require("../Models/User"); // Import the user model
const purchase = require("../Models/Purchase");

router.get("/portfolio", verifyauthtoken, async (req, res) => {
  try {
    const userPurchases = await purchase.find({ UserId: req.payload._id });
    const userinfo = await user.findOne({ _id: req.payload._id });

    if (!userinfo) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const name = userinfo.name;
    const email = userinfo.email;

    let totalProfit = 0;
    let totalLoss = 0;
    let todayProfit = 0;
    let todayLoss = 0;
    let totalAmount = 0;

    const cryptoTransactions = {};

    // Process each purchase record
    userPurchases.forEach((purchaseRecord) => {
      totalAmount += purchaseRecord.cashBalance;

      purchaseRecord.purchases.forEach((item) => {
        const { cryptoSymbol, quantity, purchasePrice, timestamp, purchasetype } = item;

        if (!cryptoTransactions[cryptoSymbol]) {
          cryptoTransactions[cryptoSymbol] = [];
        }

        cryptoTransactions[cryptoSymbol].push({ quantity, purchasePrice, timestamp, purchasetype });
      });
    });

    // Calculate profit and loss based on transaction history
    for (const symbol in cryptoTransactions) {
      const transactions = cryptoTransactions[symbol];

      transactions.forEach((transaction, index) => {
        const { quantity, purchasePrice, timestamp, purchasetype } = transaction;

        if (purchasetype === "SELL") {
          const matchingBuys = transactions.slice(0, index).filter(t => t.purchasetype === "BUY" && t.quantity > 0);
          let remainingQuantity = quantity;

          matchingBuys.forEach(buyTransaction => {
            if (remainingQuantity <= 0) return;

            const soldQuantity = Math.min(remainingQuantity, buyTransaction.quantity);
            const profitLoss = (purchasePrice - buyTransaction.purchasePrice) * soldQuantity;

            if (profitLoss > 0) {
              totalProfit += profitLoss;
              if (isToday(timestamp)) {
                todayProfit += profitLoss;
              }
            } else {
              totalLoss += Math.abs(profitLoss);
              if (isToday(timestamp)) {
                todayLoss += Math.abs(profitLoss);
              }
            }

            buyTransaction.quantity -= soldQuantity;
            remainingQuantity -= soldQuantity;
          });
        }
      });
    }

    res.status(200).json({
      success: true,
      totalPortfolio: {
        totalProfit,
        totalLoss,
        todayProfit,
        todayLoss,
        totalAmount,
      },
      user: {
        name,
        email,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

function isToday(timestamp) {
  const today = new Date();
  const itemDate = new Date(timestamp);
  return (
    itemDate.getDate() === today.getDate() &&
    itemDate.getMonth() === today.getMonth() &&
    itemDate.getFullYear() === today.getFullYear()
  );
}

module.exports = router;
