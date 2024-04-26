const mongoose = require("mongoose");
const { Schema } = mongoose;
const portfolioSchema = new Schema({
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cashBalance: {
      type: Number,
      required: true,
      default: 0,
    },
    totalInvestment: {
      type: Number,
      required: true,
      default: 0,
    },
    totalValue: {
      type: Number,
      required: true,
      default: 0,
    },
    holdings: [{
      symbol: String,
      quantity: Number,
      averagePrice: Number,
    }],
    performance: {
      type: Number,
      required: true,
      default: 0,
    },
    transactionHistory: [{
      type: Schema.Types.ObjectId,
      ref: "Transaction",
    }],
  });
  
  module.exports = mongoose.model("Portfolio", portfolioSchema);
  