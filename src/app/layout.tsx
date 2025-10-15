import type { Metadata } from 'next';
import Script from 'next/script';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import Providers from '@/providers';
import '@rainbow-me/rainbowkit/styles.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Autopilot App - Earn more on USDC, ETH and BTC',
  description:
    'Autopilot reallocates liquidity across the most efficient yield sources, keeping your assets productive 24/7 without the need for manual management.',
  icons: '/icon.svg',
  twitter: {
    card: 'summary_large_image',
    site: 'Autopilot App - Earn more on USDC, ETH and BTC',
    images: 'https://app.autopilot.finance/social-card.jpg',
  },
  openGraph: {
    type: 'website',
    url: 'https://app.autopilot.finance/',
    title: 'Autopilot App - Earn more on USDC, ETH and BTC',
    description:
      'Autopilot reallocates liquidity across the most efficient yield sources, keeping your assets productive 24/7 without the need for manual management.',
    siteName: 'Autopilot App - Earn more on USDC, ETH and BTC',
    images: [{ url: 'https://app.autopilot.finance/social-card.jpg' }],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Script src="https://cdn.usefathom.com/script.js" data-site="MHVSKUBZ" defer />
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}>
        <div className="fixed inset-x-0 top-0 h-[30px] z-[100] w-full bg-purple-50 border-purple-200/50 border-b py-2 px-4 text-center text-[11px] text-purple-700">
          Demo reflects Autopilot exactly as it appears to a real user wallet.
        </div>
        <Providers>
          <Sidebar />
          <div className="min-h-screen bg-gray-50 flex md:ml-80">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
