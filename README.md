# Wheel - Spin & Win App

A React Native mobile application with Firebase backend for a spin wheel game where users can win prizes and track their history.

## 🏗️ Project Structure

```
Wheel/
├── firebase/           # Firebase backend (Functions, Firestore, Auth)
│   ├── functions/      # Cloud Functions (TypeScript)
│   ├── firestore.rules # Firestore security rules
│   └── *.js           # Firebase setup and utility scripts
├── frontend/           # React Native mobile app
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Screen components
│   │   ├── styles/     # Centralized styling system
│   │   └── store/      # Zustand state management
│   └── android/        # Android-specific files
└── README.md           # This file
```

## 🎯 Technology Choices

### **Why Zustand for State Management?**

**Zustand** was chosen over alternatives like Redux, MobX, or Context API for several key reasons:

- **🚀 Lightweight & Fast**: Minimal bundle size (~2KB) with excellent performance
- **⚡ Simple API**: No providers, no complex setup, just `create()` and `useStore()`
- **🔧 TypeScript First**: Built with TypeScript in mind, excellent type inference
- **📱 React Native Optimized**: Designed for React Native with minimal re-renders
- **🔄 Easy Testing**: Simple to mock and test without complex middleware
- **🌐 No Dependencies**: Zero external dependencies, reducing bundle size

**Perfect for this app because:**
- Simple state requirements (auth, wheel config, game state)
- Need for fast, responsive UI updates
- Small team development with quick iteration cycles

### **Why React Native Reanimated?**

**React Native Reanimated** was chosen for the spinning wheel animations over alternatives like Animated API or Lottie:

- **⚡ Native Performance**: Runs animations on the UI thread, not JavaScript thread
- **🎯 Smooth 60fps**: Ensures buttery smooth wheel spinning animations
- **🔄 Complex Animations**: Handles the complex wheel rotation calculations efficiently
- **📱 Cross-Platform**: Consistent performance across iOS and Android
- **🔧 Worklet System**: Modern animation architecture with better performance
- **🎨 Rich API**: Advanced interpolation, timing, and gesture handling

**Perfect for this app because:**
- Complex wheel spinning animations with precise timing
- Need for smooth, engaging user experience
- Performance-critical game mechanics
- Future extensibility for more complex animations

### **Why Simple Data Fetching (No React Query)?**

**Simple data fetching with Zustand and Firebase** was chosen over React Query for several reasons:

- **🚀 Simpler Architecture**: Fewer dependencies, less complexity, easier to understand and maintain
- **📦 Smaller Bundle Size**: No additional library overhead, keeping the app lightweight
- **🎯 Direct Control**: Full control over data flow, caching, and error handling
- **🔥 Firebase Integration**: Firebase SDK already provides excellent caching and offline support
- **⚡ Performance**: No unnecessary abstractions for simple data requirements
- **🔧 Over-Engineering Prevention**: Avoids adding complexity for features not needed

**Perfect for this app because:**
- Simple data requirements (wheel config, spin history, user auth)
- Firebase handles most caching and offline scenarios
- Limited number of API calls with straightforward patterns
- Focus on game mechanics rather than complex data synchronization
- Small app scope doesn't justify the overhead of React Query

**When to reconsider React Query:**
- Adding complex data relationships (user profiles, leaderboards)
- Implementing real-time updates beyond Firebase capabilities
- Building offline-first functionality with complex sync logic
- Integrating multiple data sources (APIs, local storage, etc.)
- Needing advanced error handling and retry strategies

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Firebase CLI** (`npm install -g firebase-tools`)
- **Expo CLI** (`npm install -g @expo/cli`)
- **Android Studio** (for Android development)
- **Java Development Kit (JDK)** 11 or higher

### 1. Clone and Setup

```bash
git clone https://github.com/vahidrn98/spin
cd Wheel
```

### 2. Firebase Backend Setup

```bash
cd firebase

# Install dependencies
npm install

# Login to Firebase (if not already logged in)
firebase login

# Initialize Firebase project (if not already initialized)
firebase init

# Start Firebase emulators
firebase emulators:start
```

**Firebase Emulators:**
- Functions: http://localhost:5001
- Firestore: http://localhost:8080
- Auth: http://localhost:9099
- Hosting: http://localhost:5000

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npx expo run:android
```

**Expo Development:**
- Scan QR code with Expo Go app
- Press 'a' for Android emulator
- Press 'w' for web development

## 🔧 Development Setup

### Firebase Functions Development

```bash
cd firebase/functions

# Install dependencies
npm install

# Build TypeScript
npm run build
```

### React Native Development

```bash
cd frontend

# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios

