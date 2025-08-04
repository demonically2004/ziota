import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/SubjectDetail.css';

const SubjectDetail = () => {
  const { subjectId, section } = useParams();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [files, setFiles] = useState([]);
  const [notes, setNotes] = useState('');

  // Subject data (in real app, this would come from backend)
  const subjects = {
    java: { name: 'Java Programming', icon: '☕', description: 'Object-oriented programming with Java' },
    python: { name: 'Python Programming', icon: '🐍', description: 'Python programming and data structures' },
    ann: { name: 'Artificial Neural Networks', icon: '🧠', description: 'Deep learning and neural networks' },
    statistics: { name: 'Statistics', icon: '📊', description: 'Statistical analysis and probability' },
    web_tech: { name: 'Web Technology', icon: '🌐', description: 'HTML, CSS, JavaScript and web development' },
    ai: { name: 'Artificial Intelligence', icon: '🤖', description: 'AI algorithms and machine learning' }
  };

  const subject = subjects[subjectId];
  const sectionTitle = section === 'theory' ? '📚 Theory' : '🧪 Lab';
  const sectionDescription = section === 'theory' 
    ? 'Theoretical concepts, notes, and study materials'
    : 'Practical exercises, lab manuals, and hands-on materials';

  useEffect(() => {
    // Load files and notes for this subject/section
    // In real app, this would be an API call
    const savedData = localStorage.getItem(`${subjectId}_${section}`);
    if (savedData) {
      const data = JSON.parse(savedData);
      setFiles(data.files || []);
      setNotes(data.notes || '');
    }

    // Check if admin is logged in (persist admin state across pages)
    const adminStatus = localStorage.getItem('isAdmin');
    if (adminStatus === 'true') {
      setIsAdmin(true);
    }
  }, [subjectId, section]);

  // Admin authentication
  const handleAdminLogin = () => {
    if (adminCode === 'ansh_is_sexy') {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminCode('');
      // Persist admin state across pages
      localStorage.setItem('isAdmin', 'true');
      alert('🎉 Admin access granted!');
    } else {
      alert('❌ Invalid admin code!');
      setAdminCode('');
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    // Remove admin state from localStorage
    localStorage.removeItem('isAdmin');
    alert('👋 Admin logged out');
  };

  // File upload function
  const handleFileUpload = async (event) => {
    if (!isAdmin) return;
    
    const uploadedFiles = Array.from(event.target.files);
    if (uploadedFiles.length === 0) return;

    setUploadingFiles(true);

    try {
      const newFiles = uploadedFiles.map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date().toISOString(),
        url: URL.createObjectURL(file)
      }));

      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);

      // Save to localStorage (in real app, this would be an API call)
      const dataToSave = { files: updatedFiles, notes };
      localStorage.setItem(`${subjectId}_${section}`, JSON.stringify(dataToSave));

      alert(`✅ ${uploadedFiles.length} file(s) uploaded successfully!`);
    } catch (error) {
      console.error('❌ Upload failed:', error);
      alert('❌ Upload failed. Please try again.');
    } finally {
      setUploadingFiles(false);
    }
  };

  // Delete file function
  const deleteFile = (fileId) => {
    if (!isAdmin) return;
    
    if (window.confirm('Are you sure you want to delete this file?')) {
      const updatedFiles = files.filter(f => f.id !== fileId);
      setFiles(updatedFiles);
      
      // Save to localStorage
      const dataToSave = { files: updatedFiles, notes };
      localStorage.setItem(`${subjectId}_${section}`, JSON.stringify(dataToSave));
    }
  };

  // Update notes
  const updateNotes = (newNotes) => {
    if (!isAdmin) return;
    
    setNotes(newNotes);
    
    // Save to localStorage
    const dataToSave = { files, notes: newNotes };
    localStorage.setItem(`${subjectId}_${section}`, JSON.stringify(dataToSave));
  };

  // Download file
  const downloadFile = (file) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!subject) {
    return <div className="loading">Subject not found</div>;
  }

  return (
    <div className="subject-detail-container">
      {/* Header */}
      <header className="subject-detail-header">
        <div className="header-top">
          <button className="back-btn" onClick={() => navigate('/general')}>
            ← Back to Subjects
          </button>
          
          <div className="admin-section">
            {!isAdmin ? (
              <button
                className="admin-btn"
                onClick={() => setShowAdminLogin(true)}
              >
                🔐 Admin Access
              </button>
            ) : (
              <div className="admin-controls">
                <span className="admin-badge">👑 Admin Mode</span>
                <button className="admin-logout-btn" onClick={handleAdminLogout}>
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="subject-info">
          <div className="subject-icon">{subject.icon}</div>
          <div className="subject-text">
            <h1>{subject.name}</h1>
            <p className="subject-description">{subject.description}</p>
            <div className="section-badge">
              <span className="section-title">{sectionTitle}</span>
              <span className="section-description">{sectionDescription}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="modal-overlay">
          <div className="admin-login-modal">
            <h3>🔐 Admin Access</h3>
            <p>Enter the admin code to manage content:</p>
            <input
              type="password"
              placeholder="Enter admin code..."
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
            />
            <div className="modal-buttons">
              <button className="login-btn" onClick={handleAdminLogin}>
                Login
              </button>
              <button 
                className="cancel-btn" 
                onClick={() => {
                  setShowAdminLogin(false);
                  setAdminCode('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="subject-detail-main">
        {/* Files Section */}
        <div className="files-section">
          <h2>📁 Study Materials</h2>
          <div className="files-grid">
            {files.length === 0 ? (
              <div className="no-files">
                <span className="no-files-icon">📂</span>
                <p>No materials uploaded yet</p>
                {isAdmin && <small>Upload some files to get started!</small>}
              </div>
            ) : (
              files.map(file => (
                <div key={file.id} className="file-card">
                  <div className="file-icon">
                    {file.type === 'application/pdf' ? '📕' : 
                     file.type.includes('zip') ? '📦' : 
                     file.type.includes('image') ? '🖼️' : '📘'}
                  </div>
                  <div className="file-info">
                    <h4 className="file-name">{file.name}</h4>
                    <p className="file-meta">
                      {(file.size / 1024).toFixed(1)} KB • {new Date(file.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="file-actions">
                    <button 
                      className="download-btn"
                      onClick={() => downloadFile(file)}
                      title={`Download ${file.name}`}
                    >
                      ⬇️ Download
                    </button>
                    {isAdmin && (
                      <button 
                        className="delete-btn"
                        onClick={() => deleteFile(file.id)}
                        title="Delete file"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Notes Section */}
        <div className="notes-section">
          <h2>📝 Notes</h2>
          {isAdmin ? (
            <textarea
              className="notes-textarea"
              placeholder={`Write ${section} notes for ${subject.name}...`}
              value={notes}
              onChange={(e) => updateNotes(e.target.value)}
            />
          ) : (
            <div className="notes-display">
              {notes || `No ${section} notes available yet`}
            </div>
          )}
        </div>

        {/* Upload Section (Admin Only) - Moved to bottom */}
        {isAdmin && (
          <div className="upload-section">
            <h2>📤 Upload Materials</h2>
            <div className="upload-area">
              <input
                type="file"
                id="file-upload"
                multiple
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip,.rar"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="file-upload" className="upload-label">
                {uploadingFiles ? (
                  <div className="uploading">
                    <span>⏳ Uploading...</span>
                  </div>
                ) : (
                  <div className="upload-content">
                    <span className="upload-icon">📤</span>
                    <span>Click to upload or drag files here</span>
                    <small>PDF, DOC, PPT, TXT, ZIP supported</small>
                  </div>
                )}
              </label>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SubjectDetail;
