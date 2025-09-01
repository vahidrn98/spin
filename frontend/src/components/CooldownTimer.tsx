import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { cooldownTimerStyles } from '../styles';

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
    <View style={cooldownTimerStyles.container}>
      <Text style={cooldownTimerStyles.label}>Next spin available in:</Text>
      <Text style={cooldownTimerStyles.timer}>{timeRemaining}</Text>
    </View>
  );
};


