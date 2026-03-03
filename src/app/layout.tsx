import type { Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Company Portal",
  description: "Built with Next.js, Clerk, and Supabase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <header className="flex justify-between items-center p-4 border-b border-black/[.08] dark:border-white/[.145]">
            <nav className="flex items-center gap-6">
              <Link
                href="/"
                className="font-semibold text-sm tracking-tight"
              >
                Company Portal
              </Link>
              <Show when="signed-in">
                <Link
                  href="/quotes"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-foreground transition-colors"
                >
                  Quotes
                </Link>
              </Show>
            </nav>
            <div className="flex items-center gap-4">
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] font-medium text-sm h-10 px-4">
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="rounded-full border border-solid border-transparent transition-colors bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm h-10 px-4">
                    Sign up
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>
            </div>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
