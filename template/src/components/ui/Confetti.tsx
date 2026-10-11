"use client";

import { useMemo } from "react";

const COLORS = ["var(--lq-pink)", "var(--lq-cherry)", "var(--lq-pastel)", "#FFD36B", "#ffffff", "#9AD9C7"];

/** Lightweight CSS confetti burst. Remount (change `key`) to replay. */
export function Confetti({ pieces = 70 }: { pieces?: number }) {
  const items = useMemo(
    () =>
      Array.from({ length: pieces }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 2.2 + Math.random() * 1.8,
        dx: `${(Math.random() - 0.5) * 160}px`,
        rot: `${(Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 720)}deg`,
        w: 6 + Math.random() * 6,
        h: 8 + Math.random() * 10,
        color: COLORS[i % COLORS.length],
        round: i % 4 === 0,
      })),
    [pieces],
  );
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[60] overflow-hidden motion-reduce:hidden">
      {items.map((c) => (
        <span
          key={c.id}
          className="absolute top-0"
          style={
            {
              left: `${c.left}%`,
              width: c.w,
              height: c.round ? c.w : c.h,
              background: c.color,
              borderRadius: c.round ? "999px" : "2px",
              "--lq-dx": c.dx,
              "--lq-rot": c.rot,
              animation: `lq-confetti ${c.duration}s cubic-bezier(.2,.6,.4,1) ${c.delay}s forwards`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
