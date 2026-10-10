import type { Lang, Localized } from "@/config/birthday";

/** UI labels (buttons, hints). Romantic/personal texts live in src/config/birthday.ts. */
export const ui = {
  loading: { th: "กำลังเตรียมเซอร์ไพรส์...", en: "Preparing your surprise..." },
  continue: { th: "ไปต่อ", en: "Continue" },
  back: { th: "ย้อนกลับ", en: "Back" },
  next: { th: "ถัดไป", en: "Next" },
  previous: { th: "ก่อนหน้า", en: "Previous" },
  close: { th: "ปิด", en: "Close" },
  soundOn: { th: "เปิดเสียง", en: "Sound on" },
  soundOff: { th: "ปิดเสียง", en: "Sound off" },
  switchLang: { th: "Switch to English", en: "เปลี่ยนเป็นภาษาไทย" },
  questLabel: { th: "ภารกิจ", en: "QUEST" },

  resumeTitle: { th: "ยินดีต้อนรับกลับมา ♡", en: "Welcome back ♡" },
  resumeBody: {
    th: "เล่นต่อจากที่ค้างไว้ หรือเริ่มเรื่องใหม่ก็ได้ ตั๋วรางวัลที่ได้แล้วจะยังอยู่ครบ",
    en: "Continue where you left off, or restart the story. Your reward tickets stay safe.",
  },
  resumeContinue: { th: "เล่นต่อ", en: "Continue" },
  resumeRestart: { th: "เริ่มเรื่องใหม่", en: "Restart story" },

  memoriesHint: { th: "ปัดซ้าย-ขวาเพื่อดูความทรงจำ", en: "Swipe to see our memories" },
  memoriesNext: { th: "ไปเริ่มภารกิจกัน ♡", en: "Let's start the quests ♡" },
  photoError: { th: "โหลดรูปไม่สำเร็จ", en: "Couldn't load this photo" },
  videoTapToPlay: { th: "แตะเพื่อเล่นคลิป", en: "Tap to play" },

  q1Title: { th: "เก็บหัวใจของเรา", en: "Catch My Hearts" },
  q1Hint: { th: "แตะหัวใจที่ตกลงมาให้ครบ 10 ดวง", en: "Tap the falling hearts — collect 10!" },
  q2Title: { th: "จับคู่ความรัก", en: "Love Match" },
  q2Hint: { th: "เปิดการ์ดแล้วจับคู่ให้ครบ 3 คู่", en: "Flip the cards and find all 3 pairs" },
  q2Pairs: { th: "คู่ที่เจอ", en: "Pairs" },
  q3Title: { th: "แต่งเค้กวันเกิด", en: "Birthday Cake" },
  q3StepDecor: { th: "เลือกของแต่งเค้ก 3 อย่าง", en: "Pick 3 decorations" },
  q3StepCandle: { th: "ปักเทียนบนเค้กเลย!", en: "Now add a candle!" },
  q3AddCandle: { th: "ปักเทียน 🕯️", en: "Add candle 🕯️" },
  q3StepBlow: { th: "อธิษฐานแล้วแตะเปลวไฟเพื่อเป่าเทียน", en: "Make a wish, then tap the flame to blow it out" },
  q3Blow: { th: "เป่าเทียน 💨", en: "Blow 💨" },
  q3Done: { th: "สุขสันต์วันเกิด! 🎉", en: "Happy Birthday! 🎉" },
  q3Reset: { th: "เริ่มแต่งใหม่", en: "Start over" },
  playAgain: { th: "เล่นอีกรอบ", en: "Play again" },
  skipToNext: { th: "ไปด่านถัดไป", en: "Next quest" },

  rewardUnlocked: { th: "ปลดล็อกรางวัลแล้ว!", en: "Reward unlocked!" },
  rewardAlready: { th: "ตั๋วใบนี้อยู่ในคอลเลกชันของเธอแล้ว ♡", en: "This ticket is already in your collection ♡" },
  nextQuest: { th: "ไปภารกิจถัดไป", en: "Next quest" },
  toRewards: { th: "ดูตั๋วรางวัลทั้งหมด", en: "See my rewards" },

  rewardsTitle: { th: "คอลเลกชันตั๋วรางวัล", en: "Love Reward Collection" },
  rewardsSub: {
    th: "เปิดดูได้ตลอด ตั๋วจะถูกใช้ก็ต่อเมื่อกดยืนยันเท่านั้น",
    en: "View anytime — a ticket is only used after you confirm.",
  },
  statusLocked: { th: "ล็อกอยู่", en: "Locked" },
  statusAvailable: { th: "พร้อมใช้", en: "Available" },
  statusRedeemed: { th: "ใช้แล้ว", en: "Redeemed" },
  lockedHint: { th: "ผ่านภารกิจที่ {n} เพื่อปลดล็อก", en: "Complete Quest {n} to unlock" },
  viewTicket: { th: "ดูตั๋ว", en: "View ticket" },
  redeem: { th: "ใช้ตั๋วใบนี้", en: "Use this ticket" },
  redeemConfirmTitle: { th: "จะใช้ตั๋วใบนี้จริงไหม?", en: "Use this ticket now?" },
  redeemConfirmBody: {
    th: "เมื่อยืนยันแล้ว ตั๋วจะถูกประทับว่าใช้แล้ว (ยังเปิดดูได้เหมือนเดิม) อย่าลืมโชว์ให้เราดูด้วยนะ!",
    en: "Once confirmed, it gets a USED stamp (you can still view it). Don't forget to show it to me!",
  },
  redeemConfirm: { th: "ยืนยัน ใช้เลย ♡", en: "Yes, use it ♡" },
  redeemCancel: { th: "ยังก่อน เก็บไว้", en: "Not yet, keep it" },
  redeemedOn: { th: "ใช้เมื่อ", en: "Used on" },
  used: { th: "USED", en: "USED" },
  savedNote: {
    th: "ตั๋วถูกบันทึกในเครื่องนี้ (เบราว์เซอร์นี้) เท่านั้น",
    en: "Tickets are saved on this device/browser only.",
  },
  toLetter: { th: "เปิดจดหมายลับ 💌", en: "Open the secret letter 💌" },
  letterLocked: { th: "ผ่านครบ 3 ภารกิจเพื่อเปิดจดหมาย", en: "Finish all 3 quests to open the letter" },
  continueQuests: { th: "ไปทำภารกิจต่อ", en: "Continue quests" },

  letterTitle: { th: "จดหมายลับวันเกิด", en: "Secret Birthday Letter" },
  letterTap: { th: "แตะซองเพื่อเปิด", en: "Tap the envelope to open" },
  replay: { th: "เล่นใหม่อีกรอบ", en: "Replay" },
  viewRewards: { th: "ดูตั๋วรางวัล", en: "View Rewards" },
  backToMemories: { th: "กลับไปดูความทรงจำ", en: "Back to Memories" },

  errorTitle: { th: "อุ๊ย มีบางอย่างผิดพลาด", en: "Oops, something went wrong" },
  errorBody: { th: "ไม่เป็นไรนะ ลองไปต่อจากตรงนี้ได้เลย", en: "No worries — you can keep going from here." },
  errorRetry: { th: "ลองอีกครั้ง", en: "Try again" },
} satisfies Record<string, Localized>;

export type UiKey = keyof typeof ui;

export function t(key: UiKey, lang: Lang, vars?: Record<string, string | number>): string {
  let s = ui[key][lang];
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v));
  return s;
}

export function loc(value: Localized, lang: Lang): string {
  return value[lang] || value.th || value.en;
}
