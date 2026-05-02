// const express = require("express");
// const router = express.Router();
// const userController = require("../controllers/userController");

// const authMiddleware = require("../middleware/authMiddleware");

// const {createCourses,getAllCourses,updateCourse,deleteCourse} = require("../controllers/CoursesController");
// const {
//   getRoles,
//   getUsersByRole,
//   getUserById, createRole,
// } = require("../controllers/RollsController");
// const upload = require("../middleware/upload");

// router.post(
//   "/upload-profile",
//   upload.single("image"),
//   async (req, res) => {
//     try {
//       const { userId } = req.body;

//       if (!req.file) {
//         return res.status(400).json({
//           success: false,
//           message: "No image uploaded",
//         });
//       }

//       const user = await User.findByIdAndUpdate(
//         userId,
//         { profileImage: req.file.path },
//         { new: true }
//       );

//       res.json({
//         success: true,
//         image: user.profileImage,
//       });

//     } catch (err) {
//       res.status(500).json({
//         success: false,
//         message: err.message,
//       });
//     }
//   }
// );

// // Roles list
// router.get("/roles", getRoles);

// router.post("/createRoles", createRole);

// // Users under role
// router.get("/roles/:roleId/users", getUsersByRole);

// // Single user details
// router.get("/users/:id", getUserById);

// //courses
// router.post("/create", createCourses);
// router.get("/all", getAllCourses);
// router.put("/update/:id", updateCourse);
// router.delete("/delete/:id", deleteCourse)

// //users
// router.post("/register", userController.createUser);
// router.post("/login", userController.loginUser);
// // router.post("/refresh", userController.refreshToken);
// router.get("/users", authMiddleware, userController.getUsers);
// router.put("/updateUser/:id", authMiddleware, userController.UpdateUser);
// router.delete("/deleteUser/:id", authMiddleware, userController.deleteUser);
// router.put("/add-new", userController.UserupdateAll);


// module.exports = router;



const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const User = require("../models/User"); // ✅ REQUIRED — was missing!

const { createCourses, getAllCourses, updateCourse, deleteCourse } =
  require("../controllers/CoursesController");
const { getRoles, getUsersByRole, getUserById, createRole } =
  require("../controllers/RollsController");

// ✅ Upload Profile Image
// POST http://localhost:5000/v1/api/users/upload-profile
router.post(
  "/upload-profile",
  upload.single("image"),
  async (req, res) => {
    try {
      const { userId } = req.body;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No image uploaded",
        });
      }

      // Normalize path for all OS (Windows backslash fix)
      const imagePath = req.file.path.replace(/\\/g, "/");

      const user = await User.findByIdAndUpdate(
        userId,
        { profileImage: imagePath },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        image: user.profileImage,
      });

    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
);

// Roles
router.get("/roles", getRoles);
router.post("/createRoles", createRole);
router.get("/roles/:roleId/users", getUsersByRole);
router.get("/users/:id", getUserById);

// Courses
router.post("/create", createCourses);
router.get("/all", getAllCourses);
router.put("/update/:id", updateCourse);
router.delete("/delete/:id", deleteCourse);

// Users
router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);
router.get("/users", authMiddleware, userController.getUsers);
router.put("/updateUser/:id", authMiddleware, userController.UpdateUser);
router.delete("/deleteUser/:id", authMiddleware, userController.deleteUser);
router.put("/add-new", userController.UserupdateAll);

module.exports = router;
