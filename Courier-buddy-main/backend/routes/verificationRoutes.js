const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { uploadVerification } = require("../controllers/verificationController");

router.post(
    "/submit",
    authMiddleware,
    upload.fields([
        { name: "selfie", maxCount: 1 },
        { name: "collegeId", maxCount: 1 }
    ]),
    uploadVerification
);

module.exports = router;
