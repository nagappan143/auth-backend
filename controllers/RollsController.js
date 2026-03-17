const mongoose = require("mongoose");
const Role = require("../models/Rolls");
const User = require("../models/User");

const createRole = async (req, res) => {
  try {

    const { name, roles } = req.body;
    // name = "Admin"
    // roles = ["Create User", "Delete User"]

    if (!name || !Array.isArray(roles)) {
      return res.status(400).json({
        success: false,
        message: "Name and roles array required"
      });
    }

    // find role group
    let roleGroup = await Role.findOne({ name });

    // create if not exists
    if (!roleGroup) {
      roleGroup = new Role({ name, roles: [] });
    }

    // push roles into array
    roles.forEach(roleName => {
      roleGroup.roles.push({ name: roleName });
    });

    await roleGroup.save();

    res.status(201).json({
      success: true,
      message: "Roles added successfully",
      data: roleGroup
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



const getRoles = async (req, res) => {
  try {

    const roles = await Role.find().select("name");

    res.status(200).json({ success: true, count: roles.length, data: roles });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }

};

const getUsersByRole = async (req, res) => {
  try {

    const { roleId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(roleId)) {
      return res.status(400).json({ success: false, message: "Invalid roleId format" });
    }

    const role = await Role.findById(roleId);

    if (!role) {
      return res.status(404).json({ success: false, message: "Role not found" });
    }

    const users = await User.find({ roleId })
      .populate("roleId", "name")
      .select("-password");

    res.status(200).json({ success: true, role: role.name, count: users.length, data: users });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }

};

const getUserById = async (req, res) => {
  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid user id" });
    }

    const user = await User.findById(id)
      .populate("roleId", "name")
      .select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }

};


module.exports = { getRoles, getUsersByRole, getUserById,createRole };