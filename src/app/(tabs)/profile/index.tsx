import { Stack, router } from 'expo-router';
import { useMemo } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Avatar } from '@/components/Avatar';
import { Group } from '@/components/Group';
import { Row } from '@/components/Row';
import { API_URL } from '@/config/env';
import { STRINGS } from '@/constants/strings';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts } from '@/hooks/usePosts';
import { useServerStatus } from '@/hooks/useServerStatus';
import { useUsersTotal } from '@/hooks/useUsers';
import { spacing } from '@/theme/theme';
import { useTheme } from '@/theme/useTheme';
import { confirmDestructive } from '@/utils/feedback';
import { formatLongDate, isoToBrDate, maskPhone } from '@/utils/format';
import type { User } from '@/types';

const P = STRINGS.profile;

function infoRows(user: User): [string, string][] {
  const value = (text: string | null | undefined) => text || STRINGS.common.notInformed;
  const rows: [string, string][] = [
    [P.fields.email, user.email],
    [P.fields.phone, user.phone ? maskPhone(user.phone) : value(null)],
  ];
  if (user.role === 'PROFESSOR') {
    rows.push([P.fields.subject, value(user.subject)], [P.fields.education, value(user.education)]);
  } else {
    rows.push(
      [P.fields.registration, value(user.registration)],
      [P.fields.classGroup, value(user.classGroup)],
      [P.fields.birthDate, value(isoToBrDate(user.birthDate))],
      [P.fields.guardianName, value(user.guardianName)],
    );
  }
  rows.push([P.fields.memberSince, formatLongDate(user.createdAt)]);
  return rows;
}

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { user, isTeacher, logout, refreshProfile } = useAuth();
  const posts = usePosts();
  const teachers = useUsersTotal('teachers', isTeacher);
  const students = useUsersTotal('students', isTeacher);
  const server = useServerStatus();

  const stats = useMemo(() => {
    const list = posts.data ?? [];
    return {
      mine: list.filter((post) => post.author === user?.name).length,
      total: list.length,
      authors: new Set(list.map((post) => post.author)).size,
    };
  }, [posts.data, user?.name]);

  if (!user) return null;

  const refresh = () => {
    void refreshProfile();
    void posts.refetch();
    void server.refetch();
    if (isTeacher) {
      void teachers.refetch();
      void students.refetch();
    }
  };

  const count = (value: number | undefined) => (value === undefined ? '–' : String(value));
  const status = server.isLoading ? P.checking : server.data ? P.online : P.offline;

  return (
    <>
      <Stack.Screen options={{ title: P.title }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ backgroundColor: colors.ground }}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={posts.isRefetching} onRefresh={refresh} />}
      >
        <Group>
          <Row
            testID="edit-profile"
            leading={<Avatar name={user.name} size={58} />}
            title={user.name}
            subtitle={`${isTeacher ? P.teacherRole : P.studentRole} · ${P.editProfile}`}
            chevron
            onPress={() => router.push('/account')}
          />
        </Group>

        {isTeacher && user.bio ? (
          <View style={styles.bio}>
            <AppText variant="subheadline" tone="secondary">
              {user.bio}
            </AppText>
          </View>
        ) : null}

        <Group header={P.sections.info}>
          {infoRows(user).map(([label, value]) => (
            <Row key={label} title={label} value={value} />
          ))}
        </Group>

        <Group header={P.sections.school}>
          {isTeacher
            ? [
                <Row key="mine" title={P.stats.myPosts} value={String(stats.mine)} />,
                <Row key="teachers" title={P.stats.teachers} value={count(teachers.data)} />,
                <Row key="students" title={P.stats.students} value={count(students.data)} />,
              ]
            : [
                <Row key="posts" title={P.stats.posts} value={String(stats.total)} />,
                <Row key="authors" title={P.stats.authors} value={String(stats.authors)} />,
              ]}
        </Group>

        <Group header={P.sections.server}>
          <Row
            title={P.serverStatus}
            trailing={
              <View style={styles.status}>
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: server.data ? colors.success : colors.warning },
                  ]}
                />
                <AppText variant="body" tone="secondary">
                  {status}
                </AppText>
              </View>
            }
          />
          <Row title={P.serverAddress} value={API_URL} />
        </Group>

        <Group header={P.sections.about}>
          <Row title={P.version} value={STRINGS.app.version} />
        </Group>

        <Group>
          <Row
            testID="logout"
            title={P.logout}
            destructive
            centered
            onPress={() =>
              confirmDestructive(P.logoutConfirmTitle, P.logoutConfirmMessage, P.logoutConfirm, () => void logout())
            }
          />
        </Group>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: spacing.sm, paddingBottom: spacing.xxxl },
  bio: { marginHorizontal: spacing.xxl + spacing.xs, marginTop: -spacing.lg, marginBottom: spacing.xxl },
  status: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm - 2 },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
