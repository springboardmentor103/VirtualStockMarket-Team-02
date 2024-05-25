<<<<<<< HEAD
const express = require("express");
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

module.exports = router;
=======
const express = require("express");
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

module.exports = router;
>>>>>>> 465c35f9ce83da72e5252f6a7cfebdc2f5c3993d
