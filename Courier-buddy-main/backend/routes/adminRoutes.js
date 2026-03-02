const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
    getPendingUsers,
    approveUser,
    rejectUser,
    blockUser,
    unblockUser,
    getAllUsers
} = require("../controllers/adminController");

router.get("/pending-users", authMiddleware, roleMiddleware("admin"), getPendingUsers);
router.put("/approve/:id",   authMiddleware, roleMiddleware("admin"), approveUser);
router.put("/reject/:id",    authMiddleware, roleMiddleware("admin"), rejectUser);
router.put("/block/:id",     authMiddleware, roleMiddleware("admin"), blockUser);
router.put("/unblock/:id",   authMiddleware, roleMiddleware("admin"), unblockUser);
router.get("/all-users",     authMiddleware, roleMiddleware("admin"), getAllUsers);

module.exports = router;
