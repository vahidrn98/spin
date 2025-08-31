import { create } from 'zustand';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged, 
  User,
  signOut 
} from '@react-native-firebase/auth';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  signIn: async () => {
    try {
      set({ loading: true });
      const auth = getAuth();
      await signInAnonymously(auth);
    } catch (error) {
      console.error('Sign in error:', error);
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  },

  initializeAuth: () => {
    const auth = getAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      set({ 
        user, 
        isAuthenticated: !!user, 
        loading: false 
      });
    });

    // Return unsubscribe function for cleanup
    return unsubscribe;
  },
}));
