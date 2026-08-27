"use client";

import type { ReactNode } from "react";
import { SettingsProvider } from "@/lib/settings";
import { ProgressProvider } from "@/lib/progress";
import { AchievementsProvider } from "@/lib/achievements";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SettingsProvider>
      <ProgressProvider>
        <AchievementsProvider>{children}</AchievementsProvider>
      </ProgressProvider>
    </SettingsProvider>
  );
}
