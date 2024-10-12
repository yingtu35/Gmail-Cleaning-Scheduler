import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from './components/sidebar';

import Footer from "./components/footer";
import { getAuthenticatedUser } from "./lib/actions";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gmail Cleaner",
  description: "Clean up your Gmail inbox with ease.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated } = await getAuthenticatedUser();
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex flex-row h-screen">
          {isAuthenticated && <Sidebar />}
          {children}
        </main>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
