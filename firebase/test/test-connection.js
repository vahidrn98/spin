const admin = require('firebase-admin');

// Set emulator environment variable
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

// Initialize admin SDK without credentials (for emulator)
admin.initializeApp({
  projectId: 'spin-the-wheel-app-83562'
});

const db = admin.firestore();

const testConnection = async () => {
  try {
    console.log('🔍 Testing Firestore emulator connection...');
    
    // Test basic connection
    const testDoc = await db.collection('test').doc('connection').get();
    console.log('✅ Basic connection test passed');
    
    // Check if wheel config exists
    const wheelConfig = await db.collection('wheelConfig').doc('default').get();
    
    if (wheelConfig.exists) {
      console.log('✅ Wheel configuration found:', wheelConfig.data());
    } else {
      console.log('⚠️ Wheel configuration not found - you need to run the seed script');
    }
    
    // List all collections
    const collections = await db.listCollections();
    console.log('📚 Available collections:', collections.map(col => col.id));
    
  } catch (error) {
    console.error('❌ Connection test failed:', error);
  } finally {
    process.exit(0);
  }
};

testConnection();
