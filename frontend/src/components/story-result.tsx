import type { GeneratedStory } from "@/domain/story-generation";

type StoryResultProps = {
  story: GeneratedStory;
  canToggleFavorite: boolean;
  isFavorite: boolean;
  isFavoriteUpdating: boolean;
  onToggleFavorite: () => Promise<void> | void;
  onCreateAnother: () => void;
};

export function StoryResult({
  story,
  canToggleFavorite,
  isFavorite,
  isFavoriteUpdating,
  onToggleFavorite,
  onCreateAnother
}: StoryResultProps) {
  const { sourceParams } = story;
  const themeLabel: Record<typeof sourceParams.theme, string> = {
    adventure: "Aventura",
    animals: "Animais",
    space: "Espaço",
    princess_prince: "Princesa/Príncipe",
    dinosaurs: "Dinossauros",
    fantasy_magic: "Fantasia e magia",
    nature: "Natureza"
  };
  const typeLabel: Record<typeof sourceParams.storyType, string> = {
    funny: "Divertida",
    educational: "Educativa",
    bedtime: "Para Dormir",
    moral_lesson: "Lição de Moral"
  };

  const favoriteLabel = isFavorite ? "Remover dos Favoritos" : "Salvar nos Favoritos";

  return (
    <section className="result-screen" aria-label="Resultado da história">
      <p className="result-metadata">
        {story.estimatedMinutes} min · {themeLabel[sourceParams.theme]} · {typeLabel[sourceParams.storyType]}
      </p>
      <h2 className="result-title">{story.title}</h2>

      <article className="result-story-card">
        <p>{story.text}</p>
      </article>

      <div className="result-actions">
        {canToggleFavorite && (
          <button
            type="button"
            className="primary-button result-primary-action"
            onClick={onToggleFavorite}
            disabled={isFavoriteUpdating}
            aria-label={favoriteLabel}
          >
            {isFavoriteUpdating ? "Atualizando..." : favoriteLabel}
          </button>
        )}
        <button type="button" className="result-secondary-action" onClick={onCreateAnother}>
          Criar outra história
        </button>
      </div>
    </section>
  );
}
