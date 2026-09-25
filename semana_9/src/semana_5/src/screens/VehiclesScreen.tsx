import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  FlatList, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { vehicles as initialVehicles } from '../data/mockData';
import type { Vehicle } from '../../../semana_2/src/types';

const KEY = 'cooperativa-vehicles-v1';

export function VehiclesScreen(): React.JSX.Element {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [ready, setReady] = useState(false);
  const [plate, setPlate] = useState('');
  const [model, setModel] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    void AsyncStorage.getItem(KEY).then((saved) => {
      if (saved) setVehicles(JSON.parse(saved) as Vehicle[]);
      else setVehicles(initialVehicles);
    }).catch(() => {
      setVehicles(initialVehicles);
    }).finally(() => {
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (ready) {
      void AsyncStorage.setItem(KEY, JSON.stringify(vehicles));
    }
  }, [vehicles, ready]);

  function saveVehicle(): void {
    const cleanPlate = plate.trim().toUpperCase();
    const cleanModel = model.trim();

    if (!/^[A-Z]{3}[- ]?\d{3,4}$/.test(cleanPlate)) {
      setMessage('Escribe una placa válida, por ejemplo ABC 123.');
      return;
    }
    if (cleanModel.length < 2) {
      setMessage('Escribe la marca o el modelo.');
      return;
    }

    if (editingId) {
      setVehicles(list => list.map(vehicle =>
        vehicle.id === editingId
          ? { ...vehicle, plate: cleanPlate, model: cleanModel }
          : vehicle
      ));
    } else {
      setVehicles(list => [{
        id: `v${Date.now()}`,
        plate: cleanPlate,
        model: cleanModel,
        status: 'Disponible',
      }, ...list]);
    }

    setPlate('');
    setModel('');
    setEditingId(null);
    setMessage('Vehículo guardado.');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={ready ? vehicles : []}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.container}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Vehículos</Text>
            <TextInput
              value={plate}
              onChangeText={setPlate}
              placeholder="Placa (ABC 123)"
              autoCapitalize="characters"
              placeholderTextColor="#8994a0"
              style={styles.input}
            />
            <TextInput
              value={model}
              onChangeText={setModel}
              placeholder="Marca o modelo"
              placeholderTextColor="#8994a0"
              style={styles.input}
            />
            <Pressable onPress={saveVehicle} style={styles.button}>
              <Text style={styles.buttonText}>
                {editingId ? 'Guardar cambios' : 'Agregar vehículo'}
              </Text>
            </Pressable>
            {editingId ? (
              <Pressable onPress={() => {
                setEditingId(null);
                setPlate('');
                setModel('');
              }}>
                <Text style={styles.cancel}>Cancelar edición</Text>
              </Pressable>
            ) : null}
            {message ? <Text style={styles.message}>{message}</Text> : null}
            <Text style={styles.section}>Flota ({vehicles.length})</Text>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.empty}>
            {ready ? 'No hay vehículos registrados.' : 'Cargando vehículos…'}
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.info}>
              <Text style={styles.plate}>{item.plate}</Text>
              <Text style={styles.model}>{item.model}</Text>
              <Pressable onPress={() => setVehicles(list => list.map(vehicle =>
                vehicle.id === item.id
                  ? { ...vehicle, status: vehicle.status === 'Disponible' ? 'En servicio' : 'Disponible' }
                  : vehicle
              ))}>
                <Text style={styles.status}>{item.status} · toca para cambiar</Text>
              </Pressable>
            </View>
            <View>
              <Pressable onPress={() => {
                setEditingId(item.id);
                setPlate(item.plate);
                setModel(item.model);
              }}>
                <Text style={styles.edit}>Editar</Text>
              </Pressable>
              <Pressable onPress={() => setVehicles(list => list.filter(v => v.id !== item.id))}>
                <Text style={styles.delete}>Eliminar</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0d1117' },
  container: { padding: 18, paddingBottom: 30, maxWidth: 700, width: '100%', alignSelf: 'center' },
  title: { color: '#fff', fontSize: 25, fontWeight: '900', marginBottom: 12 },
  input: { color: '#fff', backgroundColor: '#161b22', borderWidth: 1, borderColor: '#30363d', borderRadius: 9, padding: 12, marginBottom: 10 },
  button: { backgroundColor: '#238636', padding: 12, borderRadius: 9, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '800' },
  cancel: { color: '#9aa4af', textAlign: 'center', padding: 10 },
  message: { color: '#61dafb', marginTop: 9 },
  section: { color: '#fff', fontWeight: '800', fontSize: 17, marginTop: 18, marginBottom: 9 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#161b22', borderWidth: 1, borderColor: '#30363d', borderRadius: 12, padding: 13, marginBottom: 9 },
  info: { flex: 1 },
  plate: { color: '#fff', fontWeight: '900', fontSize: 17 },
  model: { color: '#bdc6d0', marginTop: 4 },
  status: { color: '#8ce99a', fontSize: 12, marginTop: 7 },
  edit: { color: '#61dafb', padding: 6 },
  delete: { color: '#ff8a80', padding: 6 },
  empty: { color: '#9aa4af', textAlign: 'center', padding: 20 },
});
