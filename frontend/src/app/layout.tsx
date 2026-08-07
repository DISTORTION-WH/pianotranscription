import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import QueryProvider from '../providers/QueryProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PianoTranscription | AI Audio-to-Score',
  description: 'AI-Powered platform to transcribe polyphonic audio tracks into playable MIDI and MusicXML',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}>
        {/* Глобальный провайдер для React Query */}
        <QueryProvider>
          <main className="min-h-screen flex flex-col">
            {children}
          </main>
        </QueryProvider>
      </body>
    </html>
  );
}