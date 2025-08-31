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

// Mock user data for development fallback
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
      
      console.log('🔐 Attempting Firebase anonymous sign in...');
      
      // Try Firebase authentication first
      try {
        const userCredential = await auth().signInAnonymously();
        console.log('✅ Firebase authentication successful:', userCredential.user.uid);
        set({ user: userCredential.user, isAuthenticated: true, loading: false });
      } catch (firebaseError) {
        console.warn('⚠️ Firebase auth failed, using mock authentication:', firebaseError);
        
        // Fallback to mock authentication
        console.log('🎭 Using mock authentication');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        set({ user: mockUser, isAuthenticated: true, loading: false });
      }
      
    } catch (error) {
      console.error('❌ Sign in error:', error);
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      console.log('🔐 Attempting Firebase sign out...');
      
      // Try Firebase sign out first
      try {
        await auth().signOut();
        console.log('✅ Firebase sign out successful');
        set({ user: null, isAuthenticated: false });
      } catch (firebaseError) {
        console.warn('⚠️ Firebase sign out failed, using mock sign out:', firebaseError);
        
        // Fallback to mock sign out
        console.log('🎭 Mock sign out');
        set({ user: null, isAuthenticated: false });
      }
      
    } catch (error) {
      console.error('❌ Sign out error:', error);
    }
  },

  initializeAuth: () => {
    console.log('🔐 Initializing Firebase authentication...');
    
    // Try Firebase auth state listener first
    try {
      const unsubscribe = auth().onAuthStateChanged((user) => {
        console.log('✅ Firebase auth state changed:', user ? user.uid : 'No user');
        
        if (user) {
          console.log('🔐 User authenticated:', {
            uid: user.uid,
            isAnonymous: user.isAnonymous,
            emailVerified: user.emailVerified
          });
          
          set({ 
            user, 
            isAuthenticated: true, 
            loading: false 
          });
        } else {
          console.log('🔐 No user found, attempting automatic sign in...');
          
          // Add a small delay to ensure Firebase SDK is fully initialized
          setTimeout(async () => {
            // Try to automatically sign in anonymously
            try {
              const userCredential = await auth().signInAnonymously();
              console.log('✅ Automatic sign in successful:', userCredential.user.uid);
              
              // The auth state listener will be called again with the new user
              // so we don't need to set the state here
            } catch (autoSignInError: any) {
              console.warn('⚠️ Automatic sign in failed, using mock auth:', autoSignInError);
              
              // Fallback to mock authentication
              console.log('🎭 Using mock authentication for auto sign in');
              set({ 
                user: mockUser, 
                isAuthenticated: true, 
                loading: false 
              });
            }
          }, 1000); // 1 second delay
        }
      });
      
      console.log('✅ Firebase auth listener initialized');
      return unsubscribe;
      
    } catch (firebaseError) {
      console.warn('⚠️ Firebase auth initialization failed, using mock auth:', firebaseError);
      
      // Fallback to mock authentication
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
      
      return mockUnsubscribe;
    }
  },
}));
