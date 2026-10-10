"use client";

import { Lock } from "lucide-react";
import type { TicketConfig } from "@/config/birthday";
import type { TicketStatus } from "@/lib/storage";
import { useGame } from "@/components/GameProvider";
import { loc, t } from "@/lib/i18n";

/** The visual ticket (used in the collection, reward modal and ticket viewer). */
export function TicketFace({
  ticket,
  status,
  compact = false,
  showDescription = true,
}: {
  ticket: TicketConfig;
  status: TicketStatus;
  compact?: boolean;
  showDescription?: boolean;
}) {
  const { lang } = useGame();
  const locked = status === "locked";
  const statusLabel =
    status === "locked" ? t("statusLocked", lang) : status === "available" ? t("statusAvailable", lang) : t("statusRedeemed", lang);

  return (
    <div className="relative">
      <div
        className={`ticket-notch relative flex overflow-hidden rounded-2xl border-2 border-rose ${
          locked ? "bg-white/70" : "bg-gradient-to-br from-white via-cream to-blush"
        }`}
      >
        {/* Stub */}
        <div
          className={`flex shrink-0 flex-col items-center justify-center gap-1 border-r-2 border-dashed border-rose/50 px-3 ${
            compact ? "w-20 py-3" : "w-24 py-5"
          } ${locked ? "bg-blush/30" : "bg-pink/15"}`}
        >
          <span className={`${compact ? "text-3xl" : "text-4xl"} ${locked ? "opacity-40 grayscale" : ""}`} aria-hidden>
            {locked ? "🔒" : ticket.emoji}
          </span>
          <span className="font-pixel text-[7px] leading-tight text-rose/80">#{String(ticket.quest).padStart(2, "0")}</span>
        </div>
        {/* Body */}
        <div className={`min-w-0 flex-1 ${compact ? "p-3" : "p-4"}`}>
          <p className="font-pixel text-[7px] tracking-wider text-cherry/80">LOVE TICKET · {ticket.code}</p>
          <h3 className={`mt-1 font-bold leading-tight text-rose ${compact ? "text-base" : "text-xl"}`}>
            {locked ? "? ? ?" : loc(ticket.name, lang)}
          </h3>
          {showDescription && !locked && (
            <p className="mt-1.5 text-sm leading-snug text-rose/80">{loc(ticket.description, lang)}</p>
          )}
          {!compact && !locked && <p className="mt-2 text-xs text-rose/60">{loc(ticket.terms, lang)}</p>}
          <span
            className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${
              status === "available"
                ? "bg-cherry text-white"
                : status === "redeemed"
                  ? "bg-rose/15 text-rose"
                  : "bg-rose/10 text-rose/70"
            }`}
          >
            {locked && <Lock size={11} strokeWidth={3} />}
            {statusLabel}
          </span>
        </div>
      </div>
      {status === "redeemed" && <UsedStamp />}
    </div>
  );
}

function UsedStamp() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <span className="-rotate-12 rounded-lg border-4 border-cherry/80 px-3 py-0.5 font-pixel text-xl tracking-widest text-cherry/80 mix-blend-multiply">
        USED
      </span>
    </div>
  );
}
