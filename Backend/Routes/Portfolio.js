/*const express = require("express");
const router = express.Router();
const { verifyauthtoken } = require("../Middleware/authtoken");
const Purchase = require("../Models/Purchase");

router.get("/portfolio", verifyauthtoken, async (req, res) => {
  try {
    const userPurchases = await Purchase.find({ UserId: req.payload._id });

    let totalProfit = 0;
    let totalLoss = 0;
    let totalAmount = 0;

    for (const userPurchase of userPurchases) {
      totalAmount += userPurchase.cashBalance; // Add cash balance to total amount

      const purchaseArr = [];
      const sellArr = [];

      for (const purchaseItem of userPurchase.purchases) {
        if (purchaseItem.purchasetype === "BUY") {
          purchaseArr.push(purchaseItem);
        } else if (purchaseItem.purchasetype === "SELL") {
          sellArr.push(purchaseItem);
        }
      }

      // Match each purchase with its corresponding sale and calculate profit/loss
      for (const buy of purchaseArr) {
        for (const sell of sellArr) {
          if (sell.timestamp > buy.timestamp) {
            const profitLoss = (sell.quantity * sell.purchasePrice) - (buy.quantity * buy.purchasePrice);
            if (profitLoss > 0) {
              totalProfit += profitLoss;
            } else {
              totalLoss += profitLoss;
            }
            // Remove the matched purchase and sale from arrays to avoid double counting
            const buyIndex = purchaseArr.indexOf(buy);
            const sellIndex = sellArr.indexOf(sell);
            purchaseArr.splice(buyIndex, 1);
            sellArr.splice(sellIndex, 1);
            break; // Move to the next buy after matching with one sale
          }
        }
      }
    }

    // Adjust total profit and total loss to 2 decimal places
    totalProfit = totalProfit.toFixed(2);
    totalLoss = totalLoss.toFixed(2);

    // Calculate the corrected total amount
    const correctedTotalAmount = parseFloat(totalAmount).toFixed(3);

    res.status(200).json({
      success: true,
      portfolio: [],
      totalProfit,
      totalLoss,
      totalAmount: correctedTotalAmount
    });
  } catch (error) {
    console.error("Error in portfolio route:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;*/
const express = require("express");
const router = express.Router();
const { verifyauthtoken } = require("../Middleware/authtoken");
const purchase = require("../Models/Purchase");
const { getCoinData } = require("../Middleware/getCoinData");

router.get("/portfolio", verifyauthtoken, async (req, res) => {
  //console.log("Headers:", req.headers); // Log request headers
  //console.log("Payload:", req.payload); // Log payload from token

  try {
    const userPurchases = await purchase.find({ UserId: req.payload._id });

    let totalProfit = 0;
    let totalLoss = 0;
    let todayProfit = 0;
    let todayLoss = 0;
    let totalAmount = 0;

    const symbols = new Set();
    userPurchases.forEach((purchase) => {
      purchase.purchases.forEach((item) => {
        symbols.add(item.cryptoSymbol);
      });
    });

    const symbolArray = Array.from(symbols);
    const data = await getCoinData(symbolArray);

    const symbolPrices = symbolArray.reduce((acc, symbol) => {
      const priceData = data.data[symbol];
      if (
        priceData &&
        priceData[0] &&
        priceData[0].quote &&
        priceData[0].quote.USD &&
        priceData[0].quote.USD.price
      ) {
        acc[symbol] = priceData[0].quote.USD.price;
      } else {
        console.warn(`Price data for ${symbol} is not available`);
      }
      return acc;
    }, {});

    for (const purchase of userPurchases) {
      totalAmount += purchase.cashBalance;

      for (const item of purchase.purchases) {
        const currentPrice = symbolPrices[item.cryptoSymbol];

        if (!currentPrice) {
          continue;
        }

        const transactionAmount = item.quantity * currentPrice;
        const transactionProfitLoss =
          (currentPrice - item.purchasePrice) * item.quantity;

        if (transactionProfitLoss > 0) {
          totalProfit += transactionProfitLoss;
          if (isToday(item.timestamp)) {
            todayProfit += transactionProfitLoss;
          }
        } else {
          totalLoss += Math.abs(transactionProfitLoss); // Use absolute value for losses
          if (isToday(item.timestamp)) {
            todayLoss += Math.abs(transactionProfitLoss); // Use absolute value for losses
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
        totalAmount,
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
