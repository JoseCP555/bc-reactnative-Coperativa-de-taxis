import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field } from '../../../semana_6/src/components/Field';
import { PrimaryButton } from '../../../semana_6/src/components/PrimaryButton';
import { loginSchema, registerSchema, type LoginForm, type RegisterForm } from '../../../semana_6/src/validation/schemas';
import { useAuthStore } from '../store/useAuthStore';
import { OAuthPkceButton } from '../components/OAuthPkceButton';

export function AuthScreen(): React.JSX.Element {
  const [creatingAccount, setCreatingAccount] = useState(false);
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const loginForm = useForm<LoginForm>({ resolver: zodResolver(loginSchema), defaultValues: { username: '', password: '' } });
  const registerForm = useForm<RegisterForm>({ resolver: zodResolver(registerSchema), defaultValues: { name: '', username: '', email: '', password: '', confirmPassword: '' } });

  async function submitLogin(values: LoginForm): Promise<void> {
    try { await login(values); }
    catch { Alert.alert('No se pudo ingresar', 'Verifica tus datos y conexión, o crea una cuenta de prueba.'); }
  }
  async function submitRegister(values: RegisterForm): Promise<void> {
    try { await register(values); }
    catch { Alert.alert('No se pudo registrar', 'No fue posible completar el alta de demostración. Intenta de nuevo.'); }
  }

  return <SafeAreaView style={styles.safe}><KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
      <View style={styles.brand}><View style={styles.logo}><Text style={styles.logoText}>CT</Text></View><Text style={styles.title}>Cooperativa de Taxis</Text><Text style={styles.subtitle}>Ingresa para administrar conductores y servicios.</Text></View>
      <View style={styles.panel}><Text style={styles.panelTitle}>{creatingAccount ? 'Crear cuenta de prueba' : 'Iniciar sesión'}</Text>
        {creatingAccount ? <>
          <Field control={registerForm.control} name="name" label="Nombre completo" error={registerForm.formState.errors.name?.message} />
          <Field control={registerForm.control} name="username" label="Usuario" error={registerForm.formState.errors.username?.message} />
          <Field control={registerForm.control} name="email" label="Correo" keyboardType="email-address" error={registerForm.formState.errors.email?.message} />
          <Field control={registerForm.control} name="password" label="Contraseña" secureTextEntry error={registerForm.formState.errors.password?.message} />
          <Field control={registerForm.control} name="confirmPassword" label="Confirmar contraseña" secureTextEntry error={registerForm.formState.errors.confirmPassword?.message} />
          <PrimaryButton title="Crear cuenta" loading={registerForm.formState.isSubmitting} onPress={registerForm.handleSubmit(submitRegister)} />
        </> : <>
          <Field control={loginForm.control} name="username" label="Usuario" error={loginForm.formState.errors.username?.message} />
          <Field control={loginForm.control} name="password" label="Contraseña" secureTextEntry error={loginForm.formState.errors.password?.message} />
          <PrimaryButton title="Ingresar" loading={loginForm.formState.isSubmitting} onPress={loginForm.handleSubmit(submitLogin)} />
          <OAuthPkceButton />
        </>}
        <Text accessibilityRole="button" onPress={() => setCreatingAccount((value) => !value)} style={styles.switch}>{creatingAccount ? 'Ya tengo cuenta · Iniciar sesión' : 'Crear una cuenta de prueba'}</Text>
      </View>
      <Text style={styles.note}>Autenticación educativa; usa SecureStore en dispositivos y no sustituye un backend de producción.</Text>
    </ScrollView>
  </KeyboardAvoidingView></SafeAreaView>;
}
const styles = StyleSheet.create({ flex: { flex: 1 }, safe: { flex: 1, backgroundColor: '#0d1117' }, wrap: { flexGrow: 1, justifyContent: 'center', padding: 22, maxWidth: 560, width: '100%', alignSelf: 'center' }, brand: { alignItems: 'center', marginBottom: 22 }, logo: { width: 54, height: 54, borderRadius: 17, backgroundColor: '#238636', alignItems: 'center', justifyContent: 'center' }, logoText: { color: '#fff', fontWeight: '900', fontSize: 20 }, title: { color: '#fff', fontWeight: '900', fontSize: 24, marginTop: 13, textAlign: 'center' }, subtitle: { color: '#9aa4af', marginTop: 5, textAlign: 'center' }, panel: { backgroundColor: '#111820', padding: 20, borderRadius: 18, borderWidth: 1, borderColor: '#26313a' }, panelTitle: { color: '#fff', fontSize: 21, fontWeight: '800', marginBottom: 14 }, switch: { color: '#61dafb', textAlign: 'center', paddingTop: 15, fontWeight: '700' }, note: { color: '#687581', fontSize: 12, textAlign: 'center', lineHeight: 18, marginTop: 16 } });
