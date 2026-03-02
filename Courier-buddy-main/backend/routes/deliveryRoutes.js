const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
    createDelivery,
    getAllDeliveries,
    acceptDelivery,
    markDelivered,
    markNotDelivered,
    cancelDelivery
} = require("../controllers/deliveryController");



router.post("/create", authMiddleware, createDelivery);
router.put("/cancel/:id", authMiddleware, cancelDelivery);
router.get("/", authMiddleware, getAllDeliveries);
router.put("/accept/:id", authMiddleware, acceptDelivery);
router.put("/deliver/:id", authMiddleware, markDelivered);
router.put("/not-delivered/:id", authMiddleware, markNotDelivered);


module.exports = router;
