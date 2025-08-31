import { create } from 'zustand';
import { firestore } from '../../firebase.config';

interface WheelSegment {
  id: number;
  label: string;
  color: string;
  weight: number;
  prize: {
    type: string;
    amount: number;
    description: string;
  };
}

interface WheelConfig {
  segments: WheelSegment[];
  totalWeight: number;
  cooldownMinutes: number;
  version: number;
}

interface WheelStore {
  wheelConfig: WheelConfig | null;
  loading: boolean;
  error: string | null;
  fetchWheelConfig: () => Promise<void>;
}

// Mock data for development
const mockWheelConfig: WheelConfig = {
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
  version: 1
};

export const useWheelStore = create<WheelStore>((set, get) => ({
  wheelConfig: null,
  loading: false,
  error: null,

  fetchWheelConfig: async () => {
    try {
      set({ loading: true, error: null });
      
      console.log('🔍 Attempting to fetch wheel config...');
      
      // Use mock data for now
      console.log('🎭 Using mock wheel configuration');
      set({ wheelConfig: mockWheelConfig, loading: false });
      
      // Firebase code (commented out for now)
      /*
      if (!firestore) {
        throw new Error('Firestore is not initialized');
      }

      const firestoreInstance = firestore();
      console.log('📡 Firestore instance created');
      
      const wheelConfigDoc = await firestoreInstance
        .collection('wheelConfig')
        .doc('default');
      
      console.log('📄 Document fetched, exists:', wheelConfigDoc.path);

      const doc = await wheelConfigDoc.get();
      console.log('📄 Document fetched, exists:', doc.exists);
      
      if (doc.exists) {
        const data = doc.data() as WheelConfig;
        console.log('✅ Wheel config loaded:', data);
        set({ wheelConfig: data, loading: false });
      } else {
        console.log('⚠️ Wheel configuration document does not exist');
        set({ 
          error: 'Wheel configuration not found. Please run the seed script.', 
          loading: false 
        });
      }
      */
      
    } catch (error: any) {
      console.error('❌ Error fetching wheel config:', error);
      
      let errorMessage = 'Failed to load wheel configuration';
      
      if (error.code === 'firestore/unavailable') {
        errorMessage = 'Firestore service is unavailable. Please check if emulators are running.';
      } else if (error.code === 'firestore/permission-denied') {
        errorMessage = 'Permission denied. Please check Firestore rules.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      set({ 
        error: errorMessage, 
        loading: false 
      });
    }
  },
}));
