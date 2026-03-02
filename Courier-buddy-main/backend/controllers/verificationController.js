const User = require("../models/User");

exports.uploadVerification = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        user.selfieImage = req.files.selfie[0].path;
        user.collegeIdImage = req.files.collegeId[0].path;
        user.verificationStatus = "pending";  // ← is this line there?
        user.rejectionReason = "";             // ← is this line there?
        user.reverifyDeadline = null;          // ← is this line there?

        await user.save();

        res.json({ message: "Verification submitted" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};