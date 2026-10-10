# 💗 LOVE QUEST — Birthday Edition

**3 Little Quests. 3 Love Rewards. 1 Special Person.**

A mobile-first birthday web game (11 October 2026). It opens from a link, needs no app install and takes about 3–5 minutes to play:

1. **Welcome** 🎂: framed portrait, Happy Birthday, start button, sound and TH/EN switch
2. **Our Memories** 📸: swipeable polaroid gallery of real photos plus a video (video player with tap to play, playsInline and native controls)
3. **Quest 1: Catch My Hearts** 💕: tap 10 falling hearts, with no timer and no game over → Ticket #01
4. **Quest 2: Love Match** 🧩: 6 cards, 3 pairs (🧸 💖 🍒), shuffled every game → Ticket #02
5. **Quest 3: Birthday Cake** 🎂: pick 3 decorations, add a candle, tap to blow it out (no microphone needed) → Ticket #03
6. **Love Reward Collection** 🎟️: 3 tickets. Each one goes Locked → Available → Redeemed, and you can only redeem after a confirmation step
7. **Secret Birthday Letter** 💌: tap the envelope to read your letter, then the ending screen with Replay, View Rewards and Back to Memories

Tech: Next.js 15 (App Router), TypeScript, Tailwind CSS 4, Motion, Lucide icons, localStorage. There is no backend, no database and no login.

---

## ✏️ Personalise it (one file)

Edit **`src/config/birthday.ts`**. Every text has `th` and `en` versions.

| Field | What it is |
| --- | --- |
| `birthdayLetter.th` / `.en` | **Your letter.** While empty, the letter shows "A little letter is waiting for you ♡". Line breaks are kept. Use backticks `` ` `` for multi-line text. |
| `letterSignature` | Optional signature under the letter |
| `greeting` | Welcome title, subtitle and start button |
| `boyfriendName` | Name shown under the portrait |
| `portrait` | Photo on the welcome screen. `objectPosition` sets which part stays in the frame |
| `memories` | Gallery photos and video, with captions |
| `tickets` | The 3 rewards: name, description, terms, emoji, code |
| `music.src` | Optional background music, e.g. `/music/song.mp3` (put the file in `public/music/`) |
| `theme` | Colours, default language (`th`) and whether sound starts on |

### Media

`public/memories/`:

- `memory-01.jpg`: BBQ night (also used as the welcome portrait)
- `memory-02.jpg`: silly-face selfie
- `memory-03.jpg`: dinner photo
- `memory-video.mp4`: **not included yet.** Copy your clip here using exactly this name. Until the file exists, the video card is hidden automatically so nothing looks broken.

Video tips: use MP4 (H.264 video and AAC audio, which is what an iPhone records with "Most Compatible"). Keep it under about 20 MB. To compress it:

```bash
ffmpeg -i input.mov -vf "scale=-2:1280" -c:v libx264 -crf 26 -preset slow -c:a aac -b:a 128k -movflags +faststart public/memories/memory-video.mp4
```

The photos were resized to a maximum of 1600 px, and their EXIF and GPS metadata were removed.

---

## ▶️ Run locally

Requires Node.js 18.18 or newer (20+ recommended).

```bash
npm install
npm run dev          # http://localhost:3000
```

To test on your phone over the same Wi-Fi: `npm run dev -- -H 0.0.0.0`, then open `http://<your-computer-ip>:3000`.

Checks:

```bash
npm run typecheck
npm run lint
npm run build && npm start
```

> If you add or replace files in `public/` while `npm start` is running, restart it. The production server only picks up new public files on startup. `npm run dev` picks them up immediately.

---

## 🚀 Deploy to Vercel

**Option A: GitHub + Vercel dashboard**

1. Push this repo to GitHub.
2. Go to <https://vercel.com/new> and import the repository. Vercel detects the framework as Next.js, so leave all settings at their defaults.
3. Click **Deploy** and you get a link like `https://love-quest-xxx.vercel.app`.
4. Every later push to the deployed branch redeploys automatically.

**Option B: CLI**

```bash
npm i -g vercel
vercel          # preview deployment
vercel --prod   # production link
```

Send him the production link on 11 October 💗

### ⚠️ Privacy note

Everything in `public/` (photos and video) can be reached by anyone who knows or guesses the file URL, for example `/memories/memory-01.jpg`. The site has `noindex`, so search engines won't list it, but that is **not** access control. If you need it truly private, turn on **Vercel → Project → Settings → Deployment Protection** (password protection or Vercel Authentication, depending on your plan), or don't share the link publicly.

### About saved progress

Progress and ticket states are stored in **localStorage on his device and browser only**. They don't sync between devices. Clearing browser data or using a private tab resets them. Tell him to open the link in the same browser each time.

---

## ✅ Testing checklist

- [ ] Welcome shows the portrait, title, 11 OCT, the cake and the start button. The TH/EN switch and sound toggle work
- [ ] Memories: swipe and the arrow buttons work. Photos are not cropped. The video plays with sound controls once `memory-video.mp4` is added
- [ ] Quest 1: the counter goes 0 → 10, a heart can't be scored twice, Ticket #01 unlocks with confetti
- [ ] Quest 2: cards flip, a third card can't be flipped mid-check, all 3 pairs unlock Ticket #02, Play again reshuffles
- [ ] Quest 3: exactly 3 decorations, add candle, tap the flame 3× to blow it out, Ticket #03 unlocks
- [ ] Rewards: **viewing a ticket doesn't use it**. "Use this ticket" asks for confirmation, "Not yet" keeps it, and confirming adds the USED stamp
- [ ] Refresh mid-game opens Welcome with "Continue / Restart story" and the tickets are unchanged
- [ ] Replaying the quests never resets or duplicates tickets, and redeemed tickets stay redeemed
- [ ] The letter opens from the envelope with line breaks preserved (placeholder shown while empty)
- [ ] On iPhone with Settings → Accessibility → Reduce Motion on, the game is still playable (hearts appear in place instead of falling)

To reset everything while testing: in the browser console run `localStorage.removeItem("love-quest-birthday")`, then reload. Remember to do this on your own device before the big day, **not on his** 😉

---

## Project structure

```
src/
  config/birthday.ts        ← all personal content (edit this)
  lib/storage.ts            ← versioned localStorage save (safe defaults, corrupt-data safe)
  lib/i18n.ts               ← UI labels TH/EN
  lib/sound.ts              ← tiny WebAudio sound effects (no audio files)
  components/
    GameProvider.tsx        ← game state, persistence, navigation
    LoveQuestApp.tsx        ← screen switcher + error fallback
    screens/                ← the 7 screens
    ui/                     ← Button, Modal, Ticket, Cake, Confetti, TopBar…
public/memories/            ← photos & video
```
