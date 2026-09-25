import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

type Props = { title: string; value: string; onPress?: () => void };

export function StatCard({ title, value, onPress }: Props): React.JSX.Element {
  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]} onPress={onPress}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, minWidth: 140, backgroundColor: '#161b22', borderRadius: 14, padding: 18, margin: 5, borderWidth: 1, borderColor: '#30363d' },
  pressed: { opacity: 0.65 },
  value: { color: '#61dafb', fontSize: 26, fontWeight: 'bold' },
  title: { color: '#c9d1d9', fontSize: 14, marginTop: 5 },
});
