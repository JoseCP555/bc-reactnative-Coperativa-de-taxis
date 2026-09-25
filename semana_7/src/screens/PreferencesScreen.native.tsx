import React, { useEffect, useState } from 'react';
import { Alert, Pressable, SafeAreaView, StyleSheet, Switch, Text, View } from 'react-native';
import { useMMKVBoolean, useMMKVNumber, useMMKVString } from 'react-native-mmkv';
import { storage } from '../storage/preferencesStorage.native';
import { usePreferencesStore } from '../store/usePreferencesStore';
import { privateValueStorage } from '../storage/secureToken';

export function PreferencesScreen(): React.JSX.Element {
  const [savedOrder, setSavedOrder] = useMMKVString('sortOrder', storage);
  const [savedCompact, setSavedCompact] = useMMKVBoolean('compactMode', storage);
  const [savedPageSize, setSavedPageSize] = useMMKVNumber('itemsPerPage', storage);
  const setOrder = usePreferencesStore((state) => state.setSortOrder);
  const setCompactMode = usePreferencesStore((state) => state.setCompactMode);
  const setPageSize = usePreferencesStore((state) => state.setItemsPerPage);
  const [secretSaved, setSecretSaved] = useState(false);
  const sortOrder = savedOrder === 'status' ? 'status' : 'name';
  const compactMode = savedCompact ?? false;
  const itemsPerPage = savedPageSize && [5, 10, 20].includes(savedPageSize) ? savedPageSize : 10;

  useEffect(() => { usePreferencesStore.getState().hydrate(); }, []);
  function changeOrder(value: 'name' | 'status'): void { setSavedOrder(value); setOrder(value); }
  function changeCompact(value: boolean): void { setSavedCompact(value); setCompactMode(value); }
  function changePageSize(value: number): void { setSavedPageSize(value); setPageSize(value); }
  async function saveDemoSecret(): Promise<void> {
    await privateValueStorage.set('codigo-demo-cooperativa-7319');
    const value = await privateValueStorage.get();
    setSecretSaved(Boolean(value));
    Alert.alert('Dato protegido', value ? 'Se guardó en SecureStore. El valor no se muestra.' : 'No se pudo confirmar el guardado.');
  }

  return <SafeAreaView style={styles.safe}><View style={styles.container}>
    <Text style={styles.title}>Preferencias</Text><Text style={styles.caption}>Semana 7 · MMKV las actualiza y conserva al instante.</Text>
    <View style={styles.row}><View style={styles.copy}><Text style={styles.label}>Modo compacto</Text><Text style={styles.hint}>Reduce el espacio entre elementos.</Text></View><Switch value={compactMode} onValueChange={changeCompact} trackColor={{ true: '#238636' }} /></View>
    <View style={styles.card}><Text style={styles.label}>Orden de conductores</Text><View style={styles.choices}><Choice title="Nombre" active={sortOrder === 'name'} onPress={() => changeOrder('name')} /><Choice title="Estado" active={sortOrder === 'status'} onPress={() => changeOrder('status')} /></View></View>
    <View style={styles.card}><Text style={styles.label}>Conductores por página</Text><View style={styles.choices}>{[5, 10, 20].map((value) => <Choice key={value} title={String(value)} active={itemsPerPage === value} onPress={() => changePageSize(value)} />)}</View></View>
    <View style={styles.card}><Text style={styles.label}>Seguridad</Text><Text style={styles.hint}>Prueba SecureStore. La aplicación confirma el guardado sin revelar el dato sensible.</Text><Pressable onPress={() => void saveDemoSecret()} style={styles.button}><Text style={styles.buttonText}>{secretSaved ? 'Dato guardado de forma segura' : 'Guardar dato de prueba'}</Text></Pressable></View>
  </View></SafeAreaView>;
}
function Choice({ title, active, onPress }: { title: string; active: boolean; onPress: () => void }): React.JSX.Element {
  return <Pressable onPress={onPress} style={[styles.choice, active && styles.choiceActive]}><Text style={[styles.choiceText, active && styles.choiceTextActive]}>{title}</Text></Pressable>;
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: '#0d1117' }, container: { padding: 20, maxWidth: 680, width: '100%', alignSelf: 'center' }, title: { color: '#fff', fontSize: 25, fontWeight: '900' }, caption: { color: '#9aa4af', marginTop: 5, marginBottom: 16 }, row: { backgroundColor: '#161b22', borderRadius: 14, borderWidth: 1, borderColor: '#30363d', padding: 15, flexDirection: 'row', alignItems: 'center' }, copy: { flex: 1 }, label: { color: '#fff', fontSize: 15, fontWeight: '800' }, hint: { color: '#9aa4af', fontSize: 12, lineHeight: 18, marginTop: 5 }, card: { backgroundColor: '#161b22', borderRadius: 14, borderWidth: 1, borderColor: '#30363d', padding: 15, marginTop: 12 }, choices: { flexDirection: 'row', gap: 8, marginTop: 11 }, choice: { borderRadius: 9, paddingHorizontal: 13, paddingVertical: 9, backgroundColor: '#0d1117', borderWidth: 1, borderColor: '#30363d' }, choiceActive: { backgroundColor: '#173623', borderColor: '#238636' }, choiceText: { color: '#bdc6d0', fontWeight: '700' }, choiceTextActive: { color: '#8ce99a' }, button: { backgroundColor: '#173623', borderRadius: 9, padding: 12, marginTop: 12, alignItems: 'center' }, buttonText: { color: '#8ce99a', fontWeight: '800' } });
