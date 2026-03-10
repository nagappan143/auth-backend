require("dotenv").config();

const config = {

  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGO_URI || "mongodb://localhost:27017/test",
  jwtSecret: process.env.JWT_SECRET || "defaultsecret"

};

module.exports = config;