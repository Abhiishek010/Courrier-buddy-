const Complaint = require("../models/Complaint");

// Submit a new complaint (user)
exports.submitComplaint = async (req, res) => {
    try {
        const { userName, userPhone, issueType, accepterName, accepterPhone, productDetails } = req.body;

        if (!userName || !userPhone || !issueType || !accepterName || !accepterPhone || !productDetails) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const complaint = await Complaint.create({
            userId: req.user.id,
            userName,
            userPhone,
            issueType,
            accepterName,
            accepterPhone,
            productDetails
        });

        res.status(201).json({ message: "Complaint submitted successfully", complaint });
    } catch (error) {
        console.error("Submit complaint error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get all complaints (admin)
exports.getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find().sort({ createdAt: -1 });
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update complaint status + admin note (admin)
exports.updateComplaint = async (req, res) => {
    try {
        const { status, adminNote } = req.body;
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) return res.status(404).json({ message: "Complaint not found" });

        if (status) complaint.status = status;
        if (adminNote !== undefined) complaint.adminNote = adminNote;
        await complaint.save();

        res.json({ message: "Complaint updated", complaint });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user's own complaints
exports.getMyComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
