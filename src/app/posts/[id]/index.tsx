import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { FormField } from '@/components/FormField';
import { IconButton } from '@/components/IconButton';
import { ErrorState, LoadingState } from '@/components/StateViews';
import { useAuth } from '@/contexts/AuthContext';
import { useComments, useCreateComment, usePost } from '@/hooks/usePosts';
import { commentSchema, type CommentForm } from '@/schemas';
import { colors, radius, spacing, typography } from '@/theme/theme';
import { notify } from '@/utils/confirm';
import { formatDate } from '@/utils/format';

/** Requisito 2: leitura do post completo + comentários (opcional). */
export default function PostReadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, isTeacher } = useAuth();
  const { data: post, isLoading, isError, error, refetch } = usePost(id);
  const comments = useComments(id);
  const createComment = useCreateComment(id);
  const { control, handleSubmit, reset } = useForm<CommentForm>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: '' },
  });

  const onComment = handleSubmit(async ({ content }) => {
    try {
      await createComment.mutateAsync({ content, author: user?.name ?? 'Anônimo' });
      reset();
    } catch (e) {
      notify('Erro ao comentar', (e as Error).message);
    }
  });

  if (isLoading) return <LoadingState />;
  if (isError || !post) return <ErrorState message={error?.message ?? 'Post não encontrado.'} onRetry={refetch} />;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={100}>
      <Stack.Screen
        options={{
          headerRight: isTeacher
            ? () => (
                <IconButton
                  icon="create-outline"
                  label="Editar publicação"
                  onPress={() => router.push({ pathname: '/posts/[id]/edit', params: { id: post.id } })}
                />
              )
            : undefined,
        }}
      />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{post.title}</Text>
        <View style={styles.meta}>
          <Avatar name={post.author} size={40} />
          <View>
            <Text style={styles.author}>{post.author}</Text>
            <Text style={typography.caption}>
              Publicado em {formatDate(post.createdAt)}
              {post.updatedAt !== post.createdAt ? ` · atualizado em ${formatDate(post.updatedAt)}` : ''}
            </Text>
          </View>
        </View>
        <Text style={styles.body}>{post.content}</Text>

        <View style={styles.divider} />

        <Text style={typography.subtitle}>Comentários ({comments.data?.length ?? 0})</Text>
        {comments.isLoading ? (
          <Text style={typography.caption}>Carregando comentários...</Text>
        ) : comments.data?.length ? (
          comments.data.map((c) => (
            <View key={c.id} style={styles.comment}>
              <Avatar name={c.author} size={32} />
              <View style={{ flex: 1 }}>
                <Text style={styles.commentAuthor}>
                  {c.author} <Text style={typography.caption}>· {formatDate(c.createdAt)}</Text>
                </Text>
                <Text style={typography.body}>{c.content}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={typography.caption}>Seja o primeiro a comentar.</Text>
        )}

        <View style={styles.commentForm}>
          <FormField control={control} name="content" label={`Comentar como ${user?.name ?? ''}`} placeholder="Escreva seu comentário" multiline style={{ minHeight: 90 }} />
          <Button title="Enviar comentário" icon="send" onPress={onComment} loading={createComment.isPending} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxl * 2, gap: spacing.md },
  title: { fontSize: 26, fontWeight: '800', color: colors.text },
  meta: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  author: { fontWeight: '700', color: colors.text },
  body: { ...typography.body, fontSize: 17, lineHeight: 27 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  comment: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  commentAuthor: { fontWeight: '700', color: colors.text, marginBottom: 2 },
  commentForm: { marginTop: spacing.md },
});
