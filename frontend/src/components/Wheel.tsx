import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import Svg, { Circle, Text as SvgText, G, Path } from 'react-native-svg';

const { width } = Dimensions.get('window');
const WHEEL_SIZE = width * 0.8;
const CENTER = WHEEL_SIZE / 2;
const RADIUS = WHEEL_SIZE / 2 - 20;

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

interface WheelProps {
  segments: WheelSegment[];
  isSpinning: boolean;
  onSpinComplete?: (segment: WheelSegment) => void;
}

export const Wheel = React.forwardRef<any, WheelProps>(({ segments, isSpinning, onSpinComplete }, ref) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const [currentRotation, setCurrentRotation] = useState(0);

  const segmentAngle = 360 / segments.length;

  // Expose spinWheel method via ref
  React.useImperativeHandle(ref, () => ({
    spinWheel: (targetSegmentId: number) => {
      const targetSegmentIndex = segments.findIndex(seg => seg.id === targetSegmentId);
      const targetAngle = targetSegmentIndex * segmentAngle;
      
      // Calculate the final rotation to land on the target segment
      // Add multiple full rotations for spinning effect
      const fullRotations = 5; // Number of full rotations
      const finalRotation = currentRotation + (fullRotations * 360) + (360 - targetAngle);
      
      Animated.timing(spinValue, {
        toValue: finalRotation,
        duration: 3000,
        useNativeDriver: true,
      }).start(() => {
        setCurrentRotation(finalRotation % 360);
        onSpinComplete?.(segments[targetSegmentIndex]);
      });
    }
  }));

  const renderSegment = (segment: WheelSegment, index: number) => {
    const startAngle = index * segmentAngle;
    const endAngle = (index + 1) * segmentAngle;
    
    // Convert angles to radians
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);
    
    // Calculate arc coordinates
    const x1 = CENTER + RADIUS * Math.cos(startRad);
    const y1 = CENTER + RADIUS * Math.sin(startRad);
    const x2 = CENTER + RADIUS * Math.cos(endRad);
    const y2 = CENTER + RADIUS * Math.sin(endRad);
    
    // Determine if we need to draw a large arc
    const largeArcFlag = segmentAngle > 180 ? 1 : 0;
    
    // Create the path for the segment
    const path = [
      `M ${CENTER} ${CENTER}`,
      `L ${x1} ${y1}`,
      `A ${RADIUS} ${RADIUS} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');

    // Calculate text position
    const textAngle = (startAngle + endAngle) / 2;
    const textRad = (textAngle - 90) * (Math.PI / 180);
    const textRadius = RADIUS * 0.7;
    const textX = CENTER + textRadius * Math.cos(textRad);
    const textY = CENTER + textRadius * Math.sin(textRad);

    return (
      <G key={segment.id}>
        <Path
          d={path}
          fill={segment.color}
          stroke="#333"
          strokeWidth={1}
        />
        <SvgText
          x={textX}
          y={textY}
          fontSize={12}
          fill="white"
          textAnchor="middle"
          alignmentBaseline="middle"
          fontWeight="bold"
        >
          {segment.label}
        </SvgText>
      </G>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.wheel,
          {
            transform: [{ rotate: spinValue.interpolate({
              inputRange: [0, 360],
              outputRange: ['0deg', '360deg']
            }) }]
          }
        ]}
      >
        <Svg width={WHEEL_SIZE} height={WHEEL_SIZE}>
          {segments.map(renderSegment)}
          {/* Center circle */}
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={15}
            fill="#333"
            stroke="#fff"
            strokeWidth={3}
          />
        </Svg>
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheel: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
  },
});
