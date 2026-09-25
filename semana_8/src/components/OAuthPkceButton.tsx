import React, { useEffect, useState } from 'react';
import * as AuthSession from 'expo-auth-session';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';

const clientId = process.env.EXPO_PUBLIC_OAUTH_CLIENT_ID ?? '';
const googleDiscovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

export function OAuthPkceButton(): React.JSX.Element {
  const redirectUri = AuthSession.makeRedirectUri({ scheme: 'cooperativa-taxis' });
  const [request, response, promptAsync] = AuthSession.useAuthRequest({
    clientId: clientId || 'configure-client-id',
    redirectUri,
    responseType: AuthSession.ResponseType.Code,
    scopes: ['openid', 'profile', 'email'],
    usePKCE: true,
  }, googleDiscovery);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    if (response?.type !== 'success' || !request?.codeVerifier || !clientId) return;
    setWorking(true);
    void AuthSession.exchangeCodeAsync({
      clientId,
      code: response.params.code,
      redirectUri,
      extraParams: { code_verifier: request.codeVerifier },
    }, googleDiscovery).then((tokens) => {
      Alert.alert('OAuth completado', tokens.accessToken ? 'El código PKCE se intercambió por un token.' : 'El proveedor no devolvió un token.');
    }).catch(() => Alert.alert('OAuth no disponible', 'Verifica el client ID y la URI de retorno del proveedor.'))
      .finally(() => setWorking(false));
  }, [response, request, redirectUri]);

  const configured = Boolean(clientId && request);
  return <Pressable disabled={!configured || working} onPress={() => void promptAsync()} style={[styles.button, (!configured || working) && styles.disabled]}>
    <Text style={styles.text}>{working ? 'Conectando…' : configured ? 'Probar OAuth PKCE' : 'OAuth PKCE (requiere configurar client ID)'}</Text>
  </Pressable>;
}
const styles = StyleSheet.create({ button: { marginTop: 12, padding: 13, borderRadius: 10, borderWidth: 1, borderColor: '#3b82f6', alignItems: 'center' }, disabled: { opacity: 0.55 }, text: { color: '#bfdbfe', fontWeight: '700', textAlign: 'center' } });
