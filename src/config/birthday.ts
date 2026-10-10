/**
 * 💗 LOVE QUEST — Birthday Edition
 * ------------------------------------------------------------
 * This is the ONE file you need to edit to personalise the game.
 * Every text has a Thai (`th`) and English (`en`) version.
 *
 * ✏️  = fields you will most likely want to edit.
 * Components read everything from here — no need to touch them.
 */

export type Lang = "th" | "en";
export type Localized = Record<Lang, string>;

export type TicketId = "ticket-01" | "ticket-02" | "ticket-03";

export interface TicketConfig {
  id: TicketId;
  /** Short code printed on the ticket, e.g. "LQ-1011-01". */
  code: string;
  /** Emoji shown on the ticket artwork. */
  emoji: string;
  /** Which quest unlocks it (1, 2 or 3). */
  quest: 1 | 2 | 3;
  name: Localized;
  description: Localized;
  /** Optional small print (e.g. "valid forever", "1 time"). */
  terms: Localized;
}

export type MemoryItem =
  | {
      id: string;
      type: "photo";
      src: string;
      width: number;
      height: number;
      alt: Localized;
      caption: Localized;
    }
  | {
      id: string;
      type: "video";
      src: string;
      /** Image shown before the video plays. */
      poster: string;
      alt: Localized;
      caption: Localized;
    };

export interface BirthdayConfig {
  birthday: {
    /** ISO date of the birthday. */
    date: string;
    displayDate: Localized;
  };
  boyfriendName: Localized;
  greeting: {
    title: Localized;
    subtitle: Localized;
    startButton: Localized;
  };
  portrait: { src: string; alt: Localized; objectPosition: string };
  memoriesTitle: Localized;
  memories: MemoryItem[];
  tickets: [TicketConfig, TicketConfig, TicketConfig];
  birthdayLetter: Localized;
  letterSignature: Localized;
  letterPlaceholder: Localized;
  ending: Localized;
  music: {
    /** Optional background music, e.g. "/music/our-song.mp3" (put the file in /public/music). Leave "" for none. */
    src: string;
    volume: number;
  };
  theme: {
    cream: string;
    pastelPink: string;
    vibrantPink: string;
    cherryRed: string;
    darkRose: string;
    defaultLanguage: Lang;
    defaultSoundOn: boolean;
  };
}

