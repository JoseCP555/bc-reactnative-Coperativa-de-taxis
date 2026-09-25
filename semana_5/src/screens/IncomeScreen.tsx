import React from 'react';
import { FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getTrips } from '../services/api';
import type { Trip } from '../../../semana_2/src/types';

function money(value: number): string {
  return '$ ' + Math.round(value).toLocaleString('es-CO') + ' COP';
}


export function IncomeScreen(): React.JSX.Element {
  const query = useQuery({ queryKey: ['trips'], queryFn: getTrips });
  const trips = query.data ?? [];
  const total = trips.reduce((sum, trip) => sum + trip.fare, 0);

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList<Trip>
        data={trips}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={query.isRefetching}
            onRefresh={() => void query.refetch()}
          />
        }
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Ingresos</Text>
            <Text style={styles.subtitle}>
              Se calculan con las tarifas de los viajes registrados.
            </Text>
            <View style={styles.summary}>
              <Text style={styles.label}>Total registrado</Text>
              <Text style={styles.total}>{money(total)}</Text>
              <Text style={styles.label}>{trips.length} viajes</Text>
            </View>
            <Text style={styles.section}>Detalle de viajes</Text>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.empty}>
            {query.isLoading ? 'Cargando…' : 'Registra un viaje para calcular ingresos.'}
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.info}>
              <Text style={styles.route}>{item.origin} → {item.destination}</Text>
              <Text style={styles.driver}>{item.driver}</Text>
            </View>
            <Text style={styles.fare}>{money(item.fare)}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0d1117' },
  container: { padding: 18, paddingBottom: 30, maxWidth: 700, width: '100%', alignSelf: 'center' },
  title: { color: '#fff', fontSize: 25, fontWeight: '900' },
  subtitle: { color: '#9aa4af', marginTop: 5, marginBottom: 14 },
  summary: { backgroundColor: '#173623', padding: 17, borderRadius: 14 },
  label: { color: '#b7d9bc', fontSize: 13 },
  total: { color: '#fff', fontSize: 26, fontWeight: '900', marginVertical: 7 },
  section: { color: '#fff', fontWeight: '800', fontSize: 17, marginTop: 18, marginBottom: 9 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#161b22', borderRadius: 12, padding: 13, marginBottom: 9 },
  info: { flex: 1 },
  route: { color: '#fff', fontWeight: '800' },
  driver: { color: '#9aa4af', marginTop: 5, fontSize: 12 },
  fare: { color: '#8ce99a', fontWeight: '800', marginLeft: 8 },
  empty: { color: '#9aa4af', textAlign: 'center', padding: 20 },
});

