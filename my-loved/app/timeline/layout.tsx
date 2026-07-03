import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Memory Timeline | Our Story",
  description: "A cute polaroid-style walk through every single memory of our love story.",
};

export default function TimelineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
