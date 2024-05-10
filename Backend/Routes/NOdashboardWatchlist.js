const express = require("express");
const router = express.Router();
const { verifyauthtoken } = require("../Middleware/authtoken");
const HistoricalPrice = require('../Models/HistoricalPrice');
const getCurrentCryptoPrice = require("../Middleware/currentPrice");

// Route to get user's watchlist
router.get('/watchlist', verifyauthtoken, async (req, res) => {
  try {
    const coinData = [
      { cryptoSymbol: 'BTC' },
      { cryptoSymbol: 'ETH' },
      { cryptoSymbol: 'USDT' },
      { cryptoSymbol: 'BNB' },
      { cryptoSymbol: 'SOL' },
      { cryptoSymbol: 'USDC' },
      { cryptoSymbol: 'XRP' },
      { cryptoSymbol: 'DOGE' },
      { cryptoSymbol: 'ADA' }
    ];

    const watchlistData = await Promise.all(coinData.map(async (coin) => {
      try {
        const currentPrice = await getCurrentCryptoPrice(coin.cryptoSymbol);
        const previousPrice = await getPreviousPrice(coin.cryptoSymbol);
        let change = '-';
        if (previousPrice !== null) {
          change = currentPrice > previousPrice ? '+' : '-';
        }
        return {
          cryptoSymbol: coin.cryptoSymbol,
          currentPrice,
          change
        };
      } catch (error) {
        console.error(`Error fetching price for ${coin.cryptoSymbol}:`, error.message);
        return {
          cryptoSymbol: coin.cryptoSymbol,
          error: "Error fetching cryptocurrency price"
        };
      }
    }));

    res.status(200).json({
      success: true,
      watchlist: watchlistData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Helper function to retrieve previous price from the database
async function getPreviousPrice(cryptoSymbol) {
  try {
    const historicalPrice = await HistoricalPrice.findOne({ symbol: cryptoSymbol }).sort({ date: -1 });
    if (!historicalPrice) {
      return null;
    }
    return historicalPrice.price;
  } catch (error) {
    console.error("Error retrieving previous price:", error.message);
    throw new Error("Error retrieving previous price");
  }
}

module.exports = router;
