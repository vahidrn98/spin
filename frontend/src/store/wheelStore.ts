import { create } from 'zustand';
import { getFirestore, doc, getDoc } from '@react-native-firebase/firestore';

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

export const useWheelStore = create<WheelStore>((set, get) => ({
  wheelConfig: null,
  loading: false,
  error: null,

  fetchWheelConfig: async () => {
    try {
      set({ loading: true, error: null });
      
      const db = getFirestore();
      const wheelConfigDoc = await getDoc(doc(db, 'wheelConfig', 'default'));
      
      if (wheelConfigDoc.exists()) {
        const data = wheelConfigDoc.data() as WheelConfig;
        set({ wheelConfig: data, loading: false });
      } else {
        set({ 
          error: 'Wheel configuration not found', 
          loading: false 
        });
      }
    } catch (error) {
      console.error('Error fetching wheel config:', error);
      set({ 
        error: 'Failed to load wheel configuration', 
        loading: false 
      });
    }
  },
}));
