const express = require("express");
const router = express.Router();
const Purchase = require('../Models/Purchase');

  // Route to get purchase information
  router.get('/purchases', async (req, res) => {
    try {
      const purchases = await Purchase.find({}, 'userId status price info');
      res.status(200).json(purchases);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

module.exports = router;
