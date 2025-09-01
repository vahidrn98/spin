const os = require('os');

console.log('🌐 Network Information for Firebase Emulators');
console.log('==============================================');

// Get all network interfaces
const networkInterfaces = os.networkInterfaces();

console.log('\n📱 Available IP addresses:');
console.log('----------------------------');

Object.keys(networkInterfaces).forEach((interfaceName) => {
  const interfaces = networkInterfaces[interfaceName];
  
  interfaces.forEach((interface) => {
    // Skip internal (localhost) and non-IPv4 addresses
    if (interface.family === 'IPv4' && !interface.internal) {
      console.log(`📍 ${interfaceName}: ${interface.address}`);
    }
  });
});

console.log('\n🔧 Configuration Instructions:');
console.log('==============================');
console.log('1. For Android Emulator: Use 10.0.2.2 (already configured)');
console.log('2. For Physical Android Device: Use one of the IP addresses above');
console.log('3. For iOS Simulator: Use localhost (already configured)');
console.log('4. For Physical iOS Device: Use one of the IP addresses above');
console.log('\n💡 To update the configuration:');
console.log('   - Edit frontend/firebase.config.ts');
console.log('   - Uncomment the EMULATOR_HOST line for your device type');
console.log('   - Replace 192.168.1.XXX with your actual IP address');

console.log('\n🚀 To start emulators:');
console.log('   cd firebase && node start-emulators.js');

console.log('\n🧪 To test connection:');
console.log('   cd firebase && node test-connection.js');
