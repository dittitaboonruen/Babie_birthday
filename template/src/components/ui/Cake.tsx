"use client";

import { motion } from "motion/react";

export interface Decoration {
  id: string;
  emoji: string;
}

export type CandleState = "none" | "lit" | "out";

// Slot groups (in % of the cake box). Each chosen decoration fills one group.
const SLOT_GROUPS: { x: number; y: number }[][] = [
  [
    { x: 31, y: 32 },
    { x: 69, y: 32 },
  ],
  [
    { x: 35, y: 48 },
    { x: 50, y: 49 },
    { x: 65, y: 48 },
  ],
  [
    { x: 23, y: 75 },
    { x: 41, y: 77 },
    { x: 59, y: 77 },
    { x: 77, y: 75 },
  ],
];

/** Cute 2-tier birthday cake. Decorations & candle are layered as HTML so they stay tappable. */
export function Cake({
  decorations,
  candle,
  flameStrength = 1,
  onFlameTap,
  flameLabel,
}: {
  decorations: Decoration[];
  candle: CandleState;
  /** 1 = full flame, shrinks while blowing. */
  flameStrength?: number;
  onFlameTap?: () => void;
  flameLabel?: string;
}) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[280px]">
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-hidden>
        <ellipse cx="100" cy="180" rx="90" ry="11" fill="#fff" stroke="var(--lq-rose)" strokeWidth="3" />
        {/* bottom tier */}
        <rect x="28" y="110" width="144" height="66" rx="14" fill="var(--lq-pastel)" stroke="var(--lq-rose)" strokeWidth="3" />
        <path
          d="M30 122 Q30 110 44 110 H156 Q170 110 170 122 V128 Q162 140 154 128 Q146 144 136 128 Q126 138 116 128 Q106 146 96 128 Q86 138 76 128 Q66 144 56 128 Q46 138 38 128 Q34 134 30 128 Z"
          fill="#fff"
          stroke="var(--lq-rose)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="M28 160 H172" stroke="var(--lq-pink)" strokeWidth="4" strokeDasharray="2 8" strokeLinecap="round" />
        {/* top tier */}
        <rect x="52" y="72" width="96" height="44" rx="12" fill="#fff" stroke="var(--lq-rose)" strokeWidth="3" />
        <path
          d="M54 84 Q54 72 66 72 H134 Q146 72 146 84 V88 Q140 98 133 88 Q125 100 117 88 Q109 97 100 88 Q91 100 83 88 Q75 97 67 88 Q60 98 54 88 Z"
          fill="var(--lq-pink)"
          stroke="var(--lq-rose)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>

      {decorations.slice(0, 3).map((d, gi) =>
        SLOT_GROUPS[gi].map((s, si) => (
          <span
            key={`${d.id}-${si}`}
            aria-hidden
            className="absolute -translate-x-1/2 -translate-y-1/2 text-[22px] drop-shadow-sm"
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
          >
            <motion.span
              className="block"
              initial={{ scale: 0, y: -24 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 14, delay: si * 0.05 }}
            >
              {d.emoji}
            </motion.span>
          </span>
        )),
      )}

      {candle !== "none" && (
        <div className="absolute left-1/2 top-[13%] flex -translate-x-1/2 flex-col items-center" style={{ height: "24%" }}>
          <button
            type="button"
            onClick={onFlameTap}
            disabled={candle !== "lit" || !onFlameTap}
            aria-label={flameLabel}
            className="relative -mb-1 flex h-14 w-14 items-end justify-center rounded-full disabled:cursor-default"
          >
            {candle === "lit" ? (
              <span
                aria-hidden
                className="animate-flicker block h-7 w-5 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-gradient-to-t from-[#FF8A3D] via-[#FFC23D] to-[#FFF3B0] shadow-[0_0_18px_6px_rgba(255,200,80,0.55)] transition-all duration-200"
                style={{ transform: `scale(${0.35 + 0.65 * flameStrength})` }}
              />
            ) : (
              <span aria-hidden className="relative block h-7 w-5">
                <span className="absolute bottom-0 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-gray-300/70" style={{ animation: "lq-smoke 1.4s ease-out infinite" }} />
                <span className="absolute bottom-0 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-gray-300/60" style={{ animation: "lq-smoke 1.4s ease-out 0.5s infinite" }} />
              </span>
            )}
          </button>
          <span aria-hidden className="block w-[2px] h-2 bg-rose" />
          <span
            aria-hidden
            className="block w-4 flex-1 rounded-t-sm border-2 border-rose"
            style={{ background: "repeating-linear-gradient(45deg, #fff 0 5px, var(--lq-pink) 5px 10px)" }}
          />
        </div>
      )}
    </div>
  );
}
