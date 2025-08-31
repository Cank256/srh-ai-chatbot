'use client';

import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';

import { PasswordResetForm } from '@/components/password-reset-form';
import { SubmitButton } from '@/components/submit-button';

import { updatePassword, type ResetPasswordActionState } from '../../actions';
import { checkResetToken } from '../../actions';

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const resetToken = params.id;

  const [email, setEmail] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [state, formAction] = useActionState<ResetPasswordActionState, FormData>(
    updatePassword,
    {
      status: 'idle',
    },
  );

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const user = await checkResetToken(resetToken as string);
        if (user) {
          const data = user;
          setEmail(data.email);
        } else {
          toast.error('Invalid or expired reset token.');
          router.refresh();
        }
      } catch (error) {
        console.error('Error fetching email:', error);
        toast.error('Failed to fetch email.');
        router.refresh();
      }
    };

    fetchEmail();
  }, [resetToken, router]);

  useEffect(() => {
    if (state.status === 'failed') {
      toast.error('Invalid Email Address!');
    } else if (state.status === 'invalid_data') {
      toast.error('Failed validating your submission!');
    } else if (state.status === 'success') {
      setIsSuccessful(true);
      router.push('/');
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
          <h3 className="text-xl font-semibold dark:text-zinc-50">Reset your password</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Enter your new password
          </p>
        </div>
        <PasswordResetForm action={handleSubmit} defaultEmail={email}>
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
        </PasswordResetForm>
      </div>
    </div>
  );
}
