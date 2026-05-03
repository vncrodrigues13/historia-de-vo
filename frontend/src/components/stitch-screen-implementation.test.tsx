import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TabShell } from "@/components/tab-shell";
import type { SavedStory } from "@/domain/story";
import { StoryGenerationService } from "@/services/story-generation/story-generation.service";
import type { StoryProviderAdapter } from "@/services/story-generation/provider";

const STORIES_STORAGE_KEY = "contos-de-ninar:saved-stories";

const stitchScreens = [
  {
    name: "Criar História (Restaurada)",
    screenId: "8a422bd8840044ab9b40c7f313011b02",
    fallbackFolder: "criar_hist_ria_restaurada"
  },
  {
    name: "Resultado da História",
    screenId: "2f52b97627124271b828d2781e99ae86",
    fallbackFolder: "resultado_da_hist_ria"
  },
  {
    name: "Histórico de Histórias",
    screenId: "b610fe1a118c47e9a25a537c1d1e6230",
    fallbackFolder: "hist_rico_de_hist_rias"
  },
  {
    name: "Configurações 2",
    screenId: "ce4a28b488d7451e90827057767e6fb9",
    fallbackFolder: "configura_es_2"
  }
] as const;

const baseStory: SavedStory = {
  id: "story-luna-older",
  title: "A Estrela de Luna",
  text: "Luna guardou uma estrela pequena no bolso do pijama.",
  params: {
    childName: "Luna",
    childAge: 6,
    theme: "space",
    storyType: "bedtime",
    duration: "short"
  },
  voice: "soft_female",
  speed: 1,
  sleepTimer: "none",
  favorite: false,
  createdAt: "2026-05-01T20:00:00.000Z",
  updatedAt: "2026-05-01T20:00:00.000Z",
  promptVersion: "story-v1.0.0"
};

function writeStories(stories: SavedStory[]) {
  window.localStorage.setItem(STORIES_STORAGE_KEY, JSON.stringify(stories));
}

function resultProvider(title = "A Noite de Luna"): StoryProviderAdapter {
  return {
    generate: jest.fn(async () => ({
      rawText: JSON.stringify({
        title,
        text: "Luna atravessou um jardim calmo, ouviu uma canção suave e dormiu em paz.",
        estimatedMinutes: 3
      })
    }))
  };
}

function storyCard(title: string) {
  const heading = screen.getByRole("heading", { name: title });
  const card = heading.closest("article");
  if (!card) {
    throw new Error(`Expected story card for ${title}.`);
  }
  return card;
}

