const express = require("express");
const router = express.Router();
const axios = require("axios");
const { verifyauthtoken } = require("../Middleware/authtoken");
const purchase = require("../Models/Purchase");
const getCurrentCryptoPrice = require("../Middleware/currentPrice");

router.get("/portfolio", verifyauthtoken, async (req, res) => {
  try {
    const userPurchases = await purchase.find({ UserId: req.payload._id });

    // Initialize total profit, total loss, today's profit, today's loss, and total amount
    let totalProfit = 0;
    let totalLoss = 0;
    let todayProfit = 0;
    let todayLoss = 0;
    let totalAmount = 0;

    // Get today's date
    const today = new Date();

    // Iterate through user's purchases
    for (const purchase of userPurchases) {
      totalAmount += purchase.cashBalance; // Add cash balance to total amount

      for (const item of purchase.purchases) {
        let currentPrice;

        // Fetch current price based on purchase type if cryptoSymbol is defined
        if (item.cryptoSymbol) {
          currentPrice = await getCurrentCryptoPrice(item.cryptoSymbol);
        } else {
          // Handle case where cryptoSymbol is undefined
          currentPrice = 0; // Or any default value or behavior you want
        }

        const transactionAmount = item.quantity * currentPrice;
        const transactionProfitLoss = currentPrice - item.purchasePrice;

        // Update total profit or loss based on transaction type
        if (transactionProfitLoss > 0) {
          // Profit
          totalProfit += transactionProfitLoss;

          // Check if the transaction occurred today
          if (isToday(item.timestamp)) {
            todayProfit += transactionProfitLoss;
          }
        } else {
          // Loss
          totalLoss += transactionProfitLoss;

          // Check if the transaction occurred today
          if (isToday(item.timestamp)) {
            todayLoss += transactionProfitLoss;
          }
        }
      }
    }

    // Output results
    res.status(200).json({
      success: true,
      totalPortfolio: {
        totalProfit,
        totalLoss,
        todayProfit,
        todayLoss,
        totalAmount
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Helper function to check if a given timestamp is from today
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
