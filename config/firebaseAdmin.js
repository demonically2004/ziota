const admin = require("firebase-admin");

try {
    const serviceAccount = require("./firebase-adminsdk.json");
    console.log('✅ Firebase Admin: Service account loaded successfully');
    console.log('🔍 Firebase Admin: Project ID:', serviceAccount.project_id);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });

    console.log('✅ Firebase Admin: Initialized successfully');
} catch (error) {
    console.error('❌ Firebase Admin: Initialization failed:', error);
    throw error;
}

module.exports = admin;
