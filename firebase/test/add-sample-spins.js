const admin = require('firebase-admin');

// Set emulator environment variable
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

// Initialize admin SDK without credentials (for emulator)
admin.initializeApp({
  projectId: 'spin-the-wheel-app-83562'
});

const db = admin.firestore();

const addSampleSpins = async () => {
  try {
    console.log('🎰 Adding sample spin data...');
    
    // Get existing users or create a test user
    const usersSnapshot = await db.collection('users').limit(1).get();
    let userId;
    
    if (!usersSnapshot.empty) {
      userId = usersSnapshot.docs[0].id;
      console.log('✅ Using existing user:', userId);
    } else {
      // Create a test user
      const userRef = await db.collection('users').add({
        email: 'test@example.com',
        displayName: 'Test User',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      userId = userRef.id;
      console.log('✅ Created test user:', userId);
    }
    
    // Sample spin data
    const sampleSpins = [
      {
        userId: userId,
        segmentId: 1,
        prize: {
          type: "coins",
          amount: 100,
          description: "100 Coins!"
        },
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        clientRequestId: `sample_${Date.now()}_1`,
        wheelVersion: 1
      },
      {
        userId: userId,
        segmentId: 2,
        prize: {
          type: "coins",
          amount: 50,
          description: "50 Coins!"
        },
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        clientRequestId: `sample_${Date.now()}_2`,
        wheelVersion: 1
      },
      {
        userId: userId,
        segmentId: 3,
        prize: {
          type: "special",
          amount: 1,
          description: "Diamond Reward!"
        },
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        clientRequestId: `sample_${Date.now()}_3`,
        wheelVersion: 1
      },
      {
        userId: userId,
        segmentId: 4,
        prize: {
          type: "coins",
          amount: 25,
          description: "25 Coins!"
        },
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        clientRequestId: `sample_${Date.now()}_4`,
        wheelVersion: 1
      },
      {
        userId: userId,
        segmentId: 5,
        prize: {
          type: "bonus",
          amount: 2,
          description: "2x Multiplier!"
        },
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        clientRequestId: `sample_${Date.now()}_5`,
        wheelVersion: 1
      },
      {
        userId: userId,
        segmentId: 6,
        prize: {
          type: "coins",
          amount: 10,
          description: "10 Coins!"
        },
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        clientRequestId: `sample_${Date.now()}_6`,
        wheelVersion: 1
      },
      {
        userId: userId,
        segmentId: 7,
        prize: {
          type: "coins",
          amount: 75,
          description: "75 Coins!"
        },
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        clientRequestId: `sample_${Date.now()}_7`,
        wheelVersion: 1
      },
      {
        userId: userId,
        segmentId: 8,
        prize: {
          type: "jackpot",
          amount: 1000,
          description: "JACKPOT! 1000 Coins!"
        },
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        clientRequestId: `sample_${Date.now()}_8`,
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
    console.log('✅ Added', sampleSpins.length, 'sample spins to database');
    
    // Verify the spins were added
    const spinsSnapshot = await db.collection('spins')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .get();
    
    console.log('📊 Total spins for user:', spinsSnapshot.size);
    
    // Show some sample data
    spinsSnapshot.docs.slice(0, 3).forEach((doc, index) => {
      const data = doc.data();
      console.log(`   ${index + 1}. ${data.prize.description} - ${data.timestamp.toDate()}`);
    });
    
    console.log('\n🎉 Sample spin data added successfully!');
    console.log('\n💡 Now test the History screen in your app');
    console.log('   - The history should show real data from Firebase');
    console.log('   - If Firebase fails, it will fall back to mock data');
    
  } catch (error) {
    console.error('❌ Error adding sample spins:', error);
  } finally {
    process.exit(0);
  }
};

addSampleSpins();
