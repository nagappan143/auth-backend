const Course = require("../models/Course");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");



exports.createCourses = async (req, res) => {
  try {

    const courses = req.body.courses;


    if (!Array.isArray(courses)) {
      return res.status(400).json({ success: false, message: "Courses must be an array" });
    }

    if (courses.length === 0) {
      return res.status(400).json({ success: false, message: "Courses array cannot be empty" });
    }

    const savedCourses = await Course.insertMany(courses);

    res.status(201).json({ success: true, message: "Courses added successfully", data: savedCourses });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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

exports.getAllCourses = asyncHandler(async (req, res) => {

  const courses = await Course.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses
  });

});


exports.updateCourse = async (req, res) => {
  try {

    const { id } = req.params;

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.status(200).json({
      success: true, message: "Course updated successfully", data: updatedCourse
    }); 

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {

    const { id } = req.params;

    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return res.status(404).json({ success: false, message: "Course not found" });                     
    }

    res.status(200).json({ success: true, message: "Course deleted successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
