const mongoose = require("mongoose");
const { Schema } = mongoose;
const userschema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    iv: {
      type: String,
      default: null,
    },
    encryptedData: {
      type: String,
      default: null,
    },
    expiry: {
      type: Date,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("user", userschema);