describe("Feature 09 - Stitch screen implementation", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it.each(stitchScreens)("$name has checked-in fallback source files", ({ fallbackFolder }) => {
    const sourceFolder = path.join(
      process.cwd(),
      "..",
      "external-assets",
      "stitch",
      "stitch_contos_de_ninar_control_panel",
      fallbackFolder
    );
    const expectedFiles = ["screen.png", "code.html"];
    const missingFiles: string[] = [];

    for (const fileName of expectedFiles) {
      const filePath = path.join(sourceFolder, fileName);
      if (!existsSync(filePath)) {
        missingFiles.push(filePath);
        continue;
      }
      expect(statSync(filePath).size).toBeGreaterThan(0);
    }

    expect(missingFiles).toEqual([]);
  });

  it.each(stitchScreens)("$name has imported local Stitch screen and code references", ({ screenId }) => {
    const screenFolder = path.join(process.cwd(), "assets", "stitch", screenId);
    const expectedFiles = ["screen.png", "stitch-code.html"];
    const missingFiles: string[] = [];

    for (const fileName of expectedFiles) {
      const filePath = path.join(screenFolder, fileName);
      if (!existsSync(filePath)) {
        missingFiles.push(filePath);
        continue;
      }
      expect(statSync(filePath).size).toBeGreaterThan(0);
    }

    expect(missingFiles).toEqual([]);
  });

  it("opens on Create and switches through the Stitch-owned Portuguese screens", async () => {
    const user = userEvent.setup();
    render(<TabShell />);

    expect(screen.getByRole("heading", { name: "Nova História" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /nome da criança/i })).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Histórico" }));
    expect(await screen.findByRole("heading", { name: "Histórico" })).toBeInTheDocument();
    expect(screen.getByText("Nenhuma história no histórico ainda.")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Configurações" }));
    expect(await screen.findByRole("heading", { name: "Configurações" })).toBeInTheDocument();
    expect(screen.getByText("Preferências da história")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Criar" }));
    expect(await screen.findByRole("heading", { name: "Nova História" })).toBeInTheDocument();
  });

  it("transitions from Create to Result after generation and persists the story into History", async () => {
    const user = userEvent.setup();
    render(<TabShell generationService={new StoryGenerationService(resultProvider())} />);

    await user.type(screen.getByRole("textbox", { name: /nome da criança/i }), "Luna");
    await user.click(screen.getByRole("button", { name: "Gerar história" }));

    expect(await screen.findByRole("heading", { name: "A Noite de Luna" })).toBeInTheDocument();
    expect(screen.getByText(/3 min .* Aventura .* Para Dormir/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvar nos Favoritos" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Criar outra história" })).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Histórico" }));
    expect(await screen.findByRole("heading", { name: "A Noite de Luna" })).toBeInTheDocument();
  });

  it("keeps the generated Result state when navigating away and back to Create", async () => {
    const user = userEvent.setup();
    render(<TabShell generationService={new StoryGenerationService(resultProvider())} />);

    await user.type(screen.getByRole("textbox", { name: /nome da criança/i }), "Luna");
    await user.click(screen.getByRole("button", { name: "Gerar história" }));
    expect(await screen.findByRole("heading", { name: "A Noite de Luna" })).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Configurações" }));
    expect(await screen.findByRole("heading", { name: "Configurações" })).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Criar" }));
    expect(await screen.findByRole("heading", { name: "A Noite de Luna" })).toBeInTheDocument();
    expect(screen.queryByRole("textbox", { name: /nome da criança/i })).not.toBeInTheDocument();
  });

  it("shows the Result screen with a storage warning when local persistence fails", async () => {
    const user = userEvent.setup();
    const persistStory = jest.fn(async () => {
      throw new Error("storage unavailable");
    });

    render(
      <TabShell
        generationService={new StoryGenerationService(resultProvider())}
        persistStory={persistStory}
      />
    );

    await user.type(screen.getByRole("textbox", { name: /nome da criança/i }), "Luna");
    await user.click(screen.getByRole("button", { name: "Gerar história" }));

    expect(await screen.findByRole("heading", { name: "A Noite de Luna" })).toBeInTheDocument();
    expect(screen.getByText("A história foi gerada, mas não conseguimos salvar localmente nesta tentativa.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Salvar nos Favoritos" })).not.toBeInTheDocument();
    expect(persistStory).toHaveBeenCalledTimes(1);
  });

  it("keeps the parent on Create and shows retryable feedback when generation fails", async () => {
    const user = userEvent.setup();
    const provider: StoryProviderAdapter = {
      generate: jest.fn(async () => {
        throw new Error("provider unavailable");
      })
    };

    render(<TabShell generationService={new StoryGenerationService(provider)} />);

    await user.type(screen.getByRole("textbox", { name: /nome da criança/i }), "Luna");
    await user.click(screen.getByRole("button", { name: "Gerar história" }));

    expect(await screen.findByText("Serviço temporariamente indisponível. Tente novamente em alguns segundos.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Nova História" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /nome da criança/i })).toHaveValue("Luna");
    expect(screen.queryByRole("heading", { name: "A Noite de Luna" })).not.toBeInTheDocument();
  });

  it("keeps History actions scoped to each story card", async () => {
    const user = userEvent.setup();
    writeStories([
      {
        ...baseStory,
        id: "story-luna-newer",
        title: "O Jardim de Luna",
        text: "Luna encontrou flores que brilhavam baixinho.",
        createdAt: "2026-05-02T20:00:00.000Z",
        updatedAt: "2026-05-02T20:00:00.000Z"
      },
      baseStory
    ]);

    render(<TabShell />);
    await user.click(screen.getByRole("tab", { name: "Histórico" }));

    const list = await screen.findByRole("list", { name: "Histórico" });
    expect(within(list).getAllByRole("listitem").map((item) => within(item).getByRole("heading").textContent)).toEqual([
      "O Jardim de Luna",
      "A Estrela de Luna"
    ]);

    await user.click(within(storyCard("A Estrela de Luna")).getByRole("button", { name: "Salvar nos Favoritos" }));

    expect(within(storyCard("A Estrela de Luna")).getByRole("button", { name: "Remover dos Favoritos" })).toBeInTheDocument();
    expect(within(storyCard("O Jardim de Luna")).getByRole("button", { name: "Salvar nos Favoritos" })).toBeInTheDocument();
  });

  it("applies saved Settings defaults to the next new Create draft", async () => {
    const user = userEvent.setup();
    render(<TabShell generationService={new StoryGenerationService(resultProvider("A Lição de Luna"))} />);

    await user.click(screen.getByRole("tab", { name: "Configurações" }));
    const settingsPanel = screen.getByRole("tabpanel", { name: "Configurações" });
    await user.click(within(settingsPanel).getByRole("button", { name: "Educativa" }));
    await user.click(within(settingsPanel).getByRole("button", { name: "Longa (~12 min)" }));
    await user.click(within(settingsPanel).getByRole("button", { name: "Salvar configurações" }));
    expect(await within(settingsPanel).findByText("Configurações salvas neste dispositivo.")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Criar" }));
    await user.type(screen.getByRole("textbox", { name: /nome da criança/i }), "Luna");
    await user.click(screen.getByRole("button", { name: "Gerar história" }));
    expect(await screen.findByRole("heading", { name: "A Lição de Luna" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Criar outra história" }));

    expect(screen.getByRole("button", { name: "Educativa" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Longa (~12 min)" })).toHaveAttribute("aria-pressed", "true");
  });
});
