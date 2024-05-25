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
<<<<<<< HEAD
          type: String,
=======
          type: String
>>>>>>> 465c35f9ce83da72e5252f6a7cfebdc2f5c3993d
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
<<<<<<< HEAD
        purchasepercent: {
          type: Number,
        },
=======
>>>>>>> 465c35f9ce83da72e5252f6a7cfebdc2f5c3993d
        status: {
          type: String,
        },
        info: {
          type: String,
        },
        volume: {
          type: Number,
<<<<<<< HEAD
        },
=======
        }
>>>>>>> 465c35f9ce83da72e5252f6a7cfebdc2f5c3993d
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
