import React, { useEffect } from 'react';
import { ActivityIndicator, Alert, FlatList, LayoutAnimation, Platform, Pressable, RefreshControl, SafeAreaView, StyleSheet, Text, UIManager, View } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field } from '../../../semana_6/src/components/Field';
import { PrimaryButton } from '../../../semana_6/src/components/PrimaryButton';
import { tripSchema, type TripForm } from '../../../semana_6/src/validation/schemas';
import { createTrip, deleteTrip, getTrips } from '../services/api';

export function TripsScreen(): React.JSX.Element {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ['trips'], queryFn: getTrips, staleTime: 30000 });
  const form = useForm<TripForm>({ resolver: zodResolver(tripSchema), defaultValues: { origin: '', destination: '', driver: '', fare: '' } });
  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) UIManager.setLayoutAnimationEnabledExperimental(true);
  }, []);
  const createMutation = useMutation({
    mutationFn: createTrip,
    onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ['trips'] }); form.reset(); LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); },
    onError: () => Alert.alert('No se pudo guardar', 'Revisa los datos e inténtalo de nuevo.'),
  });
  const removeMutation = useMutation({
    mutationFn: deleteTrip,
    onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ['trips'] }); LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); },
    onError: () => Alert.alert('No se pudo eliminar', 'Inténtalo de nuevo.'),
  });

  return <SafeAreaView style={styles.safe}><FlatList
    data={query.data ?? []}
    keyExtractor={(item) => item.id}
    contentContainerStyle={styles.container}
    keyboardShouldPersistTaps="handled"
    refreshControl={<RefreshControl refreshing={query.isRefetching} onRefresh={() => void query.refetch()} tintColor="#61dafb" />}
    ListHeaderComponent={<>
      <Text style={styles.title}>Viajes</Text><Text style={styles.subtitle}>Registra y consulta los servicios de la cooperativa.</Text>
      <View style={styles.form}><Text style={styles.formTitle}>Nuevo viaje</Text>
        <Field control={form.control} name="origin" label="Origen" error={form.formState.errors.origin?.message} />
        <Field control={form.control} name="destination" label="Destino" error={form.formState.errors.destination?.message} />
        <Field control={form.control} name="driver" label="Conductor" error={form.formState.errors.driver?.message} />
        <Field control={form.control} name="fare" label="Tarifa (COP)" keyboardType="decimal-pad" error={form.formState.errors.fare?.message} />
        <PrimaryButton title="Guardar viaje" loading={form.formState.isSubmitting || createMutation.isPending} onPress={form.handleSubmit((values) => createMutation.mutate(values))} />
      </View>
      <Text style={styles.listTitle}>Historial de viajes</Text>
    </>}
    ListEmptyComponent={query.isLoading ? <View style={styles.center}><ActivityIndicator color="#61dafb" /><Text style={styles.empty}>Cargando viajes…</Text></View> : query.isError ? <Pressable onPress={() => void query.refetch()}><Text style={styles.error}>No se pudieron cargar. Toca para reintentar.</Text></Pressable> : <Text style={styles.empty}>Todavía no hay viajes registrados.</Text>}
    renderItem={({ item }) => <View style={styles.trip}><View style={styles.info}><Text style={styles.route}>{item.origin} → {item.destination}</Text><Text style={styles.meta}>{item.driver} · ${item.fare.toLocaleString('es-CO')}</Text><Text style={styles.date}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString('es-CO') : 'Servicio de ejemplo'}</Text></View><Pressable accessibilityRole="button" onPress={() => removeMutation.mutate(item.id)} style={styles.remove}><Text style={styles.removeText}>Eliminar</Text></Pressable></View>}
  /></SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: '#0d1117' }, container: { padding: 18, paddingBottom: 30, maxWidth: 700, width: '100%', alignSelf: 'center' }, title: { color: '#fff', fontSize: 25, fontWeight: '900' }, subtitle: { color: '#9aa4af', fontSize: 13, lineHeight: 19, marginTop: 5, marginBottom: 14 }, form: { padding: 15, backgroundColor: '#111820', borderRadius: 15, borderWidth: 1, borderColor: '#30363d', marginBottom: 18 }, formTitle: { color: '#fff', fontWeight: '800', fontSize: 16, marginBottom: 12 }, listTitle: { color: '#fff', fontWeight: '800', fontSize: 17, marginBottom: 10 }, trip: { backgroundColor: '#161b22', borderWidth: 1, borderColor: '#30363d', borderRadius: 12, padding: 13, marginBottom: 9, flexDirection: 'row', alignItems: 'center' }, info: { flex: 1 }, route: { color: '#fff', fontWeight: '800', fontSize: 15 }, meta: { color: '#aeb8c4', fontSize: 12, marginTop: 5 }, date: { color: '#697582', fontSize: 11, marginTop: 4 }, remove: { padding: 8, backgroundColor: '#3a1c20', borderRadius: 7 }, removeText: { color: '#ff8a80', fontSize: 11, fontWeight: '700' }, center: { padding: 24, alignItems: 'center' }, empty: { color: '#9aa4af', textAlign: 'center', padding: 18 }, error: { color: '#ff8a80', textAlign: 'center', padding: 18 } });
