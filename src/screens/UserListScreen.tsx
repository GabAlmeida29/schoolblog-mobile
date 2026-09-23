import { router } from 'expo-router';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Avatar } from '@/components/Avatar';
import { Fab } from '@/components/Fab';
import { IconButton } from '@/components/IconButton';
import { EmptyState, ErrorState, LoadingState } from '@/components/StateViews';
import { useAuth } from '@/contexts/AuthContext';
import { useDeleteUser, useUsers } from '@/hooks/useUsers';
import { colors, radius, spacing, typography } from '@/theme/theme';
import { confirmAction, notify } from '@/utils/confirm';
import type { User, UserKind } from '@/types';

const LABELS: Record<UserKind, { singular: string; plural: string }> = {
  teachers: { singular: 'professor(a)', plural: 'professores' },
  students: { singular: 'aluno(a)', plural: 'alunos' },
};

/** Listagem paginada (10 por página, carrega a próxima ao rolar) com editar/excluir. */
export function UserListScreen({ kind }: { kind: UserKind }) {
  const { user: me } = useAuth();
  const labels = LABELS[kind];
  const { data, isLoading, isError, error, refetch, isRefetching, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useUsers(kind);
  const deleteUser = useDeleteUser(kind);

  const users = data?.pages.flatMap((p) => p.data) ?? [];
  const total = data?.pages[0]?.meta.total ?? 0;
  const loadedPages = data?.pages.length ?? 0;
  const totalPages = data?.pages[0]?.meta.totalPages ?? 0;

  const handleDelete = (u: User) =>
    confirmAction(`Excluir ${labels.singular}`, `Deseja excluir ${u.name}? Esta ação não pode ser desfeita.`, () =>
      deleteUser.mutate(u.id, { onError: (e) => notify('Erro ao excluir', e.message) }),
    );

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message={error.message} onRetry={refetch} />;

  const editPath = kind === 'teachers' ? '/teachers/[id]' : '/students/[id]';

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={users}
        keyExtractor={(u) => u.id}
        contentContainerStyle={styles.list}
        onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
        onEndReachedThreshold={0.3}
        refreshControl={<RefreshControl refreshing={isRefetching && !isFetchingNextPage} onRefresh={refetch} tintColor={colors.primary} />}
        ListHeaderComponent={
          <Text style={[typography.caption, { marginBottom: spacing.md }]}>
            {total} {labels.plural} · página {loadedPages} de {totalPages}
          </Text>
        }
        ListEmptyComponent={<EmptyState icon="people-outline" message={`Nenhum(a) ${labels.singular} cadastrado(a).`} />}
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator color={colors.primary} style={{ margin: spacing.lg }} /> : null}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        renderItem={({ item }) => (
          <View style={styles.row} testID={`user-row-${item.id}`}>
            <Avatar name={item.name} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name} numberOfLines={1}>
                {item.name}
                {item.id === me?.id ? ' (você)' : ''}
              </Text>
              <Text style={typography.caption} numberOfLines={1}>
                {item.email}
              </Text>
            </View>
            <IconButton
              icon="create-outline"
              label={`Editar ${item.name}`}
              onPress={() => router.push({ pathname: editPath, params: { id: item.id } })}
            />
            {item.id !== me?.id && (
              <IconButton
                icon="trash-outline"
                label={`Excluir ${item.name}`}
                color={colors.danger}
                background={colors.dangerSoft}
                onPress={() => handleDelete(item)}
              />
            )}
          </View>
        )}
      />
      <Fab
        label={`Cadastrar ${labels.singular}`}
        onPress={() => router.push(kind === 'teachers' ? '/teachers/new' : '/students/new')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.lg, paddingBottom: 100, flexGrow: 1 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  name: { fontSize: 15, fontWeight: '600', color: colors.text },
});
