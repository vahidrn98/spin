import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { wheelScreenStyles } from '../styles';
import { Wheel } from '../components/Wheel';
import { RewardPopup } from '../components/RewardPopup';
import { CooldownTimer } from '../components/CooldownTimer';
import { useWheelStore } from '../store/wheelStore';
import { useAuthStore } from '../store/authStore';
import { functions } from '../../firebase.config';

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
      const spinWheel = functions().httpsCallable('spinWheel');
      // console.log('🔍 Spin wheel function called');
      // console.log('🔍 User:', user);
      const result = await spinWheel({
        clientRequestId: `spin_${(Date.now())}`,
        userId: user?.uid, // For emulator testing
      });


      const data = result.data as any;
      // console.log('🔍 Data:', data);

      // console.log('🔍 Data after spin:', data);
      if (data.success) {
        setWinningSegment(data.segment);
        // Don't set lastSpinResult here - it will be set after reward popup is closed
        
        // Calculate next allowed time
        const nextTime = new Date();
        // console.log('🔍 Next time:', data.cooldownMinutes);
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
      // console.log('Spin error:', error);
      Alert.alert('Error', error.message);
      
      if (error.code === 'functions/failed-precondition') {
        Alert.alert('Cooldown Active', error.message);
      } else if (error.code === 'functions/unauthenticated') {
        Alert.alert('Authentication Required', 'Please sign in to spin the wheel.');
      } else {
        // console.log('Error', 'Something went wrong. Please try again.');
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
      // Create the result object from the actual Firebase data
      const result = {
        success: true,
        segment: winningSegment,
        message: `Congratulations! You won: ${winningSegment.prize.description}`,
        cooldownMinutes: wheelConfig.cooldownMinutes,
        timestamp: new Date().toISOString()
      };
      setLastSpinResult(result);
    }
    setWinningSegment(null);
  };

  const handleCooldownComplete = () => {
    setNextAllowedAt(null);
  };

  const canSpin = !isSpinning && (!nextAllowedAt || new Date() >= nextAllowedAt);

  if (!wheelConfig) {
    return (
      <SafeAreaView style={wheelScreenStyles.container}>
        <View 
          style={wheelScreenStyles.loadingContainer}
          accessible={true}
          accessibilityLabel="Loading wheel configuration"
          accessibilityRole="progressbar"
        >
          <ActivityIndicator size="large" color="#4ADE80" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={wheelScreenStyles.container}>
      <ScrollView contentContainerStyle={wheelScreenStyles.scrollContent}>
        <View 
          style={wheelScreenStyles.header}
          accessible={true}
          accessibilityLabel="Game header"
        >
          <Text 
            style={wheelScreenStyles.title}
            accessible={true}
            accessibilityLabel="Spin and Win game title"
          >
            Spin & Win
          </Text>
          {/* {user && (
            <Text style={wheelScreenStyles.userInfo}>Welcome, {user.email}</Text>
          )} */}
        </View>

        <View 
          style={wheelScreenStyles.wheelContainer}
          accessible={true}
          accessibilityLabel="Wheel game area"
        >
          <Wheel
            ref={wheelRef}
            segments={wheelConfig.segments}
            isSpinning={isSpinning}
            onSpinComplete={handleSpinComplete}
            winningSegmentId={winningSegment?.id}
          />
        </View>

        {/* Temporary AuthTest component for debugging */}
        {/* <AuthTest /> */}

        <CooldownTimer
          nextAllowedAt={nextAllowedAt}
          onCooldownComplete={handleCooldownComplete}
        />

        <TouchableOpacity
          style={[
            wheelScreenStyles.spinButton,
            !canSpin && wheelScreenStyles.spinButtonDisabled,
          ]}
          onPress={handleSpin}
          disabled={!canSpin}
          accessible={true}
          accessibilityLabel={isSpinning ? "Wheel is spinning" : "Spin the wheel button"}
          accessibilityHint="Double tap to spin the wheel and win prizes"
          accessibilityRole="button"
          accessibilityState={{ disabled: !canSpin }}
        >
          <Text style={wheelScreenStyles.spinButtonText}>
            {isSpinning ? 'Spinning...' : 'SPIN THE WHEEL!'}
          </Text>
        </TouchableOpacity>

        {lastSpinResult && (
          <View 
            style={wheelScreenStyles.lastSpinContainer}
            accessible={true}
            accessibilityLabel="Last spin result"
            accessibilityRole="summary"
          >
            <View 
              style={wheelScreenStyles.lastSpinHeader}
              accessible={true}
              accessibilityLabel="Last spin result header"
            >
              <Text 
                style={wheelScreenStyles.lastSpinIcon}
                accessible={true}
                accessibilityLabel="Celebration icon"
              >
                🎉
              </Text>
              <Text 
                style={wheelScreenStyles.lastSpinTitle}
                accessible={true}
                accessibilityLabel="Last spin result title"
              >
                Last Spin Result
              </Text>
            </View>
            <View 
              style={wheelScreenStyles.lastSpinContent}
              accessible={true}
              accessibilityLabel="Last spin details"
            >
              <Text 
                style={wheelScreenStyles.lastSpinMessage}
                accessible={true}
                accessibilityLabel={`Last spin message: ${lastSpinResult.message}`}
              >
                {lastSpinResult.message}
              </Text>
              <View 
                style={wheelScreenStyles.lastSpinDetails}
                accessible={true}
                accessibilityLabel="Prize details"
              >
                <View 
                  style={wheelScreenStyles.lastSpinDetail}
                  accessible={true}
                  accessibilityLabel={`Prize segment: ${lastSpinResult.segment.label}`}
                >
                  <Text style={wheelScreenStyles.lastSpinDetailLabel}>Segment</Text>
                  <Text style={wheelScreenStyles.lastSpinDetailValue}>
                    {lastSpinResult.segment.label}
                  </Text>
                </View>
                <View 
                  style={wheelScreenStyles.lastSpinDetail}
                  accessible={true}
                  accessibilityLabel={`Prize description: ${lastSpinResult.segment.prize.description}`}
                >
                  <Text style={wheelScreenStyles.lastSpinDetailLabel}>Prize</Text>
                  <Text style={wheelScreenStyles.lastSpinDetailValue}>
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


