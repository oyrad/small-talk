import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { PropsWithChildren } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { InitializeUser } from '@/app/_components/InitializeUser';
import { Providers } from '@/app/_components/Providers';
import NextTopLoader from 'nextjs-toploader';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'small talk',
  description: 'talk small',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextTopLoader color="#334155" showSpinner={false} />

        <Providers>
          <main className="h-svh md:h-screen lg:px-40 xl:px-96">{children}</main>
          <Toaster duration={2000} />
          <InitializeUser />
        </Providers>
      </body>
    </html>
  );
}
