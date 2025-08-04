const jwt = require('jsonwebtoken');
const admin = require('../config/firebaseAdmin');
const User = require('../models/Users');

// Unified authentication middleware that handles both JWT and Firebase tokens
const unifiedAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'No token provided' 
      });
    }

    // Try to verify as JWT token first (for traditional login)
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('🔍 JWT token verified for user ID:', decoded.userId);
      
      // Find user by ID from JWT
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          error: 'User not found' 
        });
      }
      
      // Attach user info to request
      req.user = {
        uid: user._id.toString(),
        userId: user._id,
        email: user.email,
        username: user.username,
        authType: 'jwt'
      };
      
      console.log('✅ JWT authentication successful');
      return next();
      
    } catch (jwtError) {
      console.log('🔍 JWT verification failed, trying Firebase token...');
      
      // If JWT fails, try Firebase token
      try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        console.log('🔍 Firebase token verified for UID:', decodedToken.uid);
        
        // Find user by Firebase UID
        const user = await User.findOne({ firebaseUID: decodedToken.uid });
        if (!user) {
          return res.status(401).json({ 
            success: false, 
            error: 'User not found' 
          });
        }
        
        // Attach user info to request
        req.user = {
          uid: decodedToken.uid,
          userId: user._id,
          email: decodedToken.email,
          name: decodedToken.name,
          authType: 'firebase'
        };
        
        console.log('✅ Firebase authentication successful');
        return next();
        
      } catch (firebaseError) {
        console.error('❌ Both JWT and Firebase token verification failed');
        console.error('JWT Error:', jwtError.message);
        console.error('Firebase Error:', firebaseError.message);
        
        return res.status(401).json({ 
          success: false, 
          error: 'Invalid token' 
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Authentication middleware error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Authentication error' 
    });
  }
};

module.exports = unifiedAuth;
