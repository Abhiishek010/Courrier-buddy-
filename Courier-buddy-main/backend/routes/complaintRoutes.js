const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
    submitComplaint,
    getAllComplaints,
    updateComplaint,
    getMyComplaints
} = require("../controllers/complaintController");

// User routes
router.post("/submit",  authMiddleware, submitComplaint);
router.get("/mine",     authMiddleware, getMyComplaints);

// Admin routes
router.get("/all",           authMiddleware, roleMiddleware("admin"), getAllComplaints);
router.put("/update/:id",    authMiddleware, roleMiddleware("admin"), updateComplaint);

module.exports = router;
