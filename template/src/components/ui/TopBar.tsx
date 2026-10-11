"use client";

import { ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { useGame } from "@/components/GameProvider";
import { t } from "@/lib/i18n";
import { IconButton } from "./IconButton";

export function TopBar({ onBack, current }: { onBack?: () => void; current?: 1 | 2 | 3 }) {
  const { lang, data, setLang, toggleSound, sfx } = useGame();
  return (
    <header className="relative z-20 flex items-center gap-2 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2">
      <div className="flex w-24 justify-start">
        {onBack && (
          <IconButton
            aria-label={t("back", lang)}
            onClick={() => {
              sfx("click");
              onBack();
            }}
          >
            <ArrowLeft size={20} strokeWidth={2.6} />
          </IconButton>
        )}
      </div>
      <div className="flex flex-1 justify-center">{current && <QuestProgress current={current} />}</div>
      <div className="flex w-24 justify-end gap-1.5">
        <IconButton
          aria-label={data.prefs.sound ? t("soundOff", lang) : t("soundOn", lang)}
          aria-pressed={data.prefs.sound}
          onClick={toggleSound}
        >
          {data.prefs.sound ? <Volume2 size={19} strokeWidth={2.4} /> : <VolumeX size={19} strokeWidth={2.4} />}
        </IconButton>
        <IconButton
          aria-label={t("switchLang", lang)}
          onClick={() => setLang(lang === "th" ? "en" : "th")}
          className="font-pixel text-[10px]"
        >
          {lang === "th" ? "EN" : "TH"}
        </IconButton>
      </div>
    </header>
  );
}

export function QuestProgress({ current }: { current: 1 | 2 | 3 }) {
  const { data, lang } = useGame();
  return (
    <div
      className="flex items-center gap-1.5 rounded-full border-2 border-blush bg-white/85 px-3 py-1.5"
      aria-label={`${t("questLabel", lang)} ${current}/3`}
    >
      <span className="font-pixel text-[9px] text-rose">
        {current}/3
      </span>
      {([1, 2, 3] as const).map((q) => (
        <span
          key={q}
          aria-hidden
          className={`text-sm transition-transform ${q === current ? "scale-125" : ""} ${data.quests[q] || q === current ? "" : "opacity-40"}`}
        >
          {data.quests[q] ? "💖" : q === current ? "🩷" : "🤍"}
        </span>
      ))}
    </div>
  );
}
