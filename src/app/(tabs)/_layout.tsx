import { Tabs } from 'expo-router/js-tabs';
import type { ColorValue } from 'react-native';
import { Icon, type IconName } from '@/components/Icon';
import { STRINGS } from '@/constants/strings';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/theme/useTheme';

function tabIcon(outline: IconName, filled: IconName) {
  const TabIcon = ({ color, focused }: { color: ColorValue; focused: boolean }) => (
    <Icon name={focused ? filled : outline} size={24} color={color} />
  );
  TabIcon.displayName = `TabIcon(${outline})`;
  return TabIcon;
}

export default function TabsLayout() {
  const { isTeacher } = useAuth();
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tertiary,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.separator },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '500' },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{ title: STRINGS.tabs.home, tabBarIcon: tabIcon('home', 'homeFill') }}
      />
      <Tabs.Protected guard={isTeacher}>
        <Tabs.Screen
          name="manage"
          options={{ title: STRINGS.tabs.manage, tabBarIcon: tabIcon('manage', 'manageFill') }}
        />
        <Tabs.Screen
          name="teachers"
          options={{ title: STRINGS.tabs.teachers, tabBarIcon: tabIcon('teachers', 'teachersFill') }}
        />
        <Tabs.Screen
          name="students"
          options={{ title: STRINGS.tabs.students, tabBarIcon: tabIcon('students', 'studentsFill') }}
        />
      </Tabs.Protected>
      <Tabs.Screen
        name="profile"
        options={{ title: STRINGS.tabs.profile, tabBarIcon: tabIcon('profile', 'profileFill') }}
      />
    </Tabs>
  );
}
