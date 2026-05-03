import type { SavedStory } from "@/domain/story";

type StoryLibraryListProps = {
  sectionTitle: string;
  sectionCopy: string;
  emptyMessage: string;
  stories: SavedStory[];
  favoriteInFlightIds: Set<string>;
  onToggleFavorite: (story: SavedStory) => Promise<void> | void;
};

export function StoryLibraryList({
  sectionTitle,
  sectionCopy,
  emptyMessage,
  stories,
  favoriteInFlightIds,
  onToggleFavorite
}: StoryLibraryListProps) {
  return (
    <section aria-label={`${sectionTitle} section`}>
      <h2 className="section-title">{sectionTitle}</h2>
      <p className="section-copy">{sectionCopy}</p>

      {stories.length === 0 ? (
        <p className="story-list-empty">{emptyMessage}</p>
      ) : (
        <div className="story-list" role="list" aria-label={sectionTitle}>
          {stories.map((story) => {
            const isFavoriteBusy = favoriteInFlightIds.has(story.id);
            const favoriteLabel = story.favorite ? "Remover dos Favoritos" : "Salvar nos Favoritos";

            return (
              <article className="story-list-card" key={story.id} role="listitem">
                <h3 className="story-list-title">{story.title}</h3>
                <p className="story-list-text">{story.text}</p>
                <div className="story-list-actions">
                  <button
                    type="button"
                    className="story-favorite-action"
                    onClick={() => onToggleFavorite(story)}
                    disabled={isFavoriteBusy}
                    aria-label={favoriteLabel}
                  >
                    {isFavoriteBusy ? "Atualizando..." : favoriteLabel}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
