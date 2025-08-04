import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Lazy load components for better performance
const Home = React.lazy(() => import('./components/Home'));
const Personal = React.lazy(() => import('./components/Personal'));
const General = React.lazy(() => import('./components/General'));
const SubjectPage = React.lazy(() => import('./components/SubjectPage'));
const SubjectDetail = React.lazy(() => import('./components/SubjectDetail'));
const CSECore = React.lazy(() => import('./components/CSECore'));
const ANN = React.lazy(() => import('./components/ANN'));

// Loading component
const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    fontSize: '1.2rem'
  }}>
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px'
    }}>
      <div style={{
        width: '50px',
        height: '50px',
        border: '4px solid rgba(255,255,255,0.3)',
        borderTop: '4px solid white',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <div>Loading Ziota...</div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="App">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/personal" element={<Personal />} />
            <Route path="/general" element={<General />} />
            <Route path="/subject/:subjectId" element={<SubjectPage />} />
            <Route path="/subject/:subjectId/:section" element={<SubjectDetail />} />
            <Route path="/cse-core" element={<CSECore />} />
            <Route path="/ann" element={<ANN />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
