import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGraduationCap, 
  faBars, 
  faUserPlus, 
  faInfoCircle, 
  faBookOpen, 
  faUsers, 
  faCalendarCheck,
  faHome,
  faList,
  faSignInAlt,
  faStar,
  faBook,
  faQuestionCircle,
  faCalendar,
  faHeadset,
  faAd,
  faPaperPlane
} from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faLinkedinIn, faTwitter } from '@fortawesome/free-brands-svg-icons';
import AuthService from '../services/AuthService';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthOptions, setShowAuthOptions] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [authMessage, setAuthMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    regEmail: '',
    regPassword: '',
    friendQuota: ''
  });

  // Handle redirect result on component mount
  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const result = await AuthService.handleRedirectResult();
        if (result.success) {
          setAuthMessage(`✅ Welcome, ${result.user.displayName}!`);
          setTimeout(() => {
            navigate('/personal');
          }, 1500);
        }
      } catch (error) {
        console.error('❌ Redirect handling error:', error);
      }
    };

    handleRedirect();
  }, [navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePersonalAccess = () => {
    setShowAuthOptions(!showAuthOptions);
  };

  const handleGeneralAccess = () => {
    navigate('/general');
  };

  const showLogin = () => {
    setShowLoginForm(true);
    setShowRegisterForm(false);
    setShowAuthOptions(false);
  };

  const showRegister = () => {
    setShowRegisterForm(true);
    setShowLoginForm(false);
    setShowAuthOptions(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.password) {
      setAuthMessage('❌ Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await AuthService.login('', formData.password); // Only password-based login
      if (result.success) {
        setAuthMessage(`✅ Welcome back, bestie! 🎉`);
        setTimeout(() => {
          navigate('/personal');
        }, 1000);
      } else {
        setAuthMessage(`❌ ${result.message || 'Invalid password'}`);
      }
    } catch (error) {
      setAuthMessage('⚠️ Server error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.regEmail || !formData.regPassword || !formData.friendQuota) {
      setAuthMessage('❌ Please fill in all fields.');
      return;
    }

    // Check friend's quota code
    if (formData.friendQuota !== 'shahdara110093') {
      setAuthMessage('❌ Invalid friend\'s quota code. You need the special code to register! 🔐');
      return;
    }

    setIsLoading(true);
    try {
      const result = await AuthService.register(formData.username, formData.regEmail, formData.regPassword);
      if (result.success) {
        setAuthMessage('✅ Welcome to the squad! Registration successful! Please log in. 🎉');
        setShowRegisterForm(false);
        setShowLoginForm(true);
      } else {
        setAuthMessage(`❌ ${result.message || 'Registration failed.'}`);
      }
    } catch (error) {
      setAuthMessage('⚠️ Server error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="home-container">
      {/* Header */}
      <header id="header">
        <div className="logo">
          <FontAwesomeIcon icon={faGraduationCap} />
          <span>Ziota</span>
        </div>
        <div className="menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <FontAwesomeIcon icon={faBars} />
        </div>
        <nav className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <a href="#hero">Home</a>
          <a href="#features">Features</a>
          <a href="#auth">Login/Register</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#footer">Contact</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero" id="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Cramming for exams? <span>We got you, bestie! 💯</span>
          </h1>
          <p className="hero-description">
            Get all the study materials, notes, and expert help you need in one place.
            No more all-nighters or stress crying – just pure academic excellence! ✨
          </p>
          <div className="cta-buttons">
            <a href="#auth" className="btn btn-primary">
              <FontAwesomeIcon icon={faUserPlus} />
              Let's Go! 🚀
            </a>
            <a href="#features" className="btn btn-secondary">
              <FontAwesomeIcon icon={faInfoCircle} />
              Show Me More ✨
            </a>
          </div>
        </div>
        <div className="svg-container">
          <svg className="letter-i" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700">
            <path className="cls-1 stem" style={{"--color": "rgb(246, 9, 149)"}} d="M534,688c-21.86-.21-46.54-1.64-60.89-18.14-11.57-13.31-12.73-32.47-13.32-50.1q-3.09-92.09-6.16-184.16c-2-59.35-3.65-120.66,18.22-175.87a1078.09,1078.09,0,0,1-201.94,61.42c19.19-1.82,41.22-2.67,54.66,11.13,11,11.33,12.29,28.69,12.83,44.49q4.38,127.62,2.16,255.36c-.21,11.76-.66,24.21-7.08,34.07-10.83,16.63-32.76,19-50.79,20.49-4.64.37-25.91-.25-23.84,5.56,2.43,6.8,20.9,4.78,25.36,4.62q80.61-2.88,161.22-5.7C474.19,690.11,504.23,687.72,534,688Z"/>
            <path className="cls-1 stem" style={{"--color": "rgb(254, 219, 59)"}} d="M467.79,653.59c-10.4-22.45-10.49-48.11-10.39-72.85.41-107.63.84-215.47,11.61-322.56a560.3,560.3,0,0,1-228.84,67c28.68-8.32,80.6-14.86,94.58,11.52s8.15,97.66,9.11,127.5c1.6,49.55-10.71,104.47-9.11,154,.49,15,.77,27.26-4.14,41.4-7,20.1-24.22,19.47-43.69,28.06s-41.06,11.15-62.32,11.9c37.92-1.33,76.07-7.73,114-10q57.9-3.47,115.93-3.65q16.57,0,33.15.17c9.49.12,22.1-1.59,31,1.12-.68,9.24-24.07-3.46-27.88-6.09A68.81,68.81,0,0,1,467.79,653.59Z"/>
            <path className="cls-1 dot" style={{"--color": "rgb(88, 40, 215)"}} d="M378.7,89.91c-17.65,14.52-34.72,30.92-43.88,51.86S326,189.21,341,206.48c8.14,9.39,19.75,15.23,31.72,18.55,25.22,7,53.35,3.24,75.49-10.7s37.77-38,40.81-64c1.33-11.45.17-23.6-5.85-33.43-6.27-10.25-17-16.86-28-21.87-14.09-6.45-29.52-10.94-44.95-9.58s-30.85,9.36-38.26,23"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="feature-card animate fade-in-up">
          <div className="feature-icon">
            <FontAwesomeIcon icon={faBookOpen} />
          </div>
          <h3 className="feature-title">Study Materials That Actually Slap 📚</h3>
          <p className="feature-description">
            Get access to fire notes, practice questions, and study guides made by the best teachers.
            Everything's organized so you can find what you need ASAP!
          </p>
        </div>
        <div className="feature-card animate fade-in-up">
          <div className="feature-icon">
            <FontAwesomeIcon icon={faUsers} />
          </div>
          <h3 className="feature-title">Expert Help That Hits Different 🧠</h3>
          <p className="feature-description">
            Get personalized help from actual subject pros who'll break down the hardest concepts
            until they make sense. No cap! 💯
          </p>
        </div>
        <div className="feature-card animate fade-in-up">
          <div className="feature-icon">
            <FontAwesomeIcon icon={faCalendarCheck} />
          </div>
          <h3 className="feature-title">Study Planner That's Actually Smart 🎯</h3>
          <p className="feature-description">
            Create custom study schedules that work with YOUR life. Track your progress and
            stay on top of your game – it's giving main character energy! ⭐
          </p>
        </div>
      </section>

      {/* Authentication Section */}
      <section className="auth-section" id="auth">
        <div className="form-wrapper">
          <h2 className="form-title">Welcome to Ziota! 🎉</h2>

          <div className="access-buttons">
            <button className="access-btn personal-btn" onClick={handlePersonalAccess}>
              My Personal Space 🔐
            </button>
            <button className="access-btn general-btn" onClick={handleGeneralAccess}>
              Just Browsing 👀
            </button>
          </div>

          {/* Authentication Options */}
          {showAuthOptions && (
            <div id="authOptions">
              <button onClick={showLogin} className="auth-btn">Login</button>
              <button onClick={showRegister} className="auth-btn">Register</button>
            </div>
          )}

          {/* Login Form */}
          {showLoginForm && (
            <form onSubmit={handleLogin}>
              <h3>Login 🔑</h3>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Let Me In! 🚀'}
              </button>
              <p>
                New to the squad? <button type="button" className="link-button" onClick={showRegister}>Join Us Here! ✨</button>
              </p>
            </form>
          )}

          {/* Registration Form */}
          {showRegisterForm && (
            <form onSubmit={handleRegister}>
              <h3>Join the Squad! 🎉</h3>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                name="regEmail"
                placeholder="Email"
                value={formData.regEmail}
                onChange={handleInputChange}
                required
              />
              <input
                type="password"
                name="regPassword"
                placeholder="Create Password"
                value={formData.regPassword}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="friendQuota"
                placeholder="Friend's Quota Code 🔐"
                value={formData.friendQuota}
                onChange={handleInputChange}
                required
              />
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Joining...' : 'Join Now! 🚀'}
              </button>
              <p>
                Already part of the squad? <button type="button" className="link-button" onClick={showLogin}>Login Here! ✨</button>
              </p>
            </form>
          )}

          {/* Authentication Message */}
          {authMessage && <p id="authMessage">{authMessage}</p>}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials" id="testimonials">
        <h2 className="section-title">The Tea From Our Users ☕</h2>
        <div className="testimonial-container">
          <div className="testimonial-card">
            <p className="testimonial-quote">
              "Ziota literally saved my grades! The notes are so organized and the practice questions are
              chef's kiss 👌 Ended up in the top 5% - I'm that girl now!"
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">M</div>
              <div className="author-info">
                <h4>Manoj</h4>
                <p>Engineering Student</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <p className="testimonial-quote">
              "The study planner is absolutely sending me! 🚀 Finally got my life together and
              covered everything before exams. No more procrastination era!"
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">GKC</div>
              <div className="author-info">
                <h4>Ganeev Kaur Chhabra</h4>
                <p>Engineering Student</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <p className="testimonial-quote">
              "Balancing work and studies was giving me anxiety, but Ziota's 24/7 expert support is unmatched!
              They made the hardest concepts make sense. Absolute W! 💪"
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">SK</div>
              <div className="author-info">
                <h4>Sandeep Kalla</h4>
                <p>Engineering Student</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer">
        <div className="footer-content">
          <div className="footer-column">
            <h3>Ziota</h3>
            <p>Helping students level up their academic game with the tools and resources that actually work! 📈</p>
            <div className="social-buttons" style={{justifyContent: 'flex-start', marginTop: '1.5rem'}}>
              <a href="https://www.instagram.com/techshuttlebvp/" className="social-btn instagram">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="https://linkedin.com" className="social-btn linkedin">
                <FontAwesomeIcon icon={faLinkedinIn} />
              </a>
              <a href="https://x.com/XllAnsh" className="social-btn twitter">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
            </div>
          </div>
          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><a href="#hero"><FontAwesomeIcon icon={faHome} /> Home</a></li>
              <li><a href="#features"><FontAwesomeIcon icon={faList} /> Features</a></li>
              <li><a href="#auth"><FontAwesomeIcon icon={faSignInAlt} /> Login/Register</a></li>
              <li><a href="#testimonials"><FontAwesomeIcon icon={faStar} /> Testimonials</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Resources</h3>
            <ul className="footer-links">
              <li><button type="button" className="link-button"><FontAwesomeIcon icon={faBook} /> Study Materials</button></li>
              <li><button type="button" className="link-button"><FontAwesomeIcon icon={faQuestionCircle} /> Practice Tests</button></li>
              <li><button type="button" className="link-button"><FontAwesomeIcon icon={faCalendar} /> Study Planners</button></li>
              <li><button type="button" className="link-button"><FontAwesomeIcon icon={faHeadset} /> Expert Support</button></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Newsletter</h3>
            <p>Stay in the loop with the latest updates and study resources! No spam, just good vibes ✨</p>
            <form className="newsletter-form">
              <input type="email" className="newsletter-input" placeholder="Your email address" />
              <button type="submit" className="newsletter-btn">
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </form>
          </div>
        </div>
        <div className="advertisement-section">
          <h3>Sponsored Content</h3>
          <div className="ad-container">
            <div className="ad-slot">
              <div className="ad-placeholder">
                <FontAwesomeIcon icon={faAd} />
                <p>Advertisement Space</p>
              </div>
            </div>
            <div className="ad-slot">
              <div className="ad-placeholder">
                <FontAwesomeIcon icon={faAd} />
                <p>Advertisement Space</p>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Ziota - Where Education Meets Innovation ✨ All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
