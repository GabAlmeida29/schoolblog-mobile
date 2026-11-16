import type { ReactNode } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { STRINGS } from '@/constants/strings';
import { spacing } from '@/theme/theme';
import { useTheme } from '@/theme/useTheme';

export function FormScroll({ children }: { children: ReactNode }) {
  const { colors } = useTheme();
  return (
    <ScrollView
      style={{ backgroundColor: colors.ground }}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
      automaticallyAdjustKeyboardInsets
    >
      <AppText variant="footnote" tone="secondary" style={styles.hint}>
        {STRINGS.common.requiredHint}
      </AppText>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: spacing.lg, paddingBottom: spacing.xxxl },
  hint: { marginHorizontal: spacing.xxl + spacing.xs, marginBottom: spacing.md },
});
