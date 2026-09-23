import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { Fab } from '@/components/Fab';
import { PostCard } from '@/components/PostCard';
import { SearchBar } from '@/components/SearchBar';
import { EmptyState, ErrorState, LoadingState } from '@/components/StateViews';
import { useAuth } from '@/contexts/AuthContext';
import { useDebounce } from '@/hooks/useDebounce';
import { usePosts } from '@/hooks/usePosts';
import { colors, spacing } from '@/theme/theme';

/** Requisito 1: lista de posts com busca por palavra-chave. */
export default function PostListScreen() {
  const { isTeacher } = useAuth();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const { data, isLoading, isError, error, refetch, isRefetching } = usePosts(debouncedSearch);

  return (
    <View style={styles.container}>
      <View style={styles.searchWrapper}>
        <SearchBar value={search} onChangeText={setSearch} />
      </View>

      {isLoading ? (
        <LoadingState message="Carregando publicações..." />
      ) : isError ? (
        <ErrorState message={error.message} onRetry={refetch} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(post) => post.id}
          renderItem={({ item }) => (
            <PostCard post={item} onPress={() => router.push({ pathname: '/posts/[id]', params: { id: item.id } })} />
          )}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />}
          ListEmptyComponent={
            <EmptyState
              icon={debouncedSearch ? 'search-outline' : 'document-text-outline'}
              message={debouncedSearch ? `Nenhum post encontrado para "${debouncedSearch}".` : 'Nenhuma publicação ainda.'}
            />
          }
        />
      )}

      {isTeacher && <Fab label="Nova publicação" onPress={() => router.push('/posts/new')} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchWrapper: { padding: spacing.lg, paddingBottom: spacing.sm },
  list: { padding: spacing.lg, paddingTop: spacing.sm, paddingBottom: 100, flexGrow: 1 },
});
