
const express = require('express');
const router = express.Router();
const Purchase = require('../Models/Purchase');
const { getStockData } = require('../services/stockService');

router.post('/buy', async (req, res) => {
  try {
    const { stockName, quantity, price } = req.body;
    const totalAmount = quantity * price;

    const stockData = await getStockData(stockName);
    const currentPrice = stockData.quoteResponse.result[0].regularMarketPrice;
    
    const userID = req.user.id; 

    const purchase = new Purchase({
      userID,
      stockName,
      quantity,
      price: currentPrice,
      status: 'In Production',
      info: 'NIL'
    });

    await purchase.save();

    res.status(201).json({ message: 'Stock purchased successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/sell', async (req, res) => {
  try {
    const { stockName, quantity, price } = req.body;

    const stockData = await getStockData(stockName);
    const currentPrice = stockData.quoteResponse.result[0].regularMarketPrice;

    const userID = req.user.id;

    const purchase = await Purchase.findOne({ userID, stockName, status: 'In Production' });

    if (!purchase) {
      return res.status(404).json({ error: 'No stock available to sell' });
    }

    if (purchase.quantity < quantity) {
      return res.status(400).json({ error: 'Not enough quantity to sell' });
    }

    purchase.quantity -= quantity;
    await purchase.save();

    res.json({ message: 'Stock sold successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
