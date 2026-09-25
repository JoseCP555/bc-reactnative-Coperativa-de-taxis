import React from 'react';
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';

export function ProfileScreen(): React.JSX.Element {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  async function confirmLogout(): Promise<void> {
    await logout();
  }
  return <SafeAreaView style={styles.safe}><View style={styles.container}>
    <Text style={styles.title}>Mi perfil</Text>
    <View style={styles.card}><Text style={styles.name}>{user ? `${user.firstName} ${user.lastName}`.trim() : 'Usuario'}</Text><Text style={styles.info}>@{user?.username}</Text><Text style={styles.info}>{user?.email}</Text><Text style={styles.badge}>Cooperativa de Taxis</Text></View>
    <Pressable accessibilityRole="button" style={styles.button} onPress={() => Alert.alert('Cerrar sesión', '¿Quieres salir de tu cuenta?', [{ text: 'Cancelar', style: 'cancel' }, { text: 'Cerrar sesión', style: 'destructive', onPress: () => { void confirmLogout(); } }])}><Text style={styles.buttonText}>Cerrar sesión</Text></Pressable>
    <Text style={styles.note}>Los tokens de acceso se guardan con SecureStore en iOS y Android.</Text>
  </View></SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: '#0d1117' }, container: { padding: 20, maxWidth: 680, width: '100%', alignSelf: 'center' }, title: { color: '#fff', fontSize: 25, fontWeight: '900', marginBottom: 16 }, card: { padding: 18, backgroundColor: '#161b22', borderRadius: 14, borderWidth: 1, borderColor: '#30363d' }, name: { color: '#fff', fontWeight: '900', fontSize: 19 }, info: { color: '#abb6c2', marginTop: 7 }, badge: { alignSelf: 'flex-start', color: '#61dafb', marginTop: 13, fontWeight: '800' }, button: { backgroundColor: '#3a1c20', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 20 }, buttonText: { color: '#ff8a80', fontWeight: '800' }, note: { color: '#74808c', fontSize: 12, marginTop: 17, lineHeight: 18 } });
