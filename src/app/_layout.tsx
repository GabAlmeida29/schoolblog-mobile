import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LoadingState } from '@/components/StateViews';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { colors } from '@/theme/theme';

function RootNavigator() {
  const { isLoading, isAuthenticated, isTeacher } = useAuth();

  if (isLoading) return <LoadingState message="Restaurando sessão..." />;

  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.primary,
        headerTitleStyle: { color: colors.text, fontWeight: '700' },
        contentStyle: { backgroundColor: colors.background },
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      {/* Não autenticado: somente login */}
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack.Protected>

      {/* Autenticado (professor ou aluno): leitura */}
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="posts/[id]/index" options={{ title: 'Publicação' }} />

        {/* Somente professor(a): criação/edição/administração */}
        <Stack.Protected guard={isTeacher}>
          <Stack.Screen name="posts/new" options={{ title: 'Nova publicação' }} />
          <Stack.Screen name="posts/[id]/edit" options={{ title: 'Editar publicação' }} />
          <Stack.Screen name="teachers/new" options={{ title: 'Novo(a) professor(a)' }} />
          <Stack.Screen name="teachers/[id]" options={{ title: 'Editar professor(a)' }} />
          <Stack.Screen name="students/new" options={{ title: 'Novo(a) aluno(a)' }} />
          <Stack.Screen name="students/[id]" options={{ title: 'Editar aluno(a)' }} />
        </Stack.Protected>
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 30_000 } } }),
  );

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <StatusBar style="dark" />
          <RootNavigator />
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
