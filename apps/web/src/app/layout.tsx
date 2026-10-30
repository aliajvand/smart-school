import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'مدرسه هوشمند آینده | AI-Powered Smart School',
  description: 'سامانه یکپارچه آموزش هوشمند، ارزشیابی پارامتریک و تصحیح هوشمند برگه‌های دست‌نویس',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="dark">
      <body className="bg-canvas text-text-primary antialiased min-h-screen selection:bg-ai-violet/30 selection:text-text-primary">
        {children}
      </body>
    </html>
  );
}
