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
const user = require("../Models/User"); // Import the user model
const purchase = require("../Models/Purchase");

router.get("/portfolio", verifyauthtoken, async (req, res) => {
  try {
    const userPurchases = await purchase.find({ UserId: req.payload._id });
    const userinfo = await user.findOne({ _id: req.payload._id });

    if (!userinfo) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
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
        const {
          cryptoSymbol,
          quantity,
          purchasePrice,
          timestamp,
          purchasetype,
        } = item;

        if (!cryptoTransactions[cryptoSymbol]) {
          cryptoTransactions[cryptoSymbol] = [];
        }

        cryptoTransactions[cryptoSymbol].push({
          quantity,
          purchasePrice,
          timestamp,
          purchasetype,
        });
      });
    });

    // Calculate profit and loss based on transaction history
    for (const symbol in cryptoTransactions) {
      const transactions = cryptoTransactions[symbol];

      transactions.forEach((transaction, index) => {
        const { quantity, purchasePrice, timestamp, purchasetype } =
          transaction;

        if (purchasetype === "SELL") {
          const matchingBuys = transactions
            .slice(0, index)
            .filter((t) => t.purchasetype === "BUY" && t.quantity > 0);
          let remainingQuantity = quantity;

          matchingBuys.forEach((buyTransaction) => {
            if (remainingQuantity <= 0) return;

            const soldQuantity = Math.min(
              remainingQuantity,
              buyTransaction.quantity
            );
            const profitLoss =
              (purchasePrice - buyTransaction.purchasePrice) * soldQuantity;

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
