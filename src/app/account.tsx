import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Field, LockedField } from '@/components/Field';
import { FormHeader } from '@/components/FormHeader';
import { FormScroll } from '@/components/FormScroll';
import { Group } from '@/components/Group';
import { STRINGS } from '@/constants/strings';
import { useAuth } from '@/contexts/AuthContext';
import { profileSchema, type ProfileForm } from '@/schemas';
import { hapticSuccess, showError } from '@/utils/feedback';
import { maskPhone, onlyDigits } from '@/utils/format';

const E = STRINGS.editProfile;

export default function AccountScreen() {
  const { user, updateProfile } = useAuth();
  const { control, handleSubmit, formState } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? '',
      phone: user?.phone ? maskPhone(user.phone) : '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await updateProfile({
        name: values.name.trim(),
        phone: onlyDigits(values.phone) || null,
        ...(values.newPassword
          ? { currentPassword: values.currentPassword, newPassword: values.newPassword }
          : {}),
      });
      hapticSuccess();
      router.back();
    } catch (e) {
      showError(e);
    }
  });

  if (!user) return null;

  return (
    <>
      <FormHeader
        canSave={formState.isDirty}
        saving={formState.isSubmitting}
        dirty={formState.isDirty}
        onSave={onSubmit}
      />
      <FormScroll>
        <Group header={E.personal} footer={E.emailHint}>
          <Field
            control={control}
            name="name"
            label={STRINGS.userForm.name}
            autoCapitalize="words"
            textContentType="name"
            required
            testID="account-name"
          />
          <Field
            control={control}
            name="phone"
            label={STRINGS.userForm.phone}
            placeholder={STRINGS.userForm.phonePlaceholder}
            keyboardType="phone-pad"
            mask={maskPhone}
            testID="account-phone"
          />
          <LockedField label={STRINGS.userForm.email} value={user.email} />
        </Group>

        <Group header={E.security} footer={E.securityHint}>
          <Field
            control={control}
            name="currentPassword"
            label={E.currentPassword}
            textContentType="password"
            password
            autoCapitalize="none"
            testID="account-current-password"
          />
          <Field
            control={control}
            name="newPassword"
            label={E.newPassword}
            hint={STRINGS.userForm.passwordHint}
            textContentType="newPassword"
            password
            autoCapitalize="none"
            testID="account-new-password"
          />
          <Field
            control={control}
            name="confirmPassword"
            label={E.confirmPassword}
            textContentType="newPassword"
            password
            autoCapitalize="none"
            testID="account-confirm-password"
          />
        </Group>
      </FormScroll>
    </>
  );
}
