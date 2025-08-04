import React from 'react';
import { useNavigate } from 'react-router-dom';

const CSECore = () => {
  const navigate = useNavigate();

  return (
    <div className="cse-core-container">
      <header>
        <h1>Computer Science Core Resources</h1>
        <button onClick={() => navigate('/general')}>Back to General</button>
      </header>
      
      <main>
        <div className="cse-content">
          <h2>CS Core Study Materials</h2>
          <p>Comprehensive resources for computer science fundamentals.</p>
          
          <div className="topics-grid">
            <div className="topic-card">
              <h3>Data Structures</h3>
              <p>Arrays, Linked Lists, Trees, Graphs, and more</p>
              <button>View Materials</button>
            </div>
            
            <div className="topic-card">
              <h3>Algorithms</h3>
              <p>Sorting, Searching, Dynamic Programming</p>
              <button>View Materials</button>
            </div>
            
            <div className="topic-card">
              <h3>Operating Systems</h3>
              <p>Process Management, Memory, File Systems</p>
              <button>View Materials</button>
            </div>
            
            <div className="topic-card">
              <h3>Database Systems</h3>
              <p>SQL, NoSQL, Database Design</p>
              <button>View Materials</button>
            </div>
            
            <div className="topic-card">
              <h3>Computer Networks</h3>
              <p>TCP/IP, HTTP, Network Protocols</p>
              <button>View Materials</button>
            </div>
            
            <div className="topic-card">
              <h3>Software Engineering</h3>
              <p>SDLC, Design Patterns, Testing</p>
              <button>View Materials</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CSECore;
