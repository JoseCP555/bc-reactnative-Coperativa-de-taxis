import React, { useEffect, useRef, useState } from 'react';
import { Animated, LayoutAnimation, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, UIManager, View } from 'react-native';

export function AnimationLabScreen(): React.JSX.Element {
  const [items, setItems] = useState(['Tarjeta de viaje', 'Conductor asignado', 'Servicio finalizado']);
  const progress = useRef(new Animated.Value(0)).current;
  const drift = useRef(new Animated.Value(0)).current;
  const color = progress.interpolate({ inputRange: [0, 1], outputRange: ['#238636', '#61dafb'] });

  useEffect(() => {
    Animated.timing(progress, { toValue: 1, duration: 1000, useNativeDriver: false }).start();
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) UIManager.setLayoutAnimationEnabledExperimental(true);
  }, [progress]);
  function runSpring(): void { Animated.spring(drift, { toValue: 26, useNativeDriver: true, damping: 8, stiffness: 90 }).start(() => Animated.spring(drift, { toValue: 0, useNativeDriver: true }).start()); }
  function runDecay(): void { drift.setValue(0); Animated.decay(drift, { velocity: 0.8, deceleration: 0.94, useNativeDriver: true }).start(() => drift.setValue(0)); }
  function addItem(): void {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setItems((current) => [`Nuevo servicio ${current.length + 1}`, ...current]);
  }
  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.title}>Laboratorio de animaciones</Text><Text style={styles.subtitle}>Semana 9 · Animated API y LayoutAnimation</Text>
    <View style={styles.panel}><Text style={styles.label}>Interpolate + Animated.timing</Text><View style={styles.track}><Animated.View style={[styles.fill, { width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }), backgroundColor: color }]} /></View><Text style={styles.hint}>La barra cambia tamaño y color a partir de un valor animado.</Text></View>
    <View style={styles.panel}><Text style={styles.label}>Animated.spring</Text><Animated.View style={[styles.moving, { transform: [{ translateX: drift }] }]}><Text style={styles.movingText}>Taxi</Text></Animated.View><Pressable onPress={runSpring} style={styles.button}><Text style={styles.buttonText}>Probar spring</Text></Pressable></View>
    <View style={styles.panel}><Text style={styles.label}>Animated.decay</Text><Animated.View style={[styles.moving, { transform: [{ translateX: drift }] }]}><Text style={styles.movingText}>Recorrido</Text></Animated.View><Pressable onPress={runDecay} style={styles.button}><Text style={styles.buttonText}>Probar decay</Text></Pressable></View>
    <View style={styles.panel}><Text style={styles.label}>LayoutAnimation · lista de servicios</Text><Pressable onPress={addItem} style={styles.button}><Text style={styles.buttonText}>Agregar elemento</Text></Pressable>{items.map((item) => <View key={item} style={styles.item}><Text style={styles.itemText}>{item}</Text></View>)}</View>
  </ScrollView></SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: '#0d1117' }, container: { padding: 18, paddingBottom: 30, maxWidth: 700, width: '100%', alignSelf: 'center' }, title: { color: '#fff', fontSize: 24, fontWeight: '900' }, subtitle: { color: '#9aa4af', marginTop: 5, marginBottom: 15 }, panel: { backgroundColor: '#161b22', padding: 15, borderRadius: 14, borderWidth: 1, borderColor: '#30363d', marginBottom: 12 }, label: { color: '#fff', fontWeight: '800', marginBottom: 10 }, track: { height: 9, borderRadius: 6, overflow: 'hidden', backgroundColor: '#30363d' }, fill: { height: '100%', borderRadius: 6 }, hint: { color: '#9aa4af', fontSize: 12, marginTop: 8 }, moving: { width: 120, height: 38, borderRadius: 10, backgroundColor: '#173623', alignItems: 'center', justifyContent: 'center' }, movingText: { color: '#8ce99a', fontWeight: '800' }, button: { backgroundColor: '#238636', padding: 11, borderRadius: 9, alignItems: 'center', marginTop: 10 }, buttonText: { color: '#fff', fontWeight: '800' }, item: { padding: 11, borderRadius: 8, backgroundColor: '#0d1117', marginTop: 7 }, itemText: { color: '#d3dbe3' } });
