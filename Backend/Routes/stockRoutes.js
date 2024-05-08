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
    const currentprice = getresult.data[cryptoSymbol][0].quote.USD.price;

    const purchaseuser = await purchase.findOne({ UserId: req.payload._id });
    if (!purchaseuser) {
      // Create a new purchase record if not found
      const purchaseuser = new purchase({
        UserId: req.payload._id,
        cashBalance: 1000, // Set default cash balance
        purchases: [],
      });
      await purchaseuser.save();
      return res.status(200).json({ success: true, message: "User has no purchase record. Created a new one." });
    }

    if (typeof purchaseuser.cashBalance !== "number") {
      return res.status(400).json({ success: false, message: "Invalid cash balance" });
    }

    const totalamount = currentprice * quantity;
    if (purchaseuser.cashBalance < totalamount) {
      return res.status(400).json({ success: false, message: "Not enough balance to buy" });
    }
     // Update the cash balance
     purchaseuser.cashBalance -= totalamount;
     await purchaseuser.save();
 
     res.status(200).json({ success: true, message: "Purchase successful" });

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
    const currentprice = getresult.data[cryptoSymbol][0].quote.USD.price;

    const purchaseuser = await purchase.findOne({ UserId: req.payload._id });
    if (!purchaseuser) {
      return res.status(400).json({ success: false, message: "User has no purchase record" });
    }

    if (typeof purchaseuser.cashBalance !== "number") {
      return res.status(400).json({ success: false, message: "Invalid cash balance" });
    }
  
    // Update the cash balance
    purchaseuser.cashBalance += currentprice * quantity;
    await purchaseuser.save();

    res.status(200).json({ success: true, message: "Sale successful" });
    
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

module.exports = router;