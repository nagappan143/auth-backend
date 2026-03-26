const express = require("express");
const router = express.Router();

const roleController = require("../controllers/role.controller");

// CRUD routes
router.post("/create", roleController.createRole);
router.get("/all", roleController.getRoles);
router.put("/update/:id", roleController.updateRole);
router.delete("/roles/:id", roleController.deleteRole);

module.exports = router;