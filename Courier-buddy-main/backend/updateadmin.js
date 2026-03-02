require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

mongoose.connect(process.env.MONGO_URI);

async function updateAdmin() {
  try {
    const newPassword = "StrongAdmin@2026"; // 🔐 change this

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const admin = await User.findOneAndUpdate(
      { email: "admin@example.com" },
      { password: hashedPassword },
      { new: true }
    );

    if (!admin) {
      console.log("Admin not found");
    } else {
      console.log("Admin password updated successfully ✅");
    }

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit();
  }
}

updateAdmin();