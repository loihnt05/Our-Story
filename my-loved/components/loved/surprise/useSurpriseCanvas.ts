"use client";

import { useEffect } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  radius: number;
  alpha: number;
  decay: number;
  gravity?: number;
  type: "star" | "firework" | "heart" | "confetti";
  rotation?: number;
  rotationSpeed?: number;
}

export function useSurpriseCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  triggerConfetti: boolean
) {
  useEffect(() => {
    if (!triggerConfetti) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const particles: Particle[] = [];
    const colors = ["#f43f5e", "#ec4899", "#d946ef", "#a855f7", "#e11d48", "#f59e0b", "#10b981", "#3b82f6", "#ffffff"];

    const addExplosion = (cx: number, cy: number, count = 70) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 3;
        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (Math.random() * 2.5),
          color: colors[Math.floor(Math.random() * colors.length)],
          radius: Math.random() * 3.5 + 1.5,
          alpha: 1,
          decay: Math.random() * 0.012 + 0.007,
          gravity: 0.07,
          type: Math.random() > 0.6 ? "heart" : "firework"
        });
      }
    };

    const addConfettiRain = () => {
      if (particles.length > 250) return;
      for (let i = 0; i < 3; i++) {
        particles.push({
          x: Math.random() * width,
          y: -15,
          vx: Math.random() * 2.2 - 1.1,
          vy: Math.random() * 3.5 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          radius: Math.random() * 3.5 + 2,
          alpha: 1,
          decay: Math.random() * 0.004 + 0.002,
          gravity: 0.025,
          type: "confetti",
          rotation: Math.random() * 360,
          rotationSpeed: Math.random() * 4 - 2
        });
      }
    };

    // Initial triggers
    addExplosion(width * 0.2, height * 0.35, 60);
    addExplosion(width * 0.8, height * 0.35, 60);
    addExplosion(width * 0.5, height * 0.2, 50);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Random continuous explosions
      if (Math.random() < 0.02) {
        addExplosion(Math.random() * width, Math.random() * (height * 0.6), Math.random() * 40 + 30);
      }

      addConfettiRain();

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.gravity) p.vy += p.gravity;
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.y > height || p.x < 0 || p.x > width) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        if (p.type === "heart") {
          ctx.translate(p.x, p.y);
          ctx.beginPath();
          const d = p.radius * 2;
          ctx.moveTo(0, d / 4);
          ctx.quadraticCurveTo(0, 0, d / 2, 0);
          ctx.quadraticCurveTo(d, 0, d, d / 2);
          ctx.quadraticCurveTo(d, (d * 3) / 4, (d * 3) / 4, d);
          ctx.lineTo(0, d * 1.45);
          ctx.lineTo(-(d * 3) / 4, d);
          ctx.quadraticCurveTo(-d, (d * 3) / 4, -d, d / 2);
          ctx.quadraticCurveTo(-d, 0, -d / 2, 0);
          ctx.quadraticCurveTo(0, 0, 0, d / 4);
          ctx.closePath();
          ctx.fill();
        } else if (p.type === "confetti") {
          ctx.translate(p.x, p.y);
          p.rotation = (p.rotation || 0) + (p.rotationSpeed || 0);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillRect(-p.radius, -p.radius, p.radius * 2, p.radius * 1.3);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, [triggerConfetti]);
}
