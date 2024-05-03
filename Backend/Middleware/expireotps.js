const cron = require("node-cron");
const user = require("../Models/User");
const scheduleOTPExpirationCheck = () => {
  cron.schedule("* * * * * *", async () => {
    const newDate = new Date().getTime();
    const usersWithIVAndEncryptedData = await user.find({
      "otp.expiry": { $exists: true, $ne: null },
    });
    await Promise.all(
      usersWithIVAndEncryptedData.map(async (value, index) => {
        if (value.otp.expiry.getTime() - newDate < 0) {
          await user.updateOne(
            { _id: value._id },
            { otp: { iv: null, encryptedData: null, expiry: null } }
          );
        }
      })
    );
  });
};

module.exports = scheduleOTPExpirationCheck;
