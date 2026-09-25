import React, { useEffect, useRef, type ReactNode } from 'react';
import { Animated, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

type Props = { children: ReactNode; delay?: number; onPress?: () => void; style?: ViewStyle };
export function AnimatedEntry({ children, delay = 0, onPress, style }: Props): React.JSX.Element {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;
  const scale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 360, delay, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, delay, damping: 17, stiffness: 130, useNativeDriver: true }),
    ]).start();
  }, [delay, opacity, translateY]);
  const content = onPress ? <Pressable onPress={onPress} onPressIn={() => Animated.spring(scale, { toValue: 0.98, useNativeDriver: true, damping: 14, stiffness: 180 }).start()} onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true, damping: 14, stiffness: 180 }).start()}>{children}</Pressable> : <View>{children}</View>;
  return <Animated.View style={[styles.wrapper, { opacity, transform: [{ translateY }, { scale }] }, style]}>{content}</Animated.View>;
}
const styles = StyleSheet.create({ wrapper: { width: '100%' } });
