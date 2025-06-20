'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Success() {

  return (
    <div className="flex h-dvh w-screen items-start pt-12 md:pt-0 md:items-center justify-center bg-background">
      <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-12">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <p className="flex flex-row justify-center gap-16 items-center">
            <Image
              src="/srh/images/bsu-logo.png"
              alt="BSU logo"
              width={140}
              height={30}
              priority

            />
            <Image
              src="/srh/images/gu-logo.png"
              alt="GU logo"
              width={100}
              height={10}
            />
          </p>
          <p className='mb-8 text-xl font-bold dark:text-zinc-50'>
          CONSCOV AI Chatbot
          </p>
          <h3 className="text-xl font-semibold dark:text-zinc-50">Reset Password</h3>
          <p className="text-sm font-semibold text-green-700 dark:text-green-400">
            An email has been sent to your email address with instructions on how to reset your password.
          </p>
        </div>
        <div>
          <p className="text-center text-sm text-gray-600 mt-4 dark:text-zinc-400">
            {"Remembered your password? "}
            <Link
              href="/login"
              className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
