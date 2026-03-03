require("dotenv").config();

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");   // import db connection
const User = require("./models/User");
const bcrypt = require("bcryptjs");


dotenv.config();

const seedAdmin = async () => {
    try {
        const adminExists = await User.findOne({ email: "admin@example.com" });
        if (!adminExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash("demoadmin", salt);
            await User.create({
                name: "Admin",
                email: "admin@example.com",
                password: hashedPassword,
                hostel: "Admin Hostel",
                role: "admin"
            });
            console.log("Admin user created: ");
        }
    } catch (error) {
        console.error("Error seeding admin:", error);
    }
};

    const startServer = async () => {
    await connectDB();   // connect to MongoDB
    await seedAdmin();  // seed admin user
const app = express();
        
// Middleware must come before routes
app.use(cors({
  origin: "*"
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));


// connect routes to server.js
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");
const verificationRoutes = require("./routes/verificationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const complaintRoutes = require("./routes/complaintRoutes");

app.use("/api/complaints", complaintRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/verify", verificationRoutes);
app.use("/api/admin", adminRoutes);


app.get("/", (req, res) => {
    res.send("API running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
};

startServer();
