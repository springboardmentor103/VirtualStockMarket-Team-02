const mongoose = require("mongoose");
const { Schema } = mongoose;
const purchaseschema = new Schema({
  UserId: {
    type: String,
    required: true,
  },
  cashBalance: {
    type: Number,
    required: true,
    default: 10000,
  },
  purchases: {
    type: [
      {
        cryptoSymbol: {
          type: String,
        },
        assetId: {
          type: Number,
        },
        assetName: {
          type: String,
        },
        quantity: {
          type: Number,
        },
        purchasePrice: {
          type: Number,
        },
        timestamp: {
          type: Date,
        },
        purchasetype: {
          type: String,
        },
        purchasepercent: {
          type: Number,
        },
        status: {
          type: String,
        },
        info: {
          type: String,
        },
        volume: {
          type: Number,
        },
      },
    ],
    default: [],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("purchase", purchaseschema);
