const mongoose = require("mongoose");
require("dotenv").config();
const mongourl = process.env.MONGO_URL;

const mongodb = async () => {
  try {
    await mongoose.connect(mongourl);
      //console.log("MongoDB connected successfully.");
    } catch (err) {
      console.log(err);
    }
};

module.exports = mongodb;
