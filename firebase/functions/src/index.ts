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
    // Check if user is authenticated
    if (!context?.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const userId = context.auth.uid;
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

    return {
      success: true,
      spins,
      totalSpins,
      hasMore: totalSpins > offset + limit,
      stats
    };

  } catch (error) {
    console.error('Error in getHistory function:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
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
