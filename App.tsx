import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppNavigator } from './semana_3/src/navigation/AppNavigator';

const queryClient = new QueryClient();

export default function App(): React.JSX.Element {
  return <QueryClientProvider client={queryClient}><AppNavigator /></QueryClientProvider>;
}
