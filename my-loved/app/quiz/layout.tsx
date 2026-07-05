import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Love Quiz & Challenges | Our Story",
  description: "A premium interactive compatibility game space for romantic couples. Answer quizzes, build custom packs, unlock achievements, and save memory capsules together.",
};

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
