const User = require("../models/User");

exports.getPendingUsers = async (req, res) => {
    try {
        const users = await User.find({ verificationStatus: "pending" });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.approveUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        user.verificationStatus = "approved";
        user.isVerified = true;
        user.rejectionReason = "";
        user.reverifyDeadline = null;
        await user.save();
        res.json({ message: "User approved" });
    } catch (error) {
        console.error("Approve error:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.rejectUser = async (req, res) => {
    try {
        console.log("BODY:", req.body);
        const { reason } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        user.verificationStatus = "rejected";
        user.isVerified = false;
        user.rejectionReason = reason || "";
        user.rejectionCount += 1;
        user.reverifyDeadline = new Date(Date.now() + 12 * 60 * 60 * 1000);
        await user.save();
        res.json({ message: "User rejected successfully" });
    } catch (error) {
        console.error("Reject error:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.blockUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.role === "admin") return res.status(403).json({ message: "Cannot block an admin account" });
        user.isBlocked = true;
        await user.save();
        res.json({ message: "User blocked successfully" });
    } catch (error) {
        console.error("Block error:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.unblockUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        user.isBlocked = false;
        await user.save();
        res.json({ message: "User unblocked successfully" });
    } catch (error) {
        console.error("Unblock error:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.uploadVerification = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.selfieImage = req.files.selfie[0].path;
        user.collegeIdImage = req.files.collegeId[0].path;
        user.verificationStatus = "pending";
        user.rejectionReason = "";
        user.reverifyDeadline = null;
        user.isVerified = false;
        await user.save();
        res.json({ message: "Verification submitted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
