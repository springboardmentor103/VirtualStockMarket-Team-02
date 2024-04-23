const mongoose = require('mongoose');

const watchListSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true
  },
  lastPrice: {
    type: Number,
    required: true
  },
  change: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('WatchList', watchListSchema);
