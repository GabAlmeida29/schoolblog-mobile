import { useState } from 'react';
import { Platform, Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { AppText } from './AppText';
import { Icon } from './Icon';
import { STRINGS } from '@/constants/strings';
import { spacing, textStyles } from '@/theme/theme';
import { makeStyles, useTheme } from '@/theme/useTheme';

function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <AppText variant="footnote" tone="secondary">
      {required && (
        <AppText variant="footnote" tone="destructive">
          {'* '}
        </AppText>
      )}
      {text}
    </AppText>
  );
}

interface FieldProps<T extends FieldValues> extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  required?: boolean;
  hint?: string;
  mask?: (value: string) => string;
  password?: boolean;
}

export function Field<T extends FieldValues>({
  control,
  name,
  label,
  required,
  hint,
  mask,
  password,
  multiline,
  style,
  ...inputProps
}: FieldProps<T>) {
  const styles = useStyles();
  const { colors } = useTheme();
  const [hidden, setHidden] = useState(true);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
        <View style={styles.cell}>
          <Label text={label} required={required} />
          <View style={styles.inputRow}>
            <TextInput
              accessibilityLabel={label}
              value={value ?? ''}
              onChangeText={(text) => onChange(mask ? mask(text) : text)}
              onBlur={onBlur}
              placeholderTextColor={colors.tertiary}
              selectionColor={colors.tint}
              multiline={multiline}
              secureTextEntry={password && hidden}
              textAlignVertical={multiline ? 'top' : 'center'}
              {...inputProps}
              style={[styles.input, multiline && styles.multiline, style]}
            />
            {password && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={hidden ? STRINGS.login.showPassword : STRINGS.login.hidePassword}
                hitSlop={10}
                onPress={() => setHidden((current) => !current)}
                style={styles.eye}
              >
                <Icon name={hidden ? 'eye' : 'eyeSlash'} size={18} color={colors.tertiary} />
              </Pressable>
            )}
          </View>
          {error ? (
            <AppText variant="footnote" tone="destructive">
              {error.message}
            </AppText>
          ) : hint ? (
            <AppText variant="footnote" tone="tertiary">
              {hint}
            </AppText>
          ) : null}
        </View>
      )}
    />
  );
}

export function LockedField({ label, value, hint }: { label: string; value: string; hint?: string }) {
  const styles = useStyles();
  const { colors } = useTheme();
  return (
    <View style={styles.cell} accessibilityState={{ disabled: true }}>
      <Label text={label} />
      <View style={styles.inputRow}>
        <AppText variant="body" tone="tertiary" style={styles.lockedText} testID="locked-field">
          {value}
        </AppText>
        <Icon name="lock" size={14} color={colors.tertiary} />
      </View>
      {hint && (
        <AppText variant="footnote" tone="tertiary">
          {hint}
        </AppText>
      )}
    </View>
  );
}

const useStyles = makeStyles((colors) =>
  StyleSheet.create({
    cell: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm + 2, paddingBottom: spacing.sm + 2, gap: 2 },
    inputRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    input: {
      ...textStyles.body,
      flex: 1,
      color: colors.label,
      minHeight: 32,
      paddingVertical: 4,
      ...(Platform.OS === 'web' ? { outlineWidth: 0 } : null),
    },
    multiline: { minHeight: 140 },
    lockedText: { flex: 1, paddingVertical: 4 },
    eye: { minHeight: 32, justifyContent: 'center' },
  }),
);
