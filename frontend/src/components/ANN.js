import React from 'react';
import { useNavigate } from 'react-router-dom';

const ANN = () => {
  const navigate = useNavigate();

  return (
    <div className="ann-container">
      <header>
        <h1>Artificial Neural Networks</h1>
        <button onClick={() => navigate('/general')}>Back to General</button>
      </header>
      
      <main>
        <div className="ann-content">
          <h2>ANN Study Resources</h2>
          <p>Comprehensive materials for understanding Artificial Neural Networks.</p>
          
          <div className="ann-topics">
            <div className="topic-section">
              <h3>Fundamentals</h3>
              <ul>
                <li>Introduction to Neural Networks</li>
                <li>Perceptron Model</li>
                <li>Multi-layer Perceptrons</li>
                <li>Activation Functions</li>
              </ul>
              <button>Access Materials</button>
            </div>
            
            <div className="topic-section">
              <h3>Learning Algorithms</h3>
              <ul>
                <li>Backpropagation</li>
                <li>Gradient Descent</li>
                <li>Learning Rate Optimization</li>
                <li>Regularization Techniques</li>
              </ul>
              <button>Access Materials</button>
            </div>
            
            <div className="topic-section">
              <h3>Advanced Topics</h3>
              <ul>
                <li>Convolutional Neural Networks</li>
                <li>Recurrent Neural Networks</li>
                <li>Deep Learning Architectures</li>
                <li>Transfer Learning</li>
              </ul>
              <button>Access Materials</button>
            </div>
            
            <div className="topic-section">
              <h3>Practical Applications</h3>
              <ul>
                <li>Image Recognition</li>
                <li>Natural Language Processing</li>
                <li>Time Series Prediction</li>
                <li>Pattern Recognition</li>
              </ul>
              <button>Access Materials</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ANN;
