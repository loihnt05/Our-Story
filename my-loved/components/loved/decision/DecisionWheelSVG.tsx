import React from "react";
import { Heart } from "lucide-react";
import { DecisionOption } from "./types";
import { WHEEL_COLORS } from "./constants";

interface DecisionWheelSVGProps {
  items: DecisionOption[];
  rotation: number;
  wheelRef: React.RefObject<SVGSVGElement | null>;
  isSpinning: boolean;
  handleSpin: () => void;
}

export default function DecisionWheelSVG({
  items,
  rotation,
  wheelRef,
  isSpinning,
  handleSpin,
}: DecisionWheelSVGProps) {
  // SVG geometry constants
  const viewBoxSize = 300;
  const radius = 138;
  const cx = viewBoxSize / 2;
  const cy = viewBoxSize / 2;
  const sliceAngle = 360 / Math.max(1, items.length);

  return (
    <div className="relative w-full max-w-[320px] aspect-square flex items-center justify-center">
      {/* Top Pointer Indicator */}
      <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 z-30 pointer-events-none drop-shadow-md">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 21L3 6C3 6 8.5 7 12 7C15.5 7 21 6 21 6L12 21Z" fill="#e11d48" stroke="#ffffff" strokeWidth="2" />
          <circle cx="12" cy="5" r="3" fill="#fda4af" />
        </svg>
      </div>

      {/* Glowing Ring around wheel */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-500/20 to-pink-500/20 blur-md scale-[1.03] animate-pulse pointer-events-none" />

      {/* SVG Wheel element */}
      <svg
        ref={wheelRef}
        width="300"
        height="300"
        viewBox="0 0 300 300"
        className="w-full h-full filter drop-shadow-xl z-10 transition-transform duration-75 select-none"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <defs>
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.15" />
          </filter>
        </defs>
        
        {/* Slices drawing */}
        <g filter="url(#shadow)">
          {items.map((item, idx) => {
            const startAngleDeg = idx * sliceAngle;
            const endAngleDeg = (idx + 1) * sliceAngle;
            const startAngleRad = (startAngleDeg * Math.PI) / 180;
            const endAngleRad = (endAngleDeg * Math.PI) / 180;

            // Slice path drawing coordinates
            const x1 = cx + radius * Math.cos(startAngleRad);
            const y1 = cy + radius * Math.sin(startAngleRad);
            const x2 = cx + radius * Math.cos(endAngleRad);
            const y2 = cy + radius * Math.sin(endAngleRad);

            // Flag for angle > 180 degrees
            const largeArcFlag = sliceAngle > 180 ? 1 : 0;

            // SVG Arc command
            const dPath = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

            // Bisector angle for placing labels pointing outward
            const bisectorAngleDeg = startAngleDeg + sliceAngle / 2;

            return (
              <g key={idx}>
                <path
                  d={dPath}
                  fill={WHEEL_COLORS[idx % WHEEL_COLORS.length]}
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="dark:stroke-zinc-900 transition-colors"
                />
                
                {/* Segment text group */}
                <g transform={`translate(${cx}, ${cy}) rotate(${bisectorAngleDeg})`}>
                  <text
                    x="55"
                    y="4"
                    textAnchor="start"
                    className="text-[10px] font-extrabold font-sans fill-zinc-800 select-none tracking-wide"
                  >
                    {item.emoji} {item.text.length > 13 ? item.text.substring(0, 11) + "..." : item.text}
                  </text>
                </g>
              </g>
            );
          })}
        </g>

        {/* Outside border circle */}
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#f43f5e" strokeWidth="4" />
        <circle cx={cx} cy={cy} r={radius + 4} fill="none" stroke="rgba(244, 63, 94, 0.2)" strokeWidth="4" />
      </svg>

      {/* Static Spin Button in Center */}
      <button
        onClick={handleSpin}
        disabled={isSpinning}
        className="absolute w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 border-4 border-white dark:border-zinc-900 shadow-xl hover:scale-105 active:scale-95 transition-all z-20 flex flex-col items-center justify-center cursor-pointer group disabled:cursor-not-allowed"
        title="Click to Spin"
      >
        <Heart className={`w-6 h-6 text-white fill-white ${isSpinning ? "animate-pulse" : "group-hover:animate-bounce"}`} />
        <span className="text-[8px] font-extrabold text-white tracking-wider leading-none uppercase mt-0.5">
          {isSpinning ? "SPINNING" : "SPIN"}
        </span>
      </button>
    </div>
  );
}
