import type { SavedStory } from "@/domain/story";
import { StoryLibraryList } from "@/components/story-library-list";

type HistoryTabProps = {
  stories: SavedStory[];
  favoriteInFlightIds: Set<string>;
  onToggleFavorite: (story: SavedStory) => Promise<void> | void;
};

export function HistoryTab({ stories, favoriteInFlightIds, onToggleFavorite }: HistoryTabProps) {
  return (
    <StoryLibraryList
      sectionTitle="Histórico"
      sectionCopy="Histórias já geradas ficam disponíveis aqui para replay rápido."
      emptyMessage="Nenhuma história no histórico ainda."
      stories={stories}
      favoriteInFlightIds={favoriteInFlightIds}
      onToggleFavorite={onToggleFavorite}
    />
  );
}
