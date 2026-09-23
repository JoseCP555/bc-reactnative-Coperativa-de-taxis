import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppNavigator } from './src/navigation/AppNavigator';

const queryClient = new QueryClient();

export default function App(): React.JSX.Element {
  return <QueryClientProvider client={queryClient}><AppNavigator /></QueryClientProvider>;
}
