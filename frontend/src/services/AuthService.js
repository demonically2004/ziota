import axios from 'axios';
import { auth, provider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged } from '../config/firebase';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

class AuthService {
  // Register user
  async register(username, email, password) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        username,
        email,
        password
      });
      
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  }

  // Login user (supports password-only login)
  async login(email, password) {
    try {
      const loginData = {};

      // If email is provided, use email/password login
      if (email) {
        loginData.email = email;
        loginData.password = password;
      } else {
        // Password-only login
        loginData.password = password;
      }

      const response = await axios.post(`${API_BASE_URL}/auth/login`, loginData);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return {
        success: true,
        user: response.data.user,
        token: response.data.token
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  }

  // Google login
  async googleLogin() {
    try {
      console.log('🔍 Starting Google login...');
      console.log('🔍 Firebase auth:', auth);
      console.log('🔍 Google provider:', provider);

      // Try popup first, fallback to redirect if unauthorized domain
      let result;
      try {
        result = await signInWithPopup(auth, provider);
      } catch (popupError) {
        if (popupError.code === 'auth/unauthorized-domain') {
          console.log('🔄 Popup failed due to unauthorized domain, trying redirect...');
          await signInWithRedirect(auth, provider);
          return { success: false, message: 'Redirecting for authentication...' };
        }
        throw popupError;
      }
      console.log('🔍 Google login result:', result);

      const user = result.user;
      console.log('🔍 Google user:', user);

      const token = await user.getIdToken();
      console.log('🔍 Firebase token obtained:', token ? 'Yes' : 'No');

      // Send token to backend to verify and check user existence
      console.log('🔍 Sending token to backend:', `${API_BASE_URL}/auth/check-user`);
      const response = await axios.post(`${API_BASE_URL}/auth/check-user`, {
        token
      });

      console.log('🔍 Backend response:', response.data);

      if (response.data.success) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        return {
          success: true,
          user: {
            ...response.data.user,
            displayName: user.displayName
          }
        };
      } else {
        console.error('❌ User verification failed:', response.data);
        return {
          success: false,
          message: 'User verification failed'
        };
      }
    } catch (error) {
      console.error('❌ Google Login Error:', error);
      console.error('❌ Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      return {
        success: false,
        message: `Google login failed: ${error.message}`
      };
    }
  }

  // Handle redirect result (call this on app startup)
  async handleRedirectResult() {
    try {
      console.log('🔍 Checking for redirect result...');
      const result = await getRedirectResult(auth);

      if (result) {
        console.log('🔍 Redirect result found:', result);
        const user = result.user;
        const token = await user.getIdToken();

        // Send token to backend to verify and check user existence
        console.log('🔍 Sending redirect token to backend:', `${API_BASE_URL}/auth/check-user`);
        const response = await axios.post(`${API_BASE_URL}/auth/check-user`, {
          token
        });

        console.log('🔍 Backend response for redirect:', response.data);

        if (response.data.success) {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(response.data.user));

          return {
            success: true,
            user: {
              ...response.data.user,
              displayName: user.displayName
            }
          };
        }
      }

      return { success: false, message: 'No redirect result' };
    } catch (error) {
      console.error('❌ Redirect result error:', error);
      return {
        success: false,
        message: `Redirect authentication failed: ${error.message}`
      };
    }
  }

  // Logout
  async logout() {
    try {
      await signOut(auth);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { success: true };
    } catch (error) {
      console.error('Logout Error:', error);
      return { success: false };
    }
  }

  // Get current user
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Get current Firebase user
  getCurrentFirebaseUser() {
    return auth.currentUser;
  }

  // Wait for Firebase auth to be ready
  waitForAuthReady() {
    return new Promise((resolve) => {
      if (auth.currentUser) {
        resolve(auth.currentUser);
      } else {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          unsubscribe();
          resolve(user);
        });
      }
    });
  }

  // Get fresh Firebase token
  async getFirebaseToken() {
    try {
      console.log('🔍 Getting Firebase token...');
      const user = await this.waitForAuthReady();
      console.log('🔍 Firebase user:', user ? 'Found' : 'Not found');
      if (user) {
        const token = await user.getIdToken();
        console.log('🔍 Firebase token:', token ? 'Retrieved' : 'Failed');
        return token;
      }
      return null;
    } catch (error) {
      console.error('Error getting Firebase token:', error);
      return null;
    }
  }

  // Get token (prioritize JWT token for traditional login)
  getToken() {
    return localStorage.getItem('token');
  }

  // Get the appropriate token for API calls
  async getApiToken() {
    // First check if we have a JWT token (from traditional login)
    const jwtToken = this.getToken();
    if (jwtToken) {
      return jwtToken;
    }

    // If no JWT token, try to get Firebase token
    return await this.getFirebaseToken();
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken() || !!auth.currentUser;
  }

  // Check if user is authenticated (async version)
  async isAuthenticatedAsync() {
    const jwtToken = this.getToken();
    if (jwtToken) return true;

    const user = await this.waitForAuthReady();
    return !!user;
  }
}

const authServiceInstance = new AuthService();
export default authServiceInstance;
