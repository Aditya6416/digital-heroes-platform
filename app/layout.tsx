import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RoleQuickSwitcher from '@/components/RoleQuickSwitcher';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Digital Heroes · Golf Performance, Charity & Monthly Prize Draws',
  description: 'A modern subscription platform connecting golf scores in Stableford format with life-changing charity fundraising and monthly draw-based rewards.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-background min-h-screen flex flex-col antialiased selection:bg-brand-500/30 selection:text-brand-300`}>
        <StoreProvider>
          <RoleQuickSwitcher />
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
