import React, { useEffect, useMemo, useState } from 'react';
import { isAxiosError } from 'axios';
import { ActivityIndicator, Alert, FlatList, LayoutAnimation, Platform, Pressable, RefreshControl, SafeAreaView, StyleSheet, Text, TextInput, UIManager, View } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field } from '../../../semana_6/src/components/Field';
import { PrimaryButton } from '../../../semana_6/src/components/PrimaryButton';
import { driverSchema, type DriverForm } from '../../../semana_6/src/validation/schemas';
import { useCooperativeStore } from '../../../semana_4/src/store/useCooperativeStore';
import { readDriverCache } from '../../../semana_7/src/storage/driverCache';
import { usePreferencesStore } from '../../../semana_7/src/store/usePreferencesStore';
import { createDriver, deleteDriver, getDrivers, setDriverStatus, updateDriver } from '../../../semana_5/src/services/api';
import type { Driver } from '../types';

function isNetworkUnavailable(error: unknown): boolean {
  return isAxiosError(error) && !error.response;
}

export function DriversScreen(): React.JSX.Element {
  const queryClient = useQueryClient();
  const drivers = useCooperativeStore((state) => state.drivers);
  const hydrated = useCooperativeStore((state) => state.hydrated);
  const hydrate = useCooperativeStore((state) => state.hydrate);
  const replaceDrivers = useCooperativeStore((state) => state.replaceDrivers);
  const addLocal = useCooperativeStore((state) => state.addDriver);
  const updateLocal = useCooperativeStore((state) => state.updateDriver);
  const removeLocal = useCooperativeStore((state) => state.removeDriver);
  const toggleLocal = useCooperativeStore((state) => state.toggleDriverStatus);
  const sortOrder = usePreferencesStore((state) => state.sortOrder);
  const compactMode = usePreferencesStore((state) => state.compactMode);
  const itemsPerPage = usePreferencesStore((state) => state.itemsPerPage);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Driver | null>(null);
  const [offline, setOffline] = useState(false);
  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<DriverForm>({ resolver: zodResolver(driverSchema), defaultValues: { name: '', phone: '' } });

  useEffect(() => {
    void hydrate();
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) UIManager.setLayoutAnimationEnabledExperimental(true);
  }, [hydrate]);

  const query = useQuery({
    queryKey: ['drivers'],
    enabled: hydrated,
    initialData: drivers,
    queryFn: async () => {
      try {
        const online = await getDrivers();
        await replaceDrivers(online);
        setOffline(false);
        return online;
      } catch (error) {
        if (!isNetworkUnavailable(error)) throw error;
        const cached = await readDriverCache();
        if (cached?.length) { setOffline(true); await replaceDrivers(cached); return cached; }
        throw new Error('No hay conexión ni datos guardados.');
      }
    },
    staleTime: 0,
  });

  const saveMutation = useMutation({
    mutationFn: async ({ id, values }: { id: string | null; values: DriverForm }) => id ? updateDriver(id, values) : createDriver(values),
    onSuccess: async (saved, variables) => {
      const current = useCooperativeStore.getState().drivers;
      const next = variables.id ? current.map((item) => item.id === saved.id ? saved : item) : [saved, ...current];
      await replaceDrivers(next);
      queryClient.setQueryData(['drivers'], next);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      reset({ name: '', phone: '' });
      setEditing(null);
    },
    onError: async (error, variables) => {
      if (!isNetworkUnavailable(error)) {
        Alert.alert('No se pudo guardar', 'El servidor rechazó el cambio. Revisa los datos e inténtalo de nuevo.');
        return;
      }
      // En una falla de red se permite continuar solo con datos locales; no hay cola de sincronización.
      if (variables.id) await updateLocal(variables.id, variables.values.name, variables.values.phone);
      else await addLocal(variables.values.name, variables.values.phone);
      queryClient.setQueryData(['drivers'], useCooperativeStore.getState().drivers);
      setOffline(true);
      reset({ name: '', phone: '' });
      setEditing(null);
      Alert.alert('Guardado solo en el dispositivo', 'El cambio quedó en el almacenamiento local. No se sincronizará automáticamente con un servidor.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDriver,
    onSuccess: async (_result, id) => {
      const next = useCooperativeStore.getState().drivers.filter((item) => item.id !== id);
      await replaceDrivers(next);
      queryClient.setQueryData(['drivers'], next);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    },
    onError: async (error, id) => {
      if (!isNetworkUnavailable(error)) {
        Alert.alert('No se pudo eliminar', 'El servidor rechazó la eliminación.');
        return;
      }
      await removeLocal(id);
      queryClient.setQueryData(['drivers'], useCooperativeStore.getState().drivers);
      setOffline(true);
      Alert.alert('Eliminado solo del dispositivo', 'No hay cola de sincronización; el servidor conserva su copia.');
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Driver['status'] }) => setDriverStatus(id, status),
    onSuccess: async (updated) => {
      const next = useCooperativeStore.getState().drivers.map((item) => item.id === updated.id ? updated : item);
      await replaceDrivers(next);
      queryClient.setQueryData(['drivers'], next);
    },
    onError: async (error, variables) => {
      if (!isNetworkUnavailable(error)) { Alert.alert('No se pudo cambiar el estado', 'El servidor rechazó el cambio.'); return; }
      await toggleLocal(variables.id);
      queryClient.setQueryData(['drivers'], useCooperativeStore.getState().drivers);
      setOffline(true);
      Alert.alert('Estado actualizado solo en el dispositivo', 'El cambio local no se sincronizará automáticamente.');
    },
  });

  const visible = useMemo(() => {
    const list = [...(query.data ?? drivers)].filter((item) => `${item.name} ${item.phone}`.toLowerCase().includes(search.toLowerCase()));
    list.sort((a, b) => sortOrder === 'name' ? a.name.localeCompare(b.name, 'es') : a.status.localeCompare(b.status, 'es'));
    return list.slice(0, itemsPerPage);
  }, [query.data, drivers, search, sortOrder, itemsPerPage]);

  function submit(values: DriverForm): void { saveMutation.mutate({ id: editing?.id ?? null, values }); }
  function startEdit(driver: Driver): void { setEditing(driver); reset({ name: driver.name, phone: driver.phone }); }
  function changeStatus(driver: Driver): void {
    const states: Driver['status'][] = ['Disponible', 'En viaje', 'Descanso'];
    const next = states[(states.indexOf(driver.status) + 1) % states.length];
    statusMutation.mutate({ id: driver.id, status: next });
  }
  function confirmDelete(driver: Driver): void {
    Alert.alert('Eliminar conductor', `¿Quieres eliminar a ${driver.name}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => deleteMutation.mutate(driver.id) },
    ]);
  }

  return <SafeAreaView style={styles.safe}><FlatList
    data={visible}
    keyExtractor={(item) => item.id}
    keyboardShouldPersistTaps="handled"
    contentContainerStyle={styles.container}
    refreshControl={<RefreshControl refreshing={query.isRefetching} onRefresh={() => void query.refetch()} tintColor="#61dafb" />}
    ListHeaderComponent={<>
      <Text style={styles.title}>Conductores</Text>
      <Text style={styles.subtitle}>Registra, busca, edita y administra el estado del equipo.</Text>
      {offline ? <View style={styles.offline}><Text style={styles.offlineText}>⚠ Mostrando datos guardados sin conexión</Text></View> : null}
      <View style={styles.form}><Text style={styles.formTitle}>{editing ? 'Editar conductor' : 'Registrar conductor'}</Text>
        <Field control={control} name="name" label="Nombre completo" error={errors.name?.message} />
        <Field control={control} name="phone" label="Teléfono" keyboardType="phone-pad" error={errors.phone?.message} />
        <PrimaryButton title={editing ? 'Guardar cambios' : 'Agregar conductor'} loading={isSubmitting || saveMutation.isPending} onPress={handleSubmit(submit)} />
        {editing ? <Pressable onPress={() => { setEditing(null); reset({ name: '', phone: '' }); }} style={styles.cancel}><Text style={styles.cancelText}>Cancelar edición</Text></Pressable> : null}
      </View>
      <TextInput value={search} onChangeText={setSearch} placeholder="Buscar por nombre o teléfono" placeholderTextColor="#74808c" style={styles.search} />
      <Text style={styles.listTitle}>Listado ({visible.length}{query.data?.length && query.data.length > visible.length ? ` de ${query.data.length}` : ''})</Text>
    </>}
    ListEmptyComponent={query.isLoading ? <View style={styles.center}><ActivityIndicator color="#61dafb" /><Text style={styles.empty}>Cargando conductores…</Text></View> : query.isError ? <Text style={styles.error}>No se pudieron cargar conductores. Desliza para reintentar.</Text> : <Text style={styles.empty}>No hay conductores que coincidan.</Text>}
    renderItem={({ item }) => <View style={[styles.row, compactMode && styles.rowCompact]}>
      <Pressable style={styles.driverInfo} onPress={() => changeStatus(item)}><Text style={styles.name}>{item.name}</Text><Text style={styles.meta}>{item.phone} · {item.status}</Text><Text style={styles.action}>Toca para cambiar estado</Text></Pressable>
      <View style={styles.actions}><Pressable onPress={() => startEdit(item)} style={styles.edit}><Text style={styles.actionText}>Editar</Text></Pressable><Pressable onPress={() => confirmDelete(item)} style={styles.delete}><Text style={styles.deleteText}>Eliminar</Text></Pressable></View>
    </View>}
  /></SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: '#0d1117' }, container: { padding: 18, paddingBottom: 30, maxWidth: 700, width: '100%', alignSelf: 'center' }, title: { color: '#fff', fontSize: 25, fontWeight: '900' }, subtitle: { color: '#8b949e', marginTop: 5, marginBottom: 15 }, offline: { backgroundColor: '#493716', borderRadius: 8, padding: 10, marginBottom: 12 }, offlineText: { color: '#f0c36d', fontWeight: '700', fontSize: 12 }, form: { backgroundColor: '#111820', borderWidth: 1, borderColor: '#30363d', borderRadius: 15, padding: 15 }, formTitle: { color: '#fff', fontSize: 16, fontWeight: '800', marginBottom: 12 }, cancel: { padding: 10, alignItems: 'center' }, cancelText: { color: '#9aa4af', fontWeight: '700' }, search: { marginTop: 17, marginBottom: 12, color: '#fff', backgroundColor: '#161b22', borderColor: '#30363d', borderWidth: 1, borderRadius: 10, padding: 12 }, listTitle: { color: '#fff', fontSize: 17, fontWeight: '800', marginBottom: 10 }, row: { backgroundColor: '#161b22', borderWidth: 1, borderColor: '#30363d', borderRadius: 13, padding: 14, marginBottom: 9, flexDirection: 'row', alignItems: 'center' }, rowCompact: { paddingVertical: 8, marginBottom: 5 }, driverInfo: { flex: 1 }, name: { color: '#fff', fontSize: 16, fontWeight: '800' }, meta: { color: '#b0bac5', fontSize: 13, marginTop: 4 }, action: { color: '#61dafb', fontSize: 11, marginTop: 6 }, actions: { gap: 6, marginLeft: 8 }, edit: { backgroundColor: '#173623', padding: 8, borderRadius: 7 }, actionText: { color: '#8ce99a', fontSize: 11, fontWeight: '700' }, delete: { backgroundColor: '#3a1c20', padding: 8, borderRadius: 7 }, deleteText: { color: '#ff8a80', fontWeight: '700', fontSize: 11 }, center: { padding: 24, alignItems: 'center' }, empty: { color: '#9aa4af', textAlign: 'center', padding: 18 }, error: { color: '#ff8a80', textAlign: 'center', padding: 18 } });
