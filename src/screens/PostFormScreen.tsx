import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, Text } from 'react-native';
import { Button } from '@/components/Button';
import { FormField } from '@/components/FormField';
import { FormScreen } from '@/components/FormScreen';
import { ErrorState, LoadingState } from '@/components/StateViews';
import { useAuth } from '@/contexts/AuthContext';
import { usePost, useSavePost } from '@/hooks/usePosts';
import { postSchema, type PostForm } from '@/schemas';
import { colors, radius, spacing } from '@/theme/theme';

/** Formulário único para criar (sem id) e editar (com id) publicações. */
export function PostFormScreen({ id }: { id?: string }) {
  const isEdit = !!id;
  const { user } = useAuth();
  const post = usePost(id);
  const savePost = useSavePost(id);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit, reset, formState } = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: { title: '', content: '', author: user?.name ?? '' },
  });

  // Edição: carrega os dados atuais do post no formulário.
  useEffect(() => {
    if (post.data) reset({ title: post.data.title, content: post.data.content, author: post.data.author });
  }, [post.data, reset]);

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    try {
      const saved = await savePost.mutateAsync(values);
      if (isEdit) router.back();
      else router.replace({ pathname: '/posts/[id]', params: { id: saved.id } });
    } catch (e) {
      setError((e as Error).message);
    }
  });

  if (isEdit && post.isLoading) return <LoadingState />;
  if (isEdit && post.isError) return <ErrorState message={post.error.message} onRetry={post.refetch} />;

  return (
    <FormScreen>
      <FormField control={control} name="title" label="Título" placeholder="Ex.: Frações e decimais" testID="post-title" />
      <FormField control={control} name="author" label="Autor(a)" placeholder="Nome de quem publica" testID="post-author" />
      <FormField control={control} name="content" label="Conteúdo" placeholder="Escreva a publicação..." multiline testID="post-content" />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button
        title={isEdit ? 'Salvar alterações' : 'Publicar'}
        icon={isEdit ? 'save-outline' : 'paper-plane-outline'}
        onPress={onSubmit}
        loading={formState.isSubmitting}
        testID="post-submit"
      />
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  error: { color: colors.danger, backgroundColor: colors.dangerSoft, padding: spacing.md, borderRadius: radius.sm, marginBottom: spacing.md },
});
