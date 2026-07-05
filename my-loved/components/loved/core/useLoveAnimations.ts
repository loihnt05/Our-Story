import { useState, useEffect } from "react";
import { BurstHeart } from "@/components/loved/core/types";
import { AmbientSynth } from "@/components/loved/core/AmbientSynth";

export function useLoveAnimations(
  mounted: boolean,
  isMuted: boolean,
  synthRef: React.MutableRefObject<AmbientSynth | null>
) {
  const [burstHearts, setBurstHearts] = useState<BurstHeart[]>([]);
  const [floatingBgHearts, setFloatingBgHearts] = useState<{id: number, left: number, size: number, duration: number, delay: number}[]>([]);

  useEffect(() => {
    if (!mounted) return;
    // Generate random background floating hearts (more hearts, faster speed)
    const bgHearts = Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // percentage
      size: Math.random() * 20 + 10, // 10px to 30px
      duration: Math.random() * 8 + 6, // 6s to 14s (faster!)
      delay: Math.random() * -10 // start immediately at random offsets
    }));
    setFloatingBgHearts(bgHearts);
  }, [mounted]);

  // Handle clicking the central heart (Explosion of hearts)
  const triggerHeartBurst = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const count = 16;
    const newHearts: BurstHeart[] = Array.from({ length: count }).map((_, i) => ({
      id: Date.now() + i,
      x,
      y,
      size: Math.random() * 20 + 14,
      delay: Math.random() * 0.1,
      rotation: Math.random() * 360
    }));

    setBurstHearts((prev) => [...prev, ...newHearts]);

    // Clean up burst hearts
    setTimeout(() => {
      setBurstHearts((prev) => prev.filter((h) => !newHearts.find((nh) => nh.id === h.id)));
    }, 1500);

    // Audio chime cue on click
    if (!isMuted && synthRef.current) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const audioCtx = (synthRef.current as any).ctx;
        if (audioCtx && audioCtx.state !== "suspended") {
          const now = audioCtx.currentTime;
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(523.25, now);
          osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.15);
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.04, now + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
          
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(now + 0.3);
        }
      } catch (err) {}
    }
  };

  return {
    burstHearts,
    floatingBgHearts,
    triggerHeartBurst
  };
}
