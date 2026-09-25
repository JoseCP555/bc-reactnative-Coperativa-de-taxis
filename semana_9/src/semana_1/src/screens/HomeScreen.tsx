import React, { useEffect, useRef } from 'react';
import { Alert, Animated, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CategoryCard } from '../components/CategoryCard';
import { useCooperativeStore } from '../../../semana_4/src/store/useCooperativeStore';
import type { RootStackParamList } from '../../../semana_3/src/navigation/AppNavigator';
import { useAuthStore } from '../../../semana_8/src/store/useAuthStore';
import { AnimatedEntry } from '../../../semana_9/src/components/AnimatedEntry';
import { AnimatedActionCard } from '../../../semana_9/src/components/AnimatedActionCard';

type HomeProps = NativeStackScreenProps<RootStackParamList, 'Inicio'>;
const cards = [
  { title: 'Conductores', subtitle: 'Personal de la cooperativa', description: 'Consulta, agrega y actualiza el estado del equipo.', imageSource: require('../../../assets/conductores.png') },
  { title: 'Vehículos', subtitle: 'Taxis registrados', description: 'Revisa los vehículos habilitados para prestar el servicio.', imageSource: require('../../../assets/vehiculos.png') },
  { title: 'Viajes', subtitle: 'Servicios realizados', description: 'Registra viajes y consulta su historial.', imageSource: require('../../../assets/viajes.png') },
  { title: 'Ingresos', subtitle: 'Resumen financiero', description: 'Visualiza la información general de ingresos del día.', imageSource: require('../../../assets/ingresos.png') },
];

export function HomeScreen({ navigation }: HomeProps): React.JSX.Element {
  const drivers = useCooperativeStore((state) => state.drivers);
  const hydrateDrivers = useCooperativeStore((state) => state.hydrate);
  const user = useAuthStore((state) => state.user);
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    void hydrateDrivers();
    Animated.timing(progress, { toValue: 0.72, duration: 800, useNativeDriver: false }).start();
  }, [hydrateDrivers, progress]);
  
  function openCard(title: string): void {
    if (title === 'Conductores') navigation.navigate('Conductores');
    if (title === 'Viajes') navigation.navigate('Viajes');
    if (title === 'Vehículos') navigation.navigate('Vehiculos');
    if (title === 'Ingresos') navigation.navigate('Ingresos');
  }


  
  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
    <View style={styles.brandRow}><View style={styles.logo}><Text style={styles.logoText}>CT</Text></View><View><Text style={styles.eyebrow}>GESTIÓN DE SERVICIOS</Text><Text style={styles.brand}>Cooperativa de Taxis</Text></View></View>
    <Text style={styles.welcome}>Hola, {user?.firstName ?? 'equipo'}. Administra la operación de forma sencilla.</Text>
    <View style={styles.summary}><Text style={styles.summaryNumber}>{drivers.length}</Text><View><Text style={styles.summaryLabel}>Conductores registrados</Text><Text style={styles.summaryHint}>Datos guardados para consulta sin conexión</Text></View></View>
    <Text style={styles.progressLabel}>Actividad de hoy</Text><View style={styles.track}><Animated.View style={[styles.fill, { width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} /></View>
    <Text style={styles.sectionTitle}>Módulos principales</Text>
    {cards.map((card, index) => <AnimatedEntry key={card.title} delay={index * 90}><CategoryCard {...card} onPress={() => openCard(card.title)} /></AnimatedEntry>)}
    <Text style={styles.sectionTitle}>Cuenta y herramientas</Text>
    <AnimatedActionCard title="Mi perfil" subtitle="Datos de sesión y cerrar sesión" delay={400} onPress={() => navigation.navigate('Perfil')} />
    <AnimatedActionCard title="Preferencias" subtitle="Orden, vista compacta y tamaño de lista" delay={470} onPress={() => navigation.navigate('Preferencias')} />
    <AnimatedActionCard title="Laboratorio de animaciones" subtitle="Timing, spring, decay, interpolate y LayoutAnimation" delay={540} onPress={() => navigation.navigate('Animaciones')} />
    <Text style={styles.footer}>Proyecto integrado · Semanas 1 a 9 · Expo + React Native</Text>
  </ScrollView></SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: '#0d1117' }, container: { padding: 20, paddingBottom: 30, maxWidth: 700, width: '100%', alignSelf: 'center' }, brandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 }, logo: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#238636', alignItems: 'center', justifyContent: 'center', marginRight: 12 }, logoText: { color: '#fff', fontSize: 18, fontWeight: '900' }, eyebrow: { color: '#61dafb', fontSize: 11, fontWeight: '800', letterSpacing: 1 }, brand: { color: '#fff', fontSize: 21, fontWeight: '900', marginTop: 2 }, welcome: { color: '#aeb8c4', fontSize: 15, lineHeight: 22, marginBottom: 18 }, summary: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#161b22', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#30363d', marginBottom: 18 }, summaryNumber: { color: '#61dafb', fontSize: 32, fontWeight: '900', marginRight: 13 }, summaryLabel: { color: '#fff', fontSize: 15, fontWeight: '700' }, summaryHint: { color: '#8b949e', fontSize: 12, marginTop: 3 }, progressLabel: { color: '#c9d1d9', fontSize: 13, fontWeight: '700', marginBottom: 7 }, track: { height: 8, backgroundColor: '#21262d', borderRadius: 8, overflow: 'hidden', marginBottom: 22 }, fill: { height: 8, backgroundColor: '#3fb950', borderRadius: 8 }, sectionTitle: { color: '#fff', fontSize: 19, fontWeight: '800', marginTop: 5, marginBottom: 12 }, footer: { color: '#6e7681', fontSize: 12, textAlign: 'center', marginTop: 8 } });
