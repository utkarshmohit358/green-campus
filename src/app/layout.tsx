import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { RoleProvider } from '@/components/providers/RoleProvider';
import { ToastProvider } from '@/components/ui/Toast';
import { SmoothScrollProvider } from '@/lib/lenis';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { CommandPalette } from '@/components/ui/CommandPalette';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://greencampus.edu'),
  title: 'GreenCampus – Sustainable Computing for Colleges',
  description:
    'Institutional digital footprint monitoring and decarbonization platform for higher education. Tracking lab electricity, student computing emissions, and circular e-waste under UN SDG 12 & SDG 13.',
  keywords: [
    'sustainable computing',
    'green campus',
    'carbon footprint calculator',
    'e-waste recycling',
    'SDG 12',
    'SDG 13',
    'higher education sustainability',
    'energy monitoring',
  ],
  authors: [{ name: 'GreenCampus Initiative' }],
  creator: 'GreenCampus Team',
  openGraph: {
    title: 'GreenCampus – Sustainable Computing for Colleges',
    description:
      'Monitor, measure, and slash university computing carbon footprints. UN SDG 12 & 13 compliant.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'GreenCampus',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GreenCampus – Sustainable Computing for Colleges',
    description:
      'Institutional digital footprint monitoring and decarbonization platform for higher education.',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FBFBFA' },
    { media: '(prefers-color-scheme: dark)', color: '#06120E' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} antialiased`}>
      <body className="min-h-screen flex flex-col font-sans bg-[var(--background)] text-[var(--foreground)]">
        <ThemeProvider>
          <RoleProvider>
            <ToastProvider>
              <SmoothScrollProvider>
                <div className="flex flex-col min-h-screen">
                  <Navbar />
                  <main className="flex-1 w-full">{children}</main>
                  <Footer />
                </div>
                <CommandPalette />
              </SmoothScrollProvider>
            </ToastProvider>
          </RoleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
