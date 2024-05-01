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
  "/otpmatching",
  [body("otp").notEmpty().withMessage("otp is required")],
  validateotpmatching,
  verifyauthtoken,
  verifyotptoken,
  async (req, res) => {
    try {
      const otpExists = await user.findById({ _id: req.payload._id });

      if (otpExists) {
        const decryptedOTP = decryptOTP(otpExists.otp);
        if (decryptedOTP === req.body.otp) {
          await user.findByIdAndUpdate(req.payload._id, {
            otp: { iv: null, encryptedData: null, expiry: null },
          });
          res.clearCookie("otpToken");
          const otpmatchToken = await generateotpmatching(req.params._id);
          const cookieOptions = {
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
          };
          res.cookie("otpmatchToken", otpmatchToken, cookieOptions);
          return res.status(200).json({
            success: true,
            message: {
              otp: [
                "OTP matches successfully continue to create new password.",
              ],
            },
          });
        } else {
          return res.status(400).json({
            success: false,
            message: {
              otp: ["OTP does not match. Try again."],
            },
          });
        }
      } else {
        return res.status(400).json({
          success: false,
          message: {
            otp: ["User with provided ID not found."],
          },
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Failed to match OTP.", error });
    }
  }
);

module.exports = router;
