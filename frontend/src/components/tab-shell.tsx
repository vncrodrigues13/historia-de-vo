"use client";

import { useState } from "react";
import { CreateTab, type StoryDraftState } from "@/components/create-tab";
import { FavoritesTab } from "@/components/favorites-tab";
import { HistoryTab } from "@/components/history-tab";
import { SettingsTab } from "@/components/settings-tab";
import type { StoryParams } from "@/domain/story";

type AppTab = "create" | "history" | "favorites" | "settings";

const tabLabels: Record<AppTab, string> = {
  create: "Criar",
  history: "Histórico",
  favorites: "Favoritas",
  settings: "Configurações"
};

const mobileTabLabels: Record<AppTab, string> = {
  create: "Criar",
  history: "Histórico",
  favorites: "Favoritas",
  settings: "Ajustes"
};

const mobileTabIcons: Record<AppTab, string> = {
  create: "✎",
  history: "↺",
  favorites: "♡",
  settings: "⚙"
};

const initialDraft: StoryDraftState = {
  childName: "",
  childAge: "6",
  theme: "adventure",
  storyType: "bedtime",
  duration: "short",
  specialDetail: ""
};

export function TabShell() {
  const [activeTab, setActiveTab] = useState<AppTab>("create");
  const [draftStory, setDraftStory] = useState<StoryDraftState>(initialDraft);
  const [submissionState, setSubmissionState] = useState<"idle" | "pending" | "done">("idle");

  const handleCreateSubmit = async (params: StoryParams) => {
    setSubmissionState("pending");
    await Promise.resolve(params);
    setSubmissionState("done");
  };

  return (
    <main className="page-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <h1 className="app-title">Contos de Ninar</h1>
          <nav className="tab-list" aria-label="Seções principais" role="tablist">
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
          <div className="profile-icon" aria-hidden="true" />
        </div>
      </header>

      <div className="page-decoration page-decoration-star" aria-hidden="true" />
      <div className="page-decoration page-decoration-moon" aria-hidden="true" />

      <div className="app-content">
        <section
          className="tab-panel"
          id={`panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
        >
          {activeTab === "create" && (
            <CreateTab draft={draftStory} onDraftChange={setDraftStory} onSubmit={handleCreateSubmit} />
          )}
          {activeTab === "history" && <HistoryTab />}
          {activeTab === "favorites" && <FavoritesTab />}
          {activeTab === "settings" && <SettingsTab />}
        </section>

        {submissionState === "done" && (
          <footer className="submit-feedback" role="status" aria-live="polite">
            História enviada para geração.
          </footer>
        )}
      </div>

      <nav className="mobile-tab-list" aria-label="Seções principais móveis">
          {(Object.keys(tabLabels) as AppTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              className="mobile-tab-button"
              onClick={() => setActiveTab(tab)}
              aria-current={activeTab === tab ? "page" : undefined}
            >
              <span aria-hidden="true">{mobileTabIcons[tab]}</span>
              {mobileTabLabels[tab]}
            </button>
          ))}
        </nav>
    </main>
  );
}
