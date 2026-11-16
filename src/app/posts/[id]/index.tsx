import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Field } from '@/components/Field';
import { Group } from '@/components/Group';
import { HeaderButton } from '@/components/HeaderButton';
import { ErrorState, LoadingState } from '@/components/StateViews';
import { STRINGS } from '@/constants/strings';
import { useAuth } from '@/contexts/AuthContext';
import { useComments, useCreateComment, usePost } from '@/hooks/usePosts';
import { commentSchema, type CommentForm } from '@/schemas';
import { spacing } from '@/theme/theme';
import { makeStyles } from '@/theme/useTheme';
import { hapticSuccess, showError } from '@/utils/feedback';
import { formatDate, formatLongDate, readingTime } from '@/utils/format';

export default function PostReadScreen() {
  const styles = useStyles();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, isTeacher } = useAuth();
  const { data: post, isLoading, isError, error, refetch } = usePost(id);
  const comments = useComments(id);
  const createComment = useCreateComment(id);
  const { control, handleSubmit, reset, formState } = useForm<CommentForm>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: '' },
  });

  const onComment = handleSubmit(async ({ content }) => {
    try {
      await createComment.mutateAsync({ content, author: user?.name ?? STRINGS.post.anonymous });
      reset();
      hapticSuccess();
    } catch (e) {
      showError(e);
    }
  });

  if (isLoading) return <LoadingState />;
  if (isError || !post) {
    return <ErrorState message={error?.message ?? STRINGS.post.notFound} onRetry={refetch} />;
  }

  const total = comments.data?.length ?? 0;

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: isTeacher
            ? () => (
                <HeaderButton
                  label={STRINGS.post.edit}
                  onPress={() => router.push({ pathname: '/posts/[id]/edit', params: { id: post.id } })}
                  testID="edit-post"
                />
              )
            : undefined,
        }}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        automaticallyAdjustKeyboardInsets
        style={styles.screen}
        contentContainerStyle={styles.content}
      >
        <View style={styles.article}>
          <AppText variant="title1" accessibilityRole="header">
            {post.title}
          </AppText>
          <View style={styles.byline}>
            <Avatar name={post.author} size={34} />
            <View style={styles.flex}>
              <AppText variant="subheadline" weight="600">
                {post.author}
              </AppText>
              <AppText variant="footnote" tone="secondary">
                {formatLongDate(post.createdAt)} · {STRINGS.post.readingTime(readingTime(post.content))}
              </AppText>
            </View>
          </View>
          <AppText variant="body" style={styles.body} selectable>
            {post.content}
          </AppText>
          {post.updatedAt !== post.createdAt && (
            <AppText variant="footnote" tone="tertiary">
              {STRINGS.post.updatedAt(formatDate(post.updatedAt))}
            </AppText>
          )}
        </View>

        <Group header={comments.isLoading ? STRINGS.post.loadingComments : STRINGS.post.comments(total)}>
          {total === 0 && !comments.isLoading ? (
            <View style={styles.noComments}>
              <AppText variant="subheadline" tone="secondary">
                {STRINGS.post.noComments}
              </AppText>
            </View>
          ) : (
            (comments.data ?? []).map((comment) => (
              <View key={comment.id} style={styles.comment}>
                <View style={styles.commentHeader}>
                  <AppText variant="subheadline" weight="600" style={styles.flex}>
                    {comment.author}
                  </AppText>
                  <AppText variant="footnote" tone="tertiary">
                    {formatDate(comment.createdAt)}
                  </AppText>
                </View>
                <AppText variant="body">{comment.content}</AppText>
              </View>
            ))
          )}
        </Group>

        <Group>
          <Field
            control={control}
            name="content"
            label={STRINGS.post.commentLabel(user?.name ?? '')}
            placeholder={STRINGS.post.commentPlaceholder}
            multiline
            style={styles.commentInput}
            testID="comment-input"
          />
          <Button
            title={STRINGS.post.sendComment}
            variant="plain"
            onPress={onComment}
            loading={createComment.isPending}
            disabled={!formState.isDirty}
            testID="comment-submit"
          />
        </Group>
      </ScrollView>
    </>
  );
}

const useStyles = makeStyles((colors) =>
  StyleSheet.create({
    screen: { backgroundColor: colors.ground },
    content: { paddingBottom: spacing.xxxl },
    flex: { flex: 1 },
    article: {
      backgroundColor: colors.surface,
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.sm,
      paddingBottom: spacing.xxl,
      marginBottom: spacing.xxl,
      gap: spacing.lg,
    },
    byline: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    body: { lineHeight: 27 },
    noComments: { padding: spacing.lg },
    comment: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, gap: 2 },
    commentHeader: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm },
    commentInput: { minHeight: 72 },
  }),
);
