const express = require("express");
const router = express.Router();

const { verifyauthtoken } = require("../Middleware/authtoken");
const { getCoinsData } = require("../Middleware/latestCoins");
const user = require("../Models/User");
const purchase = require("../Models/Purchase");
// router.get("/dashboard", verifyauthtoken, async (req, res) => {
//   try {
//     const userpurchases = await purchase.find({ UserId: req.payload._id });
//     const userinfo = await user.find({ _id: req.payload._id });
//     if (userpurchases[0].purchases.length === 0) {
//       return res.status(200).json({
//         success: true,
//         totalloss: 0,
//         todayprofit: 0,
//         totalamount: userpurchases[0].cashBalance,
//       });
//     }
//     const getresult = await getCoinsData();
//     const today = new Date();
//     var todayprofit = 0;
//     var totalloss = 0;
//     userpurchases[0].purchases.map((purchase) => {
//       const timestamp = new Date(purchase.timestamp);
//       const timeDifference = today - timestamp;
//       const hoursDifference = timeDifference / (1000 * 60 * 60);
//       if (hoursDifference <= 24) {
//         todayprofit = todayprofit + purchase.purchasePrice;
//       }
//       totalloss = totalloss + purchase.purchasePrice;
//     });
//     if (totalloss > 0) {
//       totalloss = 0;
//     }
//     if (todayprofit < 0) {
//       todayprofit = 0;
//     }

//     res.status(200).json({
//       success: true,
//       totalloss,
//       todayprofit,
//       totalamount: userpurchases[0].cashBalance,
//       purchasehistory: userpurchases[0].purchases,
//       // getresult,
//       name: userinfo[0].name,
//       email: userinfo[0].email,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// });



// router.get("/dashboard", verifyauthtoken, async (req, res) => {
//   try {
//     const userpurchases = await purchase.find({ UserId: req.payload._id });
//     const userinfo = await user.find({ _id: req.payload._id });
    
//     if (userpurchases[0].purchases.length === 0) {
//       return res.status(200).json({
//         success: true,
//         totalloss: 0,
//         todayprofit: 0,
//         totalamount: userpurchases[0].cashBalance,
//       });
//     }

//     const today = new Date();
//     var todayprofit = 0;
//     var totalloss = 0;

//     userpurchases[0].purchases.forEach((purchase) => {
//       const timestamp = new Date(purchase.timestamp);
//       const timeDifference = today - timestamp;
//       const hoursDifference = timeDifference / (1000 * 60 * 60);
      
//       if (hoursDifference <= 24) {
//         // Assuming purchase object contains current price information
//         todayprofit += (purchase.currentPrice - purchase.purchasePrice) * purchase.quantity;
//       }
      
//       totalloss += (purchase.currentPrice - purchase.purchasePrice) * purchase.quantity;
//     });

//     if (totalloss > 0) {
//       totalloss = 0;
//     }
//     if (todayprofit < 0) {
//       todayprofit = 0;
//     }

//     res.status(200).json({
//       success: true,
//       totalloss,
//       todayprofit,
//       totalamount: userpurchases[0].cashBalance,
//       purchasehistory: userpurchases[0].purchases,
//       name: userinfo[0].name,
//       email: userinfo[0].email,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// });


router.get("/dashboard", verifyauthtoken, async (req, res) => {
  try {
    const userPurchases = await purchase.findOne({ UserId: req.payload._id });
    const userInfo = await user.findOne({ _id: req.payload._id });
    
    if (userPurchases.purchases.length === 0) {
      return res.status(200).json({
        success: true,
        totalloss: 0,
        todayprofit: 0,
        totalamount: userPurchases.cashBalance,
      });
    }

    const today = new Date();
    let todayProfit = 0;
    let totalLoss = 0;

    for (const purchase of userPurchases.purchases) {
      const timestamp = new Date(purchase.timestamp);
      const timeDifference = today - timestamp;
      const hoursDifference = timeDifference / (1000 * 60 * 60);
      let currentPrice = 0; // Placeholder for current price
      
      // Fetch current price from API or use stored value
      // Replace the following line with actual fetching logic
      // const currentPrice = await getCurrentPrice(purchase.assetId);

      if (hoursDifference <= 24) {
        // Assuming purchase object contains current price information
        todayProfit += (currentPrice - purchase.purchasePrice) * purchase.quantity;
      }
      
      totalLoss += (currentPrice - purchase.purchasePrice) * purchase.quantity;
    }

    // Ensure totalLoss is not positive
    if (totalLoss > 0) {
      totalLoss = 0;
    }
    // Ensure todayProfit is not negative
    if (todayProfit < 0) {
      todayProfit = 0;
    }

    res.status(200).json({
      success: true,
      totalloss: totalLoss,
      todayprofit: todayProfit,
      totalamount: userPurchases.cashBalance,
      purchasehistory: userPurchases.purchases,
      name: userInfo.name,
      email: userInfo.email,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


module.exports = router;
