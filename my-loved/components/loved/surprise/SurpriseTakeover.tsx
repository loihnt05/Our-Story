"use client";

import React, { useRef } from "react";
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
            
            {/* Memory Polaroids */}
            {state.showPolaroids && (
              <div className="hidden lg:block absolute inset-0 pointer-events-auto z-10 overflow-hidden select-none">
                {POLAROID_IMAGES.map((img, i) => {
                  const rotation = i === 0 ? -12 : i === 1 ? 12 : -8;
                  const top = i === 0 ? "15%" : i === 1 ? "15%" : "55%";
                  const left = i === 0 ? "10%" : i === 1 ? "80%" : "82%";
                  return (
                    <PolaroidCard
                      key={i}
                      url={img.url}
                      caption={img.caption}
                      date={img.date}
                      rotation={rotation}
                      top={top}
                      left={left}
                      delay={0.8 + i * 0.3}
                    />
                  );
                })}
              </div>
            )}

            {/* parchment letter content */}
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
        )}
      </AnimatePresence>

    </div>
  );
}
