import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Button } from '@/components/Button';
import { FormField } from '@/components/FormField';
import { FormScreen } from '@/components/FormScreen';
import { useAuth } from '@/contexts/AuthContext';
import { loginSchema, type LoginForm } from '@/schemas';
import { colors, radius, spacing, typography } from '@/theme/theme';

export default function LoginScreen() {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const { control, handleSubmit, formState, setValue } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  // Após o login, o Stack.Protected do _layout troca automaticamente para as abas.
  const onSubmit = handleSubmit(async ({ email, password }) => {
    setError(null);
    try {
      await login(email, password);
    } catch (e) {
      setError((e as Error).message);
    }
  });

  const fillDemo = (email: string, password: string) => {
    setValue('email', email);
    setValue('password', password);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <FormScreen>
        <View style={styles.hero}>
          <View style={styles.logo}>
            <Ionicons name="school" size={40} color={colors.white} />
          </View>
          <Text style={styles.brand}>SchoolBlog</Text>
          <Text style={[typography.caption, { textAlign: 'center' }]}>
            Publicações de professores para alunos, onde você estiver.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={[typography.title, { marginBottom: spacing.lg }]}>Entrar</Text>
          <FormField
            control={control}
            name="email"
            label="E-mail"
            placeholder="voce@schoolblog.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            testID="login-email"
          />
          <FormField
            control={control}
            name="password"
            label="Senha"
            placeholder="••••••"
            secureTextEntry
            autoCapitalize="none"
            testID="login-password"
            onSubmitEditing={onSubmit}
          />
          {error && <Text style={styles.error}>{error}</Text>}
          <Button title="Entrar" icon="log-in-outline" onPress={onSubmit} loading={formState.isSubmitting} testID="login-submit" />
        </View>

        {__DEV__ && (
          <View style={styles.demo}>
            <Text style={typography.caption}>Acesso de demonstração (seed da API):</Text>
            <View style={styles.demoButtons}>
              <Button title="Professor(a)" variant="outline" onPress={() => fillDemo('professor@schoolblog.com', 'docente123')} style={{ flex: 1 }} />
              <Button title="Aluno(a)" variant="outline" onPress={() => fillDemo('aluno@schoolblog.com', 'aluno123')} style={{ flex: 1 }} />
            </View>
          </View>
        )}
      </FormScreen>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: spacing.sm, marginTop: spacing.xxl, marginBottom: spacing.xl },
  logo: { width: 80, height: 80, borderRadius: 24, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  brand: { fontSize: 30, fontWeight: '800', color: colors.primary },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.xl, borderWidth: 1, borderColor: colors.border },
  error: { color: colors.danger, backgroundColor: colors.dangerSoft, padding: spacing.md, borderRadius: radius.sm, marginBottom: spacing.md },
  demo: { marginTop: spacing.xl, gap: spacing.sm },
  demoButtons: { flexDirection: 'row', gap: spacing.sm },
});
