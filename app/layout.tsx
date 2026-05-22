import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '打地鼠：花園大作戰 | Whack-a-Mole Garden Rush',
  description: '親子友善、可正式部署的花園主題打地鼠網頁遊戲。',
  applicationName: 'Whack-a-Mole Garden Rush',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