export const birthdayConfig: BirthdayConfig = {
  birthday: {
    date: "2026-10-11",
    displayDate: { th: "11 ต.ค.", en: "11 OCT" },
  },

  // ✏️ What you call him (used in a few small places).
  boyfriendName: { th: "ที่รัก", en: "My Love" },

  // ✏️ Welcome screen texts.
  greeting: {
    title: { th: "สุขสันต์วันเกิดนะ ที่รัก! ♡", en: "Happy Birthday, My Love! ♡" },
    subtitle: { th: "ทำด้วยความรัก เพื่อเธอคนเดียว", en: "Made with love, just for you." },
    startButton: { th: "เริ่มภารกิจความรัก ♡", en: "Start Our Love Quest ♡" },
  },

  // ✏️ Framed portrait on the welcome screen.
  // objectPosition controls which part of the photo stays visible in the frame.
  portrait: {
    src: "/memories/memory-01.jpg",
    alt: { th: "รูปแฟนของเรา", en: "My boyfriend" },
    objectPosition: "50% 30%",
  },

  memoriesTitle: { th: "ความทรงจำของเรา", en: "Our Memories" },

  // ✏️ Photos & video for the memory gallery. Captions are editable.
  // Files live in /public/memories/. If the video file is missing, its card is hidden automatically.
  memories: [
    {
      id: "memory-01",
      type: "photo",
      src: "/memories/memory-01.jpg",
      width: 1200,
      height: 1600,
      alt: { th: "ดินเนอร์หมูกระทะใต้ไฟวิบวับ", en: "BBQ dinner under twinkle lights" },
      caption: { th: "หมูกระทะใต้ไฟวิบวับ 🍖✨", en: "BBQ night under the twinkle lights 🍖✨" },
    },
    {
      id: "memory-02",
      type: "photo",
      src: "/memories/memory-02.jpg",
      width: 1477,
      height: 1108,
      alt: { th: "เซลฟี่หน้าตลกของเราสองคน", en: "Our silly-face selfie" },
      caption: { th: "หน้าตาแบบนี้... ก็ยังรักอยู่ดี 😜", en: "Silly faces, serious love 😜" },
    },
    {
      id: "memory-03",
      type: "photo",
      src: "/memories/memory-03.jpg",
      width: 900,
      height: 1600,
      alt: { th: "เธอตอนกำลังตั้งใจกินข้าว", en: "You, very focused on dinner" },
      caption: { th: "ตั้งใจกินข้าวแบบนี้ น่ารักที่สุด 🍳", en: "Serious dinner face — my favourite 🍳" },
    },
    {
      id: "memory-video",
      type: "video",
      src: "/memories/memory-video.mp4",
      poster: "/memories/memory-02.jpg",
      alt: { th: "คลิปความทรงจำของเรา", en: "Our memory clip" },
      caption: { th: "คลิปของเราสองคน 🎬", en: "A little clip of us 🎬" },
    },
  ],

  // ✏️ The three reward tickets.
  tickets: [
    {
      id: "ticket-01",
      code: "LQ-1011-01",
      emoji: "🤗",
      quest: 1,
      name: { th: "กอดและหอมฟรี", en: "Free Hugs & Kisses" },
      description: {
        th: "ใช้แลกกอดแน่น ๆ และหอมแก้มได้ทันที ไม่จำกัดจำนวน",
        en: "Redeem for tight hugs and cheek kisses, anytime. Unlimited refills.",
      },
      terms: { th: "ใช้ได้ตลอดไป ♡", en: "Valid forever ♡" },
    },
    {
      id: "ticket-02",
      code: "LQ-1011-02",
      emoji: "🍜",
      quest: 2,
      name: { th: "มื้อโปรดของเธอ", en: "Your Favorite Meal" },
      description: {
        th: "เลือกเมนูไหนก็ได้ที่อยากกิน เดี๋ยวเราพาไป/ทำให้เอง",
        en: "Pick any meal you crave — I'll take you there or cook it for you.",
      },
      terms: { th: "ใช้ได้ 1 ครั้ง", en: "Valid for 1 meal" },
    },
    {
      id: "ticket-03",
      code: "LQ-1011-03",
      emoji: "💑",
      quest: 3,
      name: { th: "เดตพิเศษกับเรา", en: "Special Date With Me" },
      description: {
        th: "วันเดตพิเศษหนึ่งวัน เธอเลือกที่ไป เราจัดการให้ทั้งหมด",
        en: "One special date day — you choose where, I plan the rest.",
      },
      terms: { th: "ใช้ได้ 1 ครั้ง", en: "Valid for 1 date" },
    },
  ],

  // ✏️✏️ YOUR BIRTHDAY LETTER — write it here. Line breaks are kept.
  // Use backticks (`) if you want to write multiple lines easily, e.g.
  //   th: `บรรทัดแรก
  //   บรรทัดที่สอง`,
  // While empty, the letter shows "A little letter is waiting for you ♡".
  birthdayLetter: {
    th: "",
    en: "",
  },

  // ✏️ Your signature at the bottom of the letter (optional).
  letterSignature: { th: "", en: "" },

  letterPlaceholder: {
    th: "A little letter is waiting for you ♡",
    en: "A little letter is waiting for you ♡",
  },

  ending: {
    th: "ขอบคุณที่เป็นคนโปรดของเรานะ ♡",
    en: "Thank you for being my favorite person. ♡",
  },

  music: {
    src: "",
    volume: 0.4,
  },

  theme: {
    cream: "#FFF2F4",
    pastelPink: "#FFC6D5",
    vibrantPink: "#FF6B8A",
    cherryRed: "#D91F46",
    darkRose: "#8F1734",
    defaultLanguage: "th",
    defaultSoundOn: true,
  },
};
