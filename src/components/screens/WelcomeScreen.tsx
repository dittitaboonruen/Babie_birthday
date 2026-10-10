"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { birthdayConfig } from "@/config/birthday";
import { useGame } from "@/components/GameProvider";
import { loc, t } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { Cake } from "@/components/ui/Cake";
import { FloatingHearts } from "@/components/ui/FloatingHearts";
import { Modal } from "@/components/ui/Modal";
import { TopBar } from "@/components/ui/TopBar";

export function WelcomeScreen() {
  const { lang, start, sfx, resumeScreen, dismissResume, go } = useGame();
  const { greeting, portrait, birthday } = birthdayConfig;
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative flex min-h-dvh flex-col">
      <FloatingHearts />
      <TopBar />

      <div className="relative z-10 flex flex-1 flex-col items-center px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center">
        <motion.p
          className="mt-1 rounded-full border-2 border-rose bg-white px-4 py-1.5 font-pixel text-[11px] text-cherry pixel-shadow"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.1 }}
        >
          🎂 {loc(birthday.displayDate, "en")}
        </motion.p>

        {/* Polaroid portrait */}
        <motion.figure
          className="relative mt-5 w-[62%] max-w-[240px] rotate-[-3deg] rounded-md bg-white p-2.5 pb-9 soft-shadow"
          initial={{ y: 30, rotate: -10, opacity: 0 }}
          animate={{ y: 0, rotate: -3, opacity: 1 }}
          transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.2 }}
        >
          <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-3xl" aria-hidden>
            🎀
          </span>
          <div className="aspect-[4/5] overflow-hidden rounded-sm bg-blush/40">
            {imgError ? (
              <div className="flex h-full items-center justify-center text-5xl" aria-label={loc(portrait.alt, lang)}>
                💗
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={portrait.src}
                alt={loc(portrait.alt, lang)}
                className="h-full w-full object-cover"
                style={{ objectPosition: portrait.objectPosition }}
                onError={() => setImgError(true)}
              />
            )}
          </div>
          <figcaption className="absolute bottom-2 left-0 right-0 text-sm font-bold text-rose">
            {loc(birthdayConfig.boyfriendName, lang)} 💕
          </figcaption>
          <span className="absolute -right-5 -bottom-4 text-4xl animate-bob" aria-hidden>
            🧸
          </span>
        </motion.figure>

        <motion.h1
          className="mt-7 text-[28px] font-bold leading-tight text-cherry [text-shadow:2px_2px_0_white]"
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          {loc(greeting.title, lang)}
        </motion.h1>
        <motion.p
          className="mt-2 text-base font-medium text-rose/85"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {loc(greeting.subtitle, lang)}
        </motion.p>

        <div className="mt-3 w-36" aria-hidden>
          <Cake decorations={[{ id: "s", emoji: "🍓" }, { id: "h", emoji: "💗" }, { id: "st", emoji: "⭐" }]} candle="lit" />
        </div>

        <div className="mt-auto w-full pt-4">
          <Button
            className="w-full text-lg"
            onClick={() => {
              sfx("unlock");
              dismissResume();
              start();
            }}
          >
            {loc(greeting.startButton, lang)}
          </Button>
          <p className="mt-3 font-pixel text-[8px] leading-relaxed text-rose/60">
            3 LITTLE QUESTS · 3 LOVE REWARDS · 1 SPECIAL PERSON
          </p>
        </div>
      </div>

      <Modal open={resumeScreen !== null} onClose={dismissResume} labelledBy="resume-title">
        <div className="text-center">
          <p className="text-4xl" aria-hidden>
            💌
          </p>
          <h2 id="resume-title" className="mt-1 text-xl font-bold text-cherry">
            {t("resumeTitle", lang)}
          </h2>
          <p className="mt-2 text-sm text-rose/80">{t("resumeBody", lang)}</p>
          <div className="mt-5 flex flex-col gap-3">
            <Button
              onClick={() => {
                sfx("click");
                const target = resumeScreen ?? "memories";
                dismissResume();
                go(target);
              }}
            >
              {t("resumeContinue", lang)}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                sfx("click");
                dismissResume();
              }}
            >
              {t("resumeRestart", lang)}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
