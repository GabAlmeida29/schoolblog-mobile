import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { Button } from './Button';
import { Icon, type IconName } from './Icon';
import { STRINGS } from '@/constants/strings';
import { spacing } from '@/theme/theme';
import { useTheme } from '@/theme/useTheme';

export function LoadingState({ message = STRINGS.common.loading }: { message?: string }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.center, { backgroundColor: colors.ground }]}>
      <ActivityIndicator color={colors.secondary} />
      <AppText variant="footnote" tone="secondary">
        {message}
      </AppText>
    </View>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  const { colors } = useTheme();
  return (
    <View style={styles.center}>
      <Icon name="offline" size={34} color={colors.tertiary} />
      <AppText variant="subheadline" tone="secondary" style={styles.text}>
        {message}
      </AppText>
      {onRetry && <Button title={STRINGS.common.retry} variant="plain" onPress={onRetry} />}
    </View>
  );
}

export function EmptyState({ message, icon = 'empty' }: { message: string; icon?: IconName }) {
  const { colors } = useTheme();
  return (
    <View style={styles.center}>
      <Icon name={icon} size={34} color={colors.tertiary} />
      <AppText variant="subheadline" tone="secondary" style={styles.text}>
        {message}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    gap: spacing.md,
    minHeight: 220,
  },
  text: { textAlign: 'center', maxWidth: 300 },
});
