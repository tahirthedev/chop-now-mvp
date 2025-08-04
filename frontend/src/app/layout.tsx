import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { Providers } from '@/lib/providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'ChopNow - Food Delivery App',
    template: '%s | ChopNow',
  },
  description: 'Order delicious food from your favorite restaurants with fast delivery',
  keywords: ['food delivery', 'restaurant', 'order food', 'fast delivery'],
  authors: [{ name: 'ChopNow Team' }],
  creator: 'ChopNow',
  publisher: 'ChopNow',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    siteName: 'ChopNow',
    title: 'ChopNow - Food Delivery App',
    description: 'Order delicious food from your favorite restaurants with fast delivery',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ChopNow - Food Delivery App',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChopNow - Food Delivery App',
    description: 'Order delicious food from your favorite restaurants with fast delivery',
    images: ['/og-image.jpg'],
    creator: '@chopnow',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
