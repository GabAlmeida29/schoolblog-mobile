import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { colors, radius, spacing } from '@/theme/theme';

interface Props<T extends FieldValues> extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  hint?: string;
}

/** TextInput integrado ao React Hook Form (Controller) com label e mensagem de erro. */
export function FormField<T extends FieldValues>({ control, name, label, hint, multiline, style, ...inputProps }: Props<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
        <View style={styles.container}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            accessibilityLabel={label}
            value={value ?? ''}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholderTextColor={colors.textMuted}
            multiline={multiline}
            textAlignVertical={multiline ? 'top' : 'center'}
            {...inputProps}
            style={[styles.input, multiline && styles.multiline, style, error && styles.inputError]}
          />
          {error ? (
            <Text style={styles.error}>{error.message}</Text>
          ) : hint ? (
            <Text style={styles.hint}>{hint}</Text>
          ) : null}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.lg },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: spacing.xs },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: colors.text,
  },
  multiline: { minHeight: 180 },
  inputError: { borderColor: colors.danger },
  error: { color: colors.danger, fontSize: 13, marginTop: spacing.xs },
  hint: { color: colors.textMuted, fontSize: 13, marginTop: spacing.xs },
});
