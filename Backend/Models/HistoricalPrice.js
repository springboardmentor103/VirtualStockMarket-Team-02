const mongoose = require('mongoose');

const historicalPriceSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});

const HistoricalPrice = mongoose.model('HistoricalPrice', historicalPriceSchema);

module.exports = HistoricalPrice;