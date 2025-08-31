import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CooldownTimerProps {
  nextAllowedAt: Date | null;
  onCooldownComplete?: () => void;
}

export const CooldownTimer: React.FC<CooldownTimerProps> = ({
  nextAllowedAt,
  onCooldownComplete,
}) => {
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    if (!nextAllowedAt) {
      setTimeRemaining('');
      return;
    }

    const updateTimer = () => {
      const now = new Date();
      const timeDiff = nextAllowedAt.getTime() - now.getTime();

      if (timeDiff <= 0) {
        setTimeRemaining('');
        onCooldownComplete?.();
        return;
      }

      const minutes = Math.floor(timeDiff / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [nextAllowedAt, onCooldownComplete]);

  if (!nextAllowedAt || !timeRemaining) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Next spin available in:</Text>
      <Text style={styles.timer}>{timeRemaining}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#FF0000',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  timer: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF0000',
  },
});
