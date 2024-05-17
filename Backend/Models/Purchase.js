const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  purchases: [{
    assetId: {
      type: Number,
      required: true
    },
    assetName: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    purchasePrice: {
      type: Number,
      required: true
    },
    sellPrice: {
      type: Number
    },
    type: {
      type: String,
      enum: ['BUY', 'SELL'], // Ensure type is either 'BUY' or 'SELL'
      required: true
    }
  }]
});

const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;
