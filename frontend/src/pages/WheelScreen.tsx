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
      // Mock spin functionality for now
      console.log('🎭 Using mock spin functionality');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Randomly select a winning segment based on weights
      const totalWeight = wheelConfig.totalWeight;
      let randomValue = Math.random() * totalWeight;
      let winningSegment = wheelConfig.segments[0];
      
      for (const segment of wheelConfig.segments) {
        randomValue -= segment.weight;
        if (randomValue <= 0) {
          winningSegment = segment;
          break;
        }
      }
      
      console.log('🎯 Selected winning segment:', {
        id: winningSegment.id,
        label: winningSegment.label,
        index: wheelConfig.segments.findIndex(s => s.id === winningSegment.id)
      });
      
      // Create mock result
      const mockResult = {
        success: true,
        segment: winningSegment,
        message: `Congratulations! You won: ${winningSegment.prize.description}`,
        cooldownMinutes: wheelConfig.cooldownMinutes,
        timestamp: new Date().toISOString()
      };
      
      console.log('🎰 Mock spin result:', mockResult);
      
      setWinningSegment(winningSegment);
      // lastSpinResult will be set after the reward popup is closed
      
      // Calculate next allowed time
      const nextTime = new Date();
      nextTime.setMinutes(nextTime.getMinutes() + mockResult.cooldownMinutes);
      setNextAllowedAt(nextTime);
      
      // Trigger wheel animation
      if (wheelRef.current) {
        console.log('🎲 Spinning wheel to segment ID:', winningSegment.id);
        wheelRef.current.spinWheel(winningSegment.id);
      }
      
      // Firebase code (commented out for now)
      /*
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
      */
      
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
    // Update the last spin result after the reward popup is closed
    if (winningSegment) {
      const mockResult = {
        success: true,
        segment: winningSegment,
        message: `Congratulations! You won: ${winningSegment.prize.description}`,
        cooldownMinutes: wheelConfig.cooldownMinutes,
        timestamp: new Date().toISOString()
      };
      setLastSpinResult(mockResult);
    }
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
          <Text style={styles.title}>Spin & Win</Text>
          {/* {user && (
            <Text style={styles.userInfo}>Welcome, {user.email}</Text>
          )} */}
        </View>

        <View style={styles.wheelContainer}>
          <Wheel
            ref={wheelRef}
            segments={wheelConfig.segments}
            isSpinning={isSpinning}
            onSpinComplete={handleSpinComplete}
            winningSegmentId={winningSegment?.id}
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
            <View style={styles.lastSpinHeader}>
              <Text style={styles.lastSpinIcon}>🎉</Text>
              <Text style={styles.lastSpinTitle}>Last Spin Result</Text>
            </View>
            <View style={styles.lastSpinContent}>
              <Text style={styles.lastSpinMessage}>
                {lastSpinResult.message}
              </Text>
              <View style={styles.lastSpinDetails}>
                <View style={styles.lastSpinDetail}>
                  <Text style={styles.lastSpinDetailLabel}>Segment</Text>
                  <Text style={styles.lastSpinDetailValue}>
                    {lastSpinResult.segment.label}
                  </Text>
                </View>
                <View style={styles.lastSpinDetail}>
                  <Text style={styles.lastSpinDetailLabel}>Prize</Text>
                  <Text style={styles.lastSpinDetailValue}>
                    {lastSpinResult.segment.prize.description}
                  </Text>
                </View>
                
              </View>
            </View>
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
    backgroundColor: '#0F172A', // Navy background
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
    color: '#94A3B8', // Light gray text
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F8FAFC', // Light text
    textAlign: 'center',
  },
  userInfo: {
    fontSize: 22,
    color: '#94A3B8', // Light gray text
    textAlign: 'center',
    paddingTop: 20,
  },
  wheelContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  spinButton: {
    backgroundColor: '#4ADE80', // Green
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
    alignItems: 'center',
    marginVertical: 20,
    shadowColor: '#4ADE80',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  spinButtonDisabled: {
    backgroundColor: '#334155', // Dark gray when disabled
    shadowOpacity: 0,
    elevation: 0,
  },
  spinButtonText: {
    color: '#0F172A', // Dark text on green button
    fontSize: 18,
    fontWeight: 'bold',
  },
  lastSpinContainer: {
    backgroundColor: '#1E293B', // Dark slate background
    padding: 20,
    borderRadius: 15,
    marginTop: 20
  },
  lastSpinHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  lastSpinIcon: {
    fontSize: 28,
    marginRight: 10,
  },
  lastSpinTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F8FAFC', // Light text
  },
  lastSpinContent: {
    backgroundColor: '#273544', // Slightly lighter background for content
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3F4A5C',
  },
  lastSpinMessage: {
    fontSize: 16,
    color: '#E2E8F0', // Lighter text for better readability
    marginBottom: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  lastSpinDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lastSpinDetail: {
    flex: 1,
    marginRight: 15,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1E293B',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  lastSpinDetailLabel: {
    fontSize: 12,
    color: '#94A3B8', // Light gray text
    marginBottom: 5,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  lastSpinDetailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4ADE80', // Green text for values
    textAlign: 'center',
  },
});
