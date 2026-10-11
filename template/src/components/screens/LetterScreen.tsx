"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { birthdayConfig } from "@/config/birthday";
import { useGame } from "@/components/GameProvider";
import { loc, t } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { Confetti } from "@/components/ui/Confetti";
import { FloatingHearts } from "@/components/ui/FloatingHearts";
import { TopBar } from "@/components/ui/TopBar";

export function LetterScreen() {
  const { lang, data, go, sfx, openLetter } = useGame();
  // If he already opened it before, show it straight away.
  const [open, setOpen] = useState(data.letterOpened);
  const [justOpened, setJustOpened] = useState(false);

  const letter = birthdayConfig.birthdayLetter[lang].trim() || birthdayConfig.birthdayLetter[lang === "th" ? "en" : "th"].trim();
  const signature = loc(birthdayConfig.letterSignature, lang).trim();

  const handleOpen = () => {
    if (open) return;
    sfx("unlock");
    setOpen(true); // content renders immediately — never blocked by the animation
    setJustOpened(true);
    openLetter();
  };

  return (
    <div className="relative flex min-h-dvh flex-col">
      <FloatingHearts count={10} />
      {justOpened && <Confetti pieces={40} />}
      <TopBar onBack={() => go("rewards")} />

      <div className="relative z-10 px-5 text-center">
        <h1 className="text-2xl font-bold text-cherry">💌 {t("letterTitle", lang)}</h1>
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center px-5 pt-4">
        {!open ? (
          <button
            type="button"
            onClick={handleOpen}
            className="group my-auto flex flex-col items-center gap-4"
            aria-label={t("letterTap", lang)}
          >
            <Envelope />
            <span className="animate-bob rounded-full border-2 border-rose bg-white px-4 py-2 text-sm font-bold text-cherry pixel-shadow">
              {t("letterTap", lang)} 💌
            </span>
          </button>
        ) : (
          <>
            <motion.article
              className="relative w-full rounded-2xl border-2 border-rose/30 bg-[#FFFDF8] p-6 pt-8 soft-shadow"
              style={{
                backgroundImage: "repeating-linear-gradient(transparent 0 31px, color-mix(in srgb, var(--lq-pastel) 60%, transparent) 31px 32px)",
                backgroundPosition: "0 22px",
              }}
              initial={{ y: 80, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 140, damping: 16 }}
            >
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-4xl" aria-hidden>
                💝
              </span>
              <p className="text-lg font-bold text-cherry">{loc(birthdayConfig.greeting.title, lang)}</p>
              {letter ? (
                <p className="mt-3 whitespace-pre-line text-base leading-8 text-rose">{letter}</p>
              ) : (
                <p className="mt-6 mb-4 text-center text-lg leading-8 text-rose/70 italic">{loc(birthdayConfig.letterPlaceholder, lang)}</p>
              )}
              {signature && <p className="mt-4 text-right font-semibold whitespace-pre-line text-rose">{signature}</p>}
            </motion.article>

            <motion.div
              className="mt-6 w-full text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: justOpened ? 0.9 : 0 }}
            >
              <p className="text-lg font-bold text-cherry">{loc(birthdayConfig.ending, lang)}</p>
              <div className="mt-5 flex flex-col gap-3 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
                <Button onClick={() => go("rewards")}>🎟️ {t("viewRewards", lang)}</Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="secondary" className="text-sm" onClick={() => go("memories")}>
                    📸 {t("backToMemories", lang)}
                  </Button>
                  <Button variant="secondary" className="text-sm" onClick={() => go("welcome")}>
                    🔁 {t("replay", lang)}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

function Envelope() {
  return (
    <motion.div
      className="relative h-44 w-64"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      whileHover={{ rotate: -2, scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      aria-hidden
    >
      <svg viewBox="0 0 256 176" className="h-full w-full drop-shadow-[0_6px_0_var(--lq-rose)]">
        <rect x="3" y="3" width="250" height="170" rx="14" fill="var(--lq-pastel)" stroke="var(--lq-rose)" strokeWidth="4" />
        <path d="M5 165 L110 92 Q128 80 146 92 L251 165" fill="none" stroke="var(--lq-rose)" strokeWidth="4" strokeLinejoin="round" />
        <path d="M5 10 L110 98 Q128 112 146 98 L251 10 Z" fill="var(--lq-pink)" stroke="var(--lq-rose)" strokeWidth="4" strokeLinejoin="round" />
        <path d="M128 84 l-14 -14 a9 9 0 0 1 14 -11 a9 9 0 0 1 14 11 Z" fill="var(--lq-cherry)" stroke="#fff" strokeWidth="3" />
      </svg>
      <span className="absolute -right-3 -top-3 text-3xl">✨</span>
      <span className="absolute -left-4 bottom-2 text-3xl">🎀</span>
    </motion.div>
  );
}
