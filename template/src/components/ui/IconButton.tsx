"use client";

import type { ButtonHTMLAttributes } from "react";

export function IconButton({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex h-11 min-w-11 items-center justify-center rounded-full border-2 border-blush bg-white/85 px-2 text-rose backdrop-blur transition-transform active:scale-95 ${className}`}
    />
  );
}
