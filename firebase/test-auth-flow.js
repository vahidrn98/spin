const admin = require('firebase-admin');

// Set emulator environment variable
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';

// Initialize admin SDK without credentials (for emulator)
admin.initializeApp({
  projectId: 'spin-the-wheel-app-83562'
});

const auth = admin.auth();

const testAuthFlow = async () => {
  try {
    console.log('🧪 Testing Authentication Flow...');
    
    // Test 1: Check if we can create users
    console.log('\n1️⃣ Testing user creation...');
    const testUser = await auth.createUser({
      email: 'auto-test@example.com',
      password: 'password123',
      displayName: 'Auto Test User'
    });
    console.log('✅ Test user created:', testUser.uid);
    
    // Test 2: Check if we can list users
    console.log('\n2️⃣ Testing user listing...');
    const listUsersResult = await auth.listUsers();
    console.log('✅ Users in emulator:', listUsersResult.users.length);
    
    // Test 3: Check if we can get user by UID
    console.log('\n3️⃣ Testing user retrieval...');
    const retrievedUser = await auth.getUser(testUser.uid);
    console.log('✅ User retrieved:', retrievedUser.uid, retrievedUser.email);
    
    // Test 4: Test anonymous user creation (what the app does)
    console.log('\n4️⃣ Testing anonymous user creation...');
    const anonymousUser = await auth.createUser({
      displayName: 'Anonymous User'
    });
    console.log('✅ Anonymous user created:', anonymousUser.uid);
    
    // Test 5: Create custom token for testing
    console.log('\n5️⃣ Creating custom token...');
    const customToken = await auth.createCustomToken(anonymousUser.uid);
    console.log('✅ Custom token created for anonymous user');
    
    console.log('\n🎉 Authentication flow test completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   - Regular User: ${testUser.uid}`);
    console.log(`   - Anonymous User: ${anonymousUser.uid}`);
    console.log(`   - Total Users: ${listUsersResult.users.length}`);
    console.log(`   - Auth Emulator: ✅ Working`);
    
    console.log('\n💡 For app testing:');
    console.log('   - The app should automatically create anonymous users');
    console.log('   - Check the Firebase emulator UI at http://localhost:4000');
    console.log('   - Look at the Auth tab to see created users');
    
  } catch (error) {
    console.error('❌ Auth flow test failed:', error);
  } finally {
    process.exit(0);
  }
};

testAuthFlow();
