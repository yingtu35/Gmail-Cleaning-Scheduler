import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Header from "./components/header/header";
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
        <Header />
        <main className="flex-auto w-full px-1 py-4 mx-auto sm:px-6 md:py-6">
          {children}
        </main>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
