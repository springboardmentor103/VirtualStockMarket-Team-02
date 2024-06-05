const mongoose = require("mongoose");

const emailVerificationSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  verificationToken: { type: String, required: true },
  verificationTokenExpiry: { type: Date, required: true },
});

const EmailVerification = mongoose.model(
  "EmailVerification",
  emailVerificationSchema
);

module.exports = EmailVerification;
