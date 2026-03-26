const express = require("express");
const cors = require("cors");
require("dotenv").config();

const roleRoutes = require("./routes/role.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/roles", roleRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});