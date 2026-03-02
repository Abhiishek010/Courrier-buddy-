const Delivery = require("../models/Delivery");
const User = require("../models/User");



// ✅ Create Delivery
exports.createDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.create({
      ...req.body,
      postedBy: req.user.id,
      status: "pending"
    });

    res.status(201).json(delivery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Get all active deliveries
exports.getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find({
      $or: [
        { status: "pending" },
        { acceptedBy: req.user.id },   // User B deliveries
        { postedBy: req.user.id }      // User A deliveries
      ]
    })
    .populate("postedBy", "_id name email phone profilePhoto")
    .populate("acceptedBy", "_id name email phone profilePhoto");

    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ✅ Accept Delivery
// ✅ Accept Delivery
exports.acceptDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    if (delivery.status !== "pending") {
      return res.status(400).json({ message: "Already accepted or cancelled" });
    }

    // 🔥 STEP: Check verification
    const user = await User.findById(req.user.id);

    if (!user.isVerified || user.verificationStatus !== "approved") {
      return res.status(403).json({
        message: "Please verify your account to accept deliveries and earn."
      });
    }

    // ✅ Set accepted
    delivery.status = "accepted";
    delivery.acceptedBy = req.user.id;

    // ✅ Get accepter (User B)
    const accepter = await User.findById(req.user.id);

    // 🔥 Save accepter details inside delivery
    delivery.accepterName = accepter.name;
    delivery.accepterPhone = accepter.phone;
    delivery.accepterProfile = accepter.profilePhoto || "";

    // ✅ Get owner (User A)
const owner = await User.findById(delivery.postedBy);

// 🔥 Save full owner details for User B
delivery.ownerName = owner.name;
delivery.ownerPhone = owner.phone;
delivery.ownerProfile = owner.profilePhoto || "";

    await delivery.save();

    console.log("✅ Delivery accepted & saved");

    res.json({
      message: "Delivery accepted successfully",
      delivery
    });

  } catch (error) {
    console.error("ACCEPT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};



// ✅ Mark Delivered
exports.markDelivered = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    // ✅ Only delivery owner (User A) marks delivered
    if (delivery.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    delivery.status = "delivered";
    await delivery.save();

    res.json({ message: "Marked as delivered", delivery });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ✅ Cancel Delivery (only creator, only pending)
exports.cancelDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    console.log("🔥 Logged user:", req.user);
    console.log("🔥 Logged user ID:", req.user?.id);
    console.log("🔥 Logged user _id:", req.user?._id);
    console.log("🔥 Delivery postedBy:", delivery.postedBy);

    if (delivery.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    delivery.status = "cancelled";
    await delivery.save();

    res.json({ message: "Delivery cancelled successfully" });

  } catch (error) {
    console.error("CANCEL ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ STEP: Mark Not Delivered (only courier)
exports.markNotDelivered = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    // ✅ Only accepted courier can mark not delivered
    if (!delivery.acceptedBy || delivery.acceptedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // ✅ Only accepted deliveries can be changed
    if (delivery.status !== "accepted") {
      return res.status(400).json({ message: "Cannot update this delivery" });
    }

    delivery.status = "not_delivered";
    await delivery.save();

    res.json({ message: "Marked as not delivered", delivery });

  } catch (error) {
    console.error("NOT DELIVERED ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


