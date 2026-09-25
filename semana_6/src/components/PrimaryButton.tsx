import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

type Props = { title: string; onPress: () => void; loading?: boolean; disabled?: boolean };
export function PrimaryButton({ title, onPress, loading = false, disabled = false }: Props): React.JSX.Element {
  const unavailable = loading || disabled;
  return <Pressable accessibilityRole="button" disabled={unavailable} onPress={onPress} style={({ pressed }) => [styles.button, unavailable && styles.disabled, pressed && !unavailable && styles.pressed]}>
    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>{title}</Text>}
  </Pressable>;
}
const styles = StyleSheet.create({ button: { minHeight: 46, backgroundColor: '#238636', borderRadius: 10, paddingHorizontal: 15, justifyContent: 'center', alignItems: 'center' }, disabled: { opacity: 0.6 }, pressed: { opacity: 0.75 }, text: { color: '#fff', fontWeight: '800', fontSize: 14 } });
