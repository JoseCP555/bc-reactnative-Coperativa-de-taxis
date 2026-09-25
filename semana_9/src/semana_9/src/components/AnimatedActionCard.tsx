import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';

export function AnimatedActionCard({ title, subtitle, onPress, delay = 0 }: { title: string; subtitle: string; onPress: () => void; delay?: number }): React.JSX.Element {
  const opacity = useRef(new Animated.Value(0)).current;
  const y = useRef(new Animated.Value(14)).current;
  const scale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 380, delay, useNativeDriver: true }),
      Animated.spring(y, { toValue: 0, delay, damping: 16, stiffness: 125, useNativeDriver: true }),
    ]).start();
  }, [delay, opacity, y]);
  return <Animated.View style={{ opacity, transform: [{ translateY: y }, { scale }] }}>
    <Pressable onPress={onPress} onPressIn={() => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start()} onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()} style={styles.card}>
      <Text style={styles.title}>{title}</Text><Text style={styles.subtitle}>{subtitle}</Text>
    </Pressable>
  </Animated.View>;
}
const styles = StyleSheet.create({ card: { backgroundColor: '#161b22', borderWidth: 1, borderColor: '#30363d', padding: 15, borderRadius: 13, marginBottom: 9 }, title: { color: '#fff', fontWeight: '800', fontSize: 15 }, subtitle: { color: '#9aa4af', fontSize: 12, marginTop: 4 } });
