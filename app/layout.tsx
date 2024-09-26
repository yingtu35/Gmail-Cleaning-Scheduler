import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from './components/sidebar';

import Footer from "./components/footer";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gmail Cleaner",
  description: "Clean up your Gmail inbox with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex flex-row h-screen">
          <Sidebar />
          {children}
        </main>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
