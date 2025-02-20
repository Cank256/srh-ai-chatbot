'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';

import { AuthForm } from '@/components/auth-form';
import { SubmitButton } from '@/components/submit-button';

import { resetPassword, type ResetPasswordActionState } from '../actions';

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [state, formAction] = useActionState<ResetPasswordActionState, FormData>(
    resetPassword,
    {
      status: 'idle',
    },
  );

  useEffect(() => {
    if (state.status === 'failed') {
      toast.error('Invalid Email Address!');
    } else if (state.status === 'invalid_data') {
      toast.error('Failed validating your submission!');
    } else if (state.status === 'success') {
      setIsSuccessful(true);
      router.push('/login');
    }
  }, [state.status, router]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get('email') as string);
    formAction(formData);
  };

  return (
    <div className="flex h-dvh w-screen items-start pt-12 md:pt-0 md:items-center justify-center bg-background">
      <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-12">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <p className="flex flex-row justify-center gap-16 items-center">
            <Image
              src="/images/bsu-logo.png"
              alt="BSU logo"
              width={140}
              height={30}
              priority
            />
            <Image
              src="/images/gu-logo.png"
              alt="GU logo"
              width={100}
              height={10}
            />
          </p>
          <p className='mb-8 text-xl font-bold dark:text-zinc-50'>
          CONSCOV AI Chatbot
          </p>
          <h3 className="text-xl font-semibold dark:text-zinc-50">Reset Password</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Use your email to reset your password
          </p>
        </div>
        <AuthForm action={handleSubmit} defaultEmail={email} resetPassword={true}>
          <SubmitButton isSuccessful={isSuccessful}>Reset Password</SubmitButton>
          <p className="text-center text-sm text-gray-600 mt-4 dark:text-zinc-400">
            {"Remembered your password? "}
            <Link
              href="/login"
              className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
            >
              Sign in
            </Link>
          </p>
        </AuthForm>
      </div>
    </div>
  );
}
