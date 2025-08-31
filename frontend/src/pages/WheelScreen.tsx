import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Wheel } from '../components/Wheel';
import { RewardPopup } from '../components/RewardPopup';
import { CooldownTimer } from '../components/CooldownTimer';
import { useWheelStore } from '../store/wheelStore';
import { useAuthStore } from '../store/authStore';

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

export const WheelScreen: React.FC = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [winningSegment, setWinningSegment] = useState<WheelSegment | null>(null);
  const [nextAllowedAt, setNextAllowedAt] = useState<Date | null>(null);
  const [lastSpinResult, setLastSpinResult] = useState<any>(null);
  
  const wheelRef = useRef<any>(null);
  
  const { wheelConfig, fetchWheelConfig } = useWheelStore();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchWheelConfig();
  }, []);

  const handleSpin = async () => {
    if (!isAuthenticated) {
      Alert.alert('Authentication Required', 'Please sign in to spin the wheel.');
      return;
    }

    if (isSpinning) {
      return;
    }

    if (nextAllowedAt && new Date() < nextAllowedAt) {
      Alert.alert('Cooldown Active', 'Please wait before spinning again.');
      return;
    }

    setIsSpinning(true);

    try {
      // Call Firebase Function
      const { getFunctions, httpsCallable } = await import('@react-native-firebase/functions');
      const functions = getFunctions();
      const spinWheel = httpsCallable(functions, 'spinWheel');

      const result = await spinWheel({
        clientRequestId: `spin_${Date.now()}`,
      });

      const data = result.data as any;
      
      if (data.success) {
        setWinningSegment(data.segment);
        setLastSpinResult(data);
        
        // Calculate next allowed time
        const nextTime = new Date();
        nextTime.setMinutes(nextTime.getMinutes() + data.cooldownMinutes);
        setNextAllowedAt(nextTime);
        
        // Trigger wheel animation
        if (wheelRef.current) {
          wheelRef.current.spinWheel(data.segment.id);
        }
      } else {
        Alert.alert('Error', 'Failed to process spin. Please try again.');
      }
    } catch (error: any) {
      console.error('Spin error:', error);
      
      if (error.code === 'functions/failed-precondition') {
        Alert.alert('Cooldown Active', error.message);
      } else if (error.code === 'functions/unauthenticated') {
        Alert.alert('Authentication Required', 'Please sign in to spin the wheel.');
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } finally {
      setIsSpinning(false);
    }
  };

  const handleSpinComplete = (segment: WheelSegment) => {
    setShowReward(true);
  };

  const handleRewardClose = () => {
    setShowReward(false);
    setWinningSegment(null);
  };

  const handleCooldownComplete = () => {
    setNextAllowedAt(null);
  };

  const canSpin = !isSpinning && (!nextAllowedAt || new Date() >= nextAllowedAt);

  if (!wheelConfig) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading wheel configuration...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>🎰 Spin & Win 🎰</Text>
          {user && (
            <Text style={styles.userInfo}>Welcome, {user.email}</Text>
          )}
        </View>

        <View style={styles.wheelContainer}>
          <Wheel
            ref={wheelRef}
            segments={wheelConfig.segments}
            isSpinning={isSpinning}
            onSpinComplete={handleSpinComplete}
          />
        </View>

        <CooldownTimer
          nextAllowedAt={nextAllowedAt}
          onCooldownComplete={handleCooldownComplete}
        />

        <TouchableOpacity
          style={[
            styles.spinButton,
            !canSpin && styles.spinButtonDisabled,
          ]}
          onPress={handleSpin}
          disabled={!canSpin}
        >
          <Text style={styles.spinButtonText}>
            {isSpinning ? 'Spinning...' : 'SPIN THE WHEEL!'}
          </Text>
        </TouchableOpacity>

        {lastSpinResult && (
          <View style={styles.lastSpinContainer}>
            <Text style={styles.lastSpinTitle}>Last Spin Result:</Text>
            <Text style={styles.lastSpinText}>
              {lastSpinResult.message}
            </Text>
          </View>
        )}
      </ScrollView>

      <RewardPopup
        visible={showReward}
        segment={winningSegment}
        onClose={handleRewardClose}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userInfo: {
    fontSize: 14,
    color: '#666',
  },
  wheelContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  spinButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  spinButtonDisabled: {
    backgroundColor: '#ccc',
  },
  spinButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  lastSpinContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  lastSpinTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  lastSpinText: {
    fontSize: 14,
    color: '#666',
  },
});
