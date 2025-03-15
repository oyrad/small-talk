import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { PropsWithChildren } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { InitializeUserId } from '@/app/_components/InitializeUserId';
import { Providers } from '@/app/_components/Providers';

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
        <Providers>
          <main className="h-svh md:h-screen">{children}</main>
          <Toaster duration={2000} />
          <InitializeUserId />
        </Providers>
      </body>
    </html>
  );
}
