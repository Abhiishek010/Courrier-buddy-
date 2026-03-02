const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


/* =====================================================
   LOGIN USER
===================================================== */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // ✅ ADD THIS — block check
if (user.isBlocked) {
  return res.status(403).json({ message: "Your account has been blocked. Please contact support." });
}

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send response
    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone, // ✅ REQUIRED FOR DELIVERY FEATURE
        role: user.role,
        verificationStatus: user.verificationStatus
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/* =====================================================
   REGISTER USER
===================================================== */
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, hostel, phone } = req.body;

    console.log("Registration request:", { name, email, hostel, phone });

    // Validate
    if (!name || !email || !password || !hostel || !phone) {
      return res.status(400).json({
        message: "All fields including phone number are required"
      });
    }

    // Optional: phone validation
    if (phone.length < 10) {
      return res.status(400).json({
        message: "Invalid phone number"
      });
    }

    // Check existing user
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      hostel,
      phone, // ✅ mandatory
    });

    console.log("User created:", user._id);

    res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
