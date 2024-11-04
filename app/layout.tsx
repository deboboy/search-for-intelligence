'use client';

import { Navbar } from './components/Navbar';
import { Footer } from "./components/Footer";
import { usePathname } from 'next/navigation';
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const pathname = usePathname()

  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-full`}
      >
        {pathname !== '/' && <Navbar />}
        <main className="flex-grow">
          {children}
        </main>
        {pathname !== '/' && <Footer />}
      </body>
    </html>
  );
}
