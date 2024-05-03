const mongoose = require("mongoose");
require("dotenv").config();
const mongourl = process.env.MONGO_URL;

const mongodb = async () => {
  await mongoose
    .connect(mongourl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(async () => {
      console.log("MongoDB connected successfully");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = mongodb;
