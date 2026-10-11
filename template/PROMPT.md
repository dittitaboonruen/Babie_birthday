# 🤖 Prompt สำหรับ Claude Code

มีให้เลือก 2 แบบ:

- **Prompt A**: มีโฟลเดอร์ template นี้อยู่แล้ว ให้ AI ช่วยใส่รูปและข้อความแทนคุณ ⏱️ ประมาณ 5–10 นาที
- **Prompt B**: Master Prompt สำหรับสร้างเกมใหม่ทั้งหมดตั้งแต่ศูนย์ ⏱️ ประมาณ 30–60 นาที

## วิธีใช้ Claude Code (ทั้ง 2 แบบ)

1. ติดตั้ง Claude Code ด้วยวิธีใดวิธีหนึ่ง (ดู <https://claude.com/claude-code>)
   - ใช้เป็น extension ใน VS Code
   - ใช้แบบ CLI
   - เปิดผ่านเว็บ claude.ai/code
2. สร้างโฟลเดอร์งาน
   - **แบบ A:** แตกไฟล์ template นี้ออกมา แล้วนำรูปของคุณใส่ไว้ในโฟลเดอร์ `my-photos/`
   - **แบบ B:** สร้างโฟลเดอร์เปล่าชื่อ `love-quest-birthday/` แล้วนำรูปใส่ไว้ใน `my-photos/` ข้างใน
3. เปิดโฟลเดอร์นั้นใน Claude Code
4. คัดลอก prompt ด้านล่าง แก้ส่วน `[ ... ]` ให้เป็นข้อมูลของคุณ แล้ววาง
5. เมื่อ AI ทำเสร็จ ให้ deploy ตาม Step 4–5 ใน [README.md](README.md)

---

## Prompt A: ใส่ข้อมูลลง template

```text
This folder is the LOVE QUEST birthday web game template (Next.js).
Please personalise it for me. Only edit src/config/birthday.ts and the files in public/memories/ — do not change components.

1. Photos are in ./my-photos/. For each one: auto-orient, resize so the long side is max 1600px,
   strip EXIF/GPS metadata, save as JPG into public/memories/ with these names:
   - portrait.jpg      ← [ชื่อไฟล์รูปหน้าแรก]
   - memory-01.jpg     ← [ชื่อไฟล์รูปที่ 1]
   - memory-02.jpg     ← [ชื่อไฟล์รูปที่ 2]
   - memory-03.jpg     ← [ชื่อไฟล์รูปที่ 3]
   (Video, optional: compress ./my-photos/[clip.mov] to public/memories/memory-video.mp4, H.264/AAC, faststart.)
   Update width/height in the config to each photo's real size.

2. Config values:
   - Birthday: [วันเดือนปี เช่น 2026-12-31], display "[31 ธ.ค.]" / "[31 DEC]"
   - What I call my partner: [ชื่อเล่น/คำเรียก]
   - Caption photo 1: [ข้อความ]
   - Caption photo 2: [ข้อความ]
   - Caption photo 3: [ข้อความ]
   - Tickets (keep 3): [ใช้ค่าเดิม หรือ ระบุชื่อ+รายละเอียดรางวัลใหม่ 3 อย่าง]
   - Birthday letter (Thai) — use EXACTLY my words, keep line breaks, do not rewrite:
     """
     [วางคำอวยพรของคุณที่นี่]
     """
   - Letter signature: [ลายเซ็น หรือเว้นว่าง]
   - English captions: translate my Thai captions naturally. Leave birthdayLetter.en empty
     (the English view falls back to the Thai letter).

3. Then run: npm install, npm run typecheck, npm run lint, npm run build — fix any errors.
4. Start the app and check that the welcome screen, gallery and letter show my content.
5. Tell me exactly what you changed and anything I still need to do before deploying to Vercel.
```

---

## Prompt B: Master Prompt (สร้างใหม่ทั้งหมด)

> ใช้เมื่อไม่มี template หรืออยากให้ AI สร้างเวอร์ชันของตัวเอง แก้ `[ ... ]` ก่อนวาง

```text
PROJECT: LOVE QUEST — Birthday Edition 💗
Tagline: 3 Little Quests. 3 Love Rewards. 1 Special Person.

You are a senior Next.js developer, creative front-end engineer, UX designer and casual-game developer.
Build a complete, beautiful, fully functional, mobile-first romantic birthday web game for my partner.
Birthday: [YYYY-MM-DD]. Default language: Thai, with an English switch.
Implement the real application (not a mockup). Start by inspecting the folder and the media in ./my-photos/.
If something is missing, explain the specific blocker instead of pretending it is done.

## Tech
Next.js 15 App Router, TypeScript 5 (not 6), Tailwind CSS 4, Motion (motion/react), Lucide React,
localStorage only. No backend, database, login, paid APIs or AI APIs. Vercel-compatible.
Fonts via next/font/google: "Mali" (Thai + Latin) and "Press Start 2P" for small pixel labels.

## Design
Kawaii pink × retro mini-game. Palette: cream #FFF2F4, pastel #FFC6D5, pink #FF6B8A, cherry #D91F46,
dark rose #8F1734. Rounded cards, chunky "pixel" drop-shadow buttons, polaroid photo frames, emoji
hearts/bows/bears/cherries/stars, light CSS confetti. Large tap targets (min 44px), legible text,
lightweight animations, iPhone safe areas (env(safe-area-inset-*)), 100dvh layouts.

## Media (public/memories/)
Process my photos: auto-orient, max 1600px, strip EXIF/GPS, JPG. Files: portrait.jpg, memory-01..03.jpg,
optional memory-video.mp4. Never alter or regenerate faces; never crop out subjects (gallery uses
object-contain). Video: real <video> with poster, playsInline, preload="metadata", no autoplay,
a "tap to play" overlay, then native controls (user-controlled sound). If the video file fails to load
(e.g. not added yet), hide that card automatically.

## 7 screens (single page, screen state in a context provider)
1. Welcome — date badge, framed portrait, "Happy Birthday, My Love! ♡", subtitle, small animated cake,
   floating hearts, "Start Our Love Quest ♡", sound toggle, TH/EN toggle.
2. Our Memories — horizontal scroll-snap swipe carousel of polaroids with captions, prev/next buttons,
   dots, Continue.
3. Quest 1 Catch My Hearts — hearts fall (CSS keyframes, removed on animationend); tap to collect;
   counter 0/10 + progress bar; no timer, no game over; a Set ref prevents double scoring
   (handle both pointerdown and click); support touch, mouse, keyboard. Win → Ticket #01.
4. Quest 2 Love Match — 6 cards (3×2), pairs 🧸 💖 🍒, Fisher–Yates shuffle on the client each new game,
   3D CSS flip, a lock ref prevents a 3rd flip / double taps during the compare timeout. Win → Ticket #02.
5. Quest 3 Birthday Cake — SVG two-tier cake; choose exactly 3 of 8 decorations (toggle); "Add candle";
   tap the flame (or a Blow button) 3 times to blow it out, flame shrinks each tap; smoke, confetti,
   floating hearts. No microphone. Win → Ticket #03.
6. Love Reward Collection — exactly 3 tickets with code, emoji stub, name, description, terms,
   status Locked / Available / Redeemed, unlock reveal animation the first time. "View ticket" opens a
   modal; viewing NEVER redeems. "Use this ticket" → explicit confirm step ("Yes, use it" / "Not yet").
   Redeemed tickets stay visible with a USED stamp + date. Letter button enabled after all 3 quests.
7. Secret Birthday Letter — tap envelope → paper-style letter card (lined paper), preserves line
   breaks (white-space: pre-line). Content renders immediately on tap; never blocked by animation.
   Then "Thank you for being my favorite person. ♡" and buttons: View Rewards, Back to Memories, Replay.
After each quest win show a reward modal with confetti: Next quest / See my rewards / Play again.
Top bar on every screen: back button, quest progress (1/3, 2/3, 3/3 with hearts), sound, language.
If a quest is already completed, show a "Next quest" skip button.

## Config — src/config/birthday.ts (ALL personal content here, typed, with ✏️ comments)
birthday date + display date, partner name, greeting texts, portrait (src, alt, objectPosition),
memories array (photo | video, captions), 3 tickets, birthdayLetter { th, en }, letterSignature,
letter placeholder, ending text, optional background music src, theme colours (applied as CSS
variables in layout.tsx), default language, default sound on/off. Every text is { th, en }.
Do NOT invent the birthday letter. Use this text exactly (keep line breaks):
"""
[วางคำอวยพรของคุณที่นี่ — หรือเว้นว่างไว้]
"""
If empty, show "A little letter is waiting for you ♡". If only one language is filled, fall back to it.
Captions: [ระบุคำบรรยายรูป 1–3]. Tickets: #01 Free Hugs & Kisses, #02 Your Favorite Meal,
#03 Special Date With Me (or: [ระบุรางวัลของคุณ]).
UI labels (buttons/hints) live in src/lib/i18n.ts with TH/EN.

## Persistence (localStorage, versioned)
Store: screen checkpoint, started, quests {1,2,3}, tickets {status, revealed, unlockedAt, redeemedAt},
letterOpened, prefs {lang, sound}. Sanitize field-by-field onto safe defaults; survive corrupt JSON and
blocked storage. Completing a quest only moves a ticket locked → available (never downgrades a
redeemed ticket). Replaying never resets tickets. On a return visit with progress, open on Welcome and
show a "Welcome back" modal: Continue (go to saved screen) / Restart story (tickets kept).
Note in the UI that tickets are saved on this device only.

## Quality
Sound effects via a tiny WebAudio synth (no files), respecting the sound toggle; unlock audio on first tap.
Reduced motion: MotionConfig reducedMotion="user"; Quest 1 hearts appear in place (timed) instead of
falling so the game stays playable. Error boundary with friendly fallback (retry / go to letter / rewards).
Loading state while reading storage. Keyboard focus styles. noindex metadata.

## Verify before finishing
npm run typecheck, npm run lint, npm run build all pass. Play through every screen at 393×852
(e.g. Playwright): win all 3 quests, view vs. redeem a ticket (cancel + confirm), refresh mid-game,
replay, corrupt storage, reduced motion. Fix everything found.

## Deliverables
Working source, README (Thai) with: how to edit the config, replace media, run locally, deploy to
Vercel (Import repo → Deploy), testing checklist, privacy note (public/ files are reachable by URL;
use Vercel Deployment Protection for real privacy; progress is per-device localStorage).
```

---

## 💡 Tips

- ถ้า AI ทำไม่ครบในครั้งเดียว ให้พิมพ์ต่อว่า `continue` หรือบอกให้ทำ Phase ถัดไป
- ถ้าอยากแก้ทีละจุด ให้บอกแบบเจาะจง เช่น `เปลี่ยนคำบรรยายรูปที่ 2 เป็น "..."` หรือ `เปลี่ยนตั๋วใบที่ 3 เป็น "ดูหนังด้วยกัน"`
- บอกให้ AI รัน `npm run build` ทุกครั้งก่อน deploy
- **ใส่คำอวยพรด้วยตัวเองเสมอ** prompt ทั้ง 2 แบบสั่งไว้แล้วว่าไม่ให้ AI แต่งจดหมายแทน
