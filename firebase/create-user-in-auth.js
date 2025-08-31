const admin = require('firebase-admin');

// Set emulator environment variable
process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';

// Initialize admin SDK without credentials (for emulator)
admin.initializeApp({
  projectId: 'spin-the-wheel-app-83562'
});

const auth = admin.auth();

const createUserInAuth = async () => {
  try {
    console.log('👤 Creating user in Auth emulator...');
    
    // The user ID from your app logs
    const targetUserId = 'agJ4ZzV9xZdqcZpyKCVZtDqeKFFJ';
    console.log('🎯 Target User ID:', targetUserId);
    
    // Check if user already exists
    console.log('\n1️⃣ Checking if user exists in Auth...');
    try {
      const existingUser = await auth.getUser(targetUserId);
      console.log('✅ User already exists in Auth emulator:', existingUser.uid);
      console.log('   Email:', existingUser.email || 'Anonymous');
      console.log('   Display Name:', existingUser.displayName || 'No name');
      return;
    } catch (error) {
      console.log('⚠️ User not found in Auth emulator, creating...');
    }
    
    // Create the user in Auth emulator
    console.log('\n2️⃣ Creating user in Auth emulator...');
    const userRecord = await auth.createUser({
      uid: targetUserId, // Use the specific UID
      email: 'anonymous@example.com',
      displayName: 'Anonymous User',
      emailVerified: true
    });
    
    console.log('✅ User created in Auth emulator:');
    console.log('   UID:', userRecord.uid);
    console.log('   Email:', userRecord.email);
    console.log('   Display Name:', userRecord.displayName);
    
    // Verify the user was created
    console.log('\n3️⃣ Verifying user creation...');
    const verifyUser = await auth.getUser(targetUserId);
    console.log('✅ User verification successful:', verifyUser.uid);
    
    // List all users to confirm
    console.log('\n4️⃣ Listing all users in emulator...');
    const listUsersResult = await auth.listUsers();
    console.log('📊 Total users in emulator:', listUsersResult.users.length);
    
    const targetUser = listUsersResult.users.find(user => user.uid === targetUserId);
    if (targetUser) {
      console.log('✅ Target user found in list:', targetUser.uid);
    } else {
      console.log('❌ Target user not found in list');
    }
    
    console.log('\n🎉 User creation completed successfully!');
    console.log('\n💡 Now the Firebase Functions should work:');
    console.log('   - The getHistory function will recognize the user');
    console.log('   - No more "User must be authenticated" error');
    console.log('   - The History screen should show real data');
    
  } catch (error) {
    console.error('❌ Error creating user in Auth:', error);
  } finally {
    process.exit(0);
  }
};

createUserInAuth();
