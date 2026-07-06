"use client";

import React, { useRef, useState, useEffect } from "react";
import { Volume2, VolumeX, X } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { POLAROID_IMAGES } from "./constants";
import { useSurpriseState } from "./useSurpriseState";
import { useSurpriseCanvas } from "./useSurpriseCanvas";
import PolaroidCard from "./PolaroidCard";
import Envelope3D from "./Envelope3D";
import LetterCard from "./LetterCard";

interface SurpriseTakeoverProps {
  loved: any;
  currentTheme: any;
  onClose: () => void;
  onNavigateToTab: (href: string) => void;
}

export default function SurpriseTakeover({ loved, currentTheme, onClose, onNavigateToTab }: SurpriseTakeoverProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Custom state & calculations hook
  const state = useSurpriseState(loved);

  // Custom high-performance canvas rendering loop hook
  useSurpriseCanvas(canvasRef, state.triggerConfetti);

  // Active hovered photo index (spotlight spotlight focus)
  const [hoveredPhotoIndex, setHoveredPhotoIndex] = useState<number | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleHoverStart = (index: number) => {
    // If another photo is already locked in focus, ignore hover events
    if (hoveredPhotoIndex !== null && hoveredPhotoIndex !== index) {
      return;
    }
    
    // Cancel any pending exit timeouts
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    
    setHoveredPhotoIndex(index);
  };

  const handleHoverEnd = (index: number) => {
    // Only handle exit if the leaving photo is the active one
    if (hoveredPhotoIndex !== index) {
      return;
    }
    
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    // Start hover-out delay (350ms) to allow forgiving cursor movements
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredPhotoIndex(null);
      hoverTimeoutRef.current = null;
    }, 350);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleCompleteSurprise = () => {
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
  };

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950 text-white select-none overflow-hidden flex flex-col items-center justify-center font-sans">
      
      {/* Canvas particle layers */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

      {/* Floating sparkles in the background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-30 z-0">
        <div className="absolute top-10 left-1/4 w-2 h-2 bg-yellow-300 rounded-full animate-ping" style={{ animationDuration: "3s" }} />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-pink-400 rounded-full animate-ping" style={{ animationDuration: "5s" }} />
        <div className="absolute bottom-20 left-10 w-2.5 h-2.5 bg-rose-400 rounded-full animate-ping" style={{ animationDuration: "4s" }} />
      </div>

      {/* Top Utility Controls */}
      <div className="absolute top-5 right-5 z-[120] flex items-center gap-3">
        <button
          onClick={state.toggleMute}
          className="p-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-colors cursor-pointer text-white flex items-center justify-center shadow-lg"
          title={state.isMuted ? "Unmute Audio" : "Mute Audio"}
        >
          {state.isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
        {state.envelopeState === "zoomed" && (
          <button
            onClick={handleCompleteSurprise}
            className="p-3.5 rounded-full bg-white/10 hover:bg-rose-500 hover:text-white border border-white/10 transition-colors cursor-pointer text-white flex items-center justify-center shadow-lg"
            title="Close Surprise"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 3D Envelope Viewport */}
      {state.envelopeState !== "zoomed" && (
        <Envelope3D
          envelopeState={state.envelopeState}
          milestoneTitle={state.milestoneTitle}
          handleOpenEnvelope={state.handleOpenEnvelope}
        />
      )}

      {/* Zoomed parchment card letter display */}
      <AnimatePresence>
        {state.envelopeState === "zoomed" && (
          <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-center p-4 md:p-12 z-30 bg-black/60 backdrop-blur-md select-text overflow-y-auto">
            
            {/* Anchor container to lock coordinate system relative to the LetterCard */}
            <div className="relative w-full max-w-xl flex items-center justify-center min-h-[500px]">
              
              {/* Memory Polaroids fanned out around the central letter */}
              {state.showPolaroids && (
                <div className="hidden sm:block absolute inset-0 pointer-events-none z-10 overflow-visible select-none">
                  {POLAROID_IMAGES.map((img, i) => {
                    const configs = [
                      { targetX: -290, targetY: -110, rotation: -8, depthFactor: 0.8, zIndex: 15 },  // Left Side (Upper)
                      { targetX: 290, targetY: -120, rotation: 8, depthFactor: 0.6, zIndex: 14 },   // Right Side (Upper)
                      { targetX: -280, targetY: 120, rotation: -6, depthFactor: 0.7, zIndex: 13 },   // Left Side (Lower)
                      { targetX: 280, targetY: 110, rotation: 10, depthFactor: 0.9, zIndex: 16 },   // Right Side (Lower)
                      { targetX: 0, targetY: -285, rotation: -3, depthFactor: 0.5, zIndex: 12 }    // Top Center peeking
                    ];
                    const config = configs[i % configs.length];
                    return (
                      <PolaroidCard
                        key={i}
                        url={img.url}
                        caption={img.caption}
                        date={img.date}
                        location={img.location}
                        milestone={img.milestone}
                        daysTogether={img.daysTogether}
                        note={img.note}
                        targetX={config.targetX}
                        targetY={config.targetY}
                        rotation={config.rotation}
                        depthFactor={config.depthFactor}
                        zIndex={config.zIndex}
                        delay={0.6 + i * 0.15}
                        isAnyHovered={hoveredPhotoIndex !== null}
                        isMeHovered={hoveredPhotoIndex === i}
                        onHoverStart={() => handleHoverStart(i)}
                        onHoverEnd={() => handleHoverEnd(i)}
                      />
                    );
                  })}
                </div>
              )}

              {/* parchment letter content (fades away completely to spotlight centered hovered photo) */}
              <div className={`w-full transition-all duration-500 ease-out ${hoveredPhotoIndex !== null ? "opacity-0 blur-[6px] scale-[0.95] pointer-events-none" : "opacity-100 scale-100 z-20"}`}>
                <LetterCard
                  activeLetterTab={state.activeLetterTab}
                  setActiveLetterTab={state.setActiveLetterTab}
                  milestoneTitle={state.milestoneTitle}
                  daysTogether={state.daysTogether}
                  monthsTogether={state.monthsTogether}
                  yearsTogether={state.yearsTogether}
                  typedMessage={state.typedMessage}
                  savedNote={state.savedNote}
                  noteContent={state.noteContent}
                  setNoteContent={state.setNoteContent}
                  handleSaveNote={state.handleSaveNote}
                  handleCompleteSurprise={handleCompleteSurprise}
                />
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
