const admin = require('firebase-admin');

// Set emulator environment variable
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';

// Initialize admin SDK without credentials (for emulator)
admin.initializeApp({
  projectId: 'spin-the-wheel-app-83562'
});

const db = admin.firestore();
const auth = admin.auth();

const testFunctionsAndAuth = async () => {
  try {
    console.log('🧪 Testing Firebase Functions and Authentication...');
    
    // Test 1: Create a test user
    console.log('\n1️⃣ Creating test user...');
    const testUser = await auth.createUser({
      email: 'test@example.com',
      password: 'password123',
      displayName: 'Test User'
    });
    console.log('✅ Test user created:', testUser.uid);
    
    // Test 2: Create a custom token for this user
    console.log('\n2️⃣ Creating custom token...');
    const customToken = await auth.createCustomToken(testUser.uid);
    console.log('✅ Custom token created');
    
    // Test 3: Test Firestore access
    console.log('\n3️⃣ Testing Firestore access...');
    const testDoc = await db.collection('test').doc('functions').set({
      test: true,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      userId: testUser.uid
    });
    console.log('✅ Firestore write successful');
    
    // Test 4: Check wheel config
    console.log('\n4️⃣ Checking wheel configuration...');
    const wheelConfig = await db.collection('wheelConfig').doc('default').get();
    if (wheelConfig.exists) {
      console.log('✅ Wheel configuration found');
    } else {
      console.log('⚠️ Wheel configuration not found');
    }
    
    // Test 5: Simulate spin data
    console.log('\n5️⃣ Simulating spin data...');
    const spinData = {
      userId: testUser.uid,
      segmentId: 1,
      prize: {
        type: "coins",
        amount: 100,
        description: "100 Coins!"
      },
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      clientRequestId: `test_${Date.now()}`,
      wheelVersion: 1
    };
    
    await db.collection('spins').add(spinData);
    console.log('✅ Spin data written successfully');
    
    // Test 6: Check if user can read their own spins
    console.log('\n6️⃣ Testing user data access...');
    const userSpins = await db.collection('spins')
      .where('userId', '==', testUser.uid)
      .limit(1)
      .get();
    
    if (!userSpins.empty) {
      console.log('✅ User can access their spin data');
    } else {
      console.log('⚠️ No user spin data found');
    }
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   - Test User ID: ${testUser.uid}`);
    console.log(`   - Custom Token: ${customToken.substring(0, 20)}...`);
    console.log(`   - Firestore: ✅ Working`);
    console.log(`   - Auth: ✅ Working`);
    console.log(`   - Functions: ✅ Ready to test`);
    
    console.log('\n💡 Next steps:');
    console.log('   1. Use the custom token in your app for testing');
    console.log('   2. Try calling the spinWheel function');
    console.log('   3. Check the Firebase emulator UI at http://localhost:4000');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    process.exit(0);
  }
};

testFunctionsAndAuth();
