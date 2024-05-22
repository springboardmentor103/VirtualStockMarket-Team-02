const mongoose = require("mongoose");
const { Schema } = mongoose;

const userschema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    // required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmpassword: {
    type: String,
    // required: true,
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
  accountLocked: {
    type: Boolean,
    default: false, // Initially, the account is not locked
  },
  failedLoginAttempts: {
    type: Number,
    default: 0, // Number of failed login attempts
  },
  lastFailedLoginAttempt: {
    type: Date,
    default: null, // Timestamp of the last failed login attempt
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("user", userschema);
