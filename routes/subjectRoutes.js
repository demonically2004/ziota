const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const unifiedAuth = require('../middleware/unifiedAuth');

// Get subject data for a specific subject
router.get('/:subjectId', unifiedAuth, async (req, res) => {
  try {
    const { subjectId } = req.params;
    const userId = req.user.userId;

    console.log(`🔍 Getting subject data for user ID: ${userId}, subject: ${subjectId}`);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Get subject info from subjects array
    let subject = user.subjects?.find(s => s.id === subjectId);
    
    // If subject not found in user's subjects array, create default
    if (!subject) {
      subject = {
        id: subjectId,
        name: subjectId,
        icon: 'https://cdn-icons-png.flaticon.com/512/2104/2104069.png'
      };
    }

    // Get subject-specific data
    const subjectData = {
      subject: subject,
      notes: user.subjectNotes?.[subjectId] || '',
      files: user.subjectFiles?.[subjectId] || []
    };

    console.log(`✅ Subject data retrieved successfully for ${subjectId}`);
    res.json({
      success: true,
      data: subjectData
    });

  } catch (error) {
    console.error('❌ Error getting subject data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get subject data',
      error: error.message 
    });
  }
});

// Update subject data for a specific subject
router.put('/:subjectId', unifiedAuth, async (req, res) => {
  try {
    const { subjectId } = req.params;
    const userId = req.user.userId;
    const updateData = req.body;

    console.log(`💾 Updating subject data for user ID: ${userId}, subject: ${subjectId}`);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Initialize objects if they don't exist
    if (!user.subjectNotes) user.subjectNotes = {};
    if (!user.subjectFiles) user.subjectFiles = {};

    // Update notes if provided
    if (updateData.notes !== undefined) {
      user.subjectNotes[subjectId] = updateData.notes;
      user.markModified('subjectNotes');
    }

    // Update files if provided
    if (updateData.files !== undefined) {
      user.subjectFiles[subjectId] = updateData.files;
      user.markModified('subjectFiles');
    }

    // Update subject info if provided
    if (updateData.subject !== undefined) {
      if (!user.subjects) user.subjects = [];
      
      const existingSubjectIndex = user.subjects.findIndex(s => s.id === subjectId);
      if (existingSubjectIndex >= 0) {
        user.subjects[existingSubjectIndex] = updateData.subject;
      } else {
        user.subjects.push(updateData.subject);
      }
      user.markModified('subjects');
    }

    await user.save();

    console.log(`✅ Subject data updated successfully for ${subjectId}`);
    res.json({
      success: true,
      message: 'Subject data updated successfully'
    });

  } catch (error) {
    console.error('❌ Error updating subject data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update subject data',
      error: error.message 
    });
  }
});

// Delete a specific file from a subject
router.delete('/:subjectId/files/:fileId', unifiedAuth, async (req, res) => {
  try {
    const { subjectId, fileId } = req.params;
    const userId = req.user.userId;

    console.log(`🗑️ Deleting file ${fileId} from subject ${subjectId} for user ID: ${userId}`);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    if (!user.subjectFiles || !user.subjectFiles[subjectId]) {
      return res.status(404).json({ 
        success: false, 
        message: 'Subject files not found' 
      });
    }

    // Remove the file from the array
    user.subjectFiles[subjectId] = user.subjectFiles[subjectId].filter(
      file => file.id !== fileId
    );
    user.markModified('subjectFiles');

    await user.save();

    console.log(`✅ File deleted successfully from ${subjectId}`);
    res.json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting file:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete file',
      error: error.message 
    });
  }
});

// Get all files across all subjects for a user
router.get('/files/all', unifiedAuth, async (req, res) => {
  try {
    const userId = req.user.userId;

    console.log(`📁 Getting all files for user ID: ${userId}`);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const allFiles = [];
    if (user.subjectFiles) {
      Object.keys(user.subjectFiles).forEach(subjectId => {
        const subjectFiles = user.subjectFiles[subjectId] || [];
        subjectFiles.forEach(file => {
          allFiles.push({
            ...file,
            subjectId: subjectId
          });
        });
      });
    }

    console.log(`✅ Retrieved ${allFiles.length} files`);
    res.json({
      success: true,
      data: allFiles
    });

  } catch (error) {
    console.error('❌ Error getting all files:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get files',
      error: error.message 
    });
  }
});

module.exports = router;
