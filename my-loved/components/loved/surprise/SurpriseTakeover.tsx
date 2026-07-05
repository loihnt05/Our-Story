"use client";

import React, { useState, useEffect, useRef } from "react";
import { Heart, Sparkles, Trophy, Calendar, Mail, BookOpen, Camera, Check } from "lucide-react";

interface SurpriseTakeoverProps {
  loved: any;
  currentTheme: any;
  onClose: () => void;
  onNavigateToTab: (href: string) => void;
}

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

// Simple CountUp helper component
const CountUp = ({ to, duration = 1800, suffix = "" }: { to: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = to;
    if (start === end) {
      setCount(end);
      return;
    }

    const totalSteps = Math.min(60, Math.floor(duration / 30));
    const stepValue = (end - start) / totalSteps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setCount(Math.floor(start + stepValue * currentStep));
      if (currentStep >= totalSteps) {
        setCount(end);
        clearInterval(timer);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [to, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
};

export default function SurpriseTakeover({ loved, currentTheme, onClose, onNavigateToTab }: SurpriseTakeoverProps) {
  // Experience phases: 'idle' -> 'countdown' -> 'explosion' -> 'card' -> 'replay' -> 'stats' -> 'climax'
  const [phase, setPhase] = useState<"intro" | "countdown" | "explosion" | "card" | "replay" | "stats" | "climax">("intro");
  const [countdown, setCountdown] = useState(3);
  const [typedText, setTypedText] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const synthStartedRef = useRef(false);

  // Calculated duration info
  const [daysTogether, setDaysTogether] = useState(550);
  const [yearsTogether, setYearsTogether] = useState(1);
  const [monthsTogether, setMonthsTogether] = useState(6);

  useEffect(() => {
    // Calculate actual days together
    const anni = localStorage.getItem("loved_anniversaryDate") || "2025-01-01";
    try {
      const start = new Date(anni);
      const now = new Date();
      const diff = now.getTime() - start.getTime();
      const days = Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)));
      setDaysTogether(days);

      const years = Math.floor(days / 365);
      const months = Math.floor((days % 365) / 30);
      setYearsTogether(years);
      setMonthsTogether(months);
    } catch {
      // Fallbacks
    }
  }, []);

  // Audio trigger
  const handleStartExperience = () => {
    setPhase("countdown");
    if (loved.synthRef?.current && !synthStartedRef.current) {
      loved.synthRef.current.start();
      synthStartedRef.current = true;
    }
  };

  // Countdown timer ticks
  useEffect(() => {
    if (phase !== "countdown") return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1100);
      return () => clearTimeout(timer);
    } else {
      setPhase("explosion");
    }
  }, [countdown, phase]);

  // Transition from explosion to card reveal
  useEffect(() => {
    if (phase !== "explosion") return;
    const timer = setTimeout(() => {
      setPhase("card");
    }, 2800);
    return () => clearTimeout(timer);
  }, [phase]);

  // Typewriter effect inside invitation card
  useEffect(() => {
    if (phase !== "card") return;
    
    const message = `From the very first spark between ${loved.personAName} and ${loved.personBName}, every shared laugh, cozy Sunday, late-night call, and coffee date has built a bond of deep understanding. Together, you have created a sanctuary of comfort and joy. Happy Anniversary! 🌸💖`;
    
    let idx = 0;
    setTypedText("");
    const timer = setInterval(() => {
      setTypedText(prev => prev + message.charAt(idx));
      idx++;
      if (idx >= message.length) {
        clearInterval(timer);
      }
    }, 25);

    return () => clearInterval(timer);
  }, [phase, loved.personAName, loved.personBName]);

  // Canvas particle effects loop for explosions and climax
  useEffect(() => {
    if (phase !== "explosion" && phase !== "climax" && phase !== "card") return;
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

    const addExplosion = (cx: number, cy: number, count = 80) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 3;
        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (Math.random() * 2),
          color: colors[Math.floor(Math.random() * colors.length)],
          radius: Math.random() * 4 + 1.5,
          alpha: 1,
          decay: Math.random() * 0.015 + 0.008,
          gravity: 0.06,
          type: Math.random() > 0.65 ? "heart" : "firework"
        });
      }
    };

    const addConfettiRain = () => {
      if (particles.length > 300) return;
      for (let i = 0; i < 4; i++) {
        particles.push({
          x: Math.random() * width,
          y: -10,
          vx: Math.random() * 2 - 1,
          vy: Math.random() * 3 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          radius: Math.random() * 4 + 2,
          alpha: 1,
          decay: Math.random() * 0.005 + 0.002,
          gravity: 0.02,
          type: "confetti",
          rotation: Math.random() * 360,
          rotationSpeed: Math.random() * 4 - 2
        });
      }
    };

    // Initial countdown zero blast
    if (phase === "explosion") {
      addExplosion(width / 2, height / 2, 180);
      addExplosion(width * 0.25, height * 0.4, 80);
      addExplosion(width * 0.75, height * 0.4, 80);
    }

    // Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Aurora background glow lines
      if (phase === "climax" || phase === "card") {
        const time = Date.now() * 0.0005;
        const grad = ctx.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, width);
        
        // Dynamic aurora shifts
        const rGlow = Math.floor(Math.sin(time) * 30 + 50);
        const bGlow = Math.floor(Math.cos(time) * 40 + 60);
        grad.addColorStop(0, `rgba(${rGlow}, 12, ${bGlow}, 0.3)`);
        grad.addColorStop(0.5, "rgba(15, 23, 42, 0.5)");
        grad.addColorStop(1, "rgba(9, 9, 11, 0.95)");

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
        
        // Random continuous fireworks in climax
        if (phase === "climax" && Math.random() < 0.035) {
          addExplosion(Math.random() * width, Math.random() * (height * 0.7), Math.random() * 50 + 40);
        }
      }

      addConfettiRain();

      // Update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.gravity) p.vy += p.gravity;
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.y > height) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        if (p.type === "heart") {
          // Draw heart
          ctx.translate(p.x, p.y);
          ctx.beginPath();
          const d = p.radius * 2;
          ctx.moveTo(0, d / 4);
          ctx.quadraticCurveTo(0, 0, d / 2, 0);
          ctx.quadraticCurveTo(d, 0, d, d / 2);
          ctx.quadraticCurveTo(d, (d * 3) / 4, (d * 3) / 4, d);
          ctx.lineTo(0, d * 1.4);
          ctx.lineTo(-(d * 3) / 4, d);
          ctx.quadraticCurveTo(-d, (d * 3) / 4, -d, d / 2);
          ctx.quadraticCurveTo(-d, 0, -d / 2, 0);
          ctx.quadraticCurveTo(0, 0, 0, d / 4);
          ctx.closePath();
          ctx.fill();
        } else if (p.type === "confetti") {
          // Rotated squares
          ctx.translate(p.x, p.y);
          p.rotation = (p.rotation || 0) + (p.rotationSpeed || 0);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillRect(-p.radius, -p.radius, p.radius * 2, p.radius * 1.2);
        } else {
          // Standard star/glow particle
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
  }, [phase]);

  // Dynamic timelines cards definition
  const replayTimeline = [
    { title: "First Meeting 🌸", date: "Nov 15, 2024", desc: "The magical moment our eyes first locked and our story began." },
    { title: "First Date ☕", date: "Dec 5, 2024", desc: "Coffee, warm whispers, and talking about everything for 4 hours." },
    { title: "Officially Together 💕", date: "Jan 1, 2025", desc: "Holding hands and resolving to share all of life's chapters." },
    { title: "First Trip Together ✈️", date: "May 18, 2025", desc: "Sunset beach walks, exploring seaside towns, and polaroid capsules." }
  ];

  // Save completion state
  const handleCompleteSurprise = (nextTab?: string) => {
    // Save current milestone as viewed
    if (typeof window !== "undefined") {
      const currentMilestone = localStorage.getItem("loved_current_surprise_milestone");
      if (currentMilestone) {
        const viewedMilestonesStr = localStorage.getItem("loved_surprise_milestones_viewed") || "[]";
        try {
          const viewedMilestones = JSON.parse(viewedMilestonesStr);
          if (!viewedMilestones.includes(currentMilestone)) {
            viewedMilestones.push(currentMilestone);
            localStorage.setItem("loved_surprise_milestones_viewed", JSON.stringify(viewedMilestones));
          }
        } catch (e) {
          localStorage.setItem("loved_surprise_milestones_viewed", JSON.stringify([currentMilestone]));
        }
        localStorage.removeItem("loved_current_surprise_milestone");
      }
    }
    localStorage.setItem("loved_anniversary_surprise_viewed", "true");
    onClose();
    if (nextTab) {
      onNavigateToTab(nextTab);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950 text-white select-none overflow-hidden flex flex-col items-center justify-center font-sans">
      
      {/* Intro Entrance Screen (Hydration and play-permission unlocker) */}
      {phase === "intro" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-[radial-gradient(circle_at_center,rgba(88,28,135,0.15),rgba(15,23,42,1))] z-20 text-center animate-fade-in gap-6">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-rose-500/20 blur-2xl animate-ping" />
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center border-4 border-rose-350 shadow-2xl relative">
              <span className="text-4xl animate-bounce">🎁</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight font-serif bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300">
              A Surprise Awaits
            </h1>
            <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
              We have compiled a cinematic anniversary treasure for {loved.personAName} &amp; {loved.personBName}. Click below to unlock.
            </p>
          </div>
          <button 
            onClick={handleStartExperience}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:brightness-105 text-white font-bold text-sm shadow-[0_0_25px_rgba(244,63,94,0.4)] transition-all hover:scale-105 cursor-pointer border-none"
          >
            Unlock Memory Box 💖
          </button>
        </div>
      )}

      {/* Particle Canvas Layer */}
      {(phase === "explosion" || phase === "card" || phase === "climax") && (
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />
      )}

      {/* 2. Countdown ticks */}
      {phase === "countdown" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20 gap-4 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-500/80 animate-pulse">
            A special memory is waiting for you...
          </span>
          <div 
            key={countdown} 
            className="text-8xl font-black font-serif text-transparent bg-clip-text bg-gradient-to-tr from-rose-400 to-amber-350 animate-scale-up drop-shadow-[0_0_30px_rgba(251,113,133,0.3)] select-none"
          >
            {countdown === 0 ? "🌸" : countdown}
          </div>
        </div>
      )}

      {/* 4. Glassmorphism invitation card */}
      {phase === "card" && (
        <div className="absolute inset-0 flex items-center justify-center p-6 bg-black/30 z-20 select-text">
          <div className="w-full max-w-lg p-8 sm:p-10 rounded-[36px] bg-white/5 border border-white/10 shadow-[0_0_50px_rgba(244,63,94,0.15)] backdrop-blur-xl animate-scale-up text-center flex flex-col items-center gap-6 relative hover:rotate-[0.5deg] hover:scale-[1.01] transition-all duration-300 group">
            
            {/* Top decorative seal */}
            <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 shadow-inner group-hover:scale-110 transition-transform">
              <Heart className="w-8 h-8 fill-current animate-pulse text-rose-500" />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Congratulations</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-serif tracking-tight drop-shadow-md">
                Happy Anniversary ❤️
              </h2>
              <span 
                className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-300 font-serif mt-1 block"
                style={{ fontFamily: "var(--font-molle)" }}
              >
                {daysTogether} Days Together
              </span>
              <span className="text-xs text-zinc-450 uppercase tracking-widest block font-medium">
                ({yearsTogether > 0 ? `${yearsTogether} Year${yearsTogether > 1 ? "s" : ""}, ` : ""}{monthsTogether} Month{monthsTogether !== 1 ? "s" : ""} of Devotion)
              </span>
            </div>

            {/* Typewriter love message */}
            <div className="w-full p-4.5 rounded-2xl bg-black/30 border border-white/5 font-serif text-sm leading-relaxed text-zinc-300 select-text h-40 overflow-y-auto scrollbar-hide text-center flex items-center justify-center italic">
              <p className="max-w-md">
                {typedText}
                <span className="animate-pulse font-sans font-bold text-rose-500">|</span>
              </p>
            </div>

            {/* Action controls */}
            <button 
              onClick={() => setPhase("replay")}
              className="mt-2 w-full py-3.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer border-none"
            >
              Unfold Relationship Replay 📖
            </button>
          </div>
        </div>
      )}

      {/* 6. Relationship Replay timeline cards */}
      {phase === "replay" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_center,rgba(88,28,135,0.15),rgba(15,23,42,1))] z-20 overflow-y-auto scrollbar-hide">
          <div className="w-full max-w-2xl flex flex-col gap-8 text-center py-8">
            <div>
              <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Our Love Story</span>
              <h2 className="text-3xl font-extrabold text-white font-serif mt-1">Journey Replay</h2>
              <p className="text-xs text-zinc-400 mt-1">Glowing highlights of our shared memories and milestones.</p>
            </div>

            {/* Timeline connectors */}
            <div className="relative border-l-2 border-dashed border-rose-500/20 ml-4 md:ml-1/2 pl-8 md:pl-0 flex flex-col gap-8">
              {replayTimeline.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`flex flex-col md:flex-row items-center gap-6 relative w-full text-left md:odd:flex-row-reverse animate-scale-up`}
                  style={{ animationDelay: `${idx * 0.4}s`, animationFillMode: "both" }}
                >
                  {/* Central timeline bullet */}
                  <div className="absolute -left-12 md:left-1/2 md:-ml-4 top-4 w-8 h-8 rounded-full bg-rose-550 border-4 border-zinc-950 flex items-center justify-center text-[10px] z-10 select-none shadow-md">
                    💖
                  </div>

                  {/* Journey Content Box */}
                  <div className="w-full md:w-[calc(50%-24px)] p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-md hover:border-rose-500/20 hover:scale-[1.01] transition-all">
                    <div className="flex justify-between items-center select-none">
                      <h4 className="text-xs font-bold text-white">{item.title}</h4>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                        {item.date}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed font-medium">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setPhase("stats")}
              className="mt-6 mx-auto px-8 py-3.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md transition-all hover:scale-102 cursor-pointer border-none"
            >
              Reveal Statistics ✨
            </button>
          </div>
        </div>
      )}

      {/* 7. Dynamic stats count-up */}
      {phase === "stats" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_center,rgba(88,28,135,0.15),rgba(15,23,42,1))] z-20 overflow-y-auto scrollbar-hide">
          <div className="w-full max-w-3xl flex flex-col gap-8 text-center py-8">
            <div>
              <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Dynamic Statistics</span>
              <h2 className="text-3xl font-extrabold text-white font-serif mt-1">Our Journey in Numbers</h2>
              <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto leading-normal">
                Every polaroid captured, letter written, and journal page logged.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full items-stretch">
              {[
                { label: "Days Together", toValue: daysTogether, icon: Heart, color: "text-rose-500", suffix: " days" },
                { label: "Photos Captured", toValue: 1842, icon: Camera, color: "text-indigo-500", suffix: " pics" },
                { label: "Letters Written", toValue: 56, icon: Mail, color: "text-pink-500", suffix: " notes" },
                { label: "Journal Entries", toValue: 152, icon: BookOpen, color: "text-teal-500", suffix: " logs" },
                { label: "Songs Shared", toValue: 28, icon: Sparkles, color: "text-amber-500", suffix: " beats" },
                { label: "Memories Created", toValue: 412, icon: Trophy, color: "text-purple-500", suffix: " caps" }
              ].map((stat, idx) => (
                <div 
                  key={idx} 
                  className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col justify-between hover:scale-102 transition-all animate-scale-up text-center"
                  style={{ animationDelay: `${idx * 0.15}s`, animationFillMode: "both" }}
                >
                  <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center mx-auto text-zinc-300">
                    <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} />
                  </div>
                  <div className="mt-4">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest select-none">{stat.label}</span>
                    <h4 
                      className="text-2xl font-black mt-1 text-white font-serif block" 
                      style={{ fontFamily: "var(--font-molle)" }}
                    >
                      <CountUp to={stat.toValue} suffix={stat.suffix} />
                    </h4>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setPhase("climax")}
              className="mt-6 mx-auto px-8 py-3.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md transition-all hover:scale-102 cursor-pointer border-none"
            >
              Enter Climax Climax 🌟
            </button>
          </div>
        </div>
      )}

      {/* 8 & 10. Climax & Closing details */}
      {phase === "climax" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-black/30 z-20 text-center animate-fade-in">
          <div className="w-full max-w-md p-8 rounded-[36px] bg-white/5 border border-white/10 shadow-[0_0_50px_rgba(244,63,94,0.2)] backdrop-blur-xl animate-scale-up flex flex-col items-center gap-6">
            
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-rose-500/20 blur-xl animate-ping" />
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center border-2 border-rose-350 shadow-md">
                <Heart className="w-8 h-8 text-white fill-current animate-bounce" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-serif text-white">Our Journey Synchronized 🔒</h2>
              <p className="text-xs text-zinc-400 max-w-xs leading-normal mx-auto font-medium">
                Surprise unlocked by Romeo &amp; Juliet. The event viewed status has been recorded.
              </p>
              <h3 className="text-xs font-bold text-rose-450 uppercase tracking-widest mt-1">
                Thank you for being part of this beautiful journey.
              </h3>
            </div>

            {/* Action closing buttons */}
            <div className="flex flex-col gap-3.5 w-full mt-2">
              <button 
                onClick={() => handleCompleteSurprise("/timeline")}
                className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-full shadow-md transition-all hover:scale-[1.02] cursor-pointer border-none"
              >
                Open Memory Book 📸
              </button>
              <button 
                onClick={() => handleCompleteSurprise("/timeline")}
                className="w-full py-3 bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold text-xs rounded-full transition-all hover:scale-[1.02] cursor-pointer"
              >
                View Anniversary Timeline
              </button>
              <button 
                onClick={() => handleCompleteSurprise()}
                className="w-full py-3 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 font-bold text-xs rounded-full transition-all hover:scale-[1.02] cursor-pointer border-none animate-pulse"
              >
                Continue Together
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
