const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true
  },
  stockName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'In Production'
  },
  info: {
    type: String,
    default: 'NIL'
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Purchase', purchaseSchema);
