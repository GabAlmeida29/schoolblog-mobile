import { Stack } from 'expo-router';
import { useTheme } from '@/theme/useTheme';

export function TabStack({ surface }: { surface?: boolean }) {
  const { colors } = useTheme();
  const background = surface ? colors.surface : colors.ground;
  return (
    <Stack
      screenOptions={{
        headerLargeTitleEnabled: true,
        headerLargeTitleShadowVisible: false,
        headerShadowVisible: false,
        headerStyle: { backgroundColor: background },
        headerLargeStyle: { backgroundColor: background },
        headerTintColor: colors.tint,
        headerTitleStyle: { color: colors.label },
        contentStyle: { backgroundColor: background },
      }}
    />
  );
}
