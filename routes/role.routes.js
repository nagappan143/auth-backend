const express = require("express");
const router = express.Router();

const roleController = require("../controllers/role.controller");

// CRUD routes
router.post("/create", roleController.createRole);
router.get("/all", roleController.getRoles);
router.put("/update/:id", roleController.updateRole);
router.put("/update-subrole/:id", roleController.updateSubRole);
router.delete("/delete-role/:id", roleController.deleteRole);
router.delete("/delete-subrole/:id", roleController.deleteSubRole);
// router.delete("/delete-role/:id", deleteRole);
module.exports = router;