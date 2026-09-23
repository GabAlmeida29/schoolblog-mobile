import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Button } from './Button';
import { colors, spacing, typography } from '@/theme/theme';

export function LoadingState({ message = 'Carregando...' }: { message?: string }) {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[typography.caption, { marginTop: spacing.md }]}>{message}</Text>
    </View>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <View style={styles.center}>
      <Ionicons name="cloud-offline-outline" size={48} color={colors.danger} />
      <Text style={[typography.body, styles.text]}>{message}</Text>
      {onRetry && <Button title="Tentar novamente" variant="outline" icon="refresh" onPress={onRetry} />}
    </View>
  );
}

export function EmptyState({ message, icon = 'document-text-outline' }: { message: string; icon?: keyof typeof Ionicons.glyphMap }) {
  return (
    <View style={styles.center}>
      <Ionicons name={icon} size={48} color={colors.textMuted} />
      <Text style={[typography.body, styles.text, { color: colors.textMuted }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.md, minHeight: 240 },
  text: { textAlign: 'center' },
});
