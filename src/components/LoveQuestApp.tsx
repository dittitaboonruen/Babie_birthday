"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useGame } from "./GameProvider";
import { ErrorBoundary } from "./ErrorBoundary";
import { Button } from "./ui/Button";
import { t } from "@/lib/i18n";
import type { ScreenId } from "@/lib/storage";
import { WelcomeScreen } from "./screens/WelcomeScreen";
import { MemoriesScreen } from "./screens/MemoriesScreen";
import { CatchHeartsScreen } from "./screens/CatchHeartsScreen";
import { LoveMatchScreen } from "./screens/LoveMatchScreen";
import { CakeScreen } from "./screens/CakeScreen";
import { RewardsScreen } from "./screens/RewardsScreen";
import { LetterScreen } from "./screens/LetterScreen";

const SCREEN_COMPONENTS: Record<ScreenId, () => React.JSX.Element> = {
  welcome: WelcomeScreen,
  memories: MemoriesScreen,
  quest1: CatchHeartsScreen,
  quest2: LoveMatchScreen,
  quest3: CakeScreen,
  rewards: RewardsScreen,
  letter: LetterScreen,
};

export function LoveQuestApp() {
  const { ready, data, lang, go } = useGame();

  if (!ready) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-3" aria-busy="true">
        <span className="animate-bob text-5xl" aria-hidden>
          💗
        </span>
        <p className="text-sm font-semibold text-rose/80">{t("loading", lang)}</p>
      </main>
    );
  }

  const Screen = SCREEN_COMPONENTS[data.screen];

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={data.screen}
          className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          <ErrorBoundary
            fallback={(reset) => (
              <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
                <span className="text-5xl" aria-hidden>
                  🥺
                </span>
                <h1 className="text-xl font-bold">{t("errorTitle", lang)}</h1>
                <p className="text-rose/80">{t("errorBody", lang)}</p>
                <Button onClick={reset}>{t("errorRetry", lang)}</Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    reset();
                    go("letter");
                  }}
                >
                  {t("toLetter", lang)}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    reset();
                    go("rewards");
                  }}
                >
                  {t("viewRewards", lang)}
                </Button>
              </div>
            )}
          >
            <Screen />
          </ErrorBoundary>
        </motion.main>
      </AnimatePresence>
    </MotionConfig>
  );
}
