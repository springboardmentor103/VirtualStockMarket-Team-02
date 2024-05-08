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
  [
    body("otp").notEmpty().withMessage("otp is required"),
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid Email format"),
  ],
  validateotpmatching,
  verifyauthtoken,
  // verifyotptoken,
  async (req, res) => {
    try {
      const { email, otp } = req.body;
      console.log("Called");
      const otpExists = await user.findOne({ email });
      console.log("details", email, otp, otpExists);
      if (otpExists) {
        const decryptedOTP = decryptOTP(otpExists.otp);
        console.log(
          "decrypted otp",
          typeof decryptedOTP,
          typeof otp,
          decryptedOTP === otp
        );
        if (decryptedOTP === otp) {
          const updatedUser = await user.findOneAndUpdate(
            { email },
            {
              otp: { iv: null, encryptedData: null, expiry: null },
            }
          );
          console.log("updatedUser", updatedUser);
          if (!updatedUser) {
            return res.status(400).json({
              success: true,
              message: {
                error: ["Error while updating user details."],
              },
            });
          }
          // res.clearCookie("otpToken");
          // console.log(req.payload._id);
          // const otpmatchToken = await generateotpmatching(req.payload._id);
          // console.log(otpmatchToken);
          // const cookieOptions = {
          //   httpOnly: true,
          //   maxAge: 60 * 60 * 1000,
          // };
          // res.cookie("otpmatchToken", otpmatchToken, cookieOptions);
          // console.log("otpmatchToken", req.cookies.otpmatchToken);
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
      res.status(500).json({
        success: false,
        message: "Failed to match OTP.",
        error: error,
      });
    }
  }
);

module.exports = router;
