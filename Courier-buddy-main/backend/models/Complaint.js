const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
    // Submitted by (logged in user)
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    userName: { type: String, required: true },
    userPhone: { type: String, required: true },

    // Issue details
    issueType: {
        type: String,
        enum: ["wrong_item", "not_delivered", "damaged", "late_delivery", "stolen", "other"],
        required: true
    },

    // Accepter info
    accepterName: { type: String, required: true },
    accepterPhone: { type: String, required: true },

    // Product details
    productDetails: { type: String, required: true },

    // Status — admin can update
    status: {
        type: String,
        enum: ["open", "in_review", "resolved"],
        default: "open"
    },

    // Admin notes
    adminNote: { type: String, default: "" }

}, { timestamps: true });

module.exports = mongoose.model("Complaint", complaintSchema);
