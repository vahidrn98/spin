const admin = require('firebase-admin');

// Set emulator environment variable
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

// Initialize admin SDK without credentials (for emulator)
admin.initializeApp({
  projectId: 'spin-the-wheel-app-83562'
});

const db = admin.firestore();

const seedData = async () => {
  try {
    console.log('🌱 Seeding initial data...');

    // Seed wheel configuration
    const wheelConfig = {
      segments: [
        {
          id: 1,
          label: "🎁 Prize A",
          color: "#4ADE80", // Green
          weight: 10,
          prize: {
            type: "coins",
            amount: 100,
            description: "100 Coins!"
          }
        },
        {
          id: 2,
          label: "🏆 Prize B", 
          color: "#06B6D4", // Cyan
          weight: 15,
          prize: {
            type: "coins",
            amount: 50,
            description: "50 Coins!"
          }
        },
        {
          id: 3,
          label: "💎 Rare Prize",
          color: "#8B5CF6", // Purple
          weight: 5,
          prize: {
            type: "special",
            amount: 1,
            description: "Diamond Reward!"
          }
        },
        {
          id: 4,
          label: "🎯 Prize C",
          color: "#F59E0B", // Amber
          weight: 20,
          prize: {
            type: "coins", 
            amount: 25,
            description: "25 Coins!"
          }
        },
        {
          id: 5,
          label: "⭐ Bonus",
          color: "#EC4899", // Pink
          weight: 15,
          prize: {
            type: "bonus",
            amount: 2,
            description: "2x Multiplier!"
          }
        },
        {
          id: 6,
          label: "🎈 Prize D",
          color: "#10B981", // Emerald
          weight: 20,
          prize: {
            type: "coins",
            amount: 10,
            description: "10 Coins!"
          }
        },
        {
          id: 7,
          label: "🎊 Prize E",
          color: "#3B82F6", // Blue
          weight: 10,
          prize: {
            type: "coins",
            amount: 75,
            description: "75 Coins!"
          }
        },
        {
          id: 8,
          label: "🔥 Jackpot",
          color: "#EF4444", // Red
          weight: 5,
          prize: {
            type: "jackpot",
            amount: 1000,
            description: "JACKPOT! 1000 Coins!"
          }
        }
      ],
      totalWeight: 100,
      cooldownMinutes: 1,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      version: 1
    };

    // Create wheel configuration
    await db.collection('wheelConfig').doc('default').set(wheelConfig);
    console.log('✅ Wheel configuration created');

    // Create app settings
    const appSettings = {
      maintenanceMode: false,
      minAppVersion: '1.0.0',
      wheelEnabled: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('settings').doc('app').set(appSettings);
    console.log('✅ App settings created');

    console.log('🎉 Data seeding completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

// Run the seeding
seedData();
