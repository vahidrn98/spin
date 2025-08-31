import { create } from 'zustand';
import { auth } from '../../firebase.config';

interface AuthStore {
  user: any;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  initializeAuth: () => () => void;
}

// Mock user data for development
const mockUser = {
  uid: 'mock-user-123',
  email: 'mock@example.com',
  displayName: 'Mock User',
  isAnonymous: true,
  emailVerified: false,
  photoURL: null,
  phoneNumber: null,
  metadata: {
    creationTime: new Date().toISOString(),
    lastSignInTime: new Date().toISOString()
  }
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  signIn: async () => {
    try {
      set({ loading: true });
      
      // Use mock authentication for now
      console.log('🎭 Using mock authentication');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      set({ user: mockUser, isAuthenticated: true, loading: false });
      
      // Firebase code (commented out for now)
      /*
      await auth().signInAnonymously();
      */
    } catch (error) {
      console.error('Sign in error:', error);
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      // Use mock sign out for now
      console.log('🎭 Mock sign out');
      set({ user: null, isAuthenticated: false });
      
      // Firebase code (commented out for now)
      /*
      await auth().signOut();
      */
    } catch (error) {
      console.error('Sign out error:', error);
    }
  },

  initializeAuth: () => {
    // Use mock authentication initialization for now
    console.log('🎭 Initializing mock authentication');
    
    // Simulate a brief loading period
    setTimeout(() => {
      set({ 
        user: mockUser, 
        isAuthenticated: true, 
        loading: false 
      });
    }, 500);
    
    // Return a mock unsubscribe function
    const mockUnsubscribe = () => {
      console.log('🎭 Mock auth unsubscribe');
    };
    
    // Firebase code (commented out for now)
    /*
    const unsubscribe = auth().onAuthStateChanged((user) => {
      set({ 
        user, 
        isAuthenticated: !!user, 
        loading: false 
      });
    });
    return unsubscribe;
    */
    
    return mockUnsubscribe;
  },
}));
