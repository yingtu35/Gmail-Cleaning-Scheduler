import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/app-sidebar";

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
  const { isAuthenticated, user } = await getAuthenticatedUser();
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex flex-row h-screen">
          {isAuthenticated && <AppSidebar user={user} />}
          {children}
        </main>
      </body>
    </html>
  );
}
