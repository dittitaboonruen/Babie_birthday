"use client";

import { useMemo } from "react";

/** Decorative hearts drifting up in the background (pure CSS). */
export function FloatingHearts({ count = 12, emojis = ["💗", "💕", "🩷", "✨", "🎀"] }: { count?: number; emojis?: string[] }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: (i * 97) % 100,
        delay: (i * 1.3) % 9,
        duration: 9 + ((i * 7) % 6),
        size: 14 + ((i * 5) % 16),
        emoji: emojis[i % emojis.length],
      })),
    [count, emojis],
  );
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      {items.map((h) => (
        <span
          key={h.id}
          className="absolute bottom-[-40px] opacity-0"
          style={{
            left: `${h.left}%`,
            fontSize: h.size,
            animation: `lq-float-up ${h.duration}s linear ${h.delay}s infinite`,
          }}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  );
}
