"use client";

import { useCallback, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { birthdayConfig, type MemoryItem } from "@/config/birthday";
import { useGame } from "@/components/GameProvider";
import { loc, t } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { TopBar } from "@/components/ui/TopBar";

const TILTS = ["-rotate-2", "rotate-2", "-rotate-1", "rotate-1"];

export function MemoriesScreen() {
  const { lang, go, sfx } = useGame();
  // Media that failed to load (e.g. the video file hasn't been added yet) are hidden.
  const [failed, setFailed] = useState<string[]>([]);
  const items = birthdayConfig.memories.filter((m) => m.type === "photo" || !failed.includes(m.id));
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const onScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  }, []);

  const scrollTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(items.length - 1, i));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
    sfx("click");
  };

  const markFailed = (id: string) => setFailed((f) => (f.includes(id) ? f : [...f, id]));

  return (
    <div className="flex min-h-dvh flex-col">
      <TopBar onBack={() => go("welcome")} />
      <div className="px-6 text-center">
        <h1 className="text-2xl font-bold text-cherry">📸 {loc(birthdayConfig.memoriesTitle, lang)}</h1>
        <p className="mt-1 text-sm text-rose/70">{t("memoriesHint", lang)}</p>
      </div>

      <div
        ref={trackRef}
        onScroll={onScroll}
        className="scrollbar-none mt-3 flex flex-1 snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
        role="region"
        aria-roledescription="carousel"
        aria-label={loc(birthdayConfig.memoriesTitle, lang)}
      >
        {items.map((m, i) => (
          <div
            key={m.id}
            className="flex w-full shrink-0 snap-center items-center justify-center px-8 py-4"
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${items.length}`}
          >
            <Polaroid item={m} tilt={TILTS[i % TILTS.length]} onFail={() => markFailed(m.id)} />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-3 py-2">
        <IconButton aria-label={t("previous", lang)} onClick={() => scrollTo(index - 1)} disabled={index === 0} className="disabled:opacity-40">
          <ChevronLeft size={20} />
        </IconButton>
        <div className="flex gap-2" aria-hidden>
          {items.map((m, i) => (
            <span key={m.id} className={`h-2.5 rounded-full transition-all ${i === index ? "w-6 bg-cherry" : "w-2.5 bg-blush"}`} />
          ))}
        </div>
        <IconButton
          aria-label={t("next", lang)}
          onClick={() => scrollTo(index + 1)}
          disabled={index >= items.length - 1}
          className="disabled:opacity-40"
        >
          <ChevronRight size={20} />
        </IconButton>
      </div>

      <div className="px-6 pt-2 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <Button
          className="w-full text-lg"
          onClick={() => {
            sfx("click");
            go("quest1");
          }}
        >
          {t("memoriesNext", lang)}
        </Button>
      </div>
    </div>
  );
}

function Polaroid({ item, tilt, onFail }: { item: MemoryItem; tilt: string; onFail: () => void }) {
  const { lang } = useGame();
  const [photoError, setPhotoError] = useState(false);

  return (
    <figure className={`w-full max-w-[320px] rounded-md bg-white p-3 pb-4 soft-shadow ${tilt}`}>
      <div className="relative flex items-center justify-center overflow-hidden rounded-sm bg-blush/30">
        {item.type === "photo" ? (
          photoError ? (
            <div className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-2 text-rose/70">
              <span className="text-4xl">🖼️</span>
              <span className="text-sm">{t("photoError", lang)}</span>
            </div>
          ) : (
            // Plain <img> keeps the full original framing (object-contain = nothing cropped).
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.src}
              alt={loc(item.alt, lang)}
              width={item.width}
              height={item.height}
              loading="lazy"
              draggable={false}
              className="max-h-[50dvh] w-full object-contain"
              onError={() => setPhotoError(true)}
            />
          )
        ) : (
          <MemoryVideo src={item.src} poster={item.poster} label={loc(item.alt, lang)} onFail={onFail} />
        )}
      </div>
      <figcaption className="mt-3 text-center text-base font-semibold leading-snug text-rose">{loc(item.caption, lang)}</figcaption>
    </figure>
  );
}

function MemoryVideo({ src, poster, label, onFail }: { src: string; poster: string; label: string; onFail: () => void }) {
  const { lang } = useGame();
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  return (
    <div className="relative w-full">
      <video
        ref={ref}
        src={src}
        poster={poster}
        controls={started}
        playsInline
        preload="metadata"
        aria-label={label}
        className="max-h-[50dvh] w-full bg-black object-contain"
        onError={onFail}
        onPlay={() => setStarted(true)}
      />
      {!started && (
        <button
          type="button"
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-rose/20"
          onClick={() => {
            setStarted(true);
            ref.current?.play().catch(() => {});
          }}
          aria-label={`${t("videoTapToPlay", lang)}: ${label}`}
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-rose bg-white pixel-shadow">
            <Play className="ml-1 text-cherry" size={28} fill="currentColor" />
          </span>
          <span className="rounded-full bg-white/90 px-3 py-1 text-sm font-bold text-rose">{t("videoTapToPlay", lang)}</span>
        </button>
      )}
    </div>
  );
}
