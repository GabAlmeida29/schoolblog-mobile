import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Field } from '@/components/Field';
import { FormHeader } from '@/components/FormHeader';
import { FormScroll } from '@/components/FormScroll';
import { Group } from '@/components/Group';
import { Row } from '@/components/Row';
import { ErrorState, LoadingState } from '@/components/StateViews';
import { STRINGS } from '@/constants/strings';
import { useAuth } from '@/contexts/AuthContext';
import { useDeleteUser, useSaveUser, useUser } from '@/hooks/useUsers';
import { userFormSchema, type UserForm } from '@/schemas';
import { confirmDestructive, hapticSuccess, showError } from '@/utils/feedback';
import { maskDate, maskPhone } from '@/utils/format';
import { emptyUserForm, formToUserInput, userToForm } from '@/utils/userMapper';
import type { UserKind } from '@/types';

const F = STRINGS.userForm;

export function UserFormScreen({ kind, id }: { kind: UserKind; id?: string }) {
  const isEdit = !!id;
  const texts = STRINGS.users[kind];
  const { user: me } = useAuth();
  const user = useUser(kind, id);
  const saveUser = useSaveUser(kind, id);
  const deleteUser = useDeleteUser(kind);
  const schema = useMemo(() => userFormSchema(isEdit), [isEdit]);

  const { control, handleSubmit, reset, formState } = useForm<UserForm>({
    resolver: zodResolver(schema),
    defaultValues: emptyUserForm,
  });

  useEffect(() => {
    if (user.data) reset(userToForm(user.data));
  }, [user.data, reset]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await saveUser.mutateAsync(formToUserInput(kind, values));
      hapticSuccess();
      router.back();
    } catch (e) {
      showError(e);
    }
  });

  const onDelete = () =>
    confirmDestructive(
      texts.confirmTitle,
      STRINGS.users.confirmMessage(user.data?.name ?? ''),
      STRINGS.common.delete,
      () =>
        deleteUser.mutate(id!, {
          onSuccess: () => {
            hapticSuccess();
            router.back();
          },
          onError: showError,
        }),
    );

  if (isEdit && user.isLoading) return <LoadingState />;
  if (isEdit && user.isError) return <ErrorState message={user.error.message} onRetry={user.refetch} />;

  return (
    <>
      <FormHeader
        canSave={!isEdit || formState.isDirty}
        saving={formState.isSubmitting}
        dirty={formState.isDirty}
        onSave={onSubmit}
      />
      <FormScroll>
        <Group header={F.sections.personal}>
          <Field
            control={control}
            name="name"
            label={F.name}
            placeholder={F.namePlaceholder}
            textContentType="name"
            autoCapitalize="words"
            required
            testID="user-name"
          />
          <Field
            control={control}
            name="phone"
            label={F.phone}
            placeholder={F.phonePlaceholder}
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            mask={maskPhone}
            testID="user-phone"
          />
          {kind === 'students' ? (
            <Field
              control={control}
              name="birthDate"
              label={F.birthDate}
              placeholder={F.birthDatePlaceholder}
              keyboardType="number-pad"
              mask={maskDate}
              testID="user-birthdate"
            />
          ) : null}
          {kind === 'students' ? (
            <Field
              control={control}
              name="guardianName"
              label={F.guardianName}
              placeholder={F.guardianNamePlaceholder}
              autoCapitalize="words"
              testID="user-guardian"
            />
          ) : null}
        </Group>

        {kind === 'teachers' ? (
          <Group header={F.sections.teaching}>
            <Field
              control={control}
              name="subject"
              label={F.subject}
              placeholder={F.subjectPlaceholder}
              testID="user-subject"
            />
            <Field
              control={control}
              name="education"
              label={F.education}
              placeholder={F.educationPlaceholder}
              testID="user-education"
            />
            <Field
              control={control}
              name="bio"
              label={F.bio}
              placeholder={F.bioPlaceholder}
              multiline
              style={{ minHeight: 88 }}
              testID="user-bio"
            />
          </Group>
        ) : (
          <Group header={F.sections.school}>
            <Field
              control={control}
              name="registration"
              label={F.registration}
              placeholder={F.registrationPlaceholder}
              autoCapitalize="characters"
              testID="user-registration"
            />
            <Field
              control={control}
              name="classGroup"
              label={F.classGroup}
              placeholder={F.classGroupPlaceholder}
              testID="user-classgroup"
            />
          </Group>
        )}

        <Group header={F.sections.access}>
          <Field
            control={control}
            name="email"
            label={F.email}
            placeholder={F.emailPlaceholder}
            keyboardType="email-address"
            textContentType="emailAddress"
            autoCapitalize="none"
            required
            testID="user-email"
          />
          <Field
            control={control}
            name="password"
            label={isEdit ? F.newPassword : F.password}
            hint={isEdit ? F.newPasswordHint : F.passwordHint}
            textContentType="newPassword"
            autoCapitalize="none"
            password
            required={!isEdit}
            testID="user-password"
          />
        </Group>

        {isEdit && id !== me?.id ? (
          <Group>
            <Row
              title={texts.deleteAction}
              destructive
              centered
              onPress={onDelete}
              testID="delete-user"
            />
          </Group>
        ) : null}
      </FormScroll>
    </>
  );
}
