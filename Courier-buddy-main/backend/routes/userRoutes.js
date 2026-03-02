const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const User = require("../models/User");
const { updateProfile } = require("../controllers/usercontroller");

// --------------------
// Ensure uploads folder exists
// --------------------
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// --------------------
// Multer setup
// --------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// --------------------
// Get Profile — fetch fresh from DB so rejectionReason is always current
// --------------------
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User profile fetched successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --------------------
// Reverify User
// --------------------
router.put(
  "/reverify",
  authMiddleware,
  upload.fields([
    { name: "selfie", maxCount: 1 },
    { name: "idCard", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      // ✅ Fixed: use selfieImage and collegeIdImage to match schema + admin panel
      if (req.files?.selfie) {
        user.selfieImage = "uploads/" + req.files.selfie[0].filename;
      }
      if (req.files?.idCard) {
        user.collegeIdImage = "uploads/" + req.files.idCard[0].filename;
      }

      // Reset verification status so admin sees it as a new pending request
      user.verificationStatus = "pending";
      user.rejectionReason = "";
      user.reverifyDeadline = null;

      await user.save();
      res.json({ message: "Reverification submitted successfully" });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }
);

console.log("User route loaded");

router.put("/update-profile", authMiddleware, updateProfile);
module.exports = router;