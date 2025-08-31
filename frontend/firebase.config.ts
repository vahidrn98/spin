import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions';

// For React Native Firebase, the configuration is handled in the native files
// (google-services.json for Android and GoogleService-Info.plist for iOS)
// The SDK automatically initializes when the app starts

// Connect to Firebase emulators
const useEmulators = () => {
  // Connect to local emulators
  // Note: Use your computer's IP address instead of localhost for Android emulator
  // You can find your IP with 'ipconfig' on Windows or 'ifconfig' on Mac/Linux
  const EMULATOR_HOST = '10.0.2.2'; // Your computer's IP address
  // const EMULATOR_HOST = '10.0.2.2'; // Default for Android emulator
  // const EMULATOR_HOST = '192.168.1.XXX'; // Replace with your actual IP for physical device
  
  // Default emulator ports - adjust if you're using different ports
  const FIRESTORE_PORT = 8080;
  const AUTH_PORT = 9099;
  const FUNCTIONS_PORT = 5001;
  
  try {
    firestore().useEmulator(EMULATOR_HOST, FIRESTORE_PORT);
    // test connection
    auth().useEmulator(`http://${EMULATOR_HOST}:${AUTH_PORT}`);
    functions().useEmulator(EMULATOR_HOST, FUNCTIONS_PORT);
    
    console.log('🔥 Firebase emulators connected');
    console.log(`📍 Firestore: ${EMULATOR_HOST}:${FIRESTORE_PORT}`);
    console.log(`📍 Auth: ${EMULATOR_HOST}:${AUTH_PORT}`);
    console.log(`📍 Functions: ${EMULATOR_HOST}:${FUNCTIONS_PORT}`);

    
  } catch (error) {
    console.error('❌ Failed to connect to Firebase emulators:', error);
  }
};

// Uncomment the line below to use emulators
useEmulators();

export { auth, firestore, functions };
