"use client";

import { useState } from "react";
import { CreateTab, type StoryDraftState } from "@/components/create-tab";
import { FavoritesTab } from "@/components/favorites-tab";
import { HistoryTab } from "@/components/history-tab";
import { SettingsTab } from "@/components/settings-tab";

type AppTab = "create" | "history" | "favorites" | "settings";

const tabLabels: Record<AppTab, string> = {
  create: "Create",
  history: "History",
  favorites: "Favorites",
  settings: "Settings"
};

const initialDraft: StoryDraftState = {
  childName: "",
  childAge: 6,
  theme: "adventure",
  storyType: "bedtime",
  duration: "short",
  specialDetail: ""
};

export function TabShell() {
  const [activeTab, setActiveTab] = useState<AppTab>("create");
  const [draftStory, setDraftStory] = useState<StoryDraftState>(initialDraft);

  return (
    <main className="page-shell">
      <div className="app-card">
        <header className="app-header">
          <h1 className="app-title">Historias de Vo</h1>
        </header>

        <nav className="tab-list" aria-label="Main sections" role="tablist">
          {(Object.keys(tabLabels) as AppTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              className="tab-button"
              onClick={() => setActiveTab(tab)}
              role="tab"
              aria-selected={activeTab === tab}
              aria-controls={`panel-${tab}`}
              id={`tab-${tab}`}
            >
              {tabLabels[tab]}
            </button>
          ))}
        </nav>

        <section
          className="tab-panel"
          id={`panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
        >
          {activeTab === "create" && <CreateTab draft={draftStory} onDraftChange={setDraftStory} />}
          {activeTab === "history" && <HistoryTab />}
          {activeTab === "favorites" && <FavoritesTab />}
          {activeTab === "settings" && <SettingsTab />}
        </section>
      </div>
    </main>
  );
}
