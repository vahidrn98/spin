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

const testUserAuthentication = async () => {
  try {
    console.log('🧪 Testing User Authentication...');
    
    // Test 1: List all users in the emulator
    console.log('\n1️⃣ Listing all users in emulator...');
    const listUsersResult = await auth.listUsers();
    console.log('✅ Total users in emulator:', listUsersResult.users.length);
    
    if (listUsersResult.users.length > 0) {
      listUsersResult.users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.uid} - ${user.email || 'Anonymous'} - ${user.displayName || 'No name'}`);
      });
    } else {
      console.log('   No users found in emulator');
    }
    
    // Test 2: Create a test user if none exist
    let testUser;
    if (listUsersResult.users.length === 0) {
      console.log('\n2️⃣ Creating test user...');
      testUser = await auth.createUser({
        email: 'test@example.com',
        password: 'password123',
        displayName: 'Test User'
      });
      console.log('✅ Test user created:', testUser.uid);
    } else {
      testUser = listUsersResult.users[0];
      console.log('\n2️⃣ Using existing user:', testUser.uid);
    }
    
    // Test 3: Check if user has any spins
    console.log('\n3️⃣ Checking user spins...');
    const spinsSnapshot = await db.collection('spins')
      .where('userId', '==', testUser.uid)
      .get();
    
    console.log('✅ User has', spinsSnapshot.size, 'spins');
    
    if (spinsSnapshot.size === 0) {
      console.log('   No spins found for this user');
    } else {
      spinsSnapshot.docs.slice(0, 3).forEach((doc, index) => {
        const data = doc.data();
        console.log(`   ${index + 1}. ${data.prize.description} - ${data.timestamp.toDate()}`);
      });
    }
    
    // Test 4: Create some test spins for this user
    console.log('\n4️⃣ Creating test spins for user...');
    const testSpins = [
      {
        userId: testUser.uid,
        segmentId: 1,
        prize: {
          type: "coins",
          amount: 100,
          description: "100 Coins!"
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        clientRequestId: `auth_test_${Date.now()}_1`,
        wheelVersion: 1
      },
      {
        userId: testUser.uid,
        segmentId: 2,
        prize: {
          type: "coins",
          amount: 50,
          description: "50 Coins!"
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        clientRequestId: `auth_test_${Date.now()}_2`,
        wheelVersion: 1
      }
    ];
    
    const batch = db.batch();
    testSpins.forEach((spin) => {
      const spinRef = db.collection('spins').doc();
      batch.set(spinRef, spin);
    });
    await batch.commit();
    console.log('✅ Added', testSpins.length, 'test spins');
    
    // Test 5: Verify spins were added
    console.log('\n5️⃣ Verifying spins were added...');
    const updatedSpinsSnapshot = await db.collection('spins')
      .where('userId', '==', testUser.uid)
      .get();
    
    console.log('✅ User now has', updatedSpinsSnapshot.size, 'spins');
    
    // Test 6: Test the getHistory function logic
    console.log('\n6️⃣ Testing getHistory function logic...');
    const historyQuery = await db.collection('spins')
      .where('userId', '==', testUser.uid)
      .orderBy('timestamp', 'desc')
      .limit(20)
      .get();
    
    const spins = historyQuery.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate?.() || doc.data().timestamp
    }));
    
    console.log('✅ Retrieved', spins.length, 'spins from history query');
    
    // Test 7: Create a custom token for this user
    console.log('\n7️⃣ Creating custom token...');
    const customToken = await auth.createCustomToken(testUser.uid);
    console.log('✅ Custom token created');
    console.log('   Token preview:', customToken.substring(0, 50) + '...');
    
    console.log('\n🎉 User authentication test completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   - Test User ID: ${testUser.uid}`);
    console.log(`   - User Email: ${testUser.email || 'Anonymous'}`);
    console.log(`   - Total Spins: ${updatedSpinsSnapshot.size}`);
    console.log(`   - Custom Token: Available`);
    
    console.log('\n💡 For app testing:');
    console.log('   1. The app should use the same user ID:', testUser.uid);
    console.log('   2. Check the History screen for real data');
    console.log('   3. If authentication fails, check the user ID mismatch');
    console.log('   4. Use the custom token if needed for testing');
    
  } catch (error) {
    console.error('❌ User authentication test failed:', error);
  } finally {
    process.exit(0);
  }
};

testUserAuthentication();
