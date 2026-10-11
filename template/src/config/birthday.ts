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
  // ✏️ 1) วันเกิด — Birthday date
  birthday: {
    date: "2026-12-31",
    displayDate: { th: "31 ธ.ค.", en: "31 DEC" },
  },

  // ✏️ 2) ชื่อที่ใช้เรียกแฟน — What you call your partner
  boyfriendName: { th: "ที่รัก", en: "My Love" },

  // ✏️ 3) ข้อความหน้าแรก — Welcome screen texts
  greeting: {
    title: { th: "สุขสันต์วันเกิดนะ ที่รัก! ♡", en: "Happy Birthday, My Love! ♡" },
    subtitle: { th: "ทำด้วยความรัก เพื่อเธอคนเดียว", en: "Made with love, just for you." },
    startButton: { th: "เริ่มภารกิจความรัก ♡", en: "Start Our Love Quest ♡" },
  },

  // ✏️ 4) รูปหน้าแรก — Portrait on the welcome screen (replace public/memories/portrait.jpg)
  // objectPosition = จุดที่อยากให้อยู่กลางกรอบ เช่น "50% 30%" (ซ้าย-ขวา, บน-ล่าง)
  portrait: {
    src: "/memories/portrait.jpg",
    alt: { th: "รูปแฟนของเรา", en: "My partner" },
    objectPosition: "50% 30%",
  },

  memoriesTitle: { th: "ความทรงจำของเรา", en: "Our Memories" },

  // ✏️ 5) รูป/คลิปความทรงจำ — Memory gallery
  // - แทนไฟล์ใน public/memories/ ด้วยรูปของคุณ (ใช้ชื่อไฟล์เดิม หรือแก้ src ให้ตรง)
  // - width/height = ขนาดรูปจริง (ใช้แค่สัดส่วน ไม่ต้องเป๊ะ)
  // - เพิ่ม/ลบรูปได้ แค่เพิ่ม/ลบ object ใน array นี้ (id ห้ามซ้ำ)
  // - คลิป: วางไฟล์ public/memories/memory-video.mp4 ถ้าไม่มีไฟล์ การ์ดคลิปจะซ่อนอัตโนมัติ
  memories: [
    {
      id: "memory-01",
      type: "photo",
      src: "/memories/memory-01.jpg",
      width: 1200,
      height: 1600,
      alt: { th: "รูปที่ 1", en: "Photo 1" },
      caption: { th: "คำบรรยายรูปที่ 1 ♡", en: "Caption for photo 1 ♡" },
    },
    {
      id: "memory-02",
      type: "photo",
      src: "/memories/memory-02.jpg",
      width: 1600,
      height: 1200,
      alt: { th: "รูปที่ 2", en: "Photo 2" },
      caption: { th: "คำบรรยายรูปที่ 2 ✨", en: "Caption for photo 2 ✨" },
    },
    {
      id: "memory-03",
      type: "photo",
      src: "/memories/memory-03.jpg",
      width: 1200,
      height: 1600,
      alt: { th: "รูปที่ 3", en: "Photo 3" },
      caption: { th: "คำบรรยายรูปที่ 3 🎂", en: "Caption for photo 3 🎂" },
    },
    {
      id: "memory-video",
      type: "video",
      src: "/memories/memory-video.mp4",
      poster: "/memories/memory-03.jpg",
      alt: { th: "คลิปความทรงจำของเรา", en: "Our memory clip" },
      caption: { th: "คลิปของเราสองคน 🎬", en: "A little clip of us 🎬" },
    },
  ],

  // ✏️ 6) ตั๋วรางวัล 3 ใบ — The three reward tickets (เปลี่ยนชื่อ/รายละเอียด/อีโมจิได้)
  tickets: [
    {
      id: "ticket-01",
      code: "LQ-0001-01",
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
      code: "LQ-0001-02",
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
      code: "LQ-0001-03",
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

  // ✏️✏️ 7) จดหมายวันเกิด — YOUR BIRTHDAY LETTER (ขึ้นบรรทัดใหม่ได้ ใช้ backtick ` ครอบข้อความ)
  //   th: `บรรทัดแรก
  //
  //   ย่อหน้าที่สอง`,
  // ถ้าว่างไว้ จะแสดง "A little letter is waiting for you ♡"
  // ถ้าใส่แค่ภาษาเดียว อีกภาษาจะแสดงข้อความเดียวกันแทน
  birthdayLetter: {
    th: "",
    en: "",
  },

  // ✏️ 8) ลายเซ็นท้ายจดหมาย (ไม่บังคับ) — Optional signature
  letterSignature: { th: "", en: "" },

  letterPlaceholder: {
    th: "A little letter is waiting for you ♡",
    en: "A little letter is waiting for you ♡",
  },

  // ✏️ 9) ข้อความปิดท้าย — Ending line
  ending: {
    th: "ขอบคุณที่เป็นคนโปรดของเรานะ ♡",
    en: "Thank you for being my favorite person. ♡",
  },

  // ✏️ 10) เพลงพื้นหลัง (ไม่บังคับ) — e.g. "/music/our-song.mp3" (วางไฟล์ใน public/music/)
  music: {
    src: "",
    volume: 0.4,
  },

  // ✏️ 11) ธีมสี / ภาษาเริ่มต้น — Theme colours & default language ("th" | "en")
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
