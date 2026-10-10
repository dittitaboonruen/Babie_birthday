"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { birthdayConfig, type TicketId } from "@/config/birthday";
import { useGame } from "@/components/GameProvider";
import { t } from "@/lib/i18n";
import type { ScreenId } from "@/lib/storage";
import { Button } from "@/components/ui/Button";
import { Confetti } from "@/components/ui/Confetti";
import { Modal } from "@/components/ui/Modal";
import { TicketFace } from "@/components/ui/Ticket";
import { TopBar } from "@/components/ui/TopBar";

export function RewardsScreen() {
  const { lang, data, go, sfx, markRevealed } = useGame();
  const [viewing, setViewing] = useState<TicketId | null>(null);
  // Tickets unlocked since the last visit get a reveal animation (captured once on mount).
  const [fresh] = useState<TicketId[]>(() =>
    birthdayConfig.tickets.filter((tk) => data.tickets[tk.id].status !== "locked" && !data.tickets[tk.id].revealed).map((tk) => tk.id),
  );

  useEffect(() => {
    if (fresh.length === 0) return;
    sfx("unlock");
    fresh.forEach((id) => markRevealed(id));
  }, [fresh, markRevealed, sfx]);

  const allDone = data.quests[1] && data.quests[2] && data.quests[3];
  const nextQuest: ScreenId = !data.quests[1] ? "quest1" : !data.quests[2] ? "quest2" : "quest3";

  return (
    <div className="flex min-h-dvh flex-col">
      {fresh.length > 0 && <Confetti pieces={50} />}
      <TopBar onBack={() => go(allDone ? "quest3" : nextQuest)} />
      <div className="px-5 text-center">
        <h1 className="text-2xl font-bold text-cherry">🎟️ {t("rewardsTitle", lang)}</h1>
        <p className="mt-1 text-sm text-rose/75">{t("rewardsSub", lang)}</p>
      </div>

      <ul className="mt-5 flex flex-col gap-4 px-5">
        {birthdayConfig.tickets.map((ticket, i) => {
          const state = data.tickets[ticket.id];
          const isFresh = fresh.includes(ticket.id);
          return (
            <motion.li
              key={ticket.id}
              initial={isFresh ? { scale: 0.6, rotate: -8, opacity: 0 } : { y: 16, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, y: 0, opacity: 1 }}
              transition={isFresh ? { type: "spring", stiffness: 260, damping: 12, delay: 0.25 + i * 0.15 } : { delay: i * 0.07 }}
            >
              {state.status === "locked" ? (
                <div aria-label={`${t("statusLocked", lang)} — ${t("lockedHint", lang, { n: ticket.quest })}`}>
                  <TicketFace ticket={ticket} status="locked" compact />
                  <p className="mt-1.5 text-center text-xs text-rose/60">{t("lockedHint", lang, { n: ticket.quest })}</p>
                </div>
              ) : (
                <button
                  type="button"
                  className="block w-full text-left transition-transform active:scale-[0.98]"
                  onClick={() => {
                    sfx("click");
                    setViewing(ticket.id);
                  }}
                  aria-label={`${t("viewTicket", lang)}: ${ticket.name[lang]}`}
                >
                  <TicketFace ticket={ticket} status={state.status} compact showDescription={false} />
                  <span className="mt-1.5 block text-center text-xs font-bold text-cherry underline underline-offset-2">
                    {t("viewTicket", lang)} →
                  </span>
                </button>
              )}
            </motion.li>
          );
        })}
      </ul>

      <p className="mt-4 px-5 text-center text-[11px] text-rose/50">{t("savedNote", lang)}</p>

      <div className="mt-auto flex flex-col gap-3 px-5 pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        {allDone ? (
          <Button className="w-full text-lg" onClick={() => go("letter")}>
            {t("toLetter", lang)}
          </Button>
        ) : (
          <>
            <p className="text-center text-sm text-rose/70">🔒 {t("letterLocked", lang)}</p>
            <Button className="w-full" onClick={() => go(nextQuest)}>
              {t("continueQuests", lang)} →
            </Button>
          </>
        )}
      </div>

      <TicketModal id={viewing} onClose={() => setViewing(null)} />
    </div>
  );
}

function TicketModal({ id, onClose }: { id: TicketId | null; onClose: () => void }) {
  const { lang, data, redeem, sfx } = useGame();
  const [confirming, setConfirming] = useState(false);
  const [lastId, setLastId] = useState<TicketId | null>(id);
  if (id && id !== lastId) {
    setLastId(id);
    setConfirming(false);
  }
  const shownId = id ?? lastId;
  const ticket = birthdayConfig.tickets.find((tk) => tk.id === shownId);
  const state = shownId ? data.tickets[shownId] : null;

  const close = () => {
    setConfirming(false);
    onClose();
  };

  return (
    <Modal open={id !== null} onClose={close} labelledBy="ticket-modal-title">
      {ticket && state && (
        <div>
          <h2 id="ticket-modal-title" className="sr-only">
            {ticket.name[lang]}
          </h2>
          <TicketFace ticket={ticket} status={state.status} />
          {state.status === "redeemed" && state.redeemedAt && (
            <p className="mt-2 text-center text-xs text-rose/70">
              {t("redeemedOn", lang)}{" "}
              {new Date(state.redeemedAt).toLocaleDateString(lang === "th" ? "th-TH" : "en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          )}

          {confirming ? (
            <div className="mt-4 rounded-2xl border-2 border-dashed border-cherry/60 bg-white p-4 text-center">
              <p className="text-lg font-bold text-cherry">{t("redeemConfirmTitle", lang)}</p>
              <p className="mt-1 text-sm text-rose/80">{t("redeemConfirmBody", lang)}</p>
              <div className="mt-4 flex flex-col gap-2.5">
                <Button
                  onClick={() => {
                    redeem(ticket.id);
                    sfx("match");
                    setConfirming(false);
                  }}
                >
                  {t("redeemConfirm", lang)}
                </Button>
                <Button variant="secondary" onClick={() => setConfirming(false)}>
                  {t("redeemCancel", lang)}
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-5 flex flex-col gap-2.5">
              {state.status === "available" && (
                <Button
                  onClick={() => {
                    sfx("click");
                    setConfirming(true);
                  }}
                >
                  {t("redeem", lang)}
                </Button>
              )}
              <Button variant="secondary" onClick={close}>
                {t("close", lang)}
              </Button>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
