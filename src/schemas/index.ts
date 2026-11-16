import { z } from 'zod';
import { STRINGS } from '@/constants/strings';
import { brDateToIso, onlyDigits } from '@/utils/format';

const V = STRINGS.validation;

const requiredText = (min: number, max: number) =>
  z.string().trim().min(1, V.required).min(min, V.min(min)).max(max, V.max(max));

const optionalText = (max: number) => z.string().trim().max(max, V.max(max));

const phone = z
  .string()
  .refine((value) => {
    const digits = onlyDigits(value);
    return digits.length === 0 || digits.length === 10 || digits.length === 11;
  }, V.phone);

const birthDate = z.string().refine((value) => value === '' || brDateToIso(value) !== null, V.date);

const email = z.string().trim().min(1, V.required).email(V.email);

const password = z.string().min(6, V.passwordRange).max(72, V.passwordRange);

const optionalPassword = z
  .string()
  .refine((value) => value === '' || (value.length >= 6 && value.length <= 72), V.passwordRange);

export const loginSchema = z.object({
  email,
  password: z.string().min(1, V.required),
});
export type LoginForm = z.infer<typeof loginSchema>;

export const postSchema = z.object({
  title: requiredText(3, 200),
  content: z.string().trim().min(1, V.required),
});
export type PostForm = z.infer<typeof postSchema>;

export const commentSchema = z.object({
  content: z.string().trim().min(1, V.required),
});
export type CommentForm = z.infer<typeof commentSchema>;

export function userFormSchema(isEdit: boolean) {
  return z.object({
    name: requiredText(2, 120),
    email,
    password: isEdit ? optionalPassword : password,
    phone,
    subject: optionalText(120),
    education: optionalText(120),
    bio: optionalText(500),
    registration: optionalText(30),
    classGroup: optionalText(60),
    birthDate,
    guardianName: optionalText(120),
  });
}
export type UserForm = z.infer<ReturnType<typeof userFormSchema>>;

export const profileSchema = z
  .object({
    name: requiredText(2, 120),
    phone,
    currentPassword: z.string(),
    newPassword: optionalPassword,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: V.passwordMismatch,
    path: ['confirmPassword'],
  })
  .refine((data) => !data.newPassword || data.currentPassword.length > 0, {
    message: V.currentPasswordRequired,
    path: ['currentPassword'],
  });
export type ProfileForm = z.infer<typeof profileSchema>;
