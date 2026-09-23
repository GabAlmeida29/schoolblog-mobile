import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { API_URL } from '@/config/env';
import { useAuth } from '@/contexts/AuthContext';
import { colors, radius, spacing, typography } from '@/theme/theme';

export default function ProfileScreen() {
  const { user, isTeacher, logout } = useAuth();
  if (!user) return null;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Avatar name={user.name} size={72} />
        <Text style={typography.title}>{user.name}</Text>
        <Text style={typography.caption}>{user.email}</Text>
        <View style={[styles.badge, { backgroundColor: isTeacher ? colors.primarySoft : '#FCE7F3' }]}>
          <Text style={{ color: isTeacher ? colors.primary : colors.secondary, fontWeight: '700' }}>
            {isTeacher ? 'Professor(a)' : 'Aluno(a)'}
          </Text>
        </View>
        <Text style={[typography.caption, { textAlign: 'center' }]}>
          {isTeacher
            ? 'Você pode criar, editar e excluir publicações e gerenciar professores e alunos.'
            : 'Você pode ler as publicações e comentar.'}
        </Text>
      </View>

      <Button title="Sair" variant="outline" icon="log-out-outline" onPress={logout} testID="logout" />

      <Text style={[typography.caption, styles.api]}>API: {API_URL}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, gap: spacing.lg },
  card: {
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badge: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.pill },
  api: { textAlign: 'center', marginTop: 'auto' },
});
