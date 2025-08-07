import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import axios from 'axios';
import '../styles/General.css';

const General = () => {
  const navigate = useNavigate();
  const [isTyping, setIsTyping] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [subjects, setSubjects] = useState([
    {
      id: 'java',
      name: 'Java Programming',
      icon: '☕',
      description: 'Object-oriented programming with Java',
      theory: {
        files: [],
        notes: ''
      },
      lab: {
        files: [],
        notes: ''
      }
    },
    {
      id: 'python',
      name: 'Python Programming',
      icon: '🐍',
      description: 'Python programming and data structures',
      theory: {
        files: [],
        notes: ''
      },
      lab: {
        files: [],
        notes: ''
      }
    },
    {
      id: 'ann',
      name: 'Artificial Neural Networks',
      icon: '🧠',
      description: 'Deep learning and neural networks',
      theory: {
        files: [],
        notes: ''
      },
      lab: {
        files: [],
        notes: ''
      }
    },
    {
      id: 'statistics',
      name: 'Statistics',
      icon: '📊',
      description: 'Statistical analysis and probability',
      theory: {
        files: [],
        notes: ''
      },
      lab: {
        files: [],
        notes: ''
      }
    },
    {
      id: 'web_tech',
      name: 'Web Technology',
      icon: '🌐',
      description: 'HTML, CSS, JavaScript and web development',
      theory: {
        files: [],
        notes: ''
      },
      lab: {
        files: [],
        notes: ''
      }
    },
    {
      id: 'ai',
      name: 'Artificial Intelligence',
      icon: '🤖',
      description: 'AI algorithms and machine learning',
      theory: {
        files: [],
        notes: ''
      },
      lab: {
        files: [],
        notes: ''
      }
    }
  ]);
  // Load subjects from backend or localStorage
  const loadSubjects = async () => {
    try {
      // First try to load from localStorage for admin-added subjects
      const savedSubjects = localStorage.getItem('generalSubjects');
      if (savedSubjects) {
        const parsedSubjects = JSON.parse(savedSubjects);
        setSubjects(parsedSubjects);
        return;
      }

      // If user is authenticated, try to load from backend
      const token = await AuthService.getFirebaseToken();
      if (token) {
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
        const response = await axios.get(`${API_BASE_URL}/api/user/data`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success && response.data.data.subjects && response.data.data.subjects.length > 0) {
          // Merge backend subjects with default subjects
          const backendSubjects = response.data.data.subjects;
          const mergedSubjects = [...subjects];

          // Add any new subjects from backend that aren't in default list
          backendSubjects.forEach(backendSubject => {
            const exists = mergedSubjects.find(s => s.id === backendSubject.id);
            if (!exists) {
              mergedSubjects.push({
                ...backendSubject,
                theory: { files: [], notes: '' },
                lab: { files: [], notes: '' }
              });
            }
          });

          setSubjects(mergedSubjects);
          localStorage.setItem('generalSubjects', JSON.stringify(mergedSubjects));
        }
      }
    } catch (error) {
      console.error('❌ Error loading subjects:', error);
      // Keep default subjects if loading fails
    }
  };

  // Save subjects to backend and localStorage
  const saveSubjects = async (updatedSubjects) => {
    try {
      // Always save to localStorage for immediate persistence
      localStorage.setItem('generalSubjects', JSON.stringify(updatedSubjects));

      // Try to save to backend if user is authenticated
      const token = await AuthService.getFirebaseToken();
      if (token) {
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

        // Extract just the subject info (without theory/lab data)
        const subjectsToSave = updatedSubjects.map(subject => ({
          id: subject.id,
          name: subject.name,
          icon: subject.icon,
          description: subject.description
        }));

        await axios.put(`${API_BASE_URL}/api/user/data`, {
          subjects: subjectsToSave
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log('✅ Subjects saved to backend successfully');
      }
    } catch (error) {
      console.error('❌ Error saving subjects:', error);
      // Continue anyway since localStorage save succeeded
    }
  };

  useEffect(() => {
    setIsTyping(true);

    // Check if admin is logged in (persist admin state across pages)
    const adminStatus = localStorage.getItem('isAdmin');
    if (adminStatus === 'true') {
      setIsAdmin(true);
    }

    // Load subjects from backend/localStorage
    loadSubjects();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // Subject management functions (admin only)
  const addNewSubject = async () => {
    if (!isAdmin) return;

    const name = prompt('Enter subject name:');
    if (!name || name.trim() === '') return;

    const icon = prompt('Enter emoji icon (e.g., 📚, 💻, 🔬):') || '📚';
    const description = prompt('Enter subject description:') || 'Study materials and resources';

    const newSubject = {
      id: name.toLowerCase().replace(/\s+/g, '_'),
      name: name.trim(),
      icon: icon.trim(),
      description: description.trim(),
      theory: {
        files: [],
        notes: ''
      },
      lab: {
        files: [],
        notes: ''
      }
    };

    const updatedSubjects = [...subjects, newSubject];
    setSubjects(updatedSubjects);

    // Save to backend and localStorage
    await saveSubjects(updatedSubjects);

    alert(`✅ Subject "${newSubject.name}" added successfully!`);
  };

  const editSubject = async (subjectId) => {
    if (!isAdmin) return;

    const subject = subjects.find(s => s.id === subjectId);
    const newName = prompt('Enter new subject name:', subject.name);
    const newIcon = prompt('Enter new emoji icon:', subject.icon);
    const newDescription = prompt('Enter new description:', subject.description);

    if (newName && newName.trim() !== '') {
      const updatedSubjects = subjects.map(s =>
        s.id === subjectId
          ? {
              ...s,
              name: newName.trim(),
              icon: newIcon?.trim() || s.icon,
              description: newDescription?.trim() || s.description
            }
          : s
      );

      setSubjects(updatedSubjects);

      // Save to backend and localStorage
      await saveSubjects(updatedSubjects);

      alert(`✅ Subject "${newName.trim()}" updated successfully!`);
    }
  };

  const deleteSubject = async (subjectId) => {
    if (!isAdmin) return;

    const subject = subjects.find(s => s.id === subjectId);
    if (window.confirm(`Are you sure you want to delete "${subject.name}"?`)) {
      const updatedSubjects = subjects.filter(s => s.id !== subjectId);
      setSubjects(updatedSubjects);

      // Save to backend and localStorage
      await saveSubjects(updatedSubjects);

      alert(`✅ Subject "${subject.name}" deleted successfully!`);
    }
  };

  // Functions moved to SubjectDetail component





  return (
    <div className="general-container">
      {/* Particles background effect */}
      <div className="particles" id="particles-js"></div>

      <header className="general-header">
        <div className="header-top">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← Back to Home
          </button>

          <h1>
            <span className={`typewriter ${isTyping ? 'typing' : ''}`}>
              📚 Study Materials Hub
            </span>
          </h1>

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

        <p className="subtitle">
          {isAdmin
            ? "Admin Mode: You can edit, add, and manage all content"
            : "Browse and download study materials for all subjects"
          }
        </p>
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

      <main className="subjects-grid">
        {/* Add New Subject Button (Admin Only) */}
        {isAdmin && (
          <div className="subject-card add-subject-card" onClick={addNewSubject}>
            <div className="subject-icon">➕</div>
            <h3>Add New Subject</h3>
            <p>Create a new subject</p>
          </div>
        )}

        {/* Subject Cards */}
        {subjects.map((subject) => (
          <div key={subject.id} className="subject-card">
            {isAdmin && (
              <div className="admin-controls-overlay">
                <button
                  className="edit-subject-btn"
                  onClick={() => editSubject(subject.id)}
                  title="Edit Subject"
                >
                  ✏️
                </button>
                <button
                  className="delete-subject-btn"
                  onClick={() => deleteSubject(subject.id)}
                  title="Delete Subject"
                >
                  🗑️
                </button>
              </div>
            )}

            <div className="subject-header">
              <div className="subject-icon">{subject.icon}</div>
              <h3>{subject.name}</h3>
              <p>{subject.description}</p>
            </div>

            <div className="subject-content">
              {/* Theory and Lab Buttons */}
              <div className="section-buttons">
                <button
                  className="section-btn theory-btn"
                  onClick={() => navigate(`/subject/${subject.id}/theory`)}
                >
                  <div className="section-btn-icon">📚</div>
                  <div className="section-btn-content">
                    <h4>Theory</h4>
                    <p className="section-status">
                      {subject.theory.files.length === 0
                        ? 'No theory materials yet'
                        : `${subject.theory.files.length} material${subject.theory.files.length !== 1 ? 's' : ''}`
                      }
                    </p>
                  </div>
                </button>

                <button
                  className="section-btn lab-btn"
                  onClick={() => navigate(`/subject/${subject.id}/lab`)}
                >
                  <div className="section-btn-icon">🧪</div>
                  <div className="section-btn-content">
                    <h4>Lab</h4>
                    <p className="section-status">
                      {subject.lab.files.length === 0
                        ? 'No lab materials yet'
                        : `${subject.lab.files.length} material${subject.lab.files.length !== 1 ? 's' : ''}`
                      }
                    </p>
                  </div>
                </button>
              </div>


            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default General;
