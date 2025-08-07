require("dotenv").config(); // Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const helmet = require("helmet"); // ✅ Security middleware
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");


const app = express();

// ✅ Middleware
app.use(express.json()); // Parse JSON requests

// ✅ CORS Configuration for React Frontend
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        process.env.CLIENT_ORIGIN || 'http://localhost:3000',
        'https://ziota-datf03b4z-anxious2004s-projects.vercel.app',
        'https://zio-one.vercel.app',
        'https://zio.vercel.app',
        'https://zio1.vercel.app',
        /\.vercel\.app$/,
        // Allow any Vercel preview deployments
        /https:\/\/.*\.vercel\.app$/
    ],
    credentials: true, // Allow cookies and authentication headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions)); // Allow frontend requests

// ✅ Security Enhancements with CSP configuration
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            connectSrc: ["'self'", "https://*.vercel.app", "https://*.googleapis.com", "https://*.firebaseapp.com", "https://*.cloudinary.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://*.googleapis.com", "https://*.gstatic.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https://*.cloudinary.com", "https://*.googleapis.com"],
            manifestSrc: ["'self'"]
        },
    },
    crossOriginEmbedderPolicy: false
}));

// ✅ Additional CORS Security Headers
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    res.setHeader("Cross-Origin-Embedder-Policy", "credentialless");
    next();
});

// ✅ Ensure MongoDB URI is Provided
if (!process.env.MONGO_URI) {
    console.error("❌ ERROR: MONGO_URI is missing in .env file.");
    process.exit(1);
}

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => {
        console.error("❌ MongoDB Connection Failed:", err.message);
        process.exit(1);
    });

// Create Redis client
// ✅ Session Middleware (OAuth Requires This First)
app.use(session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false, // ✅ Prevent unnecessary session storage
    cookie: { secure: process.env.NODE_ENV === "production", httpOnly: true }
}));

// ✅ Passport Configuration
require("./middleware/auth"); // Ensure Passport OAuth is configured
app.use(passport.initialize());
app.use(passport.session());

// ✅ Import Routes
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courses");
const userDataRoutes = require("./routes/userDataRoutes");
const subjectRoutes = require("./routes/subjectRoutes");

app.use("/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/user", userDataRoutes);
app.use("/api/user/subject", subjectRoutes);

// ✅ Serve static files from the React frontend app (AFTER API routes)
if (process.env.NODE_ENV === 'production') {
    // Serve static files with proper headers
    app.use(express.static(path.join(__dirname, 'frontend/build'), {
        setHeaders: (res, path) => {
            if (path.endsWith('.js')) {
                res.setHeader('Content-Type', 'application/javascript');
            } else if (path.endsWith('.css')) {
                res.setHeader('Content-Type', 'text/css');
            }
        }
    }));

    // Handle React routing, return all non-API requests to React app
    app.get('*', function(req, res) {
        // Don't serve index.html for API routes or static files
        if (req.path.startsWith('/api/') || req.path.startsWith('/auth/') || req.path.includes('.')) {
            return res.status(404).send('Not Found');
        }
        res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
    });
}

// ✅ Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// ✅ Sample File Storage (Local file paths)
const FILES = {
    java_notes: {
        path: path.join(__dirname, 'public', 'files', 'cse_core', 'Exp6_aj2fjl.docx'),
        name: 'Java_Notes.docx',
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    },
    java_books: {
        path: path.join(__dirname, 'public', 'files', 'cse_core', 'exp5_ansh.pdf'),
        name: 'Java_Books.pdf',
        type: 'application/pdf'
    },
    python_notes: {
        path: path.join(__dirname, 'public', 'files', 'cse_core', 'exp5_ansh.pdf'),
        name: 'Python_Notes.pdf',
        type: 'application/pdf'
    }
};

// ✅ API to Fetch File URLs (Local file serving)
app.get("/get-files", async (req, res) => {
    try {
        // Set CORS headers for file downloads
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

        let fileLinks = {};
        for (const key in FILES) {
            if (!FILES[key]) {
                return res.status(404).json({ error: `File ${key} not found` });
            }
            // Return local download URLs
            fileLinks[key] = `${req.protocol}://${req.get('host')}/download-file/${key}`;
        }
        res.json(fileLinks);
    } catch (error) {
        console.error("❌ File Fetch Error:", error);
        res.status(500).json({ error: "Server error while fetching files" });
    }
});

// ✅ Local file download endpoint
app.get("/download-file/:fileKey", async (req, res) => {
    try {
        const fileKey = req.params.fileKey;
        const fileConfig = FILES[fileKey];

        if (!fileConfig) {
            return res.status(404).json({ error: `File ${fileKey} not found` });
        }

        console.log(`📥 Serving local file: ${fileKey} from ${fileConfig.path}`);

        // Check if file exists
        if (!fs.existsSync(fileConfig.path)) {
            console.error(`❌ File not found on disk: ${fileConfig.path}`);
            return res.status(404).json({ error: `File ${fileKey} not found on server` });
        }

        // Set proper headers for file download
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.header('Content-Type', fileConfig.type);
        res.header('Content-Disposition', `attachment; filename="${fileConfig.name}"`);

        // Stream the file
        const fileStream = fs.createReadStream(fileConfig.path);

        fileStream.on('error', (error) => {
            console.error(`❌ Error reading file ${fileConfig.path}:`, error);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Error reading file' });
            }
        });

        fileStream.pipe(res);

        console.log(`✅ File ${fileKey} served successfully`);

    } catch (error) {
        console.error("❌ Download error:", error);
        if (!res.headersSent) {
            res.status(500).json({ error: "Server error while downloading file" });
        }
    }
});

// ✅ API Health Check Route
app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        message: "Ziota Backend API is running",
        timestamp: new Date().toISOString()
    });
});


// For local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}

// Export for Vercel
module.exports = app;

