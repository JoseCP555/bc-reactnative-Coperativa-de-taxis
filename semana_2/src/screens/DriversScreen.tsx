import React, { useState } from 'react';
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useCooperativeStore } from '../../../semana_4/src/store/useCooperativeStore';

export function DriversScreen(): React.JSX.Element {
  const drivers = useCooperativeStore((state) => state.drivers);
  const addDriver = useCooperativeStore((state) => state.addDriver);
  const toggle = useCooperativeStore((state) => state.toggleDriverStatus);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  function saveDriver(): void {
    if (!name.trim() || !phone.trim()) return;
    addDriver(name.trim(), phone.trim()); setName(''); setPhone('');
  }

  return <SafeAreaView style={styles.safe}>
    <View style={styles.container}>
      <Text style={styles.title}>Conductores</Text>
      <TextInput style={styles.input} placeholder="Nombre completo" placeholderTextColor="#8b949e" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Teléfono" placeholderTextColor="#8b949e" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <Pressable style={styles.button} onPress={saveDriver}><Text style={styles.buttonText}>Agregar conductor</Text></Pressable>
      <FlatList data={drivers} keyExtractor={(item) => item.id} renderItem={({ item }) => <Pressable style={styles.row} onPress={() => toggle(item.id)}><Text style={styles.name}>{item.name}</Text><Text style={styles.detail}>{item.phone} · {item.status}</Text></Pressable>} />
    </View>
  </SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: '#0d1117' }, container: { flex: 1, padding: 20 }, title: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 16 }, input: { backgroundColor: '#161b22', color: '#fff', borderWidth: 1, borderColor: '#30363d', borderRadius: 8, padding: 12, marginBottom: 10 }, button: { backgroundColor: '#61dafb', padding: 13, borderRadius: 8, alignItems: 'center', marginBottom: 18 }, buttonText: { color: '#0d1117', fontWeight: 'bold' }, row: { backgroundColor: '#161b22', padding: 15, borderRadius: 10, marginBottom: 10 }, name: { color: '#fff', fontSize: 17, fontWeight: 'bold' }, detail: { color: '#8b949e', marginTop: 5 } });
