import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Field, LockedField } from '@/components/Field';
import { FormHeader } from '@/components/FormHeader';
import { FormScroll } from '@/components/FormScroll';
import { Group } from '@/components/Group';
import { Row } from '@/components/Row';
import { ErrorState, LoadingState } from '@/components/StateViews';
import { STRINGS } from '@/constants/strings';
import { useAuth } from '@/contexts/AuthContext';
import { useDeletePost, usePost, useSavePost } from '@/hooks/usePosts';
import { postSchema, type PostForm } from '@/schemas';
import { confirmDestructive, hapticSuccess, showError } from '@/utils/feedback';

export function PostFormScreen({ id }: { id?: string }) {
  const isEdit = !!id;
  const { user } = useAuth();
  const post = usePost(id);
  const savePost = useSavePost(id);
  const deletePost = useDeletePost();

  const { control, handleSubmit, reset, formState } = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: { title: '', content: '' },
  });

  useEffect(() => {
    if (post.data) reset({ title: post.data.title, content: post.data.content });
  }, [post.data, reset]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      const saved = await savePost.mutateAsync({
        title: values.title.trim(),
        content: values.content.trim(),
      });
      hapticSuccess();
      if (isEdit) router.back();
      else router.replace({ pathname: '/posts/[id]', params: { id: saved.id } });
    } catch (e) {
      showError(e);
    }
  });

  const onDelete = () =>
    confirmDestructive(
      STRINGS.manage.confirmTitle,
      STRINGS.manage.confirmMessage(post.data?.title ?? ''),
      STRINGS.common.delete,
      () =>
        deletePost.mutate(id!, {
          onSuccess: () => {
            hapticSuccess();
            router.dismissAll();
          },
          onError: showError,
        }),
    );

  if (isEdit && post.isLoading) return <LoadingState />;
  if (isEdit && post.isError) return <ErrorState message={post.error.message} onRetry={post.refetch} />;

  const author = isEdit ? (post.data?.author ?? '') : (user?.name ?? '');

  return (
    <>
      <FormHeader
        saveLabel={isEdit ? STRINGS.common.save : STRINGS.postForm.publish}
        canSave={!isEdit || formState.isDirty}
        saving={formState.isSubmitting}
        dirty={formState.isDirty}
        onSave={onSubmit}
      />
      <FormScroll>
        <Group>
          <Field
            control={control}
            name="title"
            label={STRINGS.postForm.title}
            placeholder={STRINGS.postForm.titlePlaceholder}
            required
            returnKeyType="next"
            testID="post-title"
          />
          <LockedField label={STRINGS.postForm.author} value={author} hint={STRINGS.postForm.authorHint} />
        </Group>
        <Group>
          <Field
            control={control}
            name="content"
            label={STRINGS.postForm.content}
            placeholder={STRINGS.postForm.contentPlaceholder}
            required
            multiline
            testID="post-content"
          />
        </Group>
        {isEdit && (
          <Group>
            <Row
              title={STRINGS.postForm.deleteAction}
              destructive
              centered
              onPress={onDelete}
              testID="delete-post"
            />
          </Group>
        )}
      </FormScroll>
    </>
  );
}
