import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Field } from '@/components/Field';
import { Group } from '@/components/Group';
import { MarginLine } from '@/components/Notebook';
import { STRINGS } from '@/constants/strings';
import { useAuth } from '@/contexts/AuthContext';
import { loginSchema, type LoginForm } from '@/schemas';
import { MARGIN_COLUMN, spacing } from '@/theme/theme';
import { makeStyles } from '@/theme/useTheme';

export default function LoginScreen() {
  const styles = useStyles();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const { control, handleSubmit, formState } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async ({ email, password }) => {
    setError(null);
    try {
      await login(email, password);
    } catch (e) {
      setError((e as Error).message);
    }
  });

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        <View style={styles.brand}>
          <MarginLine />
          <AppText variant="largeTitle" accessibilityRole="header">
            {STRINGS.app.name}
          </AppText>
          <AppText variant="body" tone="secondary">
            {STRINGS.app.tagline}
          </AppText>
        </View>

        <Group header={STRINGS.login.title} footer={STRINGS.login.footer}>
          <Field
            control={control}
            name="email"
            label={STRINGS.login.email}
            placeholder={STRINGS.login.emailPlaceholder}
            keyboardType="email-address"
            textContentType="username"
            autoCapitalize="none"
            autoComplete="email"
            returnKeyType="next"
            testID="login-email"
          />
          <Field
            control={control}
            name="password"
            label={STRINGS.login.password}
            placeholder={STRINGS.login.passwordPlaceholder}
            textContentType="password"
            password
            autoCapitalize="none"
            returnKeyType="go"
            onSubmitEditing={onSubmit}
            testID="login-password"
          />
        </Group>

        {error && (
          <AppText variant="footnote" tone="destructive" style={styles.error} accessibilityRole="alert">
            {error}
          </AppText>
        )}

        <View style={styles.action}>
          <Button
            title={STRINGS.login.submit}
            onPress={onSubmit}
            loading={formState.isSubmitting}
            testID="login-submit"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const useStyles = makeStyles((colors) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.ground },
    content: { flexGrow: 1, justifyContent: 'center', paddingVertical: spacing.xxxl },
    brand: {
      marginBottom: spacing.xxxl,
      paddingLeft: MARGIN_COLUMN + spacing.lg,
      paddingRight: spacing.lg,
      paddingVertical: spacing.lg,
      gap: spacing.xs,
    },
    error: { marginHorizontal: spacing.xxl + spacing.xs, marginTop: -spacing.lg, marginBottom: spacing.lg },
    action: { marginHorizontal: spacing.lg },
  }),
);
