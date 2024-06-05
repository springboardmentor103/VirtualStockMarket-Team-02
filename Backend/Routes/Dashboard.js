
const express = require("express");
const router = express.Router();
const { verifyauthtoken } = require("../Middleware/authtoken");
const user = require("../Models/User"); // Import the user model
const purchase = require("../Models/Purchase");

router.get("/dashboard", verifyauthtoken, async (req, res) => {
  try {
    const purchaseUser = await purchase.findOne({ UserId: req.payload._id });
    const userinfo = await user.findOne({ _id: req.payload._id });

    if (!userinfo) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const name = userinfo.name;
    const email = userinfo.email;
    const color = userinfo.profilepiccolor;

    let purchases = [];
    if (purchaseUser) {
      purchases = await Promise.all(
        purchaseUser.purchases.map(async (purchase) => {
          const volume = purchase.quantity * purchase.purchasePrice;
          return {
            id: purchase._id,
            cryptoSymbol: purchase.cryptoSymbol,
            cryptoname: purchase.assetName,
            purchaseType: purchase.purchasetype,
            status: purchase.status,
            volume: volume,
            quantity: purchase.quantity,
            info: purchase.info || "NIL",
            percent: purchase.purchasepercent,
            timestamp: purchase.timestamp,
          };
        })
      );
    }

    res.status(200).json({
      success: true,
      user: {
        name,
        email,
        color,
        purchases,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;