import type { Metadata, Viewport } from "next";
import type { CSSProperties } from "react";
import { Mali, Press_Start_2P } from "next/font/google";
import { birthdayConfig } from "@/config/birthday";
import "./globals.css";

const mali = Mali({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mali",
  display: "swap",
});

const pixel = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pixel",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LOVE QUEST — Birthday Edition 💗",
  description: "3 Little Quests. 3 Love Rewards. 1 Special Person.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: birthdayConfig.theme.cream,
};

const { theme } = birthdayConfig;
const themeVars = {
  "--lq-cream": theme.cream,
  "--lq-pastel": theme.pastelPink,
  "--lq-pink": theme.vibrantPink,
  "--lq-cherry": theme.cherryRed,
  "--lq-rose": theme.darkRose,
} as CSSProperties;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={theme.defaultLanguage} style={themeVars} className={`${mali.variable} ${pixel.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
