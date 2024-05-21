const express = require("express");
const router = express.Router();
const Purchase = require("../Models/Purchase");
const User = require("../Models/User");
const { getCoinData } = require("../Middleware/getCoinData");

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

      const symbols = new Set();
      if (userPurchases.purchases) {
        userPurchases.purchases.forEach((transaction) => {
          symbols.add(transaction.cryptoSymbol);
        });
      }

      const symbolArray = Array.from(symbols);

      if (symbolArray.length === 0) {
        continue;
      }

      let data;
      try {
        data = await getCoinData(symbolArray);
      } catch (error) {
        continue;
      }

      const symbolPrices = symbolArray.reduce((acc, symbol) => {
        const priceData = data.data[symbol];
        if (priceData && priceData[0] && priceData[0].quote && priceData[0].quote.USD && priceData[0].quote.USD.price) {
          acc[symbol] = priceData[0].quote.USD.price;
        } else {
          acc[symbol] = 0;
        }
        return acc;
      }, {});

      if (userPurchases.purchases) {
        userPurchases.purchases.forEach((transaction) => {
          const currentPrice = symbolPrices[transaction.cryptoSymbol];
          if (currentPrice === 0) {
            return;
          }
          if (transaction.purchasetype === 'BUY') {
            totalBuyAmount += transaction.quantity * transaction.purchasePrice;
          } else if (transaction.purchasetype === 'SELL') {
            totalSellAmount += transaction.quantity * currentPrice;
          }
        });
      }

      const totalProfit = totalSellAmount - totalBuyAmount;

      topUsers.push({
        userId: currentUser._id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        totalProfit: isNaN(totalProfit) ? '0.000000' : totalProfit.toFixed(6),
      });
    }

    topUsers.sort((a, b) => parseFloat(b.totalProfit) - parseFloat(a.totalProfit));

    res.status(200).json({ success: true, topUsers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;

