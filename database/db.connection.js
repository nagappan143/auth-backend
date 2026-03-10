const mongoose = require("mongoose");
const config = require("../config/config");

const connectDB = async () => {
  try {

    await mongoose.connect(config.mongoURI);

    console.log("MongoDB Connected successfully!");

  } catch (error) {

    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);

  }
};

module.exports = connectDB;