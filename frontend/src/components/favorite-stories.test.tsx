import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TabShell } from "@/components/tab-shell";
import type { SavedStory } from "@/domain/story";
import { StoryGenerationService } from "@/services/story-generation/story-generation.service";
import type { StoryProviderAdapter } from "@/services/story-generation/provider";

const STORAGE_KEY = "contos-de-ninar:saved-stories";

const favoriteStory: SavedStory = {
  id: "story-luna-1",
  title: "A Floresta de Luna",
  text: "Luna encontrou uma coruja gentil.",
  params: {
    childName: "Luna",
    childAge: 6,
    theme: "animals",
    storyType: "bedtime",
    duration: "short"
  },
  voice: "soft_female",
  speed: 1,
  favorite: true,
  createdAt: "2026-05-01T20:00:00.000Z",
  updatedAt: "2026-05-01T20:00:00.000Z",
  promptVersion: "story-v1.0.0"
};

const regularStory: SavedStory = {
  ...favoriteStory,
  id: "story-dino-1",
  title: "O Dinossauro Sonolento",
  text: "Um dinossauro pequeno guardou sua pedra preferida.",
  favorite: false,
  params: {
    childName: "Theo",
    childAge: 5,
    theme: "dinosaurs",
    storyType: "funny",
    duration: "medium"
  }
};

function writeStories(stories: SavedStory[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
}

function storyArticle(title: string) {
  const titleNode = screen.getByText(title);
  const article = titleNode.closest("article");
  if (!article) {
    throw new Error(`Expected ${title} to render inside a story card article.`);
  }
  return article;
}

describe("Favorite stories", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("favoriting from History adds the same story to Favorites and keeps it in History", async () => {
    const user = userEvent.setup();
    writeStories([regularStory]);

    render(<TabShell />);

    await user.click(screen.getByRole("tab", { name: "Histórico" }));
    const historyCard = await screen.findByText("O Dinossauro Sonolento").then(() => storyArticle("O Dinossauro Sonolento"));
    await user.click(within(historyCard).getByRole("button", { name: "Salvar nos Favoritos" }));

    await user.click(screen.getByRole("tab", { name: "Favoritas" }));
    expect(await screen.findByText("O Dinossauro Sonolento")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Histórico" }));
    expect(await screen.findByText("O Dinossauro Sonolento")).toBeInTheDocument();
    expect(within(storyArticle("O Dinossauro Sonolento")).getByRole("button", { name: "Remover dos Favoritos" })).toBeInTheDocument();
  });

  it("Favorites lists only favorite stories", async () => {
    const user = userEvent.setup();
    writeStories([favoriteStory, regularStory]);

    render(<TabShell />);
    await user.click(screen.getByRole("tab", { name: "Favoritas" }));

    expect(await screen.findByText("A Floresta de Luna")).toBeInTheDocument();
    expect(screen.queryByText("O Dinossauro Sonolento")).not.toBeInTheDocument();
  });

  it("shows Portuguese empty state when there are no favorite stories", async () => {
    const user = userEvent.setup();

    window.localStorage.clear();
    render(<TabShell />);
    await user.click(screen.getByRole("tab", { name: "Favoritas" }));

    expect(await screen.findByText("Nenhuma história favorita ainda.")).toBeInTheDocument();
  });

  it("unfavoriting from Favorites removes it from Favorites without deleting it from History", async () => {
    const user = userEvent.setup();
    writeStories([favoriteStory]);

    render(<TabShell />);
    await user.click(screen.getByRole("tab", { name: "Favoritas" }));

    const favoriteCard = await screen.findByText("A Floresta de Luna").then(() => storyArticle("A Floresta de Luna"));
    await user.click(within(favoriteCard).getByRole("button", { name: "Remover dos Favoritos" }));

    expect(await screen.findByText("Nenhuma história favorita ainda.")).toBeInTheDocument();
    expect(screen.queryByText("A Floresta de Luna")).not.toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Histórico" }));
    expect(await screen.findByText("A Floresta de Luna")).toBeInTheDocument();
    expect(within(storyArticle("A Floresta de Luna")).getByRole("button", { name: "Salvar nos Favoritos" })).toBeInTheDocument();
  });

  it("favoriting from Result writes favorite state for the persisted story", async () => {
    const user = userEvent.setup();
    const provider: StoryProviderAdapter = {
      generate: jest.fn(async () => ({
        rawText: JSON.stringify({
          title: "A Noite de Luna",
          text: "Luna guardou uma estrela pequena antes de dormir.",
          estimatedMinutes: 3
        })
      }))
    };

    render(<TabShell generationService={new StoryGenerationService(provider)} />);

    await user.type(screen.getByLabelText("Nome da criança"), "Luna");
    await user.click(screen.getByRole("button", { name: "Gerar história" }));
    expect(await screen.findByRole("heading", { name: "A Noite de Luna" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Salvar nos Favoritos" }));
    await user.click(screen.getByRole("tab", { name: "Favoritas" }));

    expect(await screen.findByText("A Noite de Luna")).toBeInTheDocument();
  });

  it("retains favorite stories after remounting from persisted local storage", async () => {
    const user = userEvent.setup();
    writeStories([favoriteStory]);

    const { unmount } = render(<TabShell />);
    await user.click(screen.getByRole("tab", { name: "Favoritas" }));
    expect(await screen.findByText("A Floresta de Luna")).toBeInTheDocument();

    unmount();
    render(<TabShell />);
    await user.click(screen.getByRole("tab", { name: "Favoritas" }));

    expect(await screen.findByText("A Floresta de Luna")).toBeInTheDocument();
  });
});
