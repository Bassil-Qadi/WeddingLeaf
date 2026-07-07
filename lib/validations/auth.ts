import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email({ message: "البريد الإلكتروني غير صالح" }),
  password: z
    .string()
    .min(8, { message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" }),
});

export const signUpSchema = signInSchema.extend({
  name: z.string().min(2, { message: "الاسم يجب أن يكون حرفين على الأقل" }),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;