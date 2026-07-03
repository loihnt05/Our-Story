import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Together Since Day X | Our Story",
  description: "Counting every second of our beautiful journey together.",
};

export default function NumberLovedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
