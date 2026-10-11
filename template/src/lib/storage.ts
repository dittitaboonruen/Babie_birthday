import { birthdayConfig, type Lang, type TicketId } from "@/config/birthday";

/**
 * Versioned localStorage persistence. Everything lives on this device/browser only —
 * nothing is synced anywhere.
 */

export const SCREENS = ["welcome", "memories", "quest1", "quest2", "quest3", "rewards", "letter"] as const;
export type ScreenId = (typeof SCREENS)[number];

export type TicketStatus = "locked" | "available" | "redeemed";

export interface TicketState {
  status: TicketStatus;
  /** True once the unlock animation has been shown in the collection. */
  revealed: boolean;
  unlockedAt?: string;
  redeemedAt?: string;
}

export interface SaveData {
  version: 1;
  screen: ScreenId;
  /** True once the player pressed Start at least once. */
  started: boolean;
  quests: { 1: boolean; 2: boolean; 3: boolean };
  tickets: Record<TicketId, TicketState>;
  letterOpened: boolean;
  prefs: { lang: Lang; sound: boolean };
}

const STORAGE_KEY = "love-quest-birthday";
const TICKET_IDS: TicketId[] = ["ticket-01", "ticket-02", "ticket-03"];

export function defaultSave(): SaveData {
  return {
    version: 1,
    screen: "welcome",
    started: false,
    quests: { 1: false, 2: false, 3: false },
    tickets: {
      "ticket-01": { status: "locked", revealed: false },
      "ticket-02": { status: "locked", revealed: false },
      "ticket-03": { status: "locked", revealed: false },
    },
    letterOpened: false,
    prefs: { lang: birthdayConfig.theme.defaultLanguage, sound: birthdayConfig.theme.defaultSoundOn },
  };
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;
const isStr = (v: unknown): v is string => typeof v === "string";

/** Merge unknown stored JSON onto safe defaults, field by field. */
export function sanitize(raw: unknown): SaveData {
  const d = defaultSave();
  if (!isObj(raw) || raw.version !== 1) return d;

  if (isStr(raw.screen) && (SCREENS as readonly string[]).includes(raw.screen)) d.screen = raw.screen as ScreenId;
  if (typeof raw.started === "boolean") d.started = raw.started;
  if (typeof raw.letterOpened === "boolean") d.letterOpened = raw.letterOpened;

  if (isObj(raw.quests)) {
    for (const q of [1, 2, 3] as const) d.quests[q] = raw.quests[q] === true;
  }

  if (isObj(raw.tickets)) {
    for (const id of TICKET_IDS) {
      const t = raw.tickets[id];
      if (!isObj(t)) continue;
      const status = t.status;
      if (status === "locked" || status === "available" || status === "redeemed") {
        d.tickets[id] = {
          status,
          revealed: t.revealed === true,
          unlockedAt: isStr(t.unlockedAt) ? t.unlockedAt : undefined,
          redeemedAt: isStr(t.redeemedAt) ? t.redeemedAt : undefined,
        };
      }
    }
  }

  // A completed quest always has its ticket at least available (repairs partial saves).
  for (const ticket of birthdayConfig.tickets) {
    if (d.quests[ticket.quest] && d.tickets[ticket.id].status === "locked") {
      d.tickets[ticket.id] = { ...d.tickets[ticket.id], status: "available" };
    }
  }

  if (isObj(raw.prefs)) {
    if (raw.prefs.lang === "th" || raw.prefs.lang === "en") d.prefs.lang = raw.prefs.lang;
    if (typeof raw.prefs.sound === "boolean") d.prefs.sound = raw.prefs.sound;
  }
  return d;
}

export function loadSave(): { data: SaveData; existed: boolean } {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { data: defaultSave(), existed: false };
    return { data: sanitize(JSON.parse(raw)), existed: true };
  } catch {
    // Corrupt JSON or storage blocked (private mode) — start fresh.
    return { data: defaultSave(), existed: false };
  }
}

export function writeSave(data: SaveData): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage full or blocked — the game still works for this session.
  }
}
