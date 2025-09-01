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
      accessible={true}
      accessibilityLabel="Reward popup"
      accessibilityHint="Shows your prize after spinning the wheel"
    >
                        <Animated.View
            style={[
              rewardPopupStyles.overlay,
              {
                opacity: opacityAnim,
              },
            ]}
            accessible={true}
            accessibilityLabel="Reward popup overlay"
          >
            <Animated.View
              style={[
                rewardPopupStyles.popup,
                {
                  transform: [{ scale: scaleAnim }],
                },
              ]}
              accessible={true}
              accessibilityLabel="Reward popup content"
            >
            <View 
              style={rewardPopupStyles.header}
              accessible={true}
              accessibilityLabel="Congratulations header"
            >
              <Text 
                style={rewardPopupStyles.congratsText}
                accessible={true}
                accessibilityLabel="Congratulations! You won a prize!"
              >
                🎉 Congratulations! 🎉
              </Text>
            </View>

            <View 
              style={rewardPopupStyles.prizeContainer}
              accessible={true}
              accessibilityLabel="Prize details"
              accessibilityRole="summary"
            >
              <Text 
                style={rewardPopupStyles.prizeIcon}
                accessible={true}
                accessibilityLabel={`Prize icon: ${getPrizeIcon(segment.prize.type)}`}
              >
                {getPrizeIcon(segment.prize.type)}
              </Text>
              <Text 
                style={rewardPopupStyles.prizeLabel}
                accessible={true}
                accessibilityLabel={`Prize segment: ${segment.label}`}
              >
                {segment.label}
              </Text>
              <Text 
                style={rewardPopupStyles.prizeDescription}
                accessible={true}
                accessibilityLabel={`Prize description: ${segment.prize.description}`}
              >
                {segment.prize.description}
              </Text>
              <Text
                style={[
                  rewardPopupStyles.prizeAmount,
                  { color: getPrizeColor(segment.prize.type) },
                ]}
                accessible={true}
                accessibilityLabel={`Prize amount: ${segment.prize.amount}${segment.prize.type === 'coins' ? ' Coins' : segment.prize.type === 'bonus' ? 'x Multiplier' : ''}`}
              >
                {segment.prize.amount}
                {segment.prize.type === 'coins' && ' Coins'}
                {segment.prize.type === 'bonus' && 'x Multiplier'}
              </Text>
            </View>

            <TouchableOpacity 
              style={rewardPopupStyles.closeButton} 
              onPress={onClose}
              accessible={true}
              accessibilityLabel="Continue button"
              accessibilityHint="Double tap to close the reward popup and continue"
              accessibilityRole="button"
            >
              <Text style={rewardPopupStyles.closeButtonText}>Continue</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
    </Modal>
  );
};


