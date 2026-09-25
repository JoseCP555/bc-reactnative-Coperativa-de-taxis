import React, { useEffect } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../../../semana_1/src/screens/HomeScreen';
import { DriversScreen } from '../../../semana_2/src/screens/DriversScreen';
import { TripsScreen } from '../../../semana_5/src/screens/TripsScreen';
import { PreferencesScreen } from '../../../semana_7/src/screens/PreferencesScreen';
import { AuthScreen } from '../../../semana_8/src/screens/AuthScreen';
import { ProfileScreen } from '../../../semana_8/src/screens/ProfileScreen';
import { useAuthStore, restoreAuthAfterHydration } from '../../../semana_8/src/store/useAuthStore';
import { AnimationLabScreen } from '../../../semana_9/src/screens/AnimationLabScreen';
import { VehiclesScreen } from '../../../semana_5/src/screens/VehiclesScreen';
import { IncomeScreen } from '../../../semana_5/src/screens/IncomeScreen';


export type RootStackParamList = {
  Acceso: undefined;
  Inicio: undefined;
  Conductores: undefined;
  Viajes: undefined;
  Preferencias: undefined;
  Perfil: undefined;
  Animaciones: undefined;
  Vehiculos: undefined;
  Ingresos: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator(): React.JSX.Element {
  const user = useAuthStore((state) => state.user);
  const ready = useAuthStore((state) => state.ready);
  const logout = useAuthStore((state) => state.logout);
  useEffect(() => restoreAuthAfterHydration(), []);
  if (!ready) return <SafeAreaView style={styles.loading}><ActivityIndicator color="#61dafb" size="large" /></SafeAreaView>;
  return <NavigationContainer><Stack.Navigator screenOptions={{
    headerStyle: { backgroundColor: '#161b22' },
    headerTintColor: '#fff',
    headerTitleStyle: { fontWeight: '800' },
    contentStyle: { backgroundColor: '#0d1117' },
    headerRight: user ? () => <Pressable accessibilityRole="button" onPress={() => void logout()} hitSlop={10}><Text style={styles.logout}>Salir</Text></Pressable> : undefined,
  }}>
    {user ? <>
      <Stack.Screen name="Inicio" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Conductores" component={DriversScreen} />
      <Stack.Screen name="Viajes" component={TripsScreen} />
      <Stack.Screen name="Preferencias" component={PreferencesScreen} />
      <Stack.Screen name="Perfil" component={ProfileScreen} />
      <Stack.Screen name="Animaciones" component={AnimationLabScreen} />
      <Stack.Screen name="Vehiculos" component={VehiclesScreen} options={{ title: 'Vehículos' }} />
      <Stack.Screen name="Ingresos" component={IncomeScreen} />
    </> : <Stack.Screen name="Acceso" component={AuthScreen} options={{ headerShown: false }} />}
  </Stack.Navigator></NavigationContainer>;
}
const styles = StyleSheet.create({ loading: { flex: 1, backgroundColor: '#0d1117', alignItems: 'center', justifyContent: 'center' }, logout: { color: '#8ce99a', fontWeight: '800', paddingHorizontal: 6 } });
