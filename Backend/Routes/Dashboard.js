const express = require("express");
const router = express.Router();
const { verifyauthtoken } = require("../Middleware/authtoken");
const User = require("../Models/User"); // Import the user model
const Purchase = require("../Models/Purchase");

router.get("/dashboard", verifyauthtoken, async (req, res) => {
  try {
    const purchaseUser = await Purchase.findOne({ UserId: req.payload._id });
    const userinfo = await User.findOne({ _id: req.payload._id });
    
    if (!userinfo) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const name = userinfo.name;
    const email = userinfo.email;

    const purchases = purchaseUser ? purchaseUser.purchases.map(purchase => {
      const volume = purchase.quantity * purchase.purchasePrice;

      return {
        id: purchase._id,
        cryptoSymbol: purchase.cryptoSymbol,
        purchaseType: purchase.purchasetype,
        status: purchase.status,
        volume: volume,
        info: purchase.info || "NIL",
        timestamp: purchase.timestamp 
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
