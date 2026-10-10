"use client";

import { birthdayConfig } from "@/config/birthday";
import { useGame } from "@/components/GameProvider";
import { t } from "@/lib/i18n";
import { Button } from "./Button";
import { Confetti } from "./Confetti";
import { Modal } from "./Modal";
import { TicketFace } from "./Ticket";

export function RewardModal({
  open,
  quest,
  newlyUnlocked,
  nextLabel,
  onNext,
  onPlayAgain,
}: {
  open: boolean;
  quest: 1 | 2 | 3;
  newlyUnlocked: boolean;
  nextLabel: string;
  onNext: () => void;
  onPlayAgain: () => void;
}) {
  const { lang, data, go } = useGame();
  const ticket = birthdayConfig.tickets[quest - 1];
  return (
    <>
      {open && <Confetti />}
      <Modal open={open} labelledBy={`reward-title-${quest}`}>
        <div className="text-center">
          <p className="text-4xl" aria-hidden>
            🎉
          </p>
          <h2 id={`reward-title-${quest}`} className="mt-1 text-2xl font-bold text-cherry">
            {t("rewardUnlocked", lang)}
          </h2>
          {!newlyUnlocked && <p className="mt-1 text-sm text-rose/80">{t("rewardAlready", lang)}</p>}
        </div>
        <div className="mt-4">
          <TicketFace ticket={ticket} status={data.tickets[ticket.id].status} />
        </div>
        <div className="mt-5 flex flex-col gap-3">
          <Button onClick={onNext}>{nextLabel}</Button>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" className="text-sm" onClick={() => go("rewards")}>
              🎟️ {t("toRewards", lang)}
            </Button>
            <Button variant="secondary" className="text-sm" onClick={onPlayAgain}>
              🔁 {t("playAgain", lang)}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
