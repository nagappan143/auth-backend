const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

//users
router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);
// router.post("/refresh", userController.refreshToken);
router.get("/users", authMiddleware, userController.getUsers);

module.exports = router;
