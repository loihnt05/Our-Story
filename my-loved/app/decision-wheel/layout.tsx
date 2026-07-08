import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Decision Wheel | Loved Story",
  description: "Spin the decision wheel to pick date ideas, food choices, or fun couple challenges instantly!",
};

export default function DecisionWheelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
