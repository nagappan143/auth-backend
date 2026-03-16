const User = require("../models/User");
const Course = require("../models/Course");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");


const generateTokens = (user) => {

  const accessToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "30m" })

  const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "8h" });

  return { accessToken, refreshToken };
}

exports.createUser = async (req, res) => {
  try {

    const { name, email, phone, password } = req.body;

    const existingUser = await User.findOne({ email: email }).lean();

    // console.log(existingUser instanceof mongoose.Document);
    // console.log("existingUser", existingUser);
    

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Please provide a valid email address" });
    }

    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters long and contain only letters and numbers" });
    }

    const phoneRegex =/^\+?[0-9\s\-]{10,15}$/;

    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ success: false, message: "Phone number must be exactly 10 digits and contain only numbers" });
    }

    const user = new User({ name, email, phone, password: hashedPassword });

    const savedUser = await user.save();

    res.status(201).json({ success: true, message: "User registered successfully", data: savedUser });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.UpdateUser = async (req, res) => {
  try {

    const { id } = req.params;

    const { name, email, phone, password } = req.body;

    // const user = await User.findById({ _id: id, active: true });
    const updateData = {};

    // if (!user) {
    //   return res.status(404).json({ success: false, message: "User not found" });
    // }

    if (email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;

      if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: "Please provide a valid email address" });
      }

    updateData.email = email;
    }

    if (phone) {
    const phoneRegex =/^\+?[0-9\s\-]{10,15}$/;

      if (!phoneRegex.test(phone)) {
        return res.status(400).json({ success: false, message: "Please provide a valid phone number" });
      }
      updateData.phone = phone;
    }

    //   if (name) {
    //   user.name = name;
    // }

    if (name) {
      const nameRegex = /^[A-Za-z0-9]+$/;

      if (!nameRegex.test(name)) {
        return res.status(400).json({ success: false, message: "Name must contain only letters and numbers (no spaces allowed)" });
      }

      updateData.name = name;
    }

    if (password) {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

      if (!passwordRegex.test(password)) {
        return res.status(400).json({ success: false, message: "Password must be at least 8 characters long and contain only letters and numbers" });
      }
      
      const hashedPassword = await bcrypt.hash(password, 8);
      updateData.password = hashedPassword;
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: id},
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(201).json({ success: true, message: "User updated successfully", data: updatedUser });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.UserupdateAll = async (req, res) => {
  try {

    const updateFields = req.body;

    if (!Object.keys(updateFields).length) {
      return res.status(400).json({
        success: false,
        message: "No fields provided for update"
      });
    }

    const updatedUsers = await User.updateMany(
      { active: true },
      { $set: updateFields },
      { runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Users updated successfully",
      data: updatedUsers
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



exports.deleteUser = async (req, res) => {
  try {

    const { id } = req.params;

    // const user = await User.findById({ _id: id, active: true });

    const user = await User.findOne({ _id: id, active: true });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const deletedUser = await User.findOneAndUpdate({ _id: id, active: true }, { $set: { active: false } }, { new: true });

    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "User not deleted" });
    }

    res.status(200).json({ success: true, message: "User deleted successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.loginUser = async (req, res) => {

  try {

    const { loginId, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: loginId },{ name: loginId },{ phone: loginId }]});

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid Password, Please Enter Valid Password" });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    res.status(200).json({ success: true, accessToken, refreshToken, data: user });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }

};


// exports.refreshToken = (req, res) => {

//     const { refreshToken } = req.body;

//     if (!refreshToken) { 
//         return res.status(401).json({ success: false, message: "Refresh token required" }); 
//     }

//     jwt.verify(refreshToken, process.env.JWT_SECRET, (err, user) => {

//         if (err) { 
//             return res.status(403).json({ success: false, message: "Invalid refresh token" });
//         }

//         const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "30m" } );

//         res.json({ success: true, accessToken });
//     });

// };

exports.getUsers = async (req, res) => {
  try {

    const users = await User.find();

    if (!users || users.length === 0) {
      return res.status(404).json({ success: false, message: "No users found" });
    }

    res.status(200).json({ success: true, message: "Users fetched successfully", data: users });

  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch users", error: error.message });
  }
};

// exports.getAllCourses = async (req, res) => {
//   try {

//     const courses = await Course.find().sort({ createdAt: -1 });

//     res.status(200).json({ success: true, count: courses.length, data: courses });

//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };



// exports.updateCourse = async (req, res) => {
//   try {

//     const { id } = req.params;

//     const updatedCourse = await Course.findByIdAndUpdate(
//       id,
//       req.body,
//       { new: true, runValidators: true }
//     );

//     if (!updatedCourse) {
//       return res.status(404).json({ success: false, message: "Course not found" });
//     }

//     res.status(200).json({
//       success: true, message: "Course updated successfully", data: updatedCourse
//     });

//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// exports.deleteCourse = async (req, res) => {
//   try {

//     const { id } = req.params;

//     const deletedCourse = await Course.findByIdAndDelete(id);

//     if (!deletedCourse) {
//       return res.status(404).json({ success: false, message: "Course not found" });
//     }

//     res.status(200).json({ success: true, message: "Course deleted successfully" });

//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

