'use client';

import { HydrationFix } from './hydration-fix';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HydrationFix />
      {children}
    </>
  );
}