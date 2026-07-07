"use client";

import React, { useState, useEffect } from "react";
import { FollowerPointerCard } from "@/components/ui/following-pointer";

export default function CursorWrapper({ children }: { children: React.ReactNode }) {
  const [partnerLabel, setPartnerLabel] = useState("Our Story 💖");

  useEffect(() => {
    const updateLabel = () => {
      if (typeof window !== "undefined") {
        const personA = localStorage.getItem("loved_personA") || "Romeo";
        const personB = localStorage.getItem("loved_personB") || "Juliet";
        setPartnerLabel(`${personA} & ${personB} 💖`);
      }
    };

    updateLabel();

    // Listen for custom settings changes if any
    window.addEventListener("storage", updateLabel);
    return () => window.removeEventListener("storage", updateLabel);
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
