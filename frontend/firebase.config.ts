import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions';
import { Platform } from 'react-native';

// For React Native Firebase, the configuration is handled in the native files
// (google-services.json for Android and GoogleService-Info.plist for iOS)
// The SDK automatically initializes when the app starts

// Connect to Firebase emulators
const useEmulators = () => {
  // Determine the correct emulator host based on platform and environment
  let EMULATOR_HOST = 'localhost';
  
  if (Platform.OS === 'android') {
    // For Android emulator, use 10.0.2.2
    // For physical Android device, you'll need to use your computer's IP address
    EMULATOR_HOST = '10.0.2.2';
    
    // Uncomment and replace with your computer's IP address for physical devices
    // EMULATOR_HOST = '192.168.1.XXX'; // Replace with your actual IP
  } else if (Platform.OS === 'ios') {
    // For iOS simulator, use localhost
    // For physical iOS device, you'll need to use your computer's IP address
    EMULATOR_HOST = 'localhost';
    
    // Uncomment and replace with your computer's IP address for physical devices
    // EMULATOR_HOST = '192.168.1.XXX'; // Replace with your actual IP
  }
  
  // Default emulator ports - adjust if you're using different ports
  const FIRESTORE_PORT = 8080;
  const AUTH_PORT = 9099;
  const FUNCTIONS_PORT = 5001;
  
  try {
    console.log('🔥 Initializing Firebase emulator connections...');
    console.log(`📍 Platform: ${Platform.OS}`);
    console.log(`📍 Emulator Host: ${EMULATOR_HOST}`);
    console.log(`📍 Firestore Port: ${FIRESTORE_PORT}`);
    console.log(`📍 Auth Port: ${AUTH_PORT}`);
    console.log(`📍 Functions Port: ${FUNCTIONS_PORT}`);
    
    // Connect to Firestore emulator
    firestore().useEmulator(EMULATOR_HOST, FIRESTORE_PORT);
    console.log(`✅ Firestore emulator connected: ${EMULATOR_HOST}:${FIRESTORE_PORT}`);
    
    // Connect to Auth emulator
    auth().useEmulator(`http://${EMULATOR_HOST}:${AUTH_PORT}`);
    console.log(`✅ Auth emulator connected: ${EMULATOR_HOST}:${AUTH_PORT}`);
    
    // Connect to Functions emulator
    functions().useEmulator(EMULATOR_HOST, FUNCTIONS_PORT);
    console.log(`✅ Functions emulator connected: ${EMULATOR_HOST}:${FUNCTIONS_PORT}`);
    
    console.log('🎉 All Firebase emulators connected successfully!');
    
    // Test the connections
    setTimeout(() => {
      console.log('🧪 Testing emulator connections...');
      
      // // Test Firestore connection
      // firestore().collection('test').doc('connection').get()
      //   .then(() => console.log('✅ Firestore connection test passed'))
      //   .catch(err => console.warn('⚠️ Firestore connection test failed:', err.message));
      
      // Test Auth connection by checking current user
      const currentUser = auth().currentUser;
      console.log('🔐 Current user check:', currentUser ? currentUser.uid : 'No user');
      
    }, 1000);
    
  } catch (error) {
    console.error('❌ Failed to connect to Firebase emulators:', error);
    console.log('💡 Make sure Firebase emulators are running with: firebase emulators:start');
  }
};

// Initialize emulators when this module is imported
useEmulators();

export { auth, firestore, functions };
