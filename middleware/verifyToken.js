const admin = require("../config/firebaseAdmin");

const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split("Bearer ")[1];

    if (!token) {
        return res.status(401).json({ 
            success: false,
            error: "Unauthorized: No token provided" 
        });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken; // Attach user data to request
        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        res.status(401).json({ 
            success: false,
            error: "Unauthorized: Invalid token" 
        });
    }
};

module.exports = verifyToken;
