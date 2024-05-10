const express = require("express");
const router = express.Router();
const axios = require("axios");
const { verifyauthtoken } = require("../Middleware/authtoken");
const user = require("../Models/User");
const purchase = require("../Models/Purchase");

// Route to get user purchase details
router.get("/purchase-details", verifyauthtoken, async (req, res) => {
  try {
    const purchaseUser = await purchase.findOne({ UserId: req.payload._id });
    const userinfo = await user.findOne({ _id: req.payload._id });
    
    if (!userinfo) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const name = userinfo.name;
    const email = userinfo.email;

    // Extract purchase details including cryptoSymbol, volume, and info
    const purchases = purchaseUser ? purchaseUser.purchases.map(purchase => {
      // Calculate transaction volume
      const volume = purchase.quantity * purchase.purchasePrice;

      return {
        id: purchase._id, // Assuming '_id' is the ID field of the purchase
        cryptoSymbol: purchase.cryptoSymbol, // Add crypto symbol
        status: purchase.status,
        volume: volume, // Add transaction volume
        info: purchase.info || "NIL" // Add additional information, if empty, default to "N/A"
      };
    }) : [];

    res.status(200).json({
      success: true,
      user: {
        name,
        email,
        purchases
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
