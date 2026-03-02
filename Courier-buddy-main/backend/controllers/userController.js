// ✅ Edit user profile (max 3 times)
const User = require("../models/User");
exports.updateProfile = async (req, res) => {
  try {
    const { email, phone } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Limit check
    if (user.editCount >= 3) {
      return res.status(400).json({
        message: "You have reached the maximum edit limit (3 times)"
      });
    }

    // Optional: prevent same update
    if (email === user.email && phone === user.phone) {
      return res.status(400).json({
        message: "No changes detected"
      });
    }

    // ✅ Update
    user.email = email;
    user.phone = phone;
    user.editCount += 1;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      editCount: user.editCount
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};