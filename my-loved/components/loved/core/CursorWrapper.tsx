"use client";

import React, { useState, useEffect } from "react";
import { FollowerPointerCard } from "@/components/ui/following-pointer";

export default function CursorWrapper({ children }: { children: React.ReactNode }) {
  const [partnerLabel, setPartnerLabel] = useState("Our Story 💖");

  useEffect(() => {
    const updateLabel = () => {
      const personA = localStorage.getItem("loved_personA") || "Romeo";
      const personB = localStorage.getItem("loved_personB") || "Juliet";
      setPartnerLabel(`${personA} & ${personB} 💖`);
    };

    updateLabel();

    // Listen for storage changes from other tabs and custom changes in the same tab
    window.addEventListener("storage", updateLabel);
    window.addEventListener("loved_names_updated", updateLabel);
    return () => {
      window.removeEventListener("storage", updateLabel);
      window.removeEventListener("loved_names_updated", updateLabel);
    };
  }, []);

  return (
    <FollowerPointerCard 
      title={partnerLabel} 
      className="min-h-screen flex flex-col w-full"
    >
      {children}
    </FollowerPointerCard>
  );
}
