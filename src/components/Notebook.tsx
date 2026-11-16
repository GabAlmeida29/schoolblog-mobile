import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { STRINGS } from '@/constants/strings';
import { MARGIN_COLUMN, hairline, spacing } from '@/theme/theme';
import { makeStyles } from '@/theme/useTheme';
import { dayParts, excerpt, formatLongDate, readingTime } from '@/utils/format';
import type { Post } from '@/types';

export function MarginLine() {
  const styles = useStyles();
  return <View pointerEvents="none" style={styles.margin} />;
}

export function NotebookRule() {
  const styles = useStyles();
  return <View style={styles.rule} />;
}

export function NotebookHeading({ children }: { children: ReactNode }) {
  const styles = useStyles();
  return (
    <View style={styles.heading}>
      <MarginLine />
      <AppText variant="subheadline" tone="secondary" weight="600" style={styles.headingText}>
        {children}
      </AppText>
    </View>
  );
}

export function PostRow({ post, onPress }: { post: Post; onPress: () => void }) {
  const styles = useStyles();
  const { day, month } = dayParts(post.createdAt);

  return (
    <Pressable
      testID={`post-row-${post.id}`}
      accessibilityRole="button"
      accessibilityLabel={STRINGS.postRow.a11y(post.title, post.author, formatLongDate(post.createdAt))}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <MarginLine />
      <View style={styles.date}>
        <AppText variant="title2" style={styles.day}>
          {day}
        </AppText>
        <AppText variant="caption" tone="secondary" weight="600">
          {month}
        </AppText>
      </View>
      <View style={styles.body}>
        <AppText variant="headline" numberOfLines={2}>
          {post.title}
        </AppText>
        <AppText variant="subheadline" tone="secondary" numberOfLines={2}>
          {excerpt(post.content)}
        </AppText>
        <AppText variant="footnote" tone="tertiary" numberOfLines={1}>
          {post.author} · {STRINGS.postRow.readingTime(readingTime(post.content))}
        </AppText>
      </View>
    </Pressable>
  );
}

const useStyles = makeStyles((colors) =>
  StyleSheet.create({
    margin: {
      position: 'absolute',
      left: MARGIN_COLUMN,
      top: 0,
      bottom: 0,
      width: 1,
      backgroundColor: colors.margin,
      opacity: 0.55,
    },
    rule: { height: hairline, marginLeft: MARGIN_COLUMN, backgroundColor: colors.rule },
    heading: {
      backgroundColor: colors.surface,
      paddingLeft: MARGIN_COLUMN + spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.sm,
    },
    headingText: { textTransform: 'capitalize' },
    row: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      paddingVertical: spacing.md + 2,
      paddingRight: spacing.lg,
    },
    pressed: { backgroundColor: colors.fill },
    date: { width: MARGIN_COLUMN, alignItems: 'center', paddingTop: 1 },
    day: { fontVariant: ['tabular-nums'], lineHeight: 26 },
    body: { flex: 1, paddingLeft: spacing.lg, gap: 3 },
  }),
);
