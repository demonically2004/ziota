const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const admin = require('../config/firebaseAdmin');

// Middleware to verify Firebase token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

// Get user data
router.get('/data', verifyToken, async (req, res) => {
  try {
    console.log('🔍 Getting user data for:', req.user.uid);
    
    const user = await User.findOne({ firebaseUID: req.user.uid });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    // Return user data (excluding sensitive fields)
    const userData = {
      generalNotes: user.generalNotes || '',
      subjectNotes: user.subjectNotes || {
        ANN: '', Python: '', Java: '', AI: '', Statistics: '', WT: ''
      },
      subjects: user.subjects || [],
      images: user.images || [],
      savedFiles: user.savedFiles || [],
      isDarkMode: user.isDarkMode || false
    };

    console.log('✅ User data retrieved successfully');
    res.json({ success: true, data: userData });
    
  } catch (error) {
    console.error('❌ Error getting user data:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error',
      details: error.message 
    });
  }
});

// Update user data
router.put('/data', verifyToken, async (req, res) => {
  try {
    console.log('🔍 Updating user data for:', req.user.uid);
    console.log('🔍 Data to update:', req.body);
    
    const user = await User.findOne({ firebaseUID: req.user.uid });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    // Update only the provided fields
    const allowedFields = ['generalNotes', 'subjectNotes', 'subjects', 'images', 'savedFiles', 'isDarkMode'];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();
    
    console.log('✅ User data updated successfully');
    res.json({ success: true, message: 'User data updated successfully' });
    
  } catch (error) {
    console.error('❌ Error updating user data:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error',
      details: error.message 
    });
  }
});

// Delete user images
router.delete('/images', verifyToken, async (req, res) => {
  try {
    console.log('🔍 Deleting all images for:', req.user.uid);
    
    const user = await User.findOne({ firebaseUID: req.user.uid });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    user.images = [];
    await user.save();
    
    console.log('✅ All images deleted successfully');
    res.json({ success: true, message: 'All images deleted successfully' });
    
  } catch (error) {
    console.error('❌ Error deleting images:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error',
      details: error.message 
    });
  }
});

module.exports = router;
