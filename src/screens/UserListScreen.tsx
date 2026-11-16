import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Avatar } from '@/components/Avatar';
import { HeaderButton } from '@/components/HeaderButton';
import { Row } from '@/components/Row';
import { SearchField } from '@/components/SearchField';
import { EmptyState, ErrorState, LoadingState } from '@/components/StateViews';
import { STRINGS } from '@/constants/strings';
import { useAuth } from '@/contexts/AuthContext';
import { useDebounce } from '@/hooks/useDebounce';
import { useUsers } from '@/hooks/useUsers';
import { hairline, radius, spacing } from '@/theme/theme';
import { makeStyles, useTheme } from '@/theme/useTheme';
import type { User, UserKind } from '@/types';

function describe(user: User, kind: UserKind) {
  if (kind === 'teachers') return user.subject ?? user.email;
  const parts = [user.classGroup, user.registration && STRINGS.users.registration(user.registration)];
  return parts.filter(Boolean).join(' · ') || user.email;
}

export function UserListScreen({ kind }: { kind: UserKind }) {
  const styles = useStyles();
  const { colors } = useTheme();
  const { user: me } = useAuth();
  const texts = STRINGS.users[kind];
  const [search, setSearch] = useState('');
  const term = useDebounce(search).trim();
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUsers(kind, term);

  const users = data?.pages.flatMap((page) => page.data) ?? [];
  const total = data?.pages[0]?.meta.total ?? 0;
  const formPath = kind === 'teachers' ? '/teacher/[id]' : '/student/[id]';

  return (
    <>
      <Stack.Screen
        options={{
          title: texts.title,
          headerRight: () => (
            <HeaderButton
              icon="plus"
              label={texts.add}
              onPress={() => router.push(kind === 'teachers' ? '/teacher/new' : '/student/new')}
              testID="add-user"
            />
          ),
        }}
      />
      <FlatList
        data={isLoading || isError ? [] : users}
        keyExtractor={(item) => item.id}
        contentInsetAdjustmentBehavior="automatic"
        keyboardDismissMode="on-drag"
        style={{ backgroundColor: colors.ground }}
        contentContainerStyle={styles.content}
        onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
        onEndReachedThreshold={0.4}
        refreshControl={
          <RefreshControl refreshing={isRefetching && !isFetchingNextPage} onRefresh={refetch} />
        }
        ListHeaderComponent={
          <View style={styles.search}>
            <SearchField
              value={search}
              onChangeText={setSearch}
              placeholder={STRINGS.users.searchPlaceholder}
              testID="user-search"
            />
          </View>
        }
        renderItem={({ item, index }) => {
          const isMe = item.id === me?.id;
          const name = isMe ? `${item.name} (${STRINGS.common.you})` : item.name;
          return (
            <View
              style={[styles.cell, index === 0 && styles.first, index === users.length - 1 && styles.last]}
            >
              {index > 0 && <View style={styles.separator} />}
              <Row
                testID={`user-row-${item.id}`}
                leading={<Avatar name={item.name} size={36} />}
                title={name}
                subtitle={describe(item, kind)}
                accessibilityLabel={STRINGS.users.open(item.name)}
                chevron
                onPress={() => router.push({ pathname: formPath, params: { id: item.id } })}
              />
            </View>
          );
        }}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator color={colors.secondary} style={styles.footer} />
          ) : users.length ? (
            <AppText variant="footnote" tone="secondary" style={styles.count} testID="user-summary">
              {texts.count(users.length, total)}
            </AppText>
          ) : null
        }
        ListEmptyComponent={
          isLoading ? (
            <LoadingState />
          ) : isError ? (
            <ErrorState message={error.message} onRetry={refetch} />
          ) : (
            <EmptyState
              icon={term ? 'noResults' : 'empty'}
              message={term ? STRINGS.users.emptySearch(term) : texts.empty}
            />
          )
        }
      />
    </>
  );
}

const useStyles = makeStyles((colors) =>
  StyleSheet.create({
    content: { paddingBottom: spacing.xxxl, flexGrow: 1 },
    search: { paddingHorizontal: spacing.lg, paddingTop: spacing.xs, paddingBottom: spacing.md },
    cell: { marginHorizontal: spacing.lg, backgroundColor: colors.surface },
    first: { borderTopLeftRadius: radius.cell, borderTopRightRadius: radius.cell, overflow: 'hidden' },
    last: { borderBottomLeftRadius: radius.cell, borderBottomRightRadius: radius.cell, overflow: 'hidden' },
    separator: { height: hairline, marginLeft: spacing.lg + 36 + spacing.md, backgroundColor: colors.separator },
    footer: { margin: spacing.lg },
    count: { textAlign: 'center', marginTop: spacing.md },
  }),
);
