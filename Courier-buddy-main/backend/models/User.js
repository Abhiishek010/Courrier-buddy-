const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

  phone: {
  type: String,
  required: true,
},

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

  
    hostel: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    profilePhoto: {
      type: String,
      default: "",
    },

    collegeIdPhoto: {
      type: String,
      default: "",
    },

  verificationStatus: {
  type: String,
  enum: ["pending", "approved", "rejected"],
  default: "pending"
},

rejectionReason: {
  type: String,
  default: ""
},

rejectionCount: {
  type: Number,
  default: 0
},

reverifyDeadline: {
  type: Date
},

editCount: {
  type: Number,
  default: 0
},

  isBlocked: {
    type: Boolean,
    default: false
  },

    rating: {
      type: Number,
      default: 5,
    },

    totalDeliveries: {
      type: Number,
      default: 0,
    },

    selfieImage: {
      type: String
    },

    collegeIdImage: {
      type: String
    },

    isVerified: {
      type: Boolean,
      default: false
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
