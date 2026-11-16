import { Stack, router } from 'expo-router';
import { useMemo, useState } from 'react';
import { RefreshControl, SectionList, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { HeaderButton } from '@/components/HeaderButton';
import { NotebookHeading, NotebookRule, PostRow } from '@/components/Notebook';
import { SearchField } from '@/components/SearchField';
import { EmptyState, ErrorState, LoadingState } from '@/components/StateViews';
import { STRINGS } from '@/constants/strings';
import { useAuth } from '@/contexts/AuthContext';
import { useDebounce } from '@/hooks/useDebounce';
import { usePosts } from '@/hooks/usePosts';
import { spacing } from '@/theme/theme';
import { useTheme } from '@/theme/useTheme';
import { monthLabel } from '@/utils/format';
import type { Post } from '@/types';

function groupByMonth(posts: Post[]) {
  const sections: { title: string; data: Post[] }[] = [];
  for (const post of posts) {
    const title = monthLabel(post.createdAt);
    const current = sections[sections.length - 1];
    if (current?.title === title) current.data.push(post);
    else sections.push({ title, data: [post] });
  }
  return sections;
}

export default function HomeScreen() {
  const { isTeacher } = useAuth();
  const { colors } = useTheme();
  const [search, setSearch] = useState('');
  const term = useDebounce(search).trim();
  const { data, isLoading, isError, error, refetch, isRefetching } = usePosts(term);
  const sections = useMemo(() => groupByMonth(data ?? []), [data]);

  return (
    <>
      <Stack.Screen
        options={{
          title: STRINGS.home.title,
          headerRight: isTeacher
            ? () => (
                <HeaderButton
                  icon="plus"
                  label={STRINGS.home.newPost}
                  onPress={() => router.push('/posts/new')}
                  testID="new-post"
                />
              )
            : undefined,
        }}
      />
      <SectionList
        sections={isLoading || isError ? [] : sections}
        keyExtractor={(post) => post.id}
        contentInsetAdjustmentBehavior="automatic"
        keyboardDismissMode="on-drag"
        stickySectionHeadersEnabled
        style={{ backgroundColor: colors.surface }}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        ListHeaderComponent={
          <View style={styles.search}>
            <SearchField
              value={search}
              onChangeText={setSearch}
              placeholder={STRINGS.home.searchPlaceholder}
            />
            {term && !isLoading ? (
              <AppText variant="footnote" tone="secondary" style={styles.results}>
                {STRINGS.home.results(data?.length ?? 0)}
              </AppText>
            ) : null}
          </View>
        }
        renderSectionHeader={({ section }) => <NotebookHeading>{section.title}</NotebookHeading>}
        renderItem={({ item }) => (
          <PostRow
            post={item}
            onPress={() => router.push({ pathname: '/posts/[id]', params: { id: item.id } })}
          />
        )}
        ItemSeparatorComponent={NotebookRule}
        ListEmptyComponent={
          isLoading ? (
            <LoadingState />
          ) : isError ? (
            <ErrorState message={error.message} onRetry={refetch} />
          ) : (
            <EmptyState
              icon={term ? 'noResults' : 'empty'}
              message={term ? STRINGS.home.emptySearch(term) : STRINGS.home.empty}
            />
          )
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: spacing.xxxl, flexGrow: 1 },
  search: { paddingHorizontal: spacing.lg, paddingTop: spacing.xs, paddingBottom: spacing.sm },
  results: { marginTop: spacing.sm, marginLeft: spacing.xs },
});
