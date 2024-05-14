
const express = require("express");
const router = express.Router();
const axios = require("axios");
const { verifyauthtoken } = require("../Middleware/authtoken");
const purchase = require("../Models/Purchase");
const getCurrentCryptoPrice = require("../Middleware/currentPrice");

router.get("/portfolio", verifyauthtoken, async (req, res) => {
  try {
    const userPurchases = await purchase.find({ UserId: req.payload._id });

    let totalProfit = 0;
    let totalLoss = 0;
    let todayProfit = 0;
    let todayLoss = 0;
    let totalAmount = 0;

    const symbolPrices = {};

    const today = new Date();

    for (const purchase of userPurchases) {
      totalAmount += purchase.cashBalance; // Add cash balance to total amount

      for (const item of purchase.purchases) {
        let currentPrice;

        currentPrice = await getCurrentCryptoPrice(item.cryptoSymbol);

        symbolPrices[item.cryptoSymbol] = currentPrice;

        const transactionAmount = item.quantity * currentPrice;
        const transactionProfitLoss = currentPrice - item.purchasePrice;

        if (transactionProfitLoss > 0) {
          totalProfit += transactionProfitLoss;

          if (isToday(item.timestamp)) {
            todayProfit += transactionProfitLoss;
          }
        } else {

          totalLoss += transactionProfitLoss;

          if (isToday(item.timestamp)) {
            todayLoss += transactionProfitLoss;
          }
        }
      }
    }

    console.log("Symbols and Current Prices:");
    console.log(symbolPrices);

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
