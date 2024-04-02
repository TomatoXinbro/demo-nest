import '@/app/ui/global.css';
import { inter } from './ui/fonts';
import { Metadata } from 'next';

/* SEO优化 */
export const metadata: Metadata = {
  // title: 'Acme Dashboard of next design by potato',
  title: {
    template: '%s | Acme Dashboard' /* 模版字符串 %s */,
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Course Dashboard, built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
