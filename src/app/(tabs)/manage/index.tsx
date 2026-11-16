import { Stack, router } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { HeaderButton } from '@/components/HeaderButton';
import { Row } from '@/components/Row';
import { EmptyState, ErrorState, LoadingState } from '@/components/StateViews';
import { STRINGS } from '@/constants/strings';
import { useAuth } from '@/contexts/AuthContext';
import { useDeletePost, usePosts } from '@/hooks/usePosts';
import { hairline, radius, spacing } from '@/theme/theme';
import { makeStyles, useTheme } from '@/theme/useTheme';
import { confirmDestructive, hapticSuccess, showActions, showError } from '@/utils/feedback';
import { formatDate } from '@/utils/format';
import type { Post } from '@/types';

export default function ManageScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const { user } = useAuth();
  const { data, isLoading, isError, error, refetch, isRefetching } = usePosts();
  const deletePost = useDeletePost();
  const posts = useMemo(() => data ?? [], [data]);
  const mine = useMemo(() => posts.filter((post) => post.author === user?.name).length, [posts, user?.name]);

  const open = (post: Post) => router.push({ pathname: '/posts/[id]', params: { id: post.id } });
  const edit = (post: Post) => router.push({ pathname: '/posts/[id]/edit', params: { id: post.id } });
  const remove = (post: Post) =>
    confirmDestructive(STRINGS.manage.confirmTitle, STRINGS.manage.confirmMessage(post.title), STRINGS.common.delete, () =>
      deletePost.mutate(post.id, { onSuccess: hapticSuccess, onError: showError }),
    );

  const options = (post: Post) =>
    showActions(post.title, [
      { label: STRINGS.common.view, onPress: () => open(post) },
      { label: STRINGS.common.edit, onPress: () => edit(post) },
      { label: STRINGS.common.delete, onPress: () => remove(post), destructive: true },
    ]);

  return (
    <>
      <Stack.Screen
        options={{
          title: STRINGS.manage.title,
          headerRight: () => (
            <HeaderButton
              icon="plus"
              label={STRINGS.manage.newPost}
              onPress={() => router.push('/posts/new')}
            />
          ),
        }}
      />
      <FlatList
        data={isLoading || isError ? [] : posts}
        keyExtractor={(post) => post.id}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        ListHeaderComponent={
          posts.length ? (
            <AppText variant="footnote" tone="secondary" style={styles.summary}>
              {STRINGS.manage.summary(posts.length, mine)}
            </AppText>
          ) : null
        }
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.cell,
              index === 0 && styles.first,
              index === posts.length - 1 && styles.last,
            ]}
          >
            {index > 0 && <View style={styles.separator} />}
            <Row
              testID={`manage-post-${item.id}`}
              title={item.title}
              subtitle={`${item.author} · ${formatDate(item.createdAt)}`}
              onPress={() => open(item)}
              trailing={
                <HeaderButton
                  icon="ellipsis"
                  label={STRINGS.manage.options(item.title)}
                  onPress={() => options(item)}
                />
              }
            />
          </View>
        )}
        ListEmptyComponent={
          isLoading ? (
            <LoadingState />
          ) : isError ? (
            <ErrorState message={error.message} onRetry={refetch} />
          ) : (
            <EmptyState message={STRINGS.manage.empty} />
          )
        }
        style={{ backgroundColor: colors.ground }}
      />
    </>
  );
}

const useStyles = makeStyles((colors) =>
  StyleSheet.create({
    content: { paddingBottom: spacing.xxxl, flexGrow: 1 },
    summary: { marginHorizontal: spacing.xxl + spacing.xs, marginTop: spacing.sm, marginBottom: spacing.sm },
    cell: { marginHorizontal: spacing.lg, backgroundColor: colors.surface },
    first: { borderTopLeftRadius: radius.cell, borderTopRightRadius: radius.cell, overflow: 'hidden' },
    last: { borderBottomLeftRadius: radius.cell, borderBottomRightRadius: radius.cell, overflow: 'hidden' },
    separator: { height: hairline, marginLeft: spacing.lg, backgroundColor: colors.separator },
  }),
);
