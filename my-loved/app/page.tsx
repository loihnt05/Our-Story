"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useClerk } from "@/components/loved/core/AuthProvider";
import WelcomeScreen from "@/components/loved/core/WelcomeScreen";
import { THEMES } from "@/components/loved/core/constants";
import { AmbientSynth } from "@/components/loved/core/AmbientSynth";

export default function Home() {
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [themeId, setThemeId] = useState("rose-gold");
  const [customTitle, setCustomTitle] = useState("Our Story");

  // Load custom configurations from localStorage on mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const savedTheme = localStorage.getItem("loved_theme");
    if (savedTheme) setThemeId(savedTheme);
    const savedTitle = localStorage.getItem("loved_title");
    if (savedTitle) setCustomTitle(savedTitle);
  }, []);

  // Floating Hearts array for background
  const [floatingBgHearts] = useState(() =>
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 15 + 10,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 5,
    }))
  );

  if (!mounted) return null;

  const currentTheme = THEMES.find((t) => t.id === themeId) || THEMES[0];

  const handleEnter = () => {
    if (!isSignedIn) {
      if (openSignIn) {
        openSignIn();
      }
    } else {
      // Trigger a brief romantic start chime
      const synth = new AmbientSynth();
      synth.start();
      
      // Delay navigation slightly so chime can play
      setTimeout(() => {
        router.push("/number-loved");
      }, 350);
    }
  };

  return (
    <WelcomeScreen
      onEnter={handleEnter}
      gradient={currentTheme.gradient}
      floatingHearts={floatingBgHearts}
      customTitle={customTitle}
      buttonText={isSignedIn ? "Enter Our Kingdom" : "Sign In to Enter 💖"}
    />
  );
}
