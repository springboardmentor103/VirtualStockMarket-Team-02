const express = require("express");
const router = express.Router();
const { verifyauthtoken } = require("../Middleware/authtoken");
const { getCoinData } = require("../Middleware/getCoinData");
const purchase = require("../Models/Purchase");

router.post("/buy", verifyauthtoken, async (req, res) => {
  try {
    const { cryptoSymbol, quantity } = req.body;
    if (!cryptoSymbol || cryptoSymbol.trim() === "") {
      return res.status(400).json({ success: false, message: "Crypto symbol is required" });
    }
    const getresult = await getCoinData([cryptoSymbol]);
    if (!getresult.data || !getresult.data[cryptoSymbol]) {
      return res.status(400).json({ success: false, message: "Invalid crypto symbol" });
    }
    const currentPrice = getresult.data[cryptoSymbol][0].quote.USD.price;

    let purchaseUser = await purchase.findOne({ UserId: req.payload._id });
    if (!purchaseUser) {
      // Create a new purchase record if not found
      purchaseUser = new purchase({
        UserId: req.payload._id,
        cashBalance: 1000, // Set default cash balance
        purchases: [],
      });
    }

    // Calculate total amount
    const totalAmount = currentPrice * quantity;
    if (purchaseUser.cashBalance < totalAmount) {
      return res.status(400).json({ success: false, message: "Not enough balance to buy" });
    }

    // Update the cash balance
    purchaseUser.cashBalance -= totalAmount;

    // Add purchase details
    purchaseUser.purchases.push({
      cryptoSymbol, // Add cryptoSymbol
      quantity,
      purchasePrice: currentPrice,
      timestamp: new Date(),
      purchasetype: "BUY",
      status: "COMPLETED", // Update status to COMPLETED
      info: "" // Add any additional information if needed
    });

    await purchaseUser.save();
    res.status(200).json({ success: true, message: "Purchase successful"});

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

router.post("/sell", verifyauthtoken, async (req, res) => {
  try {
    const { cryptoSymbol, quantity } = req.body;
    if (!cryptoSymbol || cryptoSymbol.trim() === "") {
      return res.status(400).json({ success: false, message: "Crypto symbol is required" });
    }
    const getresult = await getCoinData([cryptoSymbol]);
    if (!getresult.data || !getresult.data[cryptoSymbol]) {
      return res.status(400).json({ success: false, message: "Invalid crypto symbol" });
    }
    const currentPrice = getresult.data[cryptoSymbol][0].quote.USD.price;

    let purchaseUser = await purchase.findOne({ UserId: req.payload._id });
    if (!purchaseUser) {
      return res.status(400).json({ success: false, message: "User has no purchase record" });
    }

    // Calculate total amount
    const totalAmount = currentPrice * quantity;

    // Update the cash balance
    purchaseUser.cashBalance += totalAmount;

    // Add sale details
    purchaseUser.purchases.push({
      cryptoSymbol, // Add cryptoSymbol
      quantity,
      purchasePrice: currentPrice,
      timestamp: new Date(),
      purchasetype: "SELL",
      status: "COMPLETED", // Update status to COMPLETED
      info: "" // Add any additional information if needed
    });

    await purchaseUser.save();
    res.status(200).json({ success: true, message: "Sale successful" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

module.exports = router;

