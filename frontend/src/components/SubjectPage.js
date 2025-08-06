import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import axios from 'axios';
import '../styles/SubjectPage.css';

const SubjectPage = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [subject, setSubject] = useState(null);
  const [files, setFiles] = useState([]);
  const [notes, setNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  // Cloudinary configuration
  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dlcujlif7/upload";
  const CLOUDINARY_UPLOAD_PRESET = "personal_space";

  // Test Cloudinary connection and upload preset
  const testCloudinaryConnection = async () => {
    console.log('🧪 Testing Cloudinary upload capabilities...');

    // Test different resource types
    const tests = [
      { type: 'auto', name: 'Auto detection test' },
      { type: 'raw', name: 'Raw files test' },
      { type: 'image', name: 'Image files test' }
    ];

    for (const test of tests) {
      try {
        const testBlob = new Blob(['test content'], { type: 'text/plain' });
        const testFile = new File([testBlob], 'test.txt', { type: 'text/plain' });

        const testFormData = new FormData();
        testFormData.append('file', testFile);
        testFormData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        testFormData.append('resource_type', test.type);

        const response = await fetch(CLOUDINARY_URL, {
          method: 'POST',
          body: testFormData
        });

        const data = await response.json();
        console.log(`🧪 ${test.name} (${test.type}):`, data.error ? 'FAILED' : 'SUCCESS');

        if (data.error) {
          console.log(`   Error: ${data.error.message}`);
        }
      } catch (error) {
        console.log(`🧪 ${test.name} (${test.type}): ERROR -`, error.message);
      }
    }
  };

  useEffect(() => {
    // Check authentication
    if (!AuthService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
    loadSubjectData();

    // Test Cloudinary connection
    testCloudinaryConnection();
  }, [subjectId, navigate]);





  // Load subject data from backend
  const loadSubjectData = async () => {
    try {
      const token = await AuthService.getApiToken();
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

      console.log('🔍 Using token for API call:', token ? `${token.substring(0, 20)}...` : 'No token');

      if (!token) {
        console.error('❌ No valid token available');
        // Load subject data from localStorage as fallback
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const localSubjects = userData.subjects || [];
        const localSubject = localSubjects.find(s => s.id === subjectId);

        if (localSubject) {
          setSubject(localSubject);
          setNotes(userData.subjectNotes?.[subjectId] || '');
          console.log('📱 Loaded subject data from localStorage');
        } else {
          setSubject({
            name: subjectId,
            icon: '📚',
            id: subjectId
          });
        }
        return;
      }
      
      const response = await axios.get(`${API_BASE_URL}/api/user/subject/${subjectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const data = response.data.data;
        setSubject(data.subject);
        setFiles(data.files || []);
        setNotes(data.notes || '');
      }
    } catch (error) {
      console.error('Failed to load subject data:', error);

      // Try to load from localStorage as fallback
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const localSubjects = userData.subjects || [];
      const localSubject = localSubjects.find(s => s.id === subjectId);

      if (localSubject) {
        setSubject(localSubject);
        setNotes(userData.subjectNotes?.[subjectId] || '');
        console.log('📱 Loaded subject data from localStorage fallback');
      } else {
        // Final fallback - create basic subject
        setSubject({ id: subjectId, name: subjectId, icon: '📚' });
        setNotes('');
      }
      setFiles([]);
    }
  };

  // Save data to backend
  const saveSubjectData = async (dataToUpdate) => {
    try {
      setIsSaving(true);
      const token = await AuthService.getApiToken();
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

      if (!token) {
        console.error('❌ No valid token available for saving');
        return;
      }

      console.log('🔄 Saving subject data:', dataToUpdate);
      await axios.put(`${API_BASE_URL}/api/user/subject/${subjectId}`, dataToUpdate, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Subject data saved successfully');
    } catch (error) {
      console.error('❌ Failed to save subject data:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Debounced save for notes
  const saveTimeoutRef = useRef(null);
  const debouncedSaveNotes = (newNotes) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      saveSubjectData({ notes: newNotes });
    }, 2000);
  };

  // Handle notes change
  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    debouncedSaveNotes(newNotes);
  };

  // Upload file to Cloudinary (with multiple strategies for PDFs)
  const uploadToCloudinary = async (file) => {
    console.log('📤 Uploading file to Cloudinary:', {
      name: file.name,
      type: file.type,
      size: file.size,
      isPDF: file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    });

    // Try multiple upload strategies
    const strategies = [
      // Strategy 1: Auto resource type (works for most files)
      () => createUploadFormData(file, 'auto'),
      // Strategy 2: Raw resource type for documents
      () => createUploadFormData(file, 'raw', true),
      // Strategy 3: Image resource type (sometimes PDFs are treated as images)
      () => createUploadFormData(file, 'image')
    ];

    for (let i = 0; i < strategies.length; i++) {
      const strategy = strategies[i];
      const strategyName = ['auto', 'raw', 'image'][i];

      try {
        console.log(`📤 Trying strategy ${i + 1}: ${strategyName}`);
        const formData = strategy();
        const result = await attemptUpload(formData, file);
        if (result) {
          console.log(`✅ Upload successful with strategy: ${strategyName}`);
          return result;
        }
      } catch (error) {
        console.log(`❌ Strategy ${strategyName} failed:`, error.message);
        if (i === strategies.length - 1) {
          // Last strategy failed
          alert(`Upload failed: ${error.message}`);
        }
      }
    }

    return null;
  };

  // Create form data for different upload strategies
  const createUploadFormData = (file, resourceType, addFlags = false) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('resource_type', resourceType);

    // Don't add 'type' parameter for unsigned uploads - it's not allowed

    if (addFlags && resourceType === 'raw') {
      formData.append('flags', 'attachment');
      // Add custom public_id for better organization
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      formData.append('public_id', `documents/${Date.now()}_${sanitizedName}`);
    }

    return formData;
  };

  // Attempt upload with given form data
  const attemptUpload = async (formData, file) => {

    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    console.log('📤 Cloudinary response:', data);

    if (data.secure_url) {
      console.log('✅ File uploaded successfully to Cloudinary');
      return {
        url: data.secure_url,
        publicId: data.public_id,
        originalName: file.name,
        fileType: file.type || 'application/octet-stream',
        fileSize: file.size
      };
    } else {
      console.error('❌ Cloudinary upload failed:', data);
      if (data.error) {
        throw new Error(data.error.message || 'Upload failed');
      }
      throw new Error('Upload failed - no secure URL returned');
    }
  };

  // Handle file upload
  const handleFileUpload = async (selectedFiles) => {
    console.log('🔍 handleFileUpload called with:', selectedFiles);

    if (!selectedFiles || selectedFiles.length === 0) {
      console.log('❌ No files to upload');
      return;
    }

    console.log('📁 Starting file upload for', selectedFiles.length, 'files');
    console.log('📁 Current isUploading state:', isUploading);

    setIsUploading(true);
    console.log('📁 Set isUploading to true');

    const newFiles = [...files];
    console.log('📁 Current files array:', newFiles.length, 'files');

    let successCount = 0;
    let failCount = 0;

    for (const file of selectedFiles) {
      try {
        console.log('📄 Processing file:', file.name, 'Type:', file.type, 'Size:', file.size);
        const uploadResult = await uploadToCloudinary(file);
        if (uploadResult) {
          const fileData = {
            id: Date.now() + Math.random(),
            name: uploadResult.originalName,
            url: uploadResult.url,
            publicId: uploadResult.publicId,
            type: uploadResult.fileType,
            size: uploadResult.fileSize,
            uploadDate: new Date().toISOString()
          };
          console.log('✅ File processed successfully:', fileData);
          newFiles.push(fileData);
          successCount++;
        } else {
          console.error('❌ Failed to upload file:', file.name);
          failCount++;
        }
      } catch (error) {
        console.error('❌ Error processing file:', file.name, error);
        failCount++;
      }
    }

    console.log(`📊 Upload summary: ${successCount} successful, ${failCount} failed`);
    console.log('💾 Saving', newFiles.length, 'files to backend');

    try {
      setFiles(newFiles);
      await saveSubjectData({ files: newFiles });
      console.log('✅ Files saved to backend successfully');

      // Show success message
      if (successCount > 0) {
        alert(`✅ Successfully uploaded ${successCount} file(s)${failCount > 0 ? ` (${failCount} failed)` : ''}`);
      } else if (failCount > 0) {
        alert(`❌ Failed to upload ${failCount} file(s). Please try again.`);
      }
    } catch (error) {
      console.error('❌ Failed to save files to backend:', error);
      alert('❌ Files uploaded to Cloudinary but failed to save to database. Please refresh and try again.');
    }

    setIsUploading(false);
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    console.log('🔍 File input change event triggered');
    console.log('🔍 Event target:', e.target);
    console.log('🔍 Files from event:', e.target.files);

    if (!e.target.files || e.target.files.length === 0) {
      console.log('❌ No files selected');
      return;
    }

    const files = Array.from(e.target.files);
    console.log('📁 Files selected:', files.map(f => ({
      name: f.name,
      type: f.type,
      size: f.size,
      lastModified: f.lastModified
    })));

    // Detailed analysis of each file
    files.forEach((file, index) => {
      console.log(`🔍 File ${index + 1} detailed analysis:`);
      console.log(`   Name: ${file.name}`);
      console.log(`   Type: ${file.type}`);
      console.log(`   Size: ${file.size} bytes (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
      console.log(`   Last Modified: ${new Date(file.lastModified)}`);
      console.log(`   Is PDF by extension: ${file.name.toLowerCase().endsWith('.pdf')}`);
      console.log(`   Is PDF by MIME type: ${file.type === 'application/pdf'}`);

      // Check if file is too large (Cloudinary free tier has limits)
      if (file.size > 10 * 1024 * 1024) { // 10MB
        console.warn(`⚠️ File ${file.name} is large (${(file.size / 1024 / 1024).toFixed(2)} MB) - might hit upload limits`);
      }

      // Check if file has unusual characteristics
      if (!file.type) {
        console.warn(`⚠️ File ${file.name} has no MIME type - browser couldn't detect it`);
      }
    });

    // Check for PDFs specifically
    const pdfFiles = files.filter(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
    if (pdfFiles.length > 0) {
      console.log('📄 PDF files detected:', pdfFiles.map(f => f.name));
    }

    // Check if upload is already in progress
    if (isUploading) {
      console.log('⚠️ Upload already in progress, ignoring new files');
      return;
    }

    console.log('🚀 Starting file upload process...');
    handleFileUpload(files);
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🔍 Files dropped');
    const droppedFiles = Array.from(e.dataTransfer.files);
    console.log('📁 Dropped files:', droppedFiles.map(f => ({
      name: f.name,
      type: f.type,
      size: f.size
    })));

    // Check for PDFs in dropped files
    const pdfFiles = droppedFiles.filter(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
    if (pdfFiles.length > 0) {
      console.log('📄 PDF files dropped:', pdfFiles.map(f => f.name));
    }

    handleFileUpload(droppedFiles);
  };

  // Delete file
  const deleteFile = async (fileId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        const token = await AuthService.getApiToken();
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

        if (token) {
          // Try to delete from backend first
          await axios.delete(`${API_BASE_URL}/api/user/subject/${subjectId}/files/${fileId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log('✅ File deleted from backend');
        }
      } catch (error) {
        console.error('❌ Failed to delete file from backend:', error);
        // Continue with local deletion even if backend fails
      }

      // Update local state
      const updatedFiles = files.filter(file => file.id !== fileId);
      setFiles(updatedFiles);
      await saveSubjectData({ files: updatedFiles });
    }
  };

  // Download file (handle Cloudinary authentication issues)
  const downloadFile = async (file) => {
    console.log('📥 Downloading file:', file.name, 'from URL:', file.url);

    try {
      // Method 1: Create a public download URL by modifying the Cloudinary URL
      let downloadUrl = file.url;

      if (file.url.includes('cloudinary.com')) {
        // For Cloudinary URLs, we need to make them public and add download flags
        // Replace /upload/ with /upload/fl_attachment/ to force download
        downloadUrl = file.url.replace('/upload/', '/upload/fl_attachment/');

        // Also try to make it public by removing any private flags
        downloadUrl = downloadUrl.replace('/image/upload/', '/image/upload/');
        downloadUrl = downloadUrl.replace('/raw/upload/', '/raw/upload/');

        console.log('🔄 Modified Cloudinary URL:', downloadUrl);
      }

      // Try direct download first
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = file.name;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('✅ Direct download attempted');

    } catch (error) {
      console.error('❌ Direct download failed:', error);

      // Fallback: Try to fetch with no-cors mode
      try {
        console.log('🔄 Trying alternative download method...');

        // Create a simple download URL without authentication requirements
        let simpleUrl = file.url;

        // Remove any version parameters that might cause auth issues
        simpleUrl = simpleUrl.split('?')[0];

        // Try opening in new window with download intent
        const newWindow = window.open(simpleUrl, '_blank');

        if (newWindow) {
          console.log('✅ Opened file in new window');
          // Give user instructions
          setTimeout(() => {
            alert(`File opened in new tab. To download:\n1. Right-click on the file\n2. Select "Save As..."\n3. Save with filename: ${file.name}`);
          }, 1000);
        } else {
          throw new Error('Popup blocked');
        }

      } catch (fallbackError) {
        console.error('❌ All download methods failed:', fallbackError);

        // Final fallback: Copy URL to clipboard and show instructions
        try {
          navigator.clipboard.writeText(file.url);
          alert(`Download failed due to Cloudinary permissions.\n\nThe file URL has been copied to your clipboard:\n${file.url}\n\nPlease paste it in a new browser tab to access the file.`);
        } catch (clipboardError) {
          alert(`Download failed due to Cloudinary permissions.\n\nPlease copy this URL and paste it in a new browser tab:\n${file.url}`);
        }
      }
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get file icon based on type (enhanced with distinctive icons)
  const getFileIcon = (fileType, fileName = '') => {
    const type = fileType?.toLowerCase() || '';
    const name = fileName?.toLowerCase() || '';

    // Image files - different icons for different types
    if (type.startsWith('image/') || /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(name)) {
      if (/\.(jpg|jpeg)$/i.test(name)) return '🖼️';
      if (/\.png$/i.test(name)) return '🎨';
      if (/\.gif$/i.test(name)) return '🎭';
      if (/\.svg$/i.test(name)) return '🎯';
      return '🖼️';
    }

    // Video files
    if (type.startsWith('video/') || /\.(mp4|avi|mov|wmv|flv|webm|mkv)$/i.test(name)) return '🎬';

    // Audio files
    if (type.startsWith('audio/') || /\.(mp3|wav|flac|aac|ogg|wma)$/i.test(name)) return '🎵';

    // PDF files - distinctive red PDF icon
    if (type.includes('pdf') || name.endsWith('.pdf')) return '📕';

    // Word documents - blue document icon
    if (type.includes('word') || type.includes('document') || /\.(doc|docx)$/i.test(name)) return '📘';

    // Excel files - green spreadsheet icon
    if (type.includes('excel') || type.includes('spreadsheet') || /\.(xls|xlsx|csv)$/i.test(name)) return '📗';

    // PowerPoint files - orange presentation icon
    if (type.includes('powerpoint') || type.includes('presentation') || /\.(ppt|pptx)$/i.test(name)) return '📙';

    // Archive files
    if (type.includes('zip') || type.includes('rar') || /\.(zip|rar|7z|tar|gz)$/i.test(name)) return '📦';

    // Text files
    if (type.includes('text') || /\.(txt|md|rtf)$/i.test(name)) return '📄';

    // Code files - different icons for different languages
    if (/\.(js|jsx|ts|tsx)$/i.test(name)) return '⚡';
    if (/\.(html|htm)$/i.test(name)) return '🌐';
    if (/\.css$/i.test(name)) return '🎨';
    if (/\.py$/i.test(name)) return '🐍';
    if (/\.java$/i.test(name)) return '☕';
    if (/\.(cpp|c|h)$/i.test(name)) return '⚙️';
    if (/\.php$/i.test(name)) return '🐘';
    if (/\.(rb|gem)$/i.test(name)) return '💎';
    if (/\.go$/i.test(name)) return '🐹';
    if (/\.rs$/i.test(name)) return '🦀';
    if (/\.(json|xml|yaml|yml)$/i.test(name)) return '📋';

    // Default file icon
    return '📁';
  };

  if (!user || !subject) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="subject-page">
      <header className="subject-header">
        <button className="back-btn" onClick={() => navigate('/personal')}>
          ← Back to Dashboard
        </button>
        <div className="subject-info">
          <div className="subject-icon">
            {subject.icon && subject.icon.startsWith('http') ? (
              <img src={subject.icon} alt={subject.name} />
            ) : (
              subject.icon || '📚'
            )}
          </div>
          <h1>{subject.name}</h1>
        </div>
        {isSaving && <span className="saving-indicator">💾 Saving...</span>}
      </header>

      <div className="subject-content">
        {/* File Upload Section */}
        <div className="file-section">
          <h2>📁 Files & Resources</h2>
          
          <div 
            className="file-upload-zone"
            ref={dropZoneRef}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              multiple
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.mp4,.mp3,*/*"
              style={{ display: 'none' }}
            />
            
            <div className="upload-content">
              <div className="upload-icon">📤</div>
              <p>Drag & drop files here or click to browse</p>
              <button
                className="browse-btn"
                onClick={() => {
                  console.log('🔍 Browse button clicked');
                  console.log('🔍 isUploading:', isUploading);
                  console.log('🔍 fileInputRef.current:', fileInputRef.current);
                  fileInputRef.current?.click();
                }}
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Browse Files'}
              </button>

            </div>
          </div>

          {/* Files List */}
          <div className="files-list">
            {files.length === 0 ? (
              <p className="no-files">No files uploaded yet</p>
            ) : (
              files.map(file => (
                <div key={file.id} className="file-item">
                  <div className="file-info">
                    <span className="file-icon">{getFileIcon(file.type, file.name)}</span>
                    <div className="file-details">
                      <span className="file-name">{file.name}</span>
                      <span className="file-meta">
                        {formatFileSize(file.size)} • {new Date(file.uploadDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="file-actions">
                    <button
                      className="download-btn"
                      onClick={() => {
                        console.log('🔍 File data for download:', file);
                        downloadFile(file);
                      }}
                      title="Download file"
                    >
                      ⬇️
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => deleteFile(file.id)}
                      title="Delete file"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Notes Section */}
        <div className="notes-section">
          <h2>📝 Notes</h2>
          <textarea
            className="subject-notes"
            placeholder={`Write your ${subject.name} notes here...`}
            value={notes}
            onChange={handleNotesChange}
          />
          <div className="word-count">
            Words: {notes.split(/\s+/).filter(word => word.length > 0).length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectPage;
