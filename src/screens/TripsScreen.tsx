import React from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getTrips } from '../services/api';

export function TripsScreen(): React.JSX.Element {
  const { data, isLoading, isError } = useQuery({ queryKey: ['trips'], queryFn: getTrips });
  if (isLoading) return <View style={styles.center}><ActivityIndicator color="#61dafb" /><Text style={styles.text}>Cargando viajes...</Text></View>;
  if (isError) return <View style={styles.center}><Text style={styles.text}>No fue posible cargar los viajes.</Text></View>;
  return <SafeAreaView style={styles.safe}><View style={styles.container}><Text style={styles.title}>Viajes</Text><FlatList data={data} keyExtractor={(item) => item.id} renderItem={({ item }) => <View style={styles.row}><Text style={styles.name}>{item.origin} → {item.destination}</Text><Text style={styles.detail}>{item.driver} · ${item.fare.toLocaleString('es-CO')}</Text></View>} /></View></SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: '#0d1117' }, container: { flex: 1, padding: 20 }, center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0d1117' }, text: { color: '#c9d1d9', marginTop: 10 }, title: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 16 }, row: { backgroundColor: '#161b22', padding: 15, borderRadius: 10, marginBottom: 10 }, name: { color: '#fff', fontSize: 17, fontWeight: 'bold' }, detail: { color: '#8b949e', marginTop: 5 } });
