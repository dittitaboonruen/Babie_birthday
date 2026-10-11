"use client";

import { useEffect, useRef, useState } from "react";
import { useGame } from "@/components/GameProvider";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { RewardModal } from "@/components/ui/RewardModal";
import { TopBar } from "@/components/ui/TopBar";

const KINDS = [
  { kind: "bear", emoji: "🧸", label: { th: "หมี", en: "Teddy bear" } },
  { kind: "heart", emoji: "💖", label: { th: "หัวใจ", en: "Heart" } },
  { kind: "cherry", emoji: "🍒", label: { th: "เชอร์รี", en: "Cherry" } },
] as const;

interface Card {
  uid: number;
  kind: (typeof KINDS)[number]["kind"];
  matched: boolean;
}

function shuffledDeck(): Card[] {
  const deck: Card[] = KINDS.flatMap((k, i) => [
    { uid: i * 2, kind: k.kind, matched: false },
    { uid: i * 2 + 1, kind: k.kind, matched: false },
  ]);
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export function LoveMatchScreen() {
  const { lang, go, sfx, completeQuest, data } = useGame();
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const lockRef = useRef(false);
  const flippedRef = useRef<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [newlyUnlocked, setNewlyUnlocked] = useState(false);
  const timers = useRef<number[]>([]);

  const newGame = () => {
    timers.current.forEach((tm) => window.clearTimeout(tm));
    timers.current = [];
    lockRef.current = false;
    flippedRef.current = [];
    setFlipped([]);
    setMoves(0);
    setShowReward(false);
    setCards(shuffledDeck());
  };

  // Shuffle on the client only (avoids hydration mismatch); new layout every fresh game.
  useEffect(() => {
    setCards(shuffledDeck());
    const pending = timers.current;
    return () => pending.forEach((tm) => window.clearTimeout(tm));
  }, []);

  const pairs = cards.filter((c) => c.matched).length / 2;

  const flip = (index: number) => {
    const card = cards[index];
    // Guard against double taps, flipping a 3rd card, or re-flipping.
    if (!card || lockRef.current || card.matched || flippedRef.current.includes(index)) return;
    sfx("flip");
    const nextFlipped = [...flippedRef.current, index];
    flippedRef.current = nextFlipped;
    setFlipped(nextFlipped);
    if (nextFlipped.length < 2) return;

    lockRef.current = true;
    setMoves((m) => m + 1);
    const [a, b] = nextFlipped;
    const isMatch = cards[a].kind === cards[b].kind;
    timers.current.push(
      window.setTimeout(
        () => {
          if (isMatch) {
            const updated = cards.map((c, i) => (i === a || i === b ? { ...c, matched: true } : c));
            setCards(updated);
            sfx("match");
            if (updated.every((c) => c.matched)) {
              setNewlyUnlocked(completeQuest(2));
              timers.current.push(
                window.setTimeout(() => {
                  sfx("win");
                  setShowReward(true);
                }, 500),
              );
            }
          } else {
            sfx("miss");
          }
          flippedRef.current = [];
          setFlipped([]);
          lockRef.current = false;
        },
        isMatch ? 450 : 850,
      ),
    );
  };

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <TopBar onBack={() => go("quest1")} current={2} />
      <div className="px-5 text-center">
        <h1 className="text-2xl font-bold text-cherry">🧩 {t("q2Title", lang)}</h1>
        <p className="text-sm text-rose/75">{t("q2Hint", lang)}</p>
      </div>

      <div className="mx-5 mt-3 flex items-center justify-between rounded-2xl border-2 border-rose bg-white px-4 py-2 pixel-shadow">
        <span className="text-sm font-bold" aria-live="polite">
          {t("q2Pairs", lang)}: <span className="font-pixel text-xs text-cherry">{pairs}/3</span>
        </span>
        <span className="flex gap-1" aria-hidden>
          {KINDS.map((k) => (
            <span key={k.kind} className={cards.some((c) => c.kind === k.kind && c.matched) ? "" : "opacity-30 grayscale"}>
              {k.emoji}
            </span>
          ))}
        </span>
        <span className="font-pixel text-[9px] text-rose/60">♡ {moves}</span>
      </div>

      <div className="flex flex-1 items-center justify-center px-5 py-4">
        <div className="grid w-full max-w-[340px] grid-cols-3 gap-3">
          {cards.map((card, i) => {
            const faceUp = card.matched || flipped.includes(i);
            const kind = KINDS.find((k) => k.kind === card.kind)!;
            return (
              <div key={card.uid} className="flip-scene aspect-[3/4]">
                <button
                  type="button"
                  onClick={() => flip(i)}
                  aria-label={faceUp ? kind.label[lang] : `${i + 1}`}
                  aria-pressed={faceUp}
                  className={`flip-card relative h-full w-full ${faceUp ? "is-flipped" : ""}`}
                >
                  {/* back of card (face down) */}
                  <span className="flip-face absolute inset-0 flex items-center justify-center rounded-2xl border-2 border-rose bg-gradient-to-br from-pink to-cherry pixel-shadow">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/25 text-2xl" aria-hidden>
                      ♡
                    </span>
                  </span>
                  {/* front (face up) */}
                  <span
                    className={`flip-face flip-back absolute inset-0 flex items-center justify-center rounded-2xl border-2 border-rose bg-white text-5xl ${
                      card.matched ? "ring-4 ring-pink/50" : ""
                    }`}
                    aria-hidden
                  >
                    {kind.emoji}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {data.quests[2] && !showReward && (
        <div className="px-5 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Button variant="secondary" className="w-full" onClick={() => go("quest3")}>
            {t("skipToNext", lang)} →
          </Button>
        </div>
      )}

      <RewardModal
        open={showReward}
        quest={2}
        newlyUnlocked={newlyUnlocked}
        nextLabel={`${t("nextQuest", lang)} 🎂`}
        onNext={() => go("quest3")}
        onPlayAgain={newGame}
      />
    </div>
  );
}
