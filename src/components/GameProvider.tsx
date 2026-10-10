"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { birthdayConfig, type Lang, type TicketId } from "@/config/birthday";
import { defaultSave, loadSave, writeSave, type SaveData, type ScreenId } from "@/lib/storage";
import { playSfx, unlockAudio, type Sfx } from "@/lib/sound";

interface GameContextValue {
  data: SaveData;
  lang: Lang;
  ready: boolean;
  /** Saved checkpoint found on load (past the welcome screen) — offered as "Continue". */
  resumeScreen: ScreenId | null;
  dismissResume: () => void;
  go: (screen: ScreenId) => void;
  setLang: (lang: Lang) => void;
  toggleSound: () => void;
  sfx: (name: Sfx) => void;
  start: () => void;
  /** Marks a quest complete. Returns true if its ticket was newly unlocked. */
  completeQuest: (quest: 1 | 2 | 3) => boolean;
  markRevealed: (id: TicketId) => void;
  redeem: (id: TicketId) => void;
  openLetter: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SaveData>(defaultSave);
  const dataRef = useRef<SaveData>(data);
  const [ready, setReady] = useState(false);
  const [resumeScreen, setResumeScreen] = useState<ScreenId | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const { data: loaded, existed } = loadSave();
    if (existed && loaded.started && loaded.screen !== "welcome") {
      // Always open on Welcome and offer to continue. The stored checkpoint is kept until they move on.
      setResumeScreen(loaded.screen);
      dataRef.current = { ...loaded, screen: "welcome" };
    } else {
      dataRef.current = loaded;
    }
    setData(dataRef.current);
    setReady(true);
  }, []);

  const update = useCallback((fn: (prev: SaveData) => SaveData) => {
    const next = fn(dataRef.current);
    if (next === dataRef.current) return;
    dataRef.current = next;
    setData(next);
    writeSave(next);
  }, []);

  useEffect(() => {
    document.documentElement.lang = data.prefs.lang;
  }, [data.prefs.lang]);

  // Optional background music (only when configured, and only after the player pressed Start).
  useEffect(() => {
    const src = birthdayConfig.music.src;
    if (!src || !ready) return;
    if (!musicRef.current) {
      const audio = new Audio(src);
      audio.loop = true;
      audio.volume = birthdayConfig.music.volume;
      musicRef.current = audio;
    }
    const audio = musicRef.current;
    if (data.prefs.sound && data.started) audio.play().catch(() => {});
    else audio.pause();
  }, [ready, data.prefs.sound, data.started]);

  const sfx = useCallback((name: Sfx) => {
    if (dataRef.current.prefs.sound) playSfx(name);
  }, []);

  const go = useCallback(
    (screen: ScreenId) => {
      update((p) => (p.screen === screen ? p : { ...p, screen }));
      if (typeof window !== "undefined") window.scrollTo({ top: 0 });
    },
    [update],
  );

  const value = useMemo<GameContextValue>(
    () => ({
      data,
      lang: data.prefs.lang,
      ready,
      resumeScreen,
      dismissResume: () => setResumeScreen(null),
      go,
      sfx,
      setLang: (lang) => update((p) => ({ ...p, prefs: { ...p.prefs, lang } })),
      toggleSound: () => {
        unlockAudio();
        update((p) => ({ ...p, prefs: { ...p.prefs, sound: !p.prefs.sound } }));
      },
      start: () => {
        unlockAudio();
        update((p) => ({ ...p, started: true }));
        go("memories");
      },
      completeQuest: (quest) => {
        const ticket = birthdayConfig.tickets.find((t) => t.quest === quest);
        const wasLocked = ticket ? dataRef.current.tickets[ticket.id].status === "locked" : false;
        update((p) => {
          const tickets = { ...p.tickets };
          if (ticket && tickets[ticket.id].status === "locked") {
            tickets[ticket.id] = { ...tickets[ticket.id], status: "available", unlockedAt: new Date().toISOString() };
          }
          return { ...p, quests: { ...p.quests, [quest]: true }, tickets };
        });
        return wasLocked;
      },
      markRevealed: (id) =>
        update((p) =>
          p.tickets[id].revealed ? p : { ...p, tickets: { ...p.tickets, [id]: { ...p.tickets[id], revealed: true } } },
        ),
      redeem: (id) =>
        update((p) =>
          p.tickets[id].status !== "available"
            ? p
            : {
                ...p,
                tickets: { ...p.tickets, [id]: { ...p.tickets[id], status: "redeemed", redeemedAt: new Date().toISOString() } },
              },
        ),
      openLetter: () => update((p) => (p.letterOpened ? p : { ...p, letterOpened: true })),
    }),
    [data, ready, resumeScreen, go, sfx, update],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside <GameProvider>");
  return ctx;
}
