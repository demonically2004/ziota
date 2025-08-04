const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: function() {
            // Username is required for regular registration (when no firebaseUID)
            return !this.firebaseUID;
        },
        unique: true,
        sparse: true // Allows multiple null values, but unique non-null values
    },
    email: { type: String, required: true, unique: true },
    password: {
        type: String,
        required: function() {
            // Password is required for regular registration (when no firebaseUID)
            return !this.firebaseUID;
        }
    },
    firebaseUID: { type: String, unique: true, sparse: true }, // For Firebase Authentication
    name: { type: String }, // Display name from Google/Firebase
    googleId: { type: String, default: null }, // For Google Login (legacy)

    // User data fields
    generalNotes: { type: String, default: '' },
    subjectNotes: {
        type: Object,
        default: {
            ANN: '',
            Python: '',
            Java: '',
            AI: '',
            Statistics: '',
            WT: ''
        }
    },
    subjects: [{
        id: String,
        name: String,
        icon: String
    }],
    subjectFiles: {
        type: Object,
        default: {}
    },
    images: [{ type: String }], // Array of Cloudinary URLs
    savedFiles: [{
        name: String,
        url: String,
        uploadDate: { type: Date, default: Date.now }
    }],
    isDarkMode: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("users", UserSchema);
