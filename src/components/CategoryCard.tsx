import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  title: string;
  subtitle: string;
  description: string;
  imageUri: string;
  onPress: () => void;
};

export function CategoryCard({ title, subtitle, description, imageUri, onPress }: Props): React.JSX.Element {
  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <Text style={styles.description}>{description}</Text>
        <Pressable style={({ pressed }) => [styles.button, pressed && styles.pressed]} onPress={onPress}>
          <Text style={styles.buttonText}>Ver información</Text>
          <Text style={styles.arrow}>›</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#161b22', borderRadius: 18, overflow: 'hidden', marginBottom: 18, borderWidth: 1, borderColor: '#30363d', shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 8, elevation: 4 },
  image: { width: '100%', height: 145, backgroundColor: '#21262d' },
  content: { padding: 17 },
  title: { color: '#fff', fontSize: 21, fontWeight: '800' },
  subtitle: { color: '#61dafb', fontSize: 14, fontWeight: '700', marginTop: 5 },
  description: { color: '#aeb8c4', fontSize: 14, lineHeight: 20, marginTop: 8 },
  button: { marginTop: 15, backgroundColor: '#238636', borderRadius: 9, paddingVertical: 11, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pressed: { opacity: 0.65 },
  buttonText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  arrow: { color: '#fff', fontSize: 22, lineHeight: 18 },
});
