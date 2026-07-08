import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Memory Guess | Loved Story",
  description: "Test how well you and your partner remember your milestones, trips, and shared adventures in a fun guessing game!",
};

export default function MemoryGuessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
