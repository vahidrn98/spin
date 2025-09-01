const admin = require('firebase-admin');

// Set emulator environment variable
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

// Initialize admin SDK without credentials (for emulator)
admin.initializeApp({
  projectId: 'spin-the-wheel-app-83562'
});

const db = admin.firestore();

const addSpinsForUser = async () => {
  try {
    console.log('🎰 Adding spins for specific user...');
    
    // The user ID from your app logs
    const targetUserId = 'agJ4ZzV9xZdqcZpyKCVZtDqeKFFJ';
    console.log('🎯 Target User ID:', targetUserId);
    
    // Check if user exists in Auth emulator
    console.log('\n1️⃣ Checking if user exists...');
    try {
      const auth = admin.auth();
      const userRecord = await auth.getUser(targetUserId);
      console.log('✅ User exists in Auth emulator:', userRecord.uid);
    } catch (error) {
      console.log('⚠️ User not found in Auth emulator, but that\'s okay for testing');
    }
    
    // Check existing spins for this user
    console.log('\n2️⃣ Checking existing spins...');
    const existingSpins = await db.collection('spins')
      .where('userId', '==', targetUserId)
      .get();
    
    console.log('📊 User currently has', existingSpins.size, 'spins');
    
    // Create sample spins for this specific user
    console.log('\n3️⃣ Creating sample spins...');
    const sampleSpins = [
      {
        userId: targetUserId,
        segmentId: 1,
        prize: {
          type: "coins",
          amount: 100,
          description: "100 Coins!"
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        clientRequestId: `app_user_${Date.now()}_1`,
        wheelVersion: 1
      },
      {
        userId: targetUserId,
        segmentId: 2,
        prize: {
          type: "coins",
          amount: 50,
          description: "50 Coins!"
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        clientRequestId: `app_user_${Date.now()}_2`,
        wheelVersion: 1
      },
      {
        userId: targetUserId,
        segmentId: 3,
        prize: {
          type: "special",
          amount: 1,
          description: "Diamond Reward!"
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 90), // 1.5 hours ago
        clientRequestId: `app_user_${Date.now()}_3`,
        wheelVersion: 1
      },
      {
        userId: targetUserId,
        segmentId: 4,
        prize: {
          type: "bonus",
          amount: 2,
          description: "2x Multiplier!"
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
        clientRequestId: `app_user_${Date.now()}_4`,
        wheelVersion: 1
      },
      {
        userId: targetUserId,
        segmentId: 5,
        prize: {
          type: "jackpot",
          amount: 1000,
          description: "JACKPOT! 1000 Coins!"
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 150), // 2.5 hours ago
        clientRequestId: `app_user_${Date.now()}_5`,
        wheelVersion: 1
      }
    ];
    
    // Add spins to database
    const batch = db.batch();
    sampleSpins.forEach((spin, index) => {
      const spinRef = db.collection('spins').doc();
      batch.set(spinRef, {
        ...spin,
        timestamp: new Date(Date.now() - (index * 30 * 60 * 1000)) // 30 minutes apart
      });
    });
    
    await batch.commit();
    console.log('✅ Added', sampleSpins.length, 'sample spins for user');
    
    // Verify the spins were added
    console.log('\n4️⃣ Verifying spins were added...');
    const updatedSpins = await db.collection('spins')
      .where('userId', '==', targetUserId)
      .orderBy('timestamp', 'desc')
      .get();
    
    console.log('📊 User now has', updatedSpins.size, 'total spins');
    
    // Show the spins
    console.log('\n📋 Recent spins:');
    updatedSpins.docs.slice(0, 5).forEach((doc, index) => {
      const data = doc.data();
      console.log(`   ${index + 1}. ${data.prize.description} - ${data.timestamp.toDate()}`);
    });
    
    console.log('\n🎉 Spins added successfully for user:', targetUserId);
    console.log('\n💡 Now test the History screen in your app:');
    console.log('   - The history should show real data from Firebase');
    console.log('   - The getHistory function should work properly');
    console.log('   - No more "User must be authenticated" error');
    
  } catch (error) {
    console.error('❌ Error adding spins for user:', error);
  } finally {
    process.exit(0);
  }
};

addSpinsForUser();
