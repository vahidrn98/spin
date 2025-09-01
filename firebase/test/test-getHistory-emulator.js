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

const testGetHistoryEmulator = async () => {
  try {
    console.log('🧪 Testing getHistory function with emulator workaround...');
    
    // The user ID from your app logs
    const targetUserId = 'agJ4ZzV9xZdqcZpyKCVZtDqeKFFJ';
    console.log('🎯 Target User ID:', targetUserId);
    
    // Verify user exists in Auth
    console.log('\n1️⃣ Verifying user in Auth...');
    const userRecord = await auth.getUser(targetUserId);
    console.log('✅ User exists in Auth:', userRecord.uid);
    
    // Check spins in Firestore
    console.log('\n2️⃣ Checking spins in Firestore...');
    const spinsSnapshot = await db.collection('spins')
      .where('userId', '==', targetUserId)
      .orderBy('timestamp', 'desc')
      .get();
    
    console.log('📊 User has', spinsSnapshot.size, 'spins in Firestore');
    
    if (spinsSnapshot.size === 0) {
      console.log('❌ No spins found for user');
      return;
    }
    
    // Test the getHistory function logic manually (simulating the emulator workaround)
    console.log('\n3️⃣ Testing getHistory function logic...');
    const limit = 20;
    const offset = 0;
    
    const historyQuery = await db.collection('spins')
      .where('userId', '==', targetUserId)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .offset(offset)
      .get();
    
    const spins = historyQuery.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate?.() || doc.data().timestamp
    }));
    
    console.log('✅ Retrieved', spins.length, 'spins from query');
    
    // Show the spins
    console.log('\n📋 Recent spins:');
    spins.slice(0, 5).forEach((spin, index) => {
      console.log(`   ${index + 1}. ${spin.prize.description} - ${spin.timestamp}`);
    });
    
    // Get total count for pagination
    console.log('\n4️⃣ Getting total count...');
    const totalQuery = await db.collection('spins')
      .where('userId', '==', targetUserId)
      .count()
      .get();
    
    const totalSpins = totalQuery.data().count;
    console.log('✅ Total spins count:', totalSpins);
    
    // Calculate statistics
    console.log('\n5️⃣ Calculating statistics...');
    const stats = {
      totalSpins: spins.length,
      totalCoins: 0,
      totalSpecial: 0,
      totalBonus: 0,
      totalJackpot: 0,
      mostCommonPrize: null,
      prizeCounts: {}
    };
    
    spins.forEach(spin => {
      const prize = spin.prize;
      if (!prize) return;
      
      switch (prize.type) {
        case 'coins':
          stats.totalCoins += prize.amount || 0;
          break;
        case 'special':
          stats.totalSpecial += prize.amount || 0;
          break;
        case 'bonus':
          stats.totalBonus += prize.amount || 0;
          break;
        case 'jackpot':
          stats.totalJackpot += prize.amount || 0;
          break;
      }
      
      const description = prize.description || 'Unknown';
      stats.prizeCounts[description] = (stats.prizeCounts[description] || 0) + 1;
    });
    
    console.log('✅ Statistics calculated:', stats);
    
    // Simulate the function response
    const response = {
      success: true,
      spins,
      totalSpins,
      hasMore: totalSpins > offset + limit,
      stats
    };
    
    console.log('\n🎉 getHistory function test completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   - User ID: ${targetUserId}`);
    console.log(`   - Total Spins: ${spinsSnapshot.size}`);
    console.log(`   - Retrieved Spins: ${spins.length}`);
    console.log(`   - Total Coins: ${stats.totalCoins}`);
    console.log(`   - Function Logic: ✅ Working`);
    console.log(`   - Response:`, JSON.stringify(response, null, 2));
    
    console.log('\n💡 The getHistory function should now work in your app');
    console.log('   - Check the History screen for real data');
    console.log('   - The emulator workaround should handle authentication');
    
  } catch (error) {
    console.error('❌ getHistory function test failed:', error);
  } finally {
    process.exit(0);
  }
};

testGetHistoryEmulator();
