import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  interpolate,
  runOnJS
} from 'react-native-reanimated';
import Svg, { Circle, Text as SvgText, G, Path, Polygon } from 'react-native-svg';

const { width } = Dimensions.get('window');
const WHEEL_SIZE = width * 0.9;
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
  winningSegmentId?: number;
}

export const Wheel = React.forwardRef<any, WheelProps>(({ segments, isSpinning, onSpinComplete, winningSegmentId }, ref) => {
  const spinValue = useSharedValue(0);
  const [currentRotation, setCurrentRotation] = useState(0);

  const segmentAngle = 360 / segments.length;

  // Helper function to determine which segment is at the top based on rotation
  const getSegmentAtTop = (rotation: number) => {
    const normalizedRotation = ((rotation % 360) + 360) % 360;
    // When wheel rotates clockwise, segments move counter-clockwise relative to the pointer
    // So we need to calculate which segment is at the top after rotation
    const segmentIndex = Math.floor((360 - normalizedRotation) / segmentAngle) % segments.length;
    return segments[segmentIndex] || segments[0];
  };

  // Expose spinWheel method via ref
  React.useImperativeHandle(ref, () => ({
    spinWheel: (targetSegmentId: number) => {
      const targetSegmentIndex = segments.findIndex(seg => seg.id === targetSegmentId);
      // Calculate the center angle of the target segment
      const targetSegmentStart = targetSegmentIndex * segmentAngle;
      const targetSegmentCenter = targetSegmentStart + (segmentAngle / 2);
      
      console.log('🎯 Wheel spin calculation:', {
        targetSegmentId,
        targetSegmentIndex,
        targetSegmentStart,
        targetSegmentCenter,
        segmentAngle,
        currentRotation,
        segmentLabel: segments[targetSegmentIndex]?.label
      });
      
      // Calculate the final rotation to land on the target segment
      // Add multiple full rotations for spinning effect
      const fullRotations = 5; // Number of full rotations
      // The wheel should land with the target segment at the top (where the pointer is)
      // We need to rotate the wheel so that the target segment center moves to 0 degrees
      const finalRotation = currentRotation + (fullRotations * 360) + targetSegmentCenter;
      
      const finalRotationDegrees = finalRotation;
      const segmentAtTop = getSegmentAtTop(finalRotationDegrees);
      
      console.log('🎲 Final rotation calculation:', {
        fullRotations,
        targetSegmentCenter,
        finalRotation,
        finalRotationDegrees,
        expectedSegment: segments[targetSegmentIndex]?.label,
        actualSegmentAtTop: segmentAtTop?.label
      });
      
      spinValue.value = withTiming(
        finalRotation,
        { duration: 3000 },
        (finished) => {
          if (finished) {
            runOnJS(setCurrentRotation)(finalRotation % 360);
            runOnJS(onSpinComplete)?.(segments[targetSegmentIndex]);
          }
        }
      );
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
        <G
          transform={`translate(${textX}, ${textY}) rotate(${textAngle})`}
        >
          <SvgText
            x={0}
            y={0}
            fontSize={12}
            fill="white"
            textAnchor="middle"
            alignmentBaseline="middle"
            fontWeight="bold"
          >
            {segment.label}
          </SvgText>
        </G>
      </G>
    );
  };

  // Render the pointer/indicator
  const renderPointer = () => {
    const pointerPoints = [
      `${CENTER},${CENTER - RADIUS - 10}`,
      `${CENTER - 15},${CENTER - RADIUS + 5}`,
      `${CENTER + 15},${CENTER - RADIUS + 5}`
    ].join(' ');

    return (
      <G>
        <Polygon
          points={pointerPoints}
          fill="#4ADE80"
          stroke="#0F172A"
          strokeWidth={2}
        />
        <Circle
          cx={CENTER}
          cy={CENTER - RADIUS + 5}
          r={3}
          fill="#0F172A"
        />
      </G>
    );
  };

  const animatedStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      spinValue.value,
      [0, 360],
      [0, 360]
    );
    return {
      transform: [{ rotate: `${rotation}deg` }]
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.wheel, animatedStyle]}
      >
        <Svg width={WHEEL_SIZE} height={WHEEL_SIZE}>
          {segments.map(renderSegment)}
          {/* Center circle */}
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={15}
            fill="#1E293B"
            stroke="#4ADE80"
            strokeWidth={3}
          />
        </Svg>
      </Animated.View>
      
      {/* Static pointer that doesn't rotate with the wheel */}
      <View style={styles.pointerContainer}>
        <Svg width={WHEEL_SIZE} height={WHEEL_SIZE}>
          {renderPointer()}
        </Svg>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  wheel: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
  },
  pointerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
