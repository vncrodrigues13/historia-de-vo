"use client";

import { useState } from "react";
import { CreateTab, type StoryDraftState } from "@/components/create-tab";
import { FavoritesTab } from "@/components/favorites-tab";
import { HistoryTab } from "@/components/history-tab";
import { SettingsTab } from "@/components/settings-tab";
import { StoryResult } from "@/components/story-result";
import type { UserSettings } from "@/domain/settings";
import type { SavedStory, StoryParams } from "@/domain/story";
import type { GeneratedStory } from "@/domain/story-generation";
import {
  StoryGenerationService,
  toStoryGenerationUserMessage
} from "@/services/story-generation/story-generation.service";
import {
  listSavedStories,
  persistGeneratedStory,
  toggleFavorite
} from "@/services/story-generation/story-persistence";
import { loadUserSettings } from "@/services/settings-storage";

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

function createInitialDraft(settings: UserSettings): StoryDraftState {
  return {
    childName: "",
    childAge: "6",
    theme: "adventure",
    storyType: settings.defaultStoryType,
    duration: settings.defaultStoryDuration,
    specialDetail: ""
  };
}

type TabShellProps = {
  generationService?: StoryGenerationService;
  persistStory?: (story: GeneratedStory, settings: UserSettings) => Promise<void>;
};

export function TabShell({ generationService: injectedGenerationService, persistStory = persistGeneratedStory }: TabShellProps) {
  const [userSettings, setUserSettings] = useState<UserSettings>(() => loadUserSettings());
  const [activeTab, setActiveTab] = useState<AppTab>("create");
  const [draftStory, setDraftStory] = useState<StoryDraftState>(() => createInitialDraft(userSettings));
  const [generatedStory, setGeneratedStory] = useState<GeneratedStory | null>(null);
  const [savedStories, setSavedStories] = useState<SavedStory[]>(() => listSavedStories());
  const [favoriteInFlightIds, setFavoriteInFlightIds] = useState<Set<string>>(() => new Set());
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [storageWarning, setStorageWarning] = useState<string | null>(null);
  const [generationService] = useState(() => injectedGenerationService ?? new StoryGenerationService());

  const refreshSavedStories = () => {
    setSavedStories(listSavedStories());
  };

  const toggleStoryFavorite = async (story: SavedStory) => {
    if (favoriteInFlightIds.has(story.id)) {
      return;
    }

    setFavoriteInFlightIds((current) => new Set(current).add(story.id));
    setStorageWarning(null);

    try {
      const result = await toggleFavorite(story.id);
      if (result.status !== "updated") {
        setStorageWarning("Não foi possível atualizar favoritos agora. Tente novamente.");
        return;
      }
      refreshSavedStories();
    } catch {
      setStorageWarning("Não foi possível atualizar favoritos agora. Tente novamente.");
    } finally {
      setFavoriteInFlightIds((current) => {
        const next = new Set(current);
        next.delete(story.id);
        return next;
      });
    }
  };

  const handleCreateSubmit = async (params: StoryParams) => {
    setSubmitError(null);
    setStorageWarning(null);

    try {
      const story = await generationService.generate({ params });
      setGeneratedStory(story);
      setActiveTab("create");

      try {
        await persistStory(story, userSettings);
        refreshSavedStories();
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

  const generatedSavedStory = generatedStory
    ? savedStories.find((story) => story.id === generatedStory.id)
    : null;

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
                canToggleFavorite={Boolean(generatedSavedStory)}
                isFavorite={Boolean(generatedSavedStory?.favorite)}
                isFavoriteUpdating={Boolean(generatedSavedStory && favoriteInFlightIds.has(generatedSavedStory.id))}
                onToggleFavorite={() => {
                  if (!generatedSavedStory) {
                    return Promise.resolve();
                  }
                  return toggleStoryFavorite(generatedSavedStory);
                }}
                onCreateAnother={() => {
                  setGeneratedStory(null);
                  setSubmitError(null);
                  setDraftStory(createInitialDraft(userSettings));
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
          {activeTab === "history" && (
            <HistoryTab
              stories={savedStories}
              favoriteInFlightIds={favoriteInFlightIds}
              onToggleFavorite={toggleStoryFavorite}
            />
          )}
          {activeTab === "favorites" && (
            <FavoritesTab
              stories={savedStories}
              favoriteInFlightIds={favoriteInFlightIds}
              onToggleFavorite={toggleStoryFavorite}
            />
          )}
          {activeTab === "settings" && (
            <SettingsTab
              settings={userSettings}
              onSettingsSaved={(settings) => setUserSettings(settings)}
            />
          )}
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
