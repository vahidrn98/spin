const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Firebase emulators and seeding data...');

// Start emulators
const emulatorProcess = spawn('firebase', ['emulators:start', '--only', 'firestore,auth,functions'], {
  stdio: 'pipe',
  shell: true
});

emulatorProcess.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(output);
  
  // Check if emulators are ready
  if (output.includes('All emulators ready!')) {
    console.log('✅ Emulators are ready! Seeding data...');
    
    // Wait a moment for emulators to fully initialize
    setTimeout(() => {
      const seedProcess = spawn('node', ['simple-seed.js'], {
        stdio: 'inherit',
        shell: true
      });
      
      seedProcess.on('close', (code) => {
        if (code === 0) {
          console.log('🎉 Setup complete! Your app should now work with the emulators.');
        } else {
          console.error('❌ Failed to seed data');
        }
      });
    }, 3000);
  }
});

emulatorProcess.stderr.on('data', (data) => {
  console.error('Emulator error:', data.toString());
});

emulatorProcess.on('close', (code) => {
  console.log(`Emulator process exited with code ${code}`);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down emulators...');
  emulatorProcess.kill('SIGINT');
  process.exit(0);
});
