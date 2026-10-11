"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { useGame } from "@/components/GameProvider";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { RewardModal } from "@/components/ui/RewardModal";
import { TopBar } from "@/components/ui/TopBar";

const GOAL = 10;
const MAX_ON_SCREEN = 7;
const HEART_EMOJIS = ["💗", "💖", "💕", "❤️", "💘", "🩷"];

interface FallingHeart {
  id: number;
  x: number; // % from left
  y: number; // % from top (reduced-motion mode only)
  duration: number; // seconds
  size: number; // px
  emoji: string;
  caught: boolean;
}

export function CatchHeartsScreen() {
  const { lang, go, sfx, completeQuest, data } = useGame();
  const reduceMotion = useReducedMotion();
  const [hearts, setHearts] = useState<FallingHeart[]>([]);
  const [count, setCount] = useState(0);
  const [won, setWon] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [newlyUnlocked, setNewlyUnlocked] = useState(false);
  const [round, setRound] = useState(0);
  const caughtRef = useRef<Set<number>>(new Set());
  const nextId = useRef(0);
  const areaRef = useRef<HTMLDivElement>(null);
  const [fallDistance, setFallDistance] = useState(700);

  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    const measure = () => setFallDistance(el.clientHeight + 90);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const remove = useCallback((id: number) => setHearts((hs) => hs.filter((h) => h.id !== id)), []);

  // Spawner
  useEffect(() => {
    if (won) return;
    const spawn = () => {
      const id = nextId.current++;
      const heart: FallingHeart = {
        id,
        x: 8 + Math.random() * 76,
        y: 8 + Math.random() * 72,
        duration: 4.2 + Math.random() * 2.4,
        size: 46 + Math.random() * 16,
        emoji: HEART_EMOJIS[id % HEART_EMOJIS.length],
        caught: false,
      };
      setHearts((hs) => (hs.filter((h) => !h.caught).length >= MAX_ON_SCREEN ? hs : [...hs, heart]));
      // Reduced motion: hearts appear in place and fade away after a while instead of falling.
      if (reduceMotion) window.setTimeout(() => remove(id), 3200);
    };
    spawn();
    const timer = window.setInterval(spawn, reduceMotion ? 1100 : 650);
    return () => window.clearInterval(timer);
  }, [won, reduceMotion, round, remove]);

  const catchHeart = (id: number) => {
    if (won || caughtRef.current.has(id)) return; // prevents double scoring (pointerdown + click, multi-touch)
    caughtRef.current.add(id);
    const newCount = Math.min(GOAL, caughtRef.current.size);
    setCount(newCount);
    setHearts((hs) => hs.map((h) => (h.id === id ? { ...h, caught: true } : h)));
    window.setTimeout(() => remove(id), 380);
    sfx("pop");
    if (newCount >= GOAL) {
      setWon(true);
      setNewlyUnlocked(completeQuest(1));
      window.setTimeout(() => {
        sfx("win");
        setShowReward(true);
      }, 450);
    }
  };

  const playAgain = () => {
    caughtRef.current = new Set();
    setHearts([]);
    setCount(0);
    setWon(false);
    setShowReward(false);
    setRound((r) => r + 1);
  };

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <TopBar onBack={() => go("memories")} current={1} />
      <div className="px-5 text-center">
        <h1 className="text-2xl font-bold text-cherry">💕 {t("q1Title", lang)}</h1>
        <p className="text-sm text-rose/75">{t("q1Hint", lang)}</p>
      </div>

      {/* Counter */}
      <div className="mx-5 mt-3 flex items-center gap-3 rounded-2xl border-2 border-rose bg-white px-4 py-2 pixel-shadow">
        <span className="font-pixel text-sm text-cherry" aria-live="polite" aria-label={`${count} / ${GOAL}`}>
          {count}/{GOAL}
        </span>
        <div className="h-4 flex-1 overflow-hidden rounded-full border-2 border-rose bg-cream" aria-hidden>
          <div
            className="h-full rounded-full bg-gradient-to-r from-pink to-cherry transition-[width] duration-300"
            style={{ width: `${(count / GOAL) * 100}%` }}
          />
        </div>
        <span aria-hidden>💖</span>
      </div>

      {/* Play area */}
      <div
        ref={areaRef}
        className="relative mx-3 mt-3 mb-3 flex-1 touch-manipulation select-none overflow-hidden rounded-3xl border-2 border-dashed border-pink/60 bg-white/50"
      >
        {hearts.map((h) =>
          reduceMotion ? (
            <button
              key={h.id}
              type="button"
              aria-label="heart"
              className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
              style={{ left: `${h.x}%`, top: `${h.y}%`, width: h.size + 16, height: h.size + 16, fontSize: h.size }}
              onPointerDown={() => catchHeart(h.id)}
              onClick={() => catchHeart(h.id)}
            >
              <HeartGlyph heart={h} />
            </button>
          ) : (
            <button
              key={h.id}
              type="button"
              aria-label="heart"
              tabIndex={-1}
              className="absolute top-0 flex items-center justify-center"
              style={
                {
                  left: `calc(${h.x}% - ${(h.size + 16) / 2}px)`,
                  width: h.size + 16,
                  height: h.size + 16,
                  fontSize: h.size,
                  "--lq-fall-distance": `${fallDistance}px`,
                  "--lq-duration": `${h.duration}s`,
                  animation: `lq-fall ${h.duration}s linear forwards`,
                } as React.CSSProperties
              }
              onAnimationEnd={(e) => {
                if (e.animationName === "lq-fall") remove(h.id);
              }}
              onPointerDown={() => catchHeart(h.id)}
              onClick={() => catchHeart(h.id)}
            >
              <HeartGlyph heart={h} />
            </button>
          ),
        )}

        {won && !showReward && (
          <div className="absolute inset-0 flex items-center justify-center text-7xl" aria-hidden>
            💖
          </div>
        )}
      </div>

      {data.quests[1] && !showReward && (
        <div className="px-5 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Button variant="secondary" className="w-full" onClick={() => go("quest2")}>
            {t("skipToNext", lang)} →
          </Button>
        </div>
      )}

      <RewardModal
        open={showReward}
        quest={1}
        newlyUnlocked={newlyUnlocked}
        nextLabel={`${t("nextQuest", lang)} 🧩`}
        onNext={() => go("quest2")}
        onPlayAgain={playAgain}
      />
    </div>
  );
}

function HeartGlyph({ heart }: { heart: FallingHeart }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none block drop-shadow-[0_3px_0_rgba(143,23,52,0.25)] transition-all duration-300"
      style={heart.caught ? { transform: "scale(1.7)", opacity: 0 } : undefined}
    >
      {heart.emoji}
    </span>
  );
}
