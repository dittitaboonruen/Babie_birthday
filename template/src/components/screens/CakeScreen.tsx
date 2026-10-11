"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { useGame } from "@/components/GameProvider";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { Cake, type CandleState, type Decoration } from "@/components/ui/Cake";
import { FloatingHearts } from "@/components/ui/FloatingHearts";
import { RewardModal } from "@/components/ui/RewardModal";
import { TopBar } from "@/components/ui/TopBar";

const DECORATIONS: (Decoration & { label: { th: string; en: string } })[] = [
  { id: "strawberry", emoji: "🍓", label: { th: "สตรอว์เบอร์รี", en: "Strawberry" } },
  { id: "cherry", emoji: "🍒", label: { th: "เชอร์รี", en: "Cherry" } },
  { id: "heart", emoji: "💗", label: { th: "หัวใจ", en: "Hearts" } },
  { id: "star", emoji: "⭐", label: { th: "ดาว", en: "Stars" } },
  { id: "bow", emoji: "🎀", label: { th: "โบว์", en: "Bows" } },
  { id: "bear", emoji: "🧸", label: { th: "น้องหมี", en: "Teddy" } },
  { id: "flower", emoji: "🌸", label: { th: "ดอกไม้", en: "Flowers" } },
  { id: "macaron", emoji: "🍬", label: { th: "ลูกอม", en: "Candy" } },
];

const PICKS = 3;
const BLOWS_NEEDED = 3;

export function CakeScreen() {
  const { lang, go, sfx, completeQuest, data } = useGame();
  const [chosen, setChosen] = useState<string[]>([]);
  const [candle, setCandle] = useState<CandleState>("none");
  const [blows, setBlows] = useState(0);
  const [celebrate, setCelebrate] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [newlyUnlocked, setNewlyUnlocked] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const decorations = chosen.map((id) => DECORATIONS.find((d) => d.id === id)!).filter(Boolean);
  const step = candle === "out" ? "done" : candle === "lit" ? "blow" : chosen.length < PICKS ? "decor" : "candle";

  const toggle = (id: string) => {
    if (candle !== "none") return;
    sfx("click");
    setChosen((c) => (c.includes(id) ? c.filter((x) => x !== id) : c.length >= PICKS ? c : [...c, id]));
  };

  const blow = () => {
    if (candle !== "lit") return;
    const next = blows + 1;
    setBlows(next);
    sfx("blow");
    if (next >= BLOWS_NEEDED) {
      setCandle("out");
      setCelebrate(true);
      setNewlyUnlocked(completeQuest(3));
      timer.current = window.setTimeout(() => {
        sfx("win");
        setShowReward(true);
      }, 1100);
    }
  };

  const reset = () => {
    if (timer.current) window.clearTimeout(timer.current);
    setChosen([]);
    setCandle("none");
    setBlows(0);
    setCelebrate(false);
    setShowReward(false);
  };

  const instruction =
    step === "decor"
      ? `${t("q3StepDecor", lang)} (${chosen.length}/${PICKS})`
      : step === "candle"
        ? t("q3StepCandle", lang)
        : step === "blow"
          ? t("q3StepBlow", lang)
          : t("q3Done", lang);

  return (
    <div className="flex min-h-dvh flex-col">
      {celebrate && <FloatingHearts count={16} emojis={["💖", "💗", "🎉", "✨", "🎂"]} />}
      <TopBar onBack={() => go("quest2")} current={3} />
      <div className="px-5 text-center">
        <h1 className="text-2xl font-bold text-cherry">🎂 {t("q3Title", lang)}</h1>
        <p className="mt-1 text-sm font-semibold text-rose/80" aria-live="polite">
          {instruction}
        </p>
      </div>

      <div className="relative z-10 mt-2 px-8">
        <Cake
          decorations={decorations}
          candle={candle}
          flameStrength={1 - blows / BLOWS_NEEDED}
          onFlameTap={blow}
          flameLabel={t("q3Blow", lang)}
        />
      </div>

      <div className="relative z-10 flex flex-1 flex-col px-5 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {candle === "none" && (
          <div className="grid grid-cols-4 gap-2" role="group" aria-label={t("q3StepDecor", lang)}>
            {DECORATIONS.map((d) => {
              const selected = chosen.includes(d.id);
              const full = !selected && chosen.length >= PICKS;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => toggle(d.id)}
                  aria-pressed={selected}
                  disabled={full}
                  className={`relative flex flex-col items-center justify-center rounded-2xl border-2 py-2 transition-all disabled:opacity-40 ${
                    selected ? "border-cherry bg-blush/60 scale-[1.04]" : "border-blush bg-white"
                  }`}
                >
                  <span className="text-2xl" aria-hidden>
                    {d.emoji}
                  </span>
                  <span className="mt-0.5 text-[11px] font-semibold leading-tight">{d.label[lang]}</span>
                  {selected && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-cherry text-white">
                      <Check size={12} strokeWidth={4} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-auto flex flex-col gap-3 pt-4">
          {step === "candle" && (
            <Button
              className="w-full text-lg"
              onClick={() => {
                sfx("unlock");
                setCandle("lit");
              }}
            >
              {t("q3AddCandle", lang)}
            </Button>
          )}
          {step === "blow" && (
            <Button className="w-full text-lg" onClick={blow}>
              {t("q3Blow", lang)} {"●".repeat(BLOWS_NEEDED - blows)}
              {"○".repeat(blows)}
            </Button>
          )}
          {(chosen.length > 0 || candle !== "none") && !showReward && (
            <Button variant="ghost" className="w-full text-sm" onClick={reset}>
              {t("q3Reset", lang)}
            </Button>
          )}
          {data.quests[3] && !showReward && step !== "done" && (
            <Button variant="secondary" className="w-full" onClick={() => go("rewards")}>
              🎟️ {t("toRewards", lang)} →
            </Button>
          )}
          {step === "done" && !showReward && (
            <Button className="w-full" onClick={() => setShowReward(true)}>
              🎟️ {t("rewardUnlocked", lang)}
            </Button>
          )}
        </div>
      </div>

      <RewardModal
        open={showReward}
        quest={3}
        newlyUnlocked={newlyUnlocked}
        nextLabel={`🎟️ ${t("toRewards", lang)}`}
        onNext={() => go("rewards")}
        onPlayAgain={reset}
      />
    </div>
  );
}
