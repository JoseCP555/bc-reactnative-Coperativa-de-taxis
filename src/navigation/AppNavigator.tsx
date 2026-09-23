import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { DriversScreen } from '../screens/DriversScreen';
import { TripsScreen } from '../screens/TripsScreen';

export type RootStackParamList = { Inicio: undefined; Conductores: undefined; Viajes: undefined };
const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator(): React.JSX.Element {
  return <NavigationContainer><Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#161b22' }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: '800' }, contentStyle: { backgroundColor: '#0d1117' } }}><Stack.Screen name="Inicio" component={HomeScreen} options={{ headerShown: false }} /><Stack.Screen name="Conductores" component={DriversScreen} /><Stack.Screen name="Viajes" component={TripsScreen} /></Stack.Navigator></NavigationContainer>;
}