# Run on web
npm run web
```

## 📱 App Features

- **Anonymous Authentication** - Users can play without creating accounts
- **Spin Wheel Game** - Weighted random prize selection
- **Cooldown System** - Prevents spam spinning
- **History Tracking** - View past spins and statistics
- **Offline Support** - Mock data fallback when Firebase is unavailable

## 🗄️ Database Schema

### Collections

#### `spins`
```typescript
{
  userId: string;
  segmentId: number;
  prize: {
    type: 'coins' | 'special' | 'bonus' | 'jackpot';
    amount: number;
    description: string;
  };
  timestamp: Timestamp;
  clientRequestId?: string;
  wheelVersion: number;
}
```

#### `wheelConfig`
```typescript
{
  segments: Array<{
    id: number;
    label: string;
    color: string;
    weight: number;
    prize: Prize;
  }>;
  totalWeight: number;
  cooldownMinutes: number;
  version: number;
}
```

## 🔐 Authentication

The app uses Firebase Anonymous Authentication with fallback to mock authentication for development purposes.

## 🎯 State Management

Built with **Zustand** for lightweight, fast state management:

- **`useAuthStore`** - Authentication state
- **`useWheelStore`** - Wheel configuration and game state

## 🎨 Styling Architecture

The app uses a **centralized styling system** for better organization and maintainability:

### **Style Organization**
```
frontend/src/styles/
├── index.ts                    # Exports all style objects
├── RewardPopup.styles.ts       # Reward popup component styles
├── Wheel.styles.ts            # Wheel component styles
├── CooldownTimer.styles.ts    # Cooldown timer component styles
├── AuthTest.styles.ts         # Auth test component styles
├── WheelScreen.styles.ts      # Main wheel screen styles
├── HistoryScreen.styles.ts    # History screen styles
└── SettingsScreen.styles.ts   # Settings screen styles
```

### **Benefits**
- **📁 Organized Structure**: Each component has its own dedicated style file
- **🔄 Easy Imports**: Centralized index file for simple imports (`import { wheelScreenStyles } from '../styles'`)
- **🔧 Maintainable**: Styles are separated from component logic for easier maintenance
- **🎯 Reusable**: Style objects can be easily shared between components if needed
- **📱 Consistent**: Enforces consistent styling patterns across the app

### **Usage Example**
```typescript
// Import styles
import { wheelScreenStyles } from '../styles';

// Use in component
<View style={wheelScreenStyles.container}>
  <Text style={wheelScreenStyles.title}>Spin & Win</Text>
</View>
```

## ♿ Accessibility Features

The app includes comprehensive **screen reader support** and accessibility features to ensure it's usable by everyone:

### **Screen Reader Support**
- **🎯 Descriptive Labels**: All interactive elements have clear, descriptive accessibility labels
- **💡 Helpful Hints**: Contextual hints guide users on how to interact with elements
- **🎮 Proper Roles**: Elements are assigned appropriate accessibility roles (button, image, timer, etc.)
- **📱 Live Updates**: Dynamic content updates are announced to screen readers

### **Key Accessibility Features**

#### **Wheel Component**
```typescript
<View 
  accessible={true}
  accessibilityLabel={`Spin wheel with ${segments.length} prize segments`}
  accessibilityHint="The wheel will spin when you tap the spin button"
  accessibilityRole="image"
>
```

#### **Spin Button**
```typescript
<TouchableOpacity
  accessible={true}
  accessibilityLabel={isSpinning ? "Wheel is spinning" : "Spin the wheel button"}
  accessibilityHint="Double tap to spin the wheel and win prizes"
  accessibilityRole="button"
  accessibilityState={{ disabled: !canSpin }}
>
```

#### **Reward Popup**
```typescript
<Modal
  accessible={true}
  accessibilityLabel="Reward popup"
  accessibilityHint="Shows your prize after spinning the wheel"
>
```

#### **Cooldown Timer**
```typescript
<View 
  accessible={true}
  accessibilityLabel="Cooldown timer"
  accessibilityRole="timer"
  accessibilityHint="Shows time remaining until next spin is available"
>
```

### **Accessibility Benefits**
- **👁️ Screen Reader Compatible**: Works with VoiceOver (iOS) and TalkBack (Android)
- **🎯 Clear Navigation**: Logical focus order and descriptive labels
- **📊 Context Awareness**: Users understand their current position and available actions
- **⚡ Dynamic Updates**: Real-time announcements for timer changes and game events
- **🎮 Inclusive Gaming**: Makes the spin wheel game accessible to users with visual impairments

### **Testing Accessibility**
- **iOS**: Enable VoiceOver in Settings > Accessibility > VoiceOver
- **Android**: Enable TalkBack in Settings > Accessibility > TalkBack
- **Web**: Use browser developer tools to test accessibility tree
- **Automated**: Consider using tools like axe-core for automated accessibility testing

## 🧪 Testing

### Firebase Functions Testing

```bash
cd firebase

# Test authentication flow
node test-auth-flow.js

# Test functions
node test-functions.js

# Test history function
node test-history-function.js
```

### Frontend Testing

```bash
cd frontend

# Run TypeScript type checking
npm run type-check

# Run linting
npm run lint

# Format code
npm run format
```

## 🚀 Deployment

### Deploy Firebase Functions

```bash
cd firebase
firebase deploy --only functions
```

### Build React Native App

```bash
cd frontend

# Build Android APK
npm run android

