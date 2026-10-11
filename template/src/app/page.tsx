import { GameProvider } from "@/components/GameProvider";
import { LoveQuestApp } from "@/components/LoveQuestApp";

export default function Home() {
  return (
    <GameProvider>
      <LoveQuestApp />
    </GameProvider>
  );
}
