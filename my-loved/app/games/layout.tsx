import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Couple Game Center | Loved Story",
  description: "Play interactive couple games like Love Quiz, Memory Guess, and Decision Wheel to build intimacy and make decisions together!",
};

export default function GamesCenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
