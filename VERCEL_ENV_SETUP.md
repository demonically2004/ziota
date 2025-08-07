# Vercel Environment Variables Setup

This document provides the exact environment variables needed for deploying the Ziota application to Vercel.

## Backend Environment Variables (for Vercel)

Add these environment variables in your Vercel project dashboard:

### Database Configuration
```
MONGO_URI=mongodb+srv://demonically2004:9eNVjMVsY5O42DK7@cluster0.ykkttaj.mongodb.net/ziota?retryWrites=true&w=majority&appName=Cluster0
```

### JWT Configuration
```
JWT_SECRET=your_secret_key
```

### Server Configuration
```
PORT=5001
NODE_ENV=production
```

### Cloudinary Configuration
```
CLOUD_NAME=dlcujlif7
CLOUD_API_KEY=432727221131427
CLOUD_API_SECRET=WxCmjLSoCJrKpOh4iQjZ1Gh0o0Q
```

### Firebase Admin SDK Configuration
```
FIREBASE_PROJECT_ID=ziota-aa366
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC5Pn3VHEKB8cTa\nZPslxqzcKMY3KVkRKArl+Wgc+KTuSASDt/yqGQya9JIHE7H8ZGieBLuzPv44/BK4\nCnTfDQkcSbK2ZT+ETFnccfGzodnN/oHCz9r1MVehF4pBBsCC0PlVfkOJ4mXKYi4A\nYGgVlAqIbsyen8e6FVHeDX30SLiJdc3Mgu2229IU9xpKto/UbDyv4FY2uJYRXEWU\naV9WMiOBd3edd301BSSdbA9VfPwlBhLd9DBMSTN7XXE8g5pD6ODFNGo5XNbm3JV9\n4kjTUivz6OJU+Fq/KoftLPfubwyPTxprirBRezFinp/SN/DBhSspdzCEuL2ytkBW\nu2KG61fTAgMBAAECggEAAfOMZ9sy2mwKVXSezEK1N0BdPV9RGV/M+h9noVQZEXpy\n71NX8LpewbkeSZ1DiDgBW5Zgtc08xkT3G4PNwBoHFddMxUaA5fOknTkJY4mqsv8u\nYGrytwZwzhtAiq8Ejt5aexpwbm21JDIRkes+3XF1nouSYrOmYnZmsr2wHDY6blql\nWMGl3JK+Au3QT0EqXyIlwdqqnFf4UMI7S/mxzdALby1TEKhJBAdTUNXEyT9qLgDk\naHfBo2sYrUhIpO9tc/+eLueDFeYa9rSP4gPyhOTSWcIXbEXvtn+WfThGdSIuR5Nu\nNVjGmLCiohEbGhmNN5cu30R3jqEzE/oV+dG5H2jIDQKBgQD04H3Gto8kOv3EabQA\nu8zU5mOxgZEAqFULlDpgxPa+rClNTLdE7p3AT9xCkdHFLsGVA8c/wpo4LeuGLyfS\nHoXiDkYvz/cz4RhEhz4pLgKrhtZK0tX7AvpIggqXMzCmM0ijixtC4CA0/mLX5fbZ\nIKC6/GtZtooHQc83YxC/+YeLNwKBgQDBqJIIFFv8uP+8fvNL2uMInCbfvO/EHDoR\n3QIx6RXZiKXfasN7Cq/ewvS3Vl0lv9E2aRoM49dQ5SLjGObBkqo8XGQdYpCkC2TM\nTkEKbpy5+NfDMP1iR+ZcXTeVqyX+xOaqmg9bft26QvtCB+wOvOnnLWC48YZrpL5p\nMH5LXHC+RQKBgQCnzvuCZHKdYmuq4MEAy7GnqCZjayXiLHjzUWXcEL4CllpLZaol\n69thAZkwaVs2ZD82jftJ/2LN4vIG52PDgzU+X4fLlhmSjMujkoaPk78yqllJt0f6\nFuVLMQpu6R6KlpRNtrM81fhcOIOl7iqGSuy6luY9+XCHXprRGutMk4RGawKBgAvR\nHHAPxfkq1LgMyw3C4n2hAaI/ZiYCTuzOHpcrEOFAPFbgreLxKQAfx0z0oSRvivWV\n/jfxIy9VfAZ9e38uUuLyBE3iuM65v0HUOJXJYBjc/VV0xNFdb8oNChpA4kWkgCrC\n0dMUb7Uw5yIFV7sifedUVoWSf1BMMi46/knc7yg9AoGAe9vzZN/ItzebydjAqrGs\n8aclBoYDA1/4AxKhMLiUkrC89trzGQOE8UqKeq0qXmqk2UZK8irZwow4acpRwqEc\nCm3aOD0ZniFWUMHOpwoxdajhsOupMN9OGFkEm3DxRRnpObbjDLGMRzEmVNuh3GMD\nh/geyMdFJwD1WyKZYo+QOBE=\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@ziota-aa366.iam.gserviceaccount.com
```

## Frontend Environment Variables (for Vercel)

Add these environment variables for the frontend build:

### API Configuration
```
REACT_APP_API_URL=https://zio1.vercel.app
```

### Firebase Configuration (Frontend)
```
REACT_APP_FIREBASE_API_KEY=AIzaSyBa-3Urpfzq-RN66bxwAcqr0v5DoRl3MaE
REACT_APP_FIREBASE_AUTH_DOMAIN=ziota-aa366.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=ziota-aa366
REACT_APP_FIREBASE_STORAGE_BUCKET=ziota-aa366.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=311889063257
REACT_APP_FIREBASE_APP_ID=1:311889063257:web:8883034d831e5812f2f048
```

## Deployment Steps

1. **Connect Repository to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   - Framework Preset: Other
   - Root Directory: `./` (leave empty)
   - Build Command: `npm run vercel-build`
   - Output Directory: `frontend/build`

3. **Add Environment Variables**
   - Go to Project Settings > Environment Variables
   - Add all the variables listed above
   - Make sure to set them for Production, Preview, and Development environments

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be available at `https://zio1.vercel.app`

## Post-Deployment Configuration

### 1. Update Firebase Authorized Domains
- Go to Firebase Console > Authentication > Settings > Authorized domains
- Add `zio1.vercel.app` to the list

### 2. Test File Upload Functionality
- Upload a file in the personal space section
- Refresh the page
- Verify the file persists after refresh

### 3. Verify API Connectivity
- Check browser console for any CORS errors
- Test authentication flow
- Verify data persistence

## Troubleshooting

### Common Issues:
1. **CORS Errors**: Ensure `zio1.vercel.app` is added to CORS origins in server.js
2. **Firebase Auth Issues**: Verify Firebase authorized domains include your Vercel domain
3. **File Upload Issues**: Check Cloudinary configuration and upload preset
4. **API Connection Issues**: Verify `REACT_APP_API_URL` points to correct Vercel deployment URL

### Environment Variable Format Notes:
- Firebase private key must be wrapped in double quotes
- Newlines in private key should be `\n` (literal backslash-n)
- No trailing spaces in environment variable values
- MongoDB URI should include database name and connection options
