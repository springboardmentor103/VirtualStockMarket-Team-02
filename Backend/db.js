<<<<<<< HEAD
// db.js
const mongoose = require("mongoose");

const mongodb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

module.exports = mongodb;

=======
// db.js
const mongoose = require("mongoose");

const mongodb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

module.exports = mongodb;

>>>>>>> 465c35f9ce83da72e5252f6a7cfebdc2f5c3993d
