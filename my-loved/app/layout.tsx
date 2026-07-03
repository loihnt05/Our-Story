import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Playfair_Display,
  Dancing_Script,
} from "next/font/google";
import "./globals.css";
import { AuthProviderWrapper as ClerkProvider } from "@/components/loved/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const dancing = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Our Love Story | Live Anniversary Counter",
  description:
    "A beautiful interactive space celebrating our time together, with a live day counter, memory timeline, and love board.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${dancing.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
