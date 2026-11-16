import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { Icon } from './Icon';
import { spacing } from '@/theme/theme';
import { makeStyles, useTheme } from '@/theme/useTheme';

interface Props {
  title: string;
  subtitle?: string;
  value?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  onPress?: () => void;
  chevron?: boolean;
  destructive?: boolean;
  centered?: boolean;
  accessibilityLabel?: string;
  testID?: string;
}

export function Row({
  title,
  subtitle,
  value,
  leading,
  trailing,
  onPress,
  chevron,
  destructive,
  centered,
  accessibilityLabel,
  testID,
}: Props) {
  const styles = useStyles();
  const { colors } = useTheme();

  return (
    <Pressable
      testID={testID}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={accessibilityLabel ?? [title, subtitle, value].filter(Boolean).join(', ')}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.fill }]}
    >
      {leading}
      <View style={[styles.text, centered && styles.centered]}>
        <AppText variant="body" tone={destructive ? 'destructive' : 'label'} numberOfLines={2}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="subheadline" tone="secondary" numberOfLines={2}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {value ? (
        <AppText variant="body" tone="secondary" numberOfLines={2} style={styles.value}>
          {value}
        </AppText>
      ) : null}
      {trailing}
      {chevron && <Icon name="chevron" size={14} color={colors.tertiary} />}
    </Pressable>
  );
}

const useStyles = makeStyles(() =>
  StyleSheet.create({
    row: {
      minHeight: 44,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm + 3,
    },
    text: { flex: 1, gap: 1 },
    centered: { alignItems: 'center' },
    value: { flexShrink: 1, textAlign: 'right', maxWidth: '60%' },
  }),
);
