import type { SavedStory } from "@/domain/story";
import { StoryLibraryList } from "@/components/story-library-list";

type FavoritesTabProps = {
  stories: SavedStory[];
  favoriteInFlightIds: Set<string>;
  onToggleFavorite: (story: SavedStory) => Promise<void> | void;
};

export function FavoritesTab({ stories, favoriteInFlightIds, onToggleFavorite }: FavoritesTabProps) {
  return (
    <StoryLibraryList
      sectionTitle="Favoritas"
      sectionCopy="As histórias marcadas como favoritas aparecem aqui para tocar novamente quando quiser."
      emptyMessage="Nenhuma história favorita ainda."
      stories={stories.filter((story) => story.favorite)}
      favoriteInFlightIds={favoriteInFlightIds}
      onToggleFavorite={onToggleFavorite}
    />
  );
}
