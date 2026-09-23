import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router/js-tabs';
import type { ColorValue } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { colors } from '@/theme/theme';

type IconName = keyof typeof Ionicons.glyphMap;

function icon(name: IconName) {
  const TabIcon = ({ color, size }: { color: ColorValue; size: number }) => (
    <Ionicons name={name} size={size} color={color} />
  );
  TabIcon.displayName = `TabIcon(${name})`;
  return TabIcon;
}

export default function TabsLayout() {
  const { isTeacher } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        headerTitleStyle: { fontWeight: '700', color: colors.text },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Posts', tabBarIcon: icon('newspaper-outline') }} />

      {/* Abas administrativas: aparecem apenas para professores */}
      <Tabs.Protected guard={isTeacher}>
        <Tabs.Screen name="admin" options={{ title: 'Admin', tabBarIcon: icon('create-outline') }} />
        <Tabs.Screen name="teachers" options={{ title: 'Professores', tabBarIcon: icon('school-outline') }} />
        <Tabs.Screen name="students" options={{ title: 'Alunos', tabBarIcon: icon('people-outline') }} />
      </Tabs.Protected>

      <Tabs.Screen name="profile" options={{ title: 'Perfil', tabBarIcon: icon('person-circle-outline') }} />
    </Tabs>
  );
}
