const mongoose = require("mongoose");

const subRoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: true }); 

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },

  roles: [subRoleSchema] 
}, { timestamps: true });

module.exports = mongoose.model("Role", roleSchema);