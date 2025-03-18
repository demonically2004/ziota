require("dotenv").config();  // Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());  // Middleware to parse JSON
app.use(cors({ origin: "*" }));  // ✅ Allow frontend requests

// ✅ Ensure MongoDB URI exists
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
    console.error("❌ ERROR: MONGO_URI is missing in .env file.");
    process.exit(1);
}

// ✅ Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => {
        console.error("❌ MongoDB Connection Failed:", err.message);
        process.exit(1);
    });

// ✅ Import Routes
try {
    const courseRoutes = require("./routes/courses");
    const authRoutes = require("./routes/authRoutes");

    // ✅ Use Routes
    app.use("/api/courses", courseRoutes);
    app.use("/api/auth", authRoutes);
} catch (err) {
    console.error("❌ ERROR: Unable to load routes:", err.message);
    process.exit(1);
}

// ✅ Basic Route for Server Health Check
app.get("/", (req, res) => {
    res.send("🚀 Ziota API is Running!");
});

// ✅ Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
