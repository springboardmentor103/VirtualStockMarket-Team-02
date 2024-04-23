const express = require("express");
const router = express.Router();
const Purchase = require('../models/Purchase');
const WatchList = require('../models/WatchList');

// Dashboard Route
router.post("/dashboard", (req, res) => {
    res.json({msg: "Welcome to the dashboard page"});
});

// Route to get monthly retail details
router.get('/monthlyRetail', async (req, res) => {
    try {
      // monthly retail detail
      res.status(200).json(monthlyRetail);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Route to get purchase information
router.get('/purchases', async (req, res) => {
    try {
      const purchases = await Purchase.find({}, 'userId status volume info');
      res.status(200).json(purchases);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Route to get watchList information
  router.get('/watchList', async (req, res) => {
    try {
      const watchList = await WatchList.find({}, 'companyName lastPrice change');
      res.status(200).json(watchList);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

module.exports = router;