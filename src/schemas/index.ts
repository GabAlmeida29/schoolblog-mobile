import { z } from 'zod';

// Mesmas regras do back-end (Zod em src/modules/*/*.schema.ts da API).

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Informe o e-mail').email('E-mail inválido'),
  password: z.string().min(1, 'Informe a senha'),
});
export type LoginForm = z.infer<typeof loginSchema>;

export const postSchema = z.object({
  title: z.string().trim().min(3, 'Mínimo de 3 caracteres').max(200, 'Máximo de 200 caracteres'),
  content: z.string().trim().min(1, 'Informe o conteúdo'),
  author: z.string().trim().min(2, 'Mínimo de 2 caracteres').max(120, 'Máximo de 120 caracteres'),
});
export type PostForm = z.infer<typeof postSchema>;

export const commentSchema = z.object({
  content: z.string().trim().min(1, 'Escreva um comentário'),
});
export type CommentForm = z.infer<typeof commentSchema>;

const baseUser = {
  name: z.string().trim().min(2, 'Mínimo de 2 caracteres').max(120, 'Máximo de 120 caracteres'),
  email: z.string().trim().min(1, 'Informe o e-mail').email('E-mail inválido'),
};

/** Na criação a senha é obrigatória; na edição, vazio = manter a senha atual. */
export function userSchema(isEdit: boolean) {
  return z.object({
    ...baseUser,
    password: isEdit
      ? z
          .string()
          .refine((v) => v === '' || (v.length >= 6 && v.length <= 72), 'Entre 6 e 72 caracteres')
      : z.string().min(6, 'Mínimo de 6 caracteres').max(72, 'Máximo de 72 caracteres'),
  });
}
export type UserForm = z.infer<ReturnType<typeof userSchema>>;
