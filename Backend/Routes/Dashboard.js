const express = require("express");
const router = express.Router();

const { verifyauthtoken } = require("../Middleware/authtoken");
const { getCoinsData } = require("../Middleware/latestCoins");
const user = require("../Models/User");
const purchase = require("../Models/Purchase");

// Route to get total profit, total loss, today's profit, today's loss, and total amount
router.get("/dashboard", verifyauthtoken, async (req, res) => {
  try {
    const userpurchases = await purchase.find({ UserId: req.payload._id });
    let totalAmount = 0;
    let totalProfit = 0;
    let totalLoss = 0;
    let todayProfit = 0;
    let todayLoss = 0;

    // Calculate total amount, total profit, total loss, today's profit, and today's loss
    userpurchases.forEach((purchase) => {
      totalAmount += purchase.cashBalance;
      purchase.purchases.forEach((item) => {
        if (item.purchasetype === "BUY") {
          totalProfit += item.purchasePrice;
          if (isToday(item.timestamp)) {
            todayProfit += item.purchasePrice;
          }
        } else if (item.purchasetype === "SELL") {
          totalLoss += item.purchasePrice;
          if (isToday(item.timestamp)) {
            todayLoss += item.purchasePrice;
          }
        }
      });
    });

    res.status(200).json({
      success: true,
      totalProfit,
      totalLoss,
      todayProfit,
      todayLoss,
      totalAmount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Route to get purchase history, getresult, name, and email
router.get("/details", verifyauthtoken, async (req, res) => {
  try {
    const userpurchases = await purchase.find({ UserId: req.payload._id });
    const userinfo = await user.find({ _id: req.payload._id });
    const getresult = await getCoinsData();
    const purchasehistory = userpurchases.length ? userpurchases[0].purchases : [];
    const name = userinfo.length ? userinfo[0].name : "";
    const email = userinfo.length ? userinfo[0].email : "";

    res.status(200).json({
      success: true,
      purchasehistory,
      getresult,
      name,
      email,
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