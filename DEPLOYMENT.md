# 🚀 Deployment Guide for Ziota

This guide will help you deploy Ziota to Vercel and set up all necessary services.

## 📋 Prerequisites

Before deploying, ensure you have:
- GitHub account
- Vercel account
- MongoDB Atlas account
- Firebase project
- Cloudinary account

## 🔧 Service Setup

### 1. MongoDB Atlas Setup

1. **Create Account**: Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. **Create Cluster**: 
   - Choose free tier (M0)
   - Select your preferred region
   - Name your cluster
3. **Create Database User**:
   - Go to Database Access
   - Add new database user
   - Choose password authentication
   - Save username and password
4. **Configure Network Access**:
   - Go to Network Access
   - Add IP Address: `0.0.0.0/0` (allow from anywhere)
5. **Get Connection String**:
   - Go to Clusters → Connect
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

### 2. Firebase Setup

1. **Create Project**: Go to [Firebase Console](https://console.firebase.google.com/)
2. **Enable Authentication**:
   - Go to Authentication → Sign-in method
   - Enable Google provider
   - Add your domain to authorized domains
3. **Generate Service Account**:
   - Go to Project Settings → Service accounts
   - Generate new private key
   - Download the JSON file
4. **Get Web App Config**:
   - Go to Project Settings → General
   - Add web app if not exists
   - Copy the config object

### 3. Cloudinary Setup

1. **Create Account**: Go to [Cloudinary](https://cloudinary.com/)
2. **Get Credentials**:
   - Go to Dashboard
   - Copy Cloud Name, API Key, and API Secret

## 🌐 Vercel Deployment

### Step 1: Prepare Repository

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

### Step 2: Connect to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave empty)
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `frontend/build`

### Step 3: Environment Variables

Add these environment variables in Vercel:

#### Backend Variables
```
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ziota?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key
PORT=5001
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
NODE_ENV=production
```

#### Frontend Variables
```
REACT_APP_API_URL=https://your-vercel-app.vercel.app
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Your app will be available at `https://your-app-name.vercel.app`

## 🔧 Post-Deployment Configuration

### 1. Update Firebase Authorized Domains

1. Go to Firebase Console → Authentication → Settings
2. Add your Vercel domain to authorized domains:
   - `your-app-name.vercel.app`
   - `your-app-name-git-main-username.vercel.app`

### 2. Update CORS Settings

If you encounter CORS issues, update your backend CORS configuration in `server.js`:

```javascript
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://your-app-name.vercel.app",
    "https://your-app-name-git-main-username.vercel.app"
  ],
  credentials: true
};
```

### 3. Test Deployment

1. Visit your deployed app
2. Test authentication (both password and Google login)
3. Test note-taking functionality
4. Test file upload
5. Verify data persistence

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are in `package.json`
   - Verify environment variables are set

2. **Authentication Issues**:
   - Verify Firebase configuration
   - Check authorized domains
   - Ensure environment variables are correct

3. **Database Connection Issues**:
   - Verify MongoDB Atlas connection string
   - Check network access settings
   - Ensure database user has proper permissions

4. **API Errors**:
   - Check Vercel function logs
   - Verify environment variables
   - Test API endpoints individually

### Debugging Tips

1. **Check Vercel Logs**:
   - Go to Vercel Dashboard → Your Project → Functions
   - Click on function to see logs

2. **Test Environment Variables**:
   ```javascript
   console.log('Environment check:', {
     mongoUri: process.env.MONGO_URI ? 'Set' : 'Missing',
     jwtSecret: process.env.JWT_SECRET ? 'Set' : 'Missing',
     firebaseProjectId: process.env.FIREBASE_PROJECT_ID ? 'Set' : 'Missing'
   });
   ```

3. **Local Testing**:
   ```bash
   # Test production build locally
   npm run build
   npm start
   ```

## 📈 Performance Optimization

1. **Enable Compression**: Already configured with Helmet.js
2. **Optimize Images**: Use Cloudinary's optimization features
3. **Monitor Performance**: Use Vercel Analytics
4. **Database Indexing**: Add indexes to frequently queried fields

## 🔒 Security Checklist

- ✅ Environment variables are secure
- ✅ Firebase rules are properly configured
- ✅ CORS is configured correctly
- ✅ JWT secrets are strong and unique
- ✅ Database access is restricted
- ✅ HTTPS is enforced (automatic with Vercel)

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Vercel documentation
3. Check Firebase documentation
4. Open an issue on GitHub

---

🎉 **Congratulations! Your Ziota app is now deployed and ready to use!**
