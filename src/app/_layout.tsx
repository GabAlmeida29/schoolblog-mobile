import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LoadingState } from '@/components/StateViews';
import { STRINGS } from '@/constants/strings';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { navigationDark, navigationLight } from '@/theme/navigation';
import { useTheme } from '@/theme/useTheme';

const modal = { presentation: 'modal' as const };

function RootNavigator() {
  const { isLoading, isAuthenticated, isTeacher } = useAuth();
  const { colors } = useTheme();

  if (isLoading) return <LoadingState message={STRINGS.common.restoringSession} />;

  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.tint,
        headerTitleStyle: { color: colors.label },
        headerBackButtonDisplayMode: 'minimal',
        contentStyle: { backgroundColor: colors.ground },
      }}
    >
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="posts/[id]/index"
          options={{ title: '', headerShadowVisible: false, headerStyle: { backgroundColor: colors.surface } }}
        />
        <Stack.Screen name="account" options={{ ...modal, title: STRINGS.editProfile.title }} />

        <Stack.Protected guard={isTeacher}>
          <Stack.Screen name="posts/new" options={{ ...modal, title: STRINGS.postForm.newTitle }} />
          <Stack.Screen name="posts/[id]/edit" options={{ ...modal, title: STRINGS.postForm.editTitle }} />
          <Stack.Screen name="teacher/new" options={{ ...modal, title: STRINGS.users.teachers.newTitle }} />
          <Stack.Screen name="teacher/[id]" options={{ ...modal, title: STRINGS.users.teachers.editTitle }} />
          <Stack.Screen name="student/new" options={{ ...modal, title: STRINGS.users.students.newTitle }} />
          <Stack.Screen name="student/[id]" options={{ ...modal, title: STRINGS.users.students.editTitle }} />
        </Stack.Protected>
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const { isDark } = useTheme();
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 30_000 } } }),
  );

  return (
    <SafeAreaProvider>
      <ThemeProvider value={isDark ? navigationDark : navigationLight}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <StatusBar style="auto" />
            <RootNavigator />
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
