# Vercel Environment Variables Setup

## 🔧 Required Environment Variables for Vercel

You need to add these environment variables in your Vercel project settings:

### 📋 Steps to Add Environment Variables:

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Click on your "zio" project**
3. **Go to "Settings" tab**
4. **Click "Environment Variables" in the sidebar**
5. **Add each variable below**

### 🔑 Environment Variables to Add:

#### **Frontend Variables (for React app):**
```
REACT_APP_API_URL = https://zio-git-main-ansh-sharmas-projects-59cc301d.vercel.app
REACT_APP_FIREBASE_API_KEY = AIzaSyBa-3Urpfzq-RN66bxwAcqr0v5DoRl3MaE
REACT_APP_FIREBASE_AUTH_DOMAIN = ziota-aa366.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID = ziota-aa366
REACT_APP_FIREBASE_STORAGE_BUCKET = ziota-aa366.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID = 311889063257
REACT_APP_FIREBASE_APP_ID = 1:311889063257:web:8883034d831e5812f2f048
```

#### **Backend Variables (for Node.js server):**
```
MONGO_URI = mongodb+srv://demonically2004:9eNVjMVsY5O42DK7@cluster0.ykkttaj.mongodb.net/ziota?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET = your_secret_key
PORT = 5001
CLOUD_NAME = dlcujlif7
CLOUD_API_KEY = 432727221131427
CLOUD_API_SECRET = WxCmjLSoCJrKpOh4iQjZ1Gh0o0Q
FIREBASE_PROJECT_ID = ziota-aa366
FIREBASE_CLIENT_EMAIL = firebase-adminsdk-fbsvc@ziota-aa366.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY = -----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC5Pn3VHEKB8cTa
ZPslxqzcKMY3KVkRKArl+Wgc+KTuSASDt/yqGQya9JIHE7H8ZGieBLuzPv44/BK4
CnTfDQkcSbK2ZT+ETFnccfGzodnN/oHCz9r1MVehF4pBBsCC0PlVfkOJ4mXKYi4A
YGgVlAqIbsyen8e6FVHeDX30SLiJdc3Mgu2229IU9xpKto/UbDyv4FY2uJYRXEWU
aV9WMiOBd3edd301BSSdbA9VfPwlBhLd9DBMSTN7XXE8g5pD6ODFNGo5XNbm3JV9
4kjTUivz6OJU+Fq/KoftLPfubwyPTxprirBRezFinp/SN/DBhSspdzCEuL2ytkBW
u2KG61fTAgMBAAECggEAAfOMZ9sy2mwKVXSezEK1N0BdPV9RGV/M+h9noVQZEXpy
71NX8LpewbkeSZ1DiDgBW5Zgtc08xkT3G4PNwBoHFddMxUaA5fOknTkJY4mqsv8u
YGrytwZwzhtAiq8Ejt5aexpwbm21JDIRkes+3XF1nouSYrOmYnZmsr2wHDY6blql
WMGl3JK+Au3QT0EqXyIlwdqqnFf4UMI7S/mxzdALby1TEKhJBAdTUNXEyT9qLgDk
aHfBo2sYrUhIpO9tc/+eLueDFeYa9rSP4gPyhOTSWcIXbEXvtn+WfThGdSIuR5Nu
NVjGmLCiohEbGhmNN5cu30R3jqEzE/oV+dG5H2jIDQKBgQD04H3Gto8kOv3EabQA
u8zU5mOxgZEAqFULlDpgxPa+rClNTLdE7p3AT9xCkdHFLsGVA8c/wpo4LeuGLyfS
HoXiDkYvz/cz4RhEhz4pLgKrhtZK0tX7AvpIggqXMzCmM0ijixtC4CA0/mLX5fbZ
IKC6/GtZtooHQc83YxC/+YeLNwKBgQDBqJIIFFv8uP+8fvNL2uMInCbfvO/EHDoR
3QIx6RXZiKXfasN7Cq/ewvS3Vl0lv9E2aRoM49dQ5SLjGObBkqo8XGQdYpCkC2TM
TkEKbpy5+NfDMP1iR+ZcXTeVqyX+xOaqmg9bft26QvtCB+wOvOnnLWC48YZrpL5p
MH5LXHC+RQKBgQCnzvuCZHKdYmuq4MEAy7GnqCZjayXiLHjzUWXcEL4CllpLZaol
69thAZkwaVs2ZD82jftJ/2LN4vIG52PDgzU+X4fLlhmSjMujkoaPk78yqllJt0f6
FuVLMQpu6R6KlpRNtrM81fhcOIOl7iqGSuy6luY9+XCHXprRGutMk4RGawKBgAvR
HHAPxfkq1LgMyw3C4n2hAaI/ZiYCTuzOHpcrEOFAPFbgreLxKQAfx0z0oSRvivWV
/jfxIy9VfAZ9e38uUuLyBE3iuM65v0HUOJXJYBjc/VV0xNFdb8oNChpA4kWkgCrC
0dMUb7Uw5yIFV7sifedUVoWSf1BMMi46/knc7yg9AoGAe9vzZN/ItzebydjAqrGs
8aclBoYDA1/4AxKhMLiUkrC89trzGQOE8UqKeq0qXmqk2UZK8irZwow4acpRwqEc
Cm3aOD0ZniFWUMHOpwoxdajhsOupMN9OGFkEm3DxRRnpObbjDLGMRzEmVNuh3GMD
h/geyMdFJwD1WyKZYo+QOBE=
-----END PRIVATE KEY-----
```

### ⚠️ Important Notes:

1. **Environment**: Set all variables for "Production", "Preview", and "Development"
2. **FIREBASE_PRIVATE_KEY**: Copy the entire private key including the BEGIN/END lines
3. **No Quotes**: Don't add quotes around the values in Vercel
4. **Case Sensitive**: Make sure the variable names match exactly

### 🚀 After Adding Variables:

1. **Redeploy** your project (or it will auto-deploy when you push the .env change)
2. **Test** the file upload functionality
3. **Check** browser console for any remaining errors

### 🔍 Troubleshooting:

If you still get errors:
- Check that all environment variables are set correctly
- Verify the API URL is pointing to your working Vercel domain
- Make sure the Firebase configuration is correct
