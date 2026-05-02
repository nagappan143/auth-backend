// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");

// const config = require("./config/config");
// const connectDB = require("./database/db.connection");

// const userRoutes = require("./routes/userRoutes");

// const app = express();

// connectDB();

// app.use(cors());
// app.use(express.json());

// app.get("/", (req, res) => {
//   res.status(200).json({ success: true, message: "Backend API Running!" });
// });

// app.use("/v1/api/users", userRoutes);
// // app.use("/uploads", express.static("uploads"));


// app.use((req, res) => {
//   res.status(404).json({ success: false, message: "Route not found" });
// });

// app.listen(config.port, () => {
//   console.log(`Server running on port ${config.port}`);
// });

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const config = require("./config/config");
const connectDB = require("./database/db.connection");
const userRoutes = require("./routes/userRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// ✅ Serve uploaded images publicly
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Backend API Running!" });
});

app.use("/v1/api/users", userRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});