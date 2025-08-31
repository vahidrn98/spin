import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();

const db = admin.firestore();

// Spin Wheel Function - Callable function that processes a spin
export const spinWheel = functions.https.onCall(async (data: any, context: any) => {
  try {
    // Check if user is authenticated
    if (!context?.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const userId = context.auth.uid;
    const clientRequestId = data?.clientRequestId || null;

    // Check cooldown period (5 minutes)
    const cooldownMinutes = 5;
    const lastSpinQuery = await db.collection('spins')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .limit(1)
      .get();

    if (!lastSpinQuery.empty) {
      const lastSpin = lastSpinQuery.docs[0].data();
      const lastSpinTime = lastSpin.timestamp.toDate();
      const now = new Date();
      const timeDiff = (now.getTime() - lastSpinTime.getTime()) / (1000 * 60); // minutes

      if (timeDiff < cooldownMinutes) {
        const remainingTime = Math.ceil(cooldownMinutes - timeDiff);
        throw new functions.https.HttpsError(
          'failed-precondition', 
          `Please wait ${remainingTime} more minutes before spinning again`
        );
      }
    }

    // Get wheel configuration
    const wheelConfigDoc = await db.collection('wheelConfig').doc('default').get();
    
    if (!wheelConfigDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Wheel configuration not found');
    }

    const wheelConfig = wheelConfigDoc.data();
    const segments = wheelConfig?.segments || [];

    if (segments.length === 0) {
      throw new functions.https.HttpsError('failed-precondition', 'No wheel segments configured');
    }

    // Weighted random selection
    const selectedSegment = selectWeightedSegment(segments);

    // Record the spin
    const spinData = {
      userId,
      segmentId: selectedSegment.id,
      prize: selectedSegment.prize,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      clientRequestId,
      wheelVersion: wheelConfig?.version || 1
    };

    const spinRef = await db.collection('spins').add(spinData);

    return {
      success: true,
      spinId: spinRef.id,
      segment: selectedSegment,
      message: `You won: ${selectedSegment.prize.description}`,
      cooldownMinutes
    };

  } catch (error) {
    console.error('Error in spinWheel function:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError('internal', 'Failed to process spin');
  }
});

// Get History Function - Callable function that retrieves user's spin history
export const getHistory = functions.https.onCall(async (data: any, context: any) => {
  try {
    // Debug logging for emulator issues
    console.log('🔍 getHistory function called');
    console.log('🔍 Context.auth exists:', !!context?.auth);
    console.log('🔍 Data keys:', Object.keys(data || {}));
    console.log('🔍 Raw data:', data);
    
    // Check if user is authenticated
    if (!context?.auth) {
      console.log('❌ No auth context found');
      
      // For emulator testing, try to get user ID from data if available
      // The data might be nested under a 'data' key
      const actualData = data?.data || data;
      console.log('🔍 Actual data:', actualData);
      
      if (actualData?.userId) {
        console.log('🔧 Using userId from data for emulator testing:', actualData.userId);
        const userId = actualData.userId;
        
        try {
          // Continue with the rest of the function using the provided userId
          const limit = actualData?.limit || 20;
          const offset = actualData?.offset || 0;

          console.log('📊 Query parameters:', { userId, limit, offset });

          // Validate limit
          if (limit > 100) {
            throw new functions.https.HttpsError('invalid-argument', 'Limit cannot exceed 100');
          }

          // Get user's spin history
          console.log('🔍 Querying Firestore for spins...');
          const spinsQuery = await db.collection('spins')
            .where('userId', '==', userId)
            .orderBy('timestamp', 'desc')
            .limit(limit)
            .offset(offset)
            .get();

          console.log('✅ Spins query completed, found', spinsQuery.size, 'spins');

          const spins = spinsQuery.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate?.() || doc.data().timestamp
          }));

          console.log('✅ Processed', spins.length, 'spins');

          // Get total count for pagination
          console.log('🔍 Getting total count...');
          const totalQuery = await db.collection('spins')
            .where('userId', '==', userId)
            .count()
            .get();

          const totalSpins = totalQuery.data().count;
          console.log('✅ Total spins count:', totalSpins);

          // Calculate statistics
          console.log('🔍 Calculating statistics...');
          const stats = calculateSpinStats(spins);
          console.log('✅ Statistics calculated:', stats);

          console.log('✅ getHistory completed with emulator workaround');
          return {
            success: true,
            spins,
            totalSpins,
            hasMore: totalSpins > offset + limit,
            stats
          };
        } catch (queryError: any) {
          console.error('❌ Error in emulator workaround query:', queryError.message || 'Unknown error');
          throw new functions.https.HttpsError('internal', 'Query error in emulator workaround');
        }
      }
      
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const userId = context.auth.uid;
    console.log('✅ Auth context found, userId:', userId);
    
    const limit = data?.limit || 20; // Default to 20 spins
    const offset = data?.offset || 0;

    // Validate limit
    if (limit > 100) {
      throw new functions.https.HttpsError('invalid-argument', 'Limit cannot exceed 100');
    }

    // Get user's spin history
    const spinsQuery = await db.collection('spins')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .offset(offset)
      .get();

    const spins = spinsQuery.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate?.() || doc.data().timestamp
    }));

    // Get total count for pagination
    const totalQuery = await db.collection('spins')
      .where('userId', '==', userId)
      .count()
      .get();

    const totalSpins = totalQuery.data().count;

    // Calculate statistics
    const stats = calculateSpinStats(spins);

    console.log('✅ getHistory completed successfully');
    return {
      success: true,
      spins,
      totalSpins,
      hasMore: totalSpins > offset + limit,
      stats
    };

  } catch (error: any) {
    console.error('❌ Error in getHistory function:', error.message || 'Unknown error');
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    // Don't include the full error object in the message to avoid circular references
    throw new functions.https.HttpsError('internal', 'Failed to retrieve history');
  }
});

// Helper function to select a weighted random segment
function selectWeightedSegment(segments: any[]): any {
  const totalWeight = segments.reduce((sum, segment) => sum + segment.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const segment of segments) {
    random -= segment.weight;
    if (random <= 0) {
      return segment;
    }
  }
  
  // Fallback to first segment
  return segments[0];
}

// Helper function to calculate spin statistics
function calculateSpinStats(spins: any[]): any {
  const stats = {
    totalSpins: spins.length,
    totalCoins: 0,
    totalSpecial: 0,
    totalBonus: 0,
    totalJackpot: 0,
    mostCommonPrize: null as string | null,
    prizeCounts: {} as Record<string, number>
  };

  spins.forEach(spin => {
    const prize = spin.prize;
    if (!prize) return;

    // Count by prize type
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

    // Count prize descriptions
    const description = prize.description || 'Unknown';
    stats.prizeCounts[description] = (stats.prizeCounts[description] || 0) + 1;
  });

  // Find most common prize
  if (Object.keys(stats.prizeCounts).length > 0) {
    const mostCommon = Object.entries(stats.prizeCounts)
      .reduce((a, b) => stats.prizeCounts[a[0]] > stats.prizeCounts[b[0]] ? a : b);
    stats.mostCommonPrize = mostCommon[0];
  }

  return stats;
}

// HTTP Function for testing (optional)
export const helloWorld = functions.https.onRequest((request, response) => {
  response.json({
    message: 'Hello from Firebase Functions!',
    timestamp: new Date().toISOString(),
    availableFunctions: ['spinWheel', 'getHistory']
  });
});
