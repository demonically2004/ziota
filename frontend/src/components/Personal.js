import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import LazyImage from './LazyImage';
import axios from 'axios';
import '../styles/Personal.css';

const Personal = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [generalNotes, setGeneralNotes] = useState('');
  const [images, setImages] = useState([]);

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [subjects, setSubjects] = useState([
    { id: 'ANN', name: 'ANN', icon: '🧠' },
    { id: 'Python', name: 'Python', icon: '🐍' },
    { id: 'Java', name: 'Java', icon: '☕' },
    { id: 'AI', name: 'AI', icon: '🤖' },
    { id: 'Statistics', name: 'Statistics', icon: '📊' },
    { id: 'WT', name: 'WT', icon: '🌐' }
  ]);
  const fileInputRef = useRef(null);
  const imagePreviewRef = useRef(null);

  // Cloudinary configuration
  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dlcujlif7/upload";
  const CLOUDINARY_UPLOAD_PRESET = "personal_space";

  // Subject notes state
  const [subjectNotes, setSubjectNotes] = useState({
    ANN: '',
    Python: '',
    Java: '',
    AI: '',
    Statistics: '',
    WT: ''
  });





  useEffect(() => {
    // Check if user is authenticated (simple check like general notes)
    if (!AuthService.isAuthenticated()) {
      navigate('/');
      return;
    }

    // Get current user
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);

    // Load saved data
    loadSavedData();



    // Cleanup function to clear timeout on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [navigate]);

  // Load saved data from backend
  const loadSavedData = async () => {
    try {
      // Get fresh Firebase token (no localStorage)
      const token = await AuthService.getFirebaseToken();
      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

      if (!token) {
        console.error('❌ No valid token available');
        return;
      }

      // Load user data including notes and preferences
      const response = await axios.get(`${API_BASE_URL}/api/user/data`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const userData = response.data.data;
        console.log('📥 Loading user data:', userData);
        console.log('📝 Subject notes from backend:', userData.subjectNotes);

        // Load general notes
        setGeneralNotes(userData.generalNotes || '');

        // Load subjects if available
        if (userData.subjects && userData.subjects.length > 0) {
          console.log('📚 Loading subjects from backend:', userData.subjects);
          setSubjects(userData.subjects);
        } else {
          console.log('📚 Using default subjects');
        }

        // Load subject notes (simplified to match general notes pattern)
        console.log('📝 Subject notes from backend:', userData.subjectNotes);
        setSubjectNotes(userData.subjectNotes || {});

        // Load saved images
        setImages(userData.images || []);

        // Load theme preference
        setIsDarkMode(userData.isDarkMode || false);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
      // Set default values on error
      setGeneralNotes('');
      setSubjectNotes({});
      setImages([]);
      setIsDarkMode(false);
    }
  };

  const handleLogout = async () => {
    await AuthService.logout();
    navigate('/');
  };

  // Upload file to Cloudinary
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Upload failed:', error);
      return null;
    }
  };

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const imageUrl = await uploadToCloudinary(file);
    if (imageUrl) {
      const newImages = [...images, imageUrl];
      setImages(newImages);
      await saveUserData({ images: newImages });
    }
  };

  // Handle drag and drop
  const handleDrop = async (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    let newImages = [...images];

    for (const file of files) {
      if (file.type.startsWith('image/')) {
        const imageUrl = await uploadToCloudinary(file);
        if (imageUrl) {
          newImages.push(imageUrl);
        }
      }
    }

    if (newImages.length > images.length) {
      setImages(newImages);
      await saveUserData({ images: newImages });
    }
  };





  // Handle paste
  const handlePaste = async (event) => {
    const items = Array.from(event.clipboardData.items);
    let newImages = [...images];

    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        const imageUrl = await uploadToCloudinary(file);
        if (imageUrl) {
          newImages.push(imageUrl);
        }
      }
    }

    if (newImages.length > images.length) {
      setImages(newImages);
      await saveUserData({ images: newImages });
    }
  };

  // Save user data to backend
  const saveUserData = async (dataToUpdate) => {
    try {
      console.log('🔄 Saving data to backend:', dataToUpdate);
      setIsSaving(true);

      // Get fresh Firebase token (no localStorage)
      const token = await AuthService.getFirebaseToken();
      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

      if (!token) {
        console.error('❌ No valid token available for saving');
        return;
      }

      const response = await axios.put(`${API_BASE_URL}/api/user/data`, dataToUpdate, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Data saved successfully:', response.data);
    } catch (error) {
      console.error('❌ Failed to save user data:', error);
      console.error('❌ Error details:', error.response?.data);
    } finally {
      setIsSaving(false);
    }
  };

  // Debounced save function using useCallback and useRef
  const saveTimeoutRef = useRef(null);

  const debouncedSave = useCallback((dataToUpdate) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveUserData(dataToUpdate);
    }, 2000); // Increased to 2 seconds for better UX
  }, []);

  // Save subject notes (EXACT same pattern as working general notes)
  const saveSubjectNote = (subject, note) => {
    console.log(`💾 Saving note for ${subject}:`, note);

    // Update state immediately for UI responsiveness (same as general notes)
    const updatedNotes = { ...subjectNotes, [subject]: note };
    setSubjectNotes(updatedNotes);

    // Debounce the backend save (same as general notes)
    debouncedSave({ subjectNotes: updatedNotes });
  };

  // Save general notes
  const saveGeneralNotes = (notes) => {
    // Update state immediately for UI responsiveness
    setGeneralNotes(notes);

    // Debounce the backend save
    debouncedSave({ generalNotes: notes });
  };

  // Delete all images
  const deleteAllImages = async () => {
    setImages([]);
    await saveUserData({ images: [] });
  };

  // Delete individual image
  const deleteImage = async (indexToDelete) => {
    const newImages = images.filter((_, index) => index !== indexToDelete);
    setImages(newImages);
    await saveUserData({ images: newImages });
  };

  // Handle image double click to enlarge/shrink
  const handleImageDoubleClick = (imageUrl) => {
    if (enlargedImage === imageUrl) {
      setEnlargedImage(null);
    } else {
      setEnlargedImage(imageUrl);
    }
  };

  // Export general notes to Word document
  const exportToWord = () => {
    if (!generalNotes.trim()) {
      alert('No notes to export!');
      return;
    }

    const content = `
      <html>
        <head>
          <meta charset="utf-8">
          <title>General Notes</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
            h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
            p { margin-bottom: 15px; }
          </style>
        </head>
        <body>
          <h1>General Notes - ${user?.name || user?.username || 'User'}</h1>
          <p><strong>Exported on:</strong> ${new Date().toLocaleDateString()}</p>
          <div>${generalNotes.replace(/\n/g, '<br>')}</div>
        </body>
      </html>
    `;

    const blob = new Blob([content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `General_Notes_${new Date().toISOString().split('T')[0]}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Toggle theme
  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    await saveUserData({ isDarkMode: newTheme });
  };

  // Add new subject
  const addNewSubject = () => {
    const name = prompt('Enter subject name:');
    if (!name || name.trim() === '') return;

    const icon = prompt('Enter icon URL (or leave empty for default):') || 'https://cdn-icons-png.flaticon.com/512/2104/2104069.png';

    const newSubject = {
      id: name.replace(/\s+/g, '_'),
      name: name.trim(),
      icon: icon
    };

    const updatedSubjects = [...subjects, newSubject];
    setSubjects(updatedSubjects);

    // Add to subject notes
    const updatedSubjectNotes = { ...subjectNotes, [newSubject.id]: '' };
    setSubjectNotes(updatedSubjectNotes);

    // Save to backend
    saveUserData({
      subjects: updatedSubjects,
      subjectNotes: updatedSubjectNotes
    });
  };

  // Delete subject
  const deleteSubject = (subjectId) => {
    if (window.confirm(`Are you sure you want to delete the subject "${subjects.find(s => s.id === subjectId)?.name}"?`)) {
      const updatedSubjects = subjects.filter(s => s.id !== subjectId);
      setSubjects(updatedSubjects);

      // Remove from subject notes
      const updatedSubjectNotes = { ...subjectNotes };
      delete updatedSubjectNotes[subjectId];
      setSubjectNotes(updatedSubjectNotes);

      // Save to backend
      saveUserData({
        subjects: updatedSubjects,
        subjectNotes: updatedSubjectNotes
      });
    }
  };

  // Edit subject name
  const editSubjectName = (subjectId) => {
    const subject = subjects.find(s => s.id === subjectId);
    const newName = prompt('Enter new subject name:', subject.name);
    if (!newName || newName.trim() === '') return;

    const updatedSubjects = subjects.map(s =>
      s.id === subjectId ? { ...s, name: newName.trim() } : s
    );
    setSubjects(updatedSubjects);

    // Save to backend
    saveUserData({ subjects: updatedSubjects });
  };

  // Edit subject icon
  const editSubjectIcon = (subjectId) => {
    const subject = subjects.find(s => s.id === subjectId);
    const newIcon = prompt('Enter new icon URL:', subject.icon);
    if (!newIcon || newIcon.trim() === '') return;

    const updatedSubjects = subjects.map(s =>
      s.id === subjectId ? { ...s, icon: newIcon.trim() } : s
    );
    setSubjects(updatedSubjects);

    // Save to backend
    saveUserData({ subjects: updatedSubjects });
  };

  // Navigate to subject page
  const navigateToSubject = (subjectId) => {
    navigate(`/subject/${subjectId}`);
  };



  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`personal-container ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* Theme Toggle */}
      <button className="theme-toggle" onClick={toggleTheme}>
        <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i> Toggle Theme
      </button>

      <header>
        <h1>Welcome to Personal Dashboard, {user.username || user.name}!</h1>
        <div className="header-controls">
          {isSaving && <span className="saving-indicator">💾 Saving...</span>}
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      {/* Subject Cards Section */}
      <div className="container">
        {subjects.map((subject, index) => (
          <div key={subject.id} className={`box box-${index + 1}`}>
            <div className="subject-controls">
              <button
                className="edit-btn"
                onClick={() => editSubjectName(subject.id)}
                title="Edit name"
              >
                ✏️
              </button>
              <button
                className="edit-icon-btn"
                onClick={() => editSubjectIcon(subject.id)}
                title="Edit icon"
              >
                🖼️
              </button>
              <button
                className="delete-subject-btn"
                onClick={() => deleteSubject(subject.id)}
                title="Delete subject"
              >
                🗑️
              </button>
            </div>

            <div className="subject-content">
              <div className="cover">
                <div className="subject-icon">
                  {subject.icon}
                </div>
              </div>
              <button onClick={() => navigateToSubject(subject.id)}>
                {subject.name}
              </button>
            </div>

            <textarea
              className="image-notes"
              placeholder="Write your notes here..."
              value={subjectNotes[subject.id] || ''}
              onChange={(e) => {
                console.log(`🔍 Text changed for ${subject.id}:`, e.target.value);
                saveSubjectNote(subject.id, e.target.value);
              }}
            />
          </div>
        ))}

        {/* Add New Subject Card */}
        <div className="box add-subject-box">
          <div className="add-subject-content">
            <div className="add-icon">➕</div>
            <button onClick={addNewSubject} className="add-subject-btn">
              Add New Subject
            </button>
          </div>
        </div>
      </div>

      {/* Image Storage Section */}
      <div className="image-storage-container">
        <h2>Copy and Paste or Drag-and-Drop Images Here</h2>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        <button onClick={() => fileInputRef.current?.click()}>
          Choose File
        </button>
        <button className="delete-all-btn" onClick={deleteAllImages}>
          Delete All Images
        </button>
        <div
          className="image-preview"
          ref={imagePreviewRef}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onPaste={handlePaste}
          contentEditable={false}
        >
          {images.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>
              Paste or drop your images here...
            </p>
          ) : (
            images.map((imageUrl, index) => (
              <div key={index} className="image-container">
                <LazyImage
                  src={imageUrl}
                  alt={`Uploaded ${index}`}
                  className={`uploaded-image ${enlargedImage === imageUrl ? 'enlarged' : ''}`}
                  onDoubleClick={() => handleImageDoubleClick(imageUrl)}
                  title="Double-click to enlarge/shrink"
                />
                <button
                  className="delete-image-btn"
                  onClick={() => deleteImage(index)}
                  title="Delete this image"
                >
                  ❌
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* General Notes Section */}
      <div className="general-notes-container">
        <div className="notes-header">
          <h2>General Notes</h2>
          <button
            className="export-word-btn"
            onClick={exportToWord}
            title="Export notes to Word document"
          >
            📄 Export to Word
          </button>
        </div>
        <textarea
          className="general-notes"
          placeholder="Write your notes here..."
          value={generalNotes}
          onChange={(e) => saveGeneralNotes(e.target.value)}
        />


        <div className="word-count">
          Words: {generalNotes.split(/\s+/).filter(word => word.length > 0).length}
        </div>
      </div>


    </div>
  );
};

export default Personal;
