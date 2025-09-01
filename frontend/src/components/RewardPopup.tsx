import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { rewardPopupStyles } from '../styles';

const { width, height } = Dimensions.get('window');

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

interface RewardPopupProps {
  visible: boolean;
  segment: WheelSegment | null;
  onClose: () => void;
}

export const RewardPopup: React.FC<RewardPopupProps> = ({
  visible,
  segment,
  onClose,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!segment) return null;

  const getPrizeIcon = (type: string) => {
    switch (type) {
      case 'coins':
        return '🪙';
      case 'special':
        return '💎';
      case 'bonus':
        return '⭐';
      case 'jackpot':
        return '🔥';
      default:
        return '🎁';
    }
  };

  const getPrizeColor = (type: string) => {
    switch (type) {
      case 'coins':
        return '#FFD700';
      case 'special':
        return '#00CED1';
      case 'bonus':
        return '#FF69B4';
      case 'jackpot':
        return '#FF4500';
      default:
        return '#32CD32';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
              <Animated.View
          style={[
            rewardPopupStyles.overlay,
            {
              opacity: opacityAnim,
            },
          ]}
        >
          <Animated.View
            style={[
              rewardPopupStyles.popup,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={rewardPopupStyles.header}>
              <Text style={rewardPopupStyles.congratsText}>🎉 Congratulations! 🎉</Text>
            </View>

            <View style={rewardPopupStyles.prizeContainer}>
              <Text style={rewardPopupStyles.prizeIcon}>
                {getPrizeIcon(segment.prize.type)}
              </Text>
              <Text style={rewardPopupStyles.prizeLabel}>{segment.label}</Text>
              <Text style={rewardPopupStyles.prizeDescription}>
                {segment.prize.description}
              </Text>
              <Text
                style={[
                  rewardPopupStyles.prizeAmount,
                  { color: getPrizeColor(segment.prize.type) },
                ]}
              >
                {segment.prize.amount}
                {segment.prize.type === 'coins' && ' Coins'}
                {segment.prize.type === 'bonus' && 'x Multiplier'}
              </Text>
            </View>

            <TouchableOpacity style={rewardPopupStyles.closeButton} onPress={onClose}>
              <Text style={rewardPopupStyles.closeButtonText}>Continue</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
    </Modal>
  );
};


