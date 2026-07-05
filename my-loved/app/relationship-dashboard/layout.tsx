import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Relationship Stats | Our Story",
  description: "A beautiful stats dashboard showcasing our journey, milestones, and shared love statistics.",
};

export default function RelationshipDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
