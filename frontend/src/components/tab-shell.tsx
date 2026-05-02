"use client";

import { useState } from "react";
import { CreateTab, type StoryDraftState } from "@/components/create-tab";
import { FavoritesTab } from "@/components/favorites-tab";
import { HistoryTab } from "@/components/history-tab";
import { SettingsTab } from "@/components/settings-tab";
import { StoryResult } from "@/components/story-result";
import type { StoryParams } from "@/domain/story";
import type { GeneratedStory } from "@/domain/story-generation";
import {
  StoryGenerationService,
  toStoryGenerationUserMessage
} from "@/services/story-generation/story-generation.service";
import { persistGeneratedStory } from "@/services/story-generation/story-persistence";

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

type TabShellProps = {
  generationService?: StoryGenerationService;
  persistStory?: (story: GeneratedStory) => Promise<void>;
};

export function TabShell({ generationService: injectedGenerationService, persistStory = persistGeneratedStory }: TabShellProps) {
  const [activeTab, setActiveTab] = useState<AppTab>("create");
  const [draftStory, setDraftStory] = useState<StoryDraftState>(initialDraft);
  const [generatedStory, setGeneratedStory] = useState<GeneratedStory | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [storageWarning, setStorageWarning] = useState<string | null>(null);
  const [generationService] = useState(() => injectedGenerationService ?? new StoryGenerationService());

  const handleCreateSubmit = async (params: StoryParams) => {
    setSubmitError(null);
    setStorageWarning(null);

    try {
      const story = await generationService.generate({ params });
      setGeneratedStory(story);
      setActiveTab("create");

      try {
        await persistStory(story);
      } catch {
        setStorageWarning("A história foi gerada, mas não conseguimos salvar localmente nesta tentativa.");
      }
    } catch (error) {
      setGeneratedStory(null);
      setSubmitError(toStoryGenerationUserMessage(error));
    }
  };

  const handleDraftChange = (next: StoryDraftState) => {
    if (submitError) {
      setSubmitError(null);
    }
    setDraftStory(next);
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
            generatedStory ? (
              <StoryResult
                story={generatedStory}
                onCreateAnother={() => {
                  setGeneratedStory(null);
                  setSubmitError(null);
                }}
              />
            ) : (
              <CreateTab
                draft={draftStory}
                onDraftChange={handleDraftChange}
                onSubmit={handleCreateSubmit}
                submitError={submitError}
              />
            )
          )}
          {activeTab === "history" && <HistoryTab />}
          {activeTab === "favorites" && <FavoritesTab />}
          {activeTab === "settings" && <SettingsTab />}
        </section>

        {generatedStory && (
          <footer className="submit-feedback" role="status" aria-live="polite">
            História gerada com sucesso.
          </footer>
        )}

        {storageWarning && (
          <footer className="storage-warning" role="status" aria-live="polite">
            {storageWarning}
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