# Build iOS (requires macOS)
npm run ios
```

## 🔧 Troubleshooting

### Common Issues

1. **Firebase Emulators Not Starting**
   - Check if ports are already in use
   - Restart terminal/command prompt
   - Run `firebase emulators:start --only firestore,auth,functions`

2. **React Native Build Errors**
   - Clear Metro cache: `npx expo start --clear`
   - Clean Android build: `cd android && ./gradlew clean`
   - Check Java version: `java -version`

3. **Firebase Connection Issues**
   - Verify emulator ports in `firebase.json`
   - Check network configuration
   - Ensure Firebase project is properly initialized

### Debug Mode

Enable debug logging by setting environment variables:

```bash
# Firebase debug
export FIREBASE_DEBUG=true

# React Native debug
export EXPO_DEBUG=true
```

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

## 🎲 Game Design & Fairness

### **Fairness Guarantees**

The app implements several mechanisms to ensure fair gameplay:

- **🎯 Server-Side Validation**: All spins are processed by Firebase Functions, preventing client-side manipulation
- **⏱️ Cooldown Enforcement**: Cooldown periods are enforced server-side to prevent spam spinning
- **🔄 Idempotent Operations**: Each spin request includes a unique `clientRequestId` to prevent duplicate spins
- **📊 Weighted Random Selection**: Prize selection uses server-side weighted random algorithms
- **🔒 Authentication Required**: All spins require valid user authentication

### **Anti-Cheat Measures**

- **🛡️ Rate Limiting**: Cooldown system prevents rapid successive spins
- **🔐 User Isolation**: Each user's spins are isolated and cannot affect others
- **📝 Audit Trail**: All spins are logged with timestamps and user IDs for monitoring
- **🎲 Deterministic Random**: Server-side random generation prevents client prediction

## ⚖️ Design Assumptions & Trade-offs

### **Technical Assumptions**

- **📱 Mobile-First**: App is designed primarily for mobile devices with touch interfaces
- **🌐 Internet Required**: Requires internet connection for Firebase backend (with offline fallbacks)
- **👤 Anonymous Users**: Designed for casual users who don't need persistent accounts
- **🎮 Simple Gameplay**: Focus on quick, engaging spins rather than complex progression systems

### **Architecture Trade-offs**

#### **Chosen: Firebase + React Native**
- **✅ Pros**: Rapid development, cross-platform, scalable backend, real-time updates
- **❌ Cons**: Vendor lock-in, potential costs at scale, dependency on Google services

#### **Chosen: Zustand over Redux**
- **✅ Pros**: Simpler API, smaller bundle, faster performance, easier testing
- **❌ Cons**: Less ecosystem tools, fewer middleware options, smaller community

#### **Chosen: Anonymous Authentication**
- **✅ Pros**: Lower barrier to entry, no account management, faster onboarding
- **❌ Cons**: No user persistence across devices, limited personalization, potential abuse

#### **Chosen: Server-Side Game Logic**
- **✅ Pros**: Prevents cheating, centralized control, easier updates, fair gameplay
- **❌ Cons**: Requires internet, potential latency, server costs, single point of failure

#### **Chosen: Centralized Styling System**
- **✅ Pros**: Organized style management, separation of concerns, reusable styles, easier maintenance
- **❌ Cons**: More files to manage, requires consistent naming conventions, potential for style duplication

#### **Chosen: No Styling Library (e.g., nativewind) Installed**
- **✅ Pros**: Full control over styles, no extra dependencies, smaller bundle size, easier debugging
- **❌ Cons**: More manual styling, less utility class convenience, potentially more verbose code

#### **Chosen: Simple Data Fetching (No React Query)**
- **✅ Pros**: Simpler architecture, smaller bundle size, direct control, Firebase handles caching, no over-engineering
- **❌ Cons**: Manual caching implementation, no built-in background refetching, more manual error handling

### **Performance Trade-offs**

- **🎨 Rich Animations**: Smooth wheel spinning prioritized over battery life
- **📱 Real-time Updates**: Immediate feedback prioritized over data efficiency
- **🔒 Security**: Server validation prioritized over offline functionality
- **📊 History**: Full spin history stored for user experience vs. storage costs

## 🔄 Idempotency & Data Consistency

### **Idempotent Operations**

The app ensures data consistency through idempotent operations:

- **🆔 Unique Request IDs**: Each spin request includes `clientRequestId` to prevent duplicates
- **⏰ Timestamp Validation**: Server checks last spin time to enforce cooldowns
- **🔒 Atomic Operations**: Spin operations are atomic - either complete or fail entirely
- **📝 Immutable Records**: Spin records are never modified once created

### **Data Consistency Guarantees**

- **🎯 Single Source of Truth**: Firebase Functions are the authoritative source for game state
- **📊 Eventual Consistency**: Firestore provides eventual consistency for read operations
- **🔄 Rollback Capability**: Failed operations don't leave partial state
- **📱 Client-Server Sync**: Client state is always derived from server responses

### **Error Handling & Recovery**

- **🚫 Graceful Degradation**: App continues to function with mock data when offline
- **🔄 Automatic Retry**: Network failures trigger automatic retry mechanisms
- **📱 User Feedback**: Clear error messages guide users through issues
- **🔧 Fallback Systems**: Mock authentication and data when Firebase is unavailable