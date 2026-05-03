import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TabShell } from "@/components/tab-shell";
import { StoryGenerationService } from "@/services/story-generation/story-generation.service";
import type { StoryProviderAdapter } from "@/services/story-generation/provider";

const SETTINGS_STORAGE_KEY = "contos-de-ninar:user-settings";
const STORIES_STORAGE_KEY = "contos-de-ninar:saved-stories";

function writeSettings(settings: object) {
  window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

function settingsPanel() {
  return screen.getByRole("tabpanel", { name: "Configurações" });
}

describe("User settings", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders Portuguese-first grouped settings controls", async () => {
    const user = userEvent.setup();
    render(<TabShell />);

    await user.click(screen.getByRole("tab", { name: "Configurações" }));

    const panel = settingsPanel();
    expect(within(panel).getByRole("heading", { name: "Configurações" })).toBeInTheDocument();
    expect(within(panel).getByText("Preferências da história")).toBeInTheDocument();
    expect(within(panel).getByText("Preferências de leitura")).toBeInTheDocument();
    expect(within(panel).getByRole("group", { name: "Tipo padrão de história" })).toBeInTheDocument();
    expect(within(panel).getByRole("group", { name: "Duração padrão" })).toBeInTheDocument();
    expect(within(panel).getByRole("group", { name: "Timer padrão de sono" })).toBeInTheDocument();
    expect(within(panel).getByRole("button", { name: "Salvar configurações" })).toBeInTheDocument();
  });

  it("saves settings locally and shows Portuguese save feedback", async () => {
    const user = userEvent.setup();
    render(<TabShell />);

    await user.click(screen.getByRole("tab", { name: "Configurações" }));
    const panel = settingsPanel();

    await user.click(within(panel).getByRole("button", { name: "Educativa" }));
    await user.click(within(panel).getByRole("button", { name: "Longa (~12 min)" }));
    await user.click(within(panel).getByRole("button", { name: "20 minutos" }));
    await user.click(within(panel).getByRole("button", { name: "Salvar configurações" }));

    expect(await within(panel).findByText("Configurações salvas neste dispositivo.")).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem(SETTINGS_STORAGE_KEY) ?? "{}")).toMatchObject({
      defaultStoryType: "educational",
      defaultStoryDuration: "long",
      defaultSleepTimer: "20m"
    });
  });

  it("applies saved story defaults to new Create sessions", async () => {
    writeSettings({
      defaultStoryType: "educational",
      defaultStoryDuration: "long",
      defaultSleepTimer: "20m",
      defaultVoice: "soft_female",
      defaultSpeed: 1
    });

    render(<TabShell />);

    expect(screen.getByRole("button", { name: "Educativa" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Longa (~12 min)" })).toHaveAttribute("aria-pressed", "true");
  });

  it("does not overwrite an in-progress draft after saving settings", async () => {
    const user = userEvent.setup();
    render(<TabShell />);

    await user.type(screen.getByLabelText("Nome da criança"), "Luna");
    await user.click(screen.getByRole("button", { name: "Média (~7 min)" }));

    await user.click(screen.getByRole("tab", { name: "Configurações" }));
    const panel = settingsPanel();
    await user.click(within(panel).getByRole("button", { name: "Longa (~12 min)" }));
    await user.click(within(panel).getByRole("button", { name: "Salvar configurações" }));

    await user.click(screen.getByRole("tab", { name: "Criar" }));

    expect(screen.getByLabelText("Nome da criança")).toHaveValue("Luna");
    expect(screen.getByRole("button", { name: "Média (~7 min)" })).toHaveAttribute("aria-pressed", "true");
  });

  it("stores current reader defaults on newly generated stories without mutating creation params", async () => {
    const user = userEvent.setup();
    writeSettings({
      defaultStoryType: "moral_lesson",
      defaultStoryDuration: "medium",
      defaultSleepTimer: "10m",
      defaultVoice: "soft_male",
      defaultSpeed: 1.25
    });
    const provider: StoryProviderAdapter = {
      generate: jest.fn(async () => ({
        rawText: JSON.stringify({
          title: "A Lição de Luna",
          text: "Luna aprendeu uma pequena lição antes de dormir.",
          estimatedMinutes: 7
        })
      }))
    };

    render(<TabShell generationService={new StoryGenerationService(provider)} />);

    await user.type(screen.getByLabelText("Nome da criança"), "Luna");
    await user.click(screen.getByRole("button", { name: "Gerar história" }));
    expect(await screen.findByRole("heading", { name: "A Lição de Luna" })).toBeInTheDocument();

    const [savedStory] = JSON.parse(window.localStorage.getItem(STORIES_STORAGE_KEY) ?? "[]");
    expect(savedStory).toMatchObject({
      voice: "soft_male",
      speed: 1.25,
      params: {
        childName: "Luna",
        storyType: "moral_lesson",
        duration: "medium"
      }
    });
  });

  it("keeps the app usable and shows retryable feedback when settings cannot be saved", async () => {
    const user = userEvent.setup();
    const setItemSpy = jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("storage unavailable");
    });

    render(<TabShell />);
    await user.click(screen.getByRole("tab", { name: "Configurações" }));
    const panel = settingsPanel();
    await user.click(within(panel).getByRole("button", { name: "Salvar configurações" }));

    expect(await within(panel).findByText("Não foi possível salvar as configurações. Tente novamente.")).toBeInTheDocument();
    expect(within(panel).getByRole("button", { name: "Salvar configurações" })).toBeEnabled();

    setItemSpy.mockRestore();
  });
});
