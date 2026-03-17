const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      required: true
    },

    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
      index: true
    },

    active: {
      type: Boolean,
      default: true,
      index: true
    },

    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {}
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);