# Firebase Emulator Troubleshooting Guide

## 🔍 **Common Issues and Solutions**

### 1. **Emulators Not Starting**

**Symptoms:**
- Error: "firebase: command not found"
- Error: "Port already in use"

**Solutions:**
```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Check if ports are available
netstat -an | findstr :8080
netstat -an | findstr :9099
netstat -an | findstr :5001

# Kill processes using those ports if needed
taskkill /F /PID <PID_NUMBER>
```

### 2. **App Can't Connect to Emulators**

**Symptoms:**
- "Firestore service is unavailable" error
- "Failed to connect to Firebase emulators" error
- App shows mock data instead of real data

**Solutions:**

#### Step 1: Check Network Configuration
```bash
# Get your network information
cd firebase && node get-network-info.js
```

#### Step 2: Update Firebase Config
Edit `frontend/firebase.config.ts`:

**For Android Emulator:**
```typescript
EMULATOR_HOST = '10.0.2.2'; // Already configured
```

**For Physical Android Device:**
```typescript
EMULATOR_HOST = '192.168.1.XXX'; // Replace with your IP
```

**For iOS Simulator:**
```typescript
EMULATOR_HOST = 'localhost'; // Already configured
```

**For Physical iOS Device:**
```typescript
EMULATOR_HOST = '192.168.1.XXX'; // Replace with your IP
```

#### Step 3: Verify Emulator Status
```bash
# Start emulators
cd firebase && node start-emulators.js

# Test connection
cd firebase && node test-connection.js
```

### 3. **Authentication Issues**

**Symptoms:**
- "User must be authenticated" error
- Anonymous sign-in fails

**Solutions:**
```bash
# Check if Auth emulator is running
curl http://localhost:9099

# Verify Auth emulator in Firebase Console
# Go to http://localhost:4000 and check Auth tab
```

### 4. **Firestore Permission Issues**

**Symptoms:**
- "Permission denied" error
- Can't read/write data

**Solutions:**
```bash
# Check Firestore rules
cat firebase/firestore.rules

# Verify rules allow read access to wheelConfig
# Current rules should allow: allow read: if true;
```

### 5. **Data Not Loading**

**Symptoms:**
- Wheel configuration not found
- Empty collections

**Solutions:**
```bash
# Seed the database
cd firebase && node simple-seed.js

# Verify data exists
cd firebase && node test-connection.js
```

## 🚀 **Step-by-Step Setup**

### 1. **Start Emulators**
```bash
cd firebase
node start-emulators.js
```

### 2. **Seed Database**
```bash
# This should run automatically after emulators start
# If not, run manually:
node simple-seed.js
```

### 3. **Test Connection**
```bash
node test-connection.js
```

### 4. **Start Frontend**
```bash
cd ../frontend
npm start
```

### 5. **Run on Device**
```bash
# For Android
npm run android

# For iOS
npm run ios
```

## 🔧 **Debugging Commands**

### Check Emulator Status
```bash
# Check if emulators are running
curl http://localhost:8080  # Firestore
curl http://localhost:9099  # Auth
curl http://localhost:5001  # Functions
```

### Check Network Connectivity
```bash
# From your device/emulator
ping 10.0.2.2  # Android emulator
ping localhost  # iOS simulator
ping 192.168.1.XXX  # Physical device (replace with your IP)
```

### View Emulator Logs
```bash
# Check Firebase emulator logs
tail -f firebase/firebase-debug.log
tail -f firebase/firestore-debug.log
```

## 📱 **Device-Specific Configuration**

### Android Emulator
- **Host**: `10.0.2.2` (already configured)
- **Ports**: 8080, 9099, 5001

### Physical Android Device
- **Host**: Your computer's IP address
- **Find IP**: Run `node get-network-info.js`
- **Update**: Edit `frontend/firebase.config.ts`

### iOS Simulator
- **Host**: `localhost` (already configured)
- **Ports**: 8080, 9099, 5001

### Physical iOS Device
- **Host**: Your computer's IP address
- **Find IP**: Run `node get-network-info.js`
- **Update**: Edit `frontend/firebase.config.ts`

## 🎯 **Verification Checklist**

- [ ] Firebase CLI installed and logged in
- [ ] Emulators start without errors
- [ ] Database seeded successfully
- [ ] Network configuration correct for device type
- [ ] App connects to emulators (check console logs)
- [ ] Authentication works (anonymous sign-in)
- [ ] Firestore data loads (wheel configuration)
- [ ] Functions work (if using callable functions)

## 🆘 **Still Having Issues?**

1. **Check Console Logs**: Look for Firebase connection messages
2. **Verify Network**: Ensure device can reach your computer
3. **Restart Everything**: Emulators, app, and device
4. **Check Firewall**: Windows firewall might block connections
5. **Use Different Ports**: If ports are busy, change them in `firebase.json`

## 📞 **Getting Help**

If you're still experiencing issues:

1. Check the console logs for specific error messages
2. Verify your network configuration
3. Ensure all emulators are running
4. Try the troubleshooting steps above
5. Check if your firewall is blocking connections
