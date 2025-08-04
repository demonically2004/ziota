# 🎓 Ziota - Personal Learning Dashboard

A modern, full-stack web application designed for personal learning management with note-taking, file storage, and subject organization capabilities.

## ✨ Features

### 🔐 Authentication
- **Dual Authentication System**: Traditional email/password and Google OAuth
- **Password-only Login**: Quick access with just a password
- **Firebase Integration**: Secure authentication with Firebase Admin SDK
- **JWT Tokens**: Stateless authentication for API endpoints

### 📝 Personal Dashboard
- **General Notes**: Rich text note-taking with auto-save functionality
- **Subject-specific Notes**: Organized notes for different subjects (ANN, Python, Java, AI, Statistics, WT)
- **File Management**: Upload and manage files with Cloudinary integration
- **Image Gallery**: Visual content organization and storage
- **Dark/Light Theme**: Toggle between themes with preference persistence

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Saving**: Auto-save functionality with visual feedback
- **Intuitive Navigation**: Clean and user-friendly interface
- **FontAwesome Icons**: Beautiful iconography throughout the application

### 🛡️ Security & Performance
- **Helmet.js**: Security middleware for Express.js
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Environment Variables**: Secure configuration management
- **MongoDB Atlas**: Cloud database with proper connection handling

## 🚀 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - MongoDB object modeling
- **Firebase Admin SDK** - Authentication and user management
- **JWT** - JSON Web Tokens for authentication
- **Cloudinary** - Image and file storage
- **bcryptjs** - Password hashing
- **Helmet.js** - Security middleware

### Frontend
- **React 19** - Frontend library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **Firebase SDK** - Frontend authentication
- **FontAwesome** - Icon library
- **CSS3** - Styling with modern features

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account
- Firebase project
- Cloudinary account

### 1. Clone the Repository
```bash
git clone https://github.com/demonically2004/ziota.git
cd ziota
```

### 2. Install Backend Dependencies
```bash
npm install
```

### 3. Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

### 4. Environment Configuration
Create a `.env` file in the root directory:

```env
# MongoDB Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key

# Server Configuration
PORT=5001

# Cloudinary Configuration
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

# Firebase Configuration
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
```

Create a `frontend/.env` file:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5001

# Firebase Configuration (Frontend)
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### 5. Firebase Setup
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Google provider
3. Generate a service account key and save as `config/firebase-adminsdk.json`
4. Add your domain to authorized domains in Firebase Authentication settings

### 6. Run the Application

#### Development Mode
```bash
# Start backend server
npm run dev

# In a new terminal, start frontend
cd frontend
npm start
```

#### Production Mode
```bash
# Build frontend
npm run build

# Start production server
npm start
```

## 🌐 Deployment

### Vercel Deployment

1. **Prepare for Deployment**
   ```bash
   # Build the frontend
   npm run build
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Set environment variables in Vercel dashboard
   - Deploy with automatic builds on push

3. **Environment Variables for Vercel**
   Add all environment variables from your `.env` file to Vercel's environment variables section.

### Manual Deployment
1. Build the application: `npm run build`
2. Upload files to your hosting provider
3. Set environment variables on your hosting platform
4. Start the application: `npm start`

## 📁 Project Structure

```
ziota/
├── config/                 # Configuration files
│   ├── database.js         # MongoDB connection
│   ├── firebaseAdmin.js    # Firebase Admin setup
│   └── firebase-adminsdk.json
├── frontend/               # React frontend
│   ├── public/            # Static files
│   ├── src/               # Source code
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   └── config/        # Frontend configuration
│   └── build/             # Production build
├── middleware/            # Express middleware
│   ├── auth.js           # Authentication middleware
│   ├── unifiedAuth.js    # Unified auth for JWT/Firebase
│   └── verifyToken.js    # Token verification
├── models/               # MongoDB models
│   ├── Users.js         # User schema
│   ├── Courses.js       # Course schema
│   └── Enrollment.js    # Enrollment schema
├── routes/              # API routes
│   ├── authRoutes.js    # Authentication endpoints
│   ├── userDataRoutes.js # User data management
│   ├── courses.js       # Course management
│   └── subjectRoutes.js # Subject-specific routes
├── public/              # Static assets
├── .env                 # Environment variables
├── server.js           # Main server file
└── package.json        # Dependencies and scripts
```

## 🔧 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/check-user` - Verify Firebase token
- `POST /auth/logout` - User logout

### User Data
- `GET /api/user/data` - Get user data
- `PUT /api/user/data` - Update user data
- `DELETE /api/user/images` - Delete user images

### Courses & Subjects
- `GET /api/courses` - Get available courses
- `GET /api/user/subject/:subjectId` - Get subject-specific data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**demonically2004**
- GitHub: [@demonically2004](https://github.com/demonically2004)
- Email: demonically2004@gmail.com

## 🙏 Acknowledgments

- Firebase for authentication services
- MongoDB Atlas for database hosting
- Cloudinary for file storage
- Vercel for deployment platform
- React community for excellent documentation

---

⭐ **Star this repository if you find it helpful!**
