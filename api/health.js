// Health check endpoint for Vercel
export default function handler(req, res) {
  res.status(200).json({
    status: 'OK',
    message: 'Ziota Backend API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    hasMongoUri: !!process.env.MONGO_URI,
    hasJwtSecret: !!process.env.JWT_SECRET,
    hasCloudinary: !!(process.env.CLOUD_NAME && process.env.CLOUD_API_KEY),
    hasFirebase: !!process.env.FIREBASE_PROJECT_ID
  });
}
