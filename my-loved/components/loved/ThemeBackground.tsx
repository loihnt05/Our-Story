"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { StarsBackground } from "../animate-ui/components/backgrounds/stars";
import { GravityStarsBackground } from "../animate-ui/components/backgrounds/gravity-stars";
import { FireworksBackground } from "../animate-ui/components/backgrounds/fireworks";

interface ThemeBackgroundProps {
  bgType?: "stars" | "gravity" | "fireworks" | "hearts";
  floatingHearts?: Array<{
    id: number;
    left: number;
    size: number;
    duration: number;
    delay: number;
  }>;
  particleColors?: string[];
}

export default function ThemeBackground({
  bgType = "hearts",
  floatingHearts = [],
  particleColors = ["#f43f5e"],
}: ThemeBackgroundProps) {
  const { resolvedTheme: theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by waiting for client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = mounted ? theme : "dark";

  switch (bgType) {
    case "stars":
      return (
        <div className="absolute inset-0 z-0 overflow-hidden bg-transparent">
          <StarsBackground
            starColor={
              activeTheme === "dark"
                ? particleColors[2] || "#ffffff"
                : "#475569"
            }
            factor={0.03}
            speed={40}
            className="w-full h-full bg-transparent"
          />
        </div>
      );

    case "gravity":
      return (
        <div
          className="absolute inset-0 z-0 overflow-hidden bg-transparent"
          style={{
            color:
              activeTheme === "dark"
                ? particleColors[0] || "#fb7185"
                : "#e11d48",
          }}
        >
          <GravityStarsBackground
            starsCount={200}
            starsSize={5}
            movementSpeed={0.5}
            glowIntensity={12}
            starsOpacity={0.8}
            className="w-full h-full bg-transparent"
          />
        </div>
      );

    case "fireworks":
      return (
        <div className="absolute inset-0 z-0 overflow-hidden bg-transparent">
          <FireworksBackground
            population={1}
            color={
              activeTheme === "dark"
                ? particleColors
                : ["#db2777", "#7c3aed", "#2563eb", "#059669"]
            }
            // fireworkSpeed={{ min: 8, max: 15 }}
            // particleSize={{ min: 2, max: 18 }}
            className="w-full h-full bg-transparent"
          />
        </div>
      );

    case "hearts":
    default:
      return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none bg-transparent">
          {floatingHearts.map((heart) => (
            <svg
              key={heart.id}
              className="absolute text-rose-300/20 dark:text-rose-500/10 animate-float"
              style={{
                left: `${heart.left}%`,
                width: `${heart.size}px`,
                height: `${heart.size}px`,
                bottom: `-50px`,
                animationDuration: `${heart.duration}s`,
                animationDelay: `${heart.delay}s`,
              }}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          ))}
        </div>
      );
  }
}
