const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true,

    },
    active: {
     type: Boolean,
     default: true,
     index: true,
    },
    password: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  }
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);