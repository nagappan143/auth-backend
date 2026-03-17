const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

const {createCourses,getAllCourses,updateCourse,deleteCourse} = require("../controllers/CoursesController");
const {
  getRoles,
  getUsersByRole,
  getUserById, createRole,
} = require("../controllers/RollsController");

// Roles list
router.get("/roles", getRoles);

router.post("/createRoles", createRole);

// Users under role
router.get("/roles/:roleId/users", getUsersByRole);

// Single user details
router.get("/users/:id", getUserById);

//courses
router.post("/create", createCourses);
router.get("/all", getAllCourses);
router.put("/update/:id", updateCourse);
router.delete("/delete/:id", deleteCourse)

//users
router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);
// router.post("/refresh", userController.refreshToken);
router.get("/users", authMiddleware, userController.getUsers);
router.put("/updateUser/:id", authMiddleware, userController.UpdateUser);
router.delete("/deleteUser/:id", authMiddleware, userController.deleteUser);
router.put("/add-new", userController.UserupdateAll);


module.exports = router;
