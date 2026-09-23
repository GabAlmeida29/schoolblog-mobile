import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Avatar } from './Avatar';
import { colors, radius, shadow, spacing, typography } from '@/theme/theme';
import { excerpt, formatDate } from '@/utils/format';
import type { Post } from '@/types';

/** Item da lista principal: título, autor e breve descrição (requisito 1). */
export function PostCard({ post, onPress }: { post: Post; onPress: () => void }) {
  return (
    <Pressable
      testID={`post-card-${post.id}`}
      accessibilityRole="button"
      accessibilityLabel={`Post ${post.title}, por ${post.author}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]}
    >
      <View style={styles.header}>
        <Avatar name={post.author} size={36} />
        <View style={{ flex: 1 }}>
          <Text style={styles.author} numberOfLines={1}>
            {post.author}
          </Text>
          <Text style={typography.caption}>{formatDate(post.createdAt)}</Text>
        </View>
      </View>
      <Text style={typography.subtitle}>{post.title}</Text>
      <Text style={styles.excerpt}>{excerpt(post.content)}</Text>
      <Text style={styles.more}>Ler publicação →</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xs },
  author: { fontWeight: '700', color: colors.text, fontSize: 14 },
  excerpt: { ...typography.body, color: colors.textMuted },
  more: { color: colors.primary, fontWeight: '600', marginTop: spacing.xs },
});
