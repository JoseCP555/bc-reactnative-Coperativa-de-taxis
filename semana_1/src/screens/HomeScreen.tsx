import React from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CategoryCard } from '../components/CategoryCard';
import { useCooperativeStore } from '../../../semana_4/src/store/useCooperativeStore';
import { RootStackParamList } from '../../../semana_3/src/navigation/AppNavigator';

export type HomeProps = NativeStackScreenProps<RootStackParamList, 'Inicio'>;

const cards = [
  { title: 'Conductores', subtitle: 'Personal de la cooperativa', description: 'Consulta los conductores registrados y su estado actual.', imageSource: require('../../../assets/conductores.png') },
  { title: 'Vehículos', subtitle: 'Taxis registrados', description: 'Revisa los vehículos habilitados para prestar el servicio.', imageSource: require('../../../assets/vehiculos.png') },
  { title: 'Viajes', subtitle: 'Servicios realizados', description: 'Consulta los viajes y recorridos gestionados por la cooperativa.', imageSource: require('../../../assets/viajes.png') },
  { title: 'Ingresos', subtitle: 'Resumen financiero', description: 'Visualiza la información general de los ingresos del día.', imageSource: require('../../../assets/ingresos.png') },
];

export function HomeScreen({ navigation }: HomeProps): React.JSX.Element {
  const drivers = useCooperativeStore((state) => state.drivers);

  function openCard(title: string): void {
    if (title === 'Conductores') return navigation.navigate('Conductores');
    if (title === 'Viajes') return navigation.navigate('Viajes');
    Alert.alert(title, title === 'Vehículos' ? 'Hay 2 vehículos registrados.' : 'Resumen de ingresos del día.');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.brandRow}>
          <View style={styles.logo}><Text style={styles.logoText}>CT</Text></View>
          <View><Text style={styles.eyebrow}>GESTIÓN DE SERVICIOS</Text><Text style={styles.brand}>Cooperativa de Taxis</Text></View>
        </View>
        <Text style={styles.welcome}>Todo lo que necesitas para administrar la cooperativa en un solo lugar.</Text>
        <View style={styles.summary}><Text style={styles.summaryNumber}>{drivers.length}</Text><View><Text style={styles.summaryLabel}>Conductores registrados</Text><Text style={styles.summaryHint}>Información actualizada</Text></View></View>
        <Text style={styles.sectionTitle}>Módulos principales</Text>
        {cards.map((card) => <CategoryCard key={card.title} {...card} onPress={() => openCard(card.title)} />)}
        <Text style={styles.footer}>Semana 1 a 5 · React Native · Expo</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0d1117' },
  container: { padding: 20, paddingBottom: 30 },
  brandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  logo: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#238636', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  logoText: { color: '#fff', fontSize: 18, fontWeight: '900' },
  eyebrow: { color: '#61dafb', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  brand: { color: '#fff', fontSize: 22, fontWeight: '900', marginTop: 2 },
  welcome: { color: '#aeb8c4', fontSize: 15, lineHeight: 22, marginBottom: 18 },
  summary: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#161b22', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#30363d', marginBottom: 25 },
  summaryNumber: { color: '#61dafb', fontSize: 32, fontWeight: '900', marginRight: 13 },
  summaryLabel: { color: '#fff', fontSize: 15, fontWeight: '700' },
  summaryHint: { color: '#8b949e', fontSize: 12, marginTop: 3 },
  sectionTitle: { color: '#fff', fontSize: 20, fontWeight: '800', marginBottom: 14 },
  footer: { color: '#6e7681', fontSize: 12, textAlign: 'center', marginTop: 4 },
});
