import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppNavigator } from './src/semana_3/src/navigation/AppNavigator';
const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 15000, refetchOnWindowFocus: false }, mutations: { retry: 0 } } });
export default function App(): React.JSX.Element { return <QueryClientProvider client={queryClient}><AppNavigator /></QueryClientProvider>; }
