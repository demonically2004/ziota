import mongoose from 'mongoose';
import User from '../../models/Users.js';
import unifiedAuth from '../../middleware/unifiedAuth.js';

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }
  
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectDB();
    
    // Apply authentication middleware
    const authResult = await new Promise((resolve) => {
      unifiedAuth(req, res, (error) => {
        if (error) {
          resolve({ error });
        } else {
          resolve({ success: true });
        }
      });
    });

    if (authResult.error) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (req.method === 'GET') {
      // Get user data
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const userData = {
        generalNotes: user.generalNotes || '',
        subjectNotes: user.subjectNotes || {
          ANN: '', Python: '', Java: '', AI: '', Statistics: '', WT: ''
        },
        subjects: user.subjects || [],
        subjectFiles: user.subjectFiles || {},
        images: user.images || [],
        savedFiles: user.savedFiles || [],
        isDarkMode: user.isDarkMode || false
      };

      return res.status(200).json({ success: true, data: userData });
    }

    if (req.method === 'PUT') {
      // Update user data
      const allowedFields = ['generalNotes', 'subjectNotes', 'subjects', 'subjectFiles', 'images', 'savedFiles', 'isDarkMode'];
      const updateData = {};

      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      });

      const user = await User.findByIdAndUpdate(
        req.user.userId,
        updateData,
        { new: true, runValidators: true }
      );

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      return res.status(200).json({ success: true, message: 'User data updated successfully' });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });

  } catch (error) {
    console.error('❌ API Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
