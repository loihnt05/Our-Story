import type { Metadata } from "next";
import {
  Fredoka,
  Geist_Mono,
  Playfair_Display,
  Dancing_Script,
  Molle,
} from "next/font/google";
import "./globals.css";
import { AuthProviderWrapper as ClerkProvider } from "@/components/loved/core/AuthProvider";
import { ThemeProvider } from "@/components/theme-provider";
import CursorWrapper from "@/components/loved/core/CursorWrapper";

const fredoka = Fredoka({
  variable: "--font-sans",
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

const molle = Molle({
  weight: "400",
  style: "italic",
  variable: "--font-molle",
  subsets: ["latin"],
});

export const dynamic = "force-dynamic";

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
        className={`${fredoka.variable} ${geistMono.variable} ${playfair.variable} ${dancing.variable} ${molle.variable} h-full antialiased`}
        suppressHydrationWarning
      >
        <body className="min-h-full flex flex-col">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <CursorWrapper>
              {children}
            </CursorWrapper>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
