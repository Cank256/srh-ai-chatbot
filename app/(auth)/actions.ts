'use server';

import { z } from 'zod';

import { createUser, getUser, updateUser } from '@/lib/db/queries';

import { signIn } from './auth';

import { sendResetEmail } from '@/lib/email';

const authFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const resetPasswordSchema = z.object({
  email: z.string().email(),
});

async function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export interface LoginActionState {
  status: 'idle' | 'in_progress' | 'success' | 'failed' | 'invalid_data';
}

export const login = async (
  _: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    await signIn('credentials', {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    return { status: 'success' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: 'invalid_data' };
    }

    return { status: 'failed' };
  }
};

export interface RegisterActionState {
  status:
    | 'idle'
    | 'in_progress'
    | 'success'
    | 'failed'
    | 'user_exists'
    | 'invalid_data';
}

export const register = async (
  _: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    const [user] = await getUser(validatedData.email);

    if (user) {
      return { status: 'user_exists' } as RegisterActionState;
    }
    await createUser(validatedData.email, validatedData.password);
    await signIn('credentials', {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    return { status: 'success' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: 'invalid_data' };
    }

    return { status: 'failed' };
  }
};

export interface ResetPasswordActionState {
  status: 'idle' | 'in_progress' | 'success' | 'failed' | 'invalid_data';
}

export const resetPassword = async (
  _: ResetPasswordActionState,
  formData: FormData,
): Promise<ResetPasswordActionState> => {
  try {
    const validatedData = resetPasswordSchema.parse({
      email: formData.get('email')
    });

    const [user] = await getUser(validatedData.email);

    if (!user) {
      return { status: 'failed' };
    }
    // Generate a unique reset token
    const resetToken = await generateUUID();
    await updateUser(false, { ...user, reset_token:resetToken });
    
    // Send email to user with reset link
    await sendResetEmail(user.email, resetToken);

    return { status: 'success' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: 'invalid_data' };
    }

    return { status: 'failed' };
  }
};
