const express = require("express");
const router = express.Router();
const user = require("../Models/User");
const { body } = require("express-validator");
const crypto = require("crypto");
const {
  verifyotptoken,
  generateotpmatching,
  verifyauthtoken,
} = require("../Middleware/authtoken");
const { validateotpmatching } = require("../Middleware/validate");

const decryptOTP = (encryptedOTP) => {
  const algorithm = "aes-256-cbc";
  const key = crypto
    .createHash("sha256")
    .update(process.env.ENCRYPTION_KEY)
    .digest("hex")
    .slice(0, 32);
  if (!encryptedOTP.iv) {
    return null;
  }
  const iv = Buffer.from(encryptedOTP.iv, "hex");
  const encryptedText = Buffer.from(encryptedOTP.encryptedData, "hex");

  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

router.post(
  "/otpmatching/:userId",
  [
    body("otp").notEmpty().withMessage("OTP is required"),
  ],
  validateotpmatching,
  verifyauthtoken,
  verifyotptoken,
  async (req, res) => {
    try {
      const userRecord = await user.findById(req.params.userId);

      if (!userRecord) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      const decryptedOTP = decryptOTP(userRecord.otp);
      if (decryptedOTP === req.body.otp) {
        await user.findByIdAndUpdate(req.params.userId, {
          otp: { iv: null, encryptedData: null, expiry: null },
        });
        res.clearCookie("otpToken");
        const otpmatchToken = await generateotpmatching(req.params.userId);
        const cookieOptions = {
          httpOnly: true,
          maxAge: 60 * 60 * 1000,
        };
        res.cookie("otpmatchToken", otpmatchToken, cookieOptions);
        return res.status(200).json({
          success: true,
          message: "OTP matches successfully. Continue to create a new password.",
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "OTP does not match. Try again.",
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to match OTP.",
        error: error.message,
      });
    }
  }
);

module.exports = router;

