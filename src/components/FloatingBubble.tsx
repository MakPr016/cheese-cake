import React, { useRef } from 'react';
import { View, StyleSheet, Animated, PanResponder, Pressable, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../utils/theme';

interface FloatingBubbleProps {
  onPress: () => void;
}

const BUBBLE_SIZE = 64;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export const FloatingBubble: React.FC<FloatingBubbleProps> = ({ onPress }) => {
  const pan = useRef(new Animated.ValueXY({ 
    x: SCREEN_WIDTH - BUBBLE_SIZE - 20, 
    y: SCREEN_HEIGHT - BUBBLE_SIZE - 100 
  })).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: (pan.x as any)._value,
          y: (pan.y as any)._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gesture) => {
        pan.flattenOffset();
        
        if (Math.abs(gesture.dx) < 5 && Math.abs(gesture.dy) < 5) {
          onPress();
        }
        
        const maxX = SCREEN_WIDTH - BUBBLE_SIZE;
        const maxY = SCREEN_HEIGHT - BUBBLE_SIZE - 50;
        
        let finalX = Math.max(0, Math.min((pan.x as any)._value, maxX));
        let finalY = Math.max(0, Math.min((pan.y as any)._value, maxY));
        
        Animated.spring(pan, {
          toValue: { x: finalX, y: finalY },
          useNativeDriver: false,
          friction: 7,
        }).start();
      },
    })
  ).current;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <Pressable style={styles.bubble}>
        <Ionicons name="chatbubbles" size={28} color={theme.colors.text} />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
  },
  bubble: {
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    borderRadius: BUBBLE_SIZE / 2,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.large,
  },
});
