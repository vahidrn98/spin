import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';

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
          styles.overlay,
          {
            opacity: opacityAnim,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.popup,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.header}>
            <Text style={styles.congratsText}>🎉 Congratulations! 🎉</Text>
          </View>

          <View style={styles.prizeContainer}>
            <Text style={styles.prizeIcon}>
              {getPrizeIcon(segment.prize.type)}
            </Text>
            <Text style={styles.prizeLabel}>{segment.label}</Text>
            <Text style={styles.prizeDescription}>
              {segment.prize.description}
            </Text>
            <Text
              style={[
                styles.prizeAmount,
                { color: getPrizeColor(segment.prize.type) },
              ]}
            >
              {segment.prize.amount}
              {segment.prize.type === 'coins' && ' Coins'}
              {segment.prize.type === 'bonus' && 'x Multiplier'}
            </Text>
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Continue</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    margin: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    marginBottom: 20,
  },
  congratsText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  prizeContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  prizeIcon: {
    fontSize: 60,
    marginBottom: 10,
  },
  prizeLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  prizeDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  prizeAmount: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
