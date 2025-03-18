const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth"); // ✅ Import the middleware
const Course = require("../models/Courses"); // ✅ Import the Course model

// Use the middleware in your route
router.post("/enroll", authMiddleware, async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user.id; // authMiddleware should add `req.user`

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        course.students.push(userId);
        await course.save();

        res.status(200).json({ message: "Enrollment successful!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
