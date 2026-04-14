import './globals.css';
import { DockMorph } from '@/components/ui/DockMorph';
import { FlickeringFooter } from '@/components/ui/flickering-footer';
import { Providers } from '@/components/Providers';
import { EtheralBackground } from '@/components/ui/etheral-shadow';

export const metadata = {
  title: 'qr.org | Minimalist 3D Generator',
  description: 'Create lightning fast, dynamic QR codes with a soft pastel, minimalist 3D aesthetic on qr.org.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <EtheralBackground />
          <main className="app-container pt-10 pb-12 px-4 md:px-8">
            <DockMorph />
            <div className="content relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center min-h-[85vh]">
              {children}
            </div>
          </main>
          <FlickeringFooter />
        </Providers>
      </body>
    </html>
  );
}
