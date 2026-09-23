import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, Text } from 'react-native';
import { Button } from '@/components/Button';
import { FormField } from '@/components/FormField';
import { FormScreen } from '@/components/FormScreen';
import { ErrorState, LoadingState } from '@/components/StateViews';
import { useSaveUser, useUser } from '@/hooks/useUsers';
import { userSchema, type UserForm } from '@/schemas';
import { colors, radius, spacing } from '@/theme/theme';
import type { UserKind } from '@/types';

/** Formulário único para cadastro/edição de professores e alunos. */
export function UserFormScreen({ kind, id }: { kind: UserKind; id?: string }) {
  const isEdit = !!id;
  const user = useUser(kind, id);
  const saveUser = useSaveUser(kind, id);
  const [error, setError] = useState<string | null>(null);
  const schema = useMemo(() => userSchema(isEdit), [isEdit]);

  const { control, handleSubmit, reset, formState } = useForm<UserForm>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '' },
  });

  useEffect(() => {
    if (user.data) reset({ name: user.data.name, email: user.data.email, password: '' });
  }, [user.data, reset]);

  const onSubmit = handleSubmit(async ({ password, ...rest }) => {
    setError(null);
    try {
      // Na edição, senha em branco = mantém a atual (não envia o campo).
      await saveUser.mutateAsync(password ? { ...rest, password } : rest);
      router.back();
    } catch (e) {
      setError((e as Error).message);
    }
  });

  if (isEdit && user.isLoading) return <LoadingState />;
  if (isEdit && user.isError) return <ErrorState message={user.error.message} onRetry={user.refetch} />;

  return (
    <FormScreen>
      <FormField control={control} name="name" label="Nome" placeholder="Nome completo" autoCapitalize="words" testID="user-name" />
      <FormField
        control={control}
        name="email"
        label="E-mail"
        placeholder="nome@schoolblog.com"
        keyboardType="email-address"
        autoCapitalize="none"
        testID="user-email"
      />
      <FormField
        control={control}
        name="password"
        label={isEdit ? 'Nova senha (opcional)' : 'Senha'}
        hint={isEdit ? 'Deixe em branco para manter a senha atual.' : 'Mínimo de 6 caracteres.'}
        secureTextEntry
        autoCapitalize="none"
        testID="user-password"
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button
        title={isEdit ? 'Salvar alterações' : 'Cadastrar'}
        icon={isEdit ? 'save-outline' : 'person-add-outline'}
        onPress={onSubmit}
        loading={formState.isSubmitting}
        testID="user-submit"
      />
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  error: { color: colors.danger, backgroundColor: colors.dangerSoft, padding: spacing.md, borderRadius: radius.sm, marginBottom: spacing.md },
});
