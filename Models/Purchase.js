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
    default: 1000,
  },
  purchases: {
    type: [
      {
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
        status: {
          type: String,
        },
        Info: {
          type: String,
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