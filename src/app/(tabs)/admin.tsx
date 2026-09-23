import { router } from 'expo-router';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Fab } from '@/components/Fab';
import { IconButton } from '@/components/IconButton';
import { EmptyState, ErrorState, LoadingState } from '@/components/StateViews';
import { useDeletePost, usePosts } from '@/hooks/usePosts';
import { colors, radius, spacing, typography } from '@/theme/theme';
import { confirmAction, notify } from '@/utils/confirm';
import { formatDate } from '@/utils/format';
import type { Post } from '@/types';

/** Requisito 9: página administrativa — todas as postagens com editar/excluir. */
export default function AdminScreen() {
  const { data, isLoading, isError, error, refetch, isRefetching } = usePosts();
  const deletePost = useDeletePost();

  const handleDelete = (post: Post) =>
    confirmAction('Excluir publicação', `Deseja excluir "${post.title}"? Os comentários também serão removidos.`, () =>
      deletePost.mutate(post.id, { onError: (e) => notify('Erro ao excluir', e.message) }),
    );

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message={error.message} onRetry={refetch} />;

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data}
        keyExtractor={(post) => post.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />}
        ListHeaderComponent={<Text style={[typography.caption, styles.header]}>{data?.length ?? 0} publicações</Text>}
        ListEmptyComponent={<EmptyState message="Nenhuma publicação cadastrada." />}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        renderItem={({ item }) => (
          <View style={styles.row} testID={`admin-post-${item.id}`}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={typography.caption}>
                {item.author} · {formatDate(item.createdAt)}
              </Text>
            </View>
            <IconButton
              icon="create-outline"
              label={`Editar ${item.title}`}
              onPress={() => router.push({ pathname: '/posts/[id]/edit', params: { id: item.id } })}
            />
            <IconButton
              icon="trash-outline"
              label={`Excluir ${item.title}`}
              color={colors.danger}
              background={colors.dangerSoft}
              onPress={() => handleDelete(item)}
            />
          </View>
        )}
      />
      <Fab label="Nova publicação" onPress={() => router.push('/posts/new')} />
    </View>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.lg, paddingBottom: 100, flexGrow: 1 },
  header: { marginBottom: spacing.md },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: { fontSize: 15, fontWeight: '600', color: colors.text, marginBottom: 2 },
});
