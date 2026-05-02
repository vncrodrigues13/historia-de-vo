import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TabShell } from "@/components/tab-shell";
import { StoryGenerationService } from "@/services/story-generation/story-generation.service";
import type { StoryProviderAdapter } from "@/services/story-generation/provider";

describe("TabShell", () => {
  it("renders all MVP tabs", () => {
    render(<TabShell />);

    expect(screen.getByRole("tab", { name: "Criar" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Histórico" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Favoritas" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Configurações" })).toBeInTheDocument();
  });

  it("preserves current story draft when switching tabs", async () => {
    const user = userEvent.setup();
    render(<TabShell />);

    const childNameInput = screen.getByLabelText("Nome da criança");
    await user.type(childNameInput, "Luna");

    await user.click(screen.getByRole("tab", { name: "Histórico" }));
    await user.click(screen.getByRole("tab", { name: "Criar" }));

    expect(screen.getByLabelText("Nome da criança")).toHaveValue("Luna");
  });

  it("keeps loading in Create and transitions to result on success", async () => {
    const user = userEvent.setup();
    let release = () => {};
    const provider: StoryProviderAdapter = {
      generate: jest.fn(
        () =>
          new Promise((resolve) => {
            release = () => {
              resolve({
                rawText: JSON.stringify({
                  title: "A Noite de Luna",
                  text: "Luna viveu uma aventura calma e dormiu em paz.",
                  estimatedMinutes: 3
                })
              });
            };
          })
      )
    };
    const generationService = new StoryGenerationService(provider);
    render(<TabShell generationService={generationService} />);

    await user.type(screen.getByLabelText("Nome da criança"), "Luna");
    const click = user.click(screen.getByRole("button", { name: "Gerar história" }));
    expect(await screen.findByRole("button", { name: "Gerando história..." })).toBeInTheDocument();
    release();
    await click;

    expect(await screen.findByRole("heading", { name: "A Noite de Luna" })).toBeInTheDocument();
    expect(screen.getByText("Criar outra história")).toBeInTheDocument();
  });

  it("keeps user in Create and shows retry messaging when generation fails", async () => {
    const user = userEvent.setup();
    const provider: StoryProviderAdapter = {
      generate: jest.fn(async () => {
        throw new Error("down");
      })
    };

    render(<TabShell generationService={new StoryGenerationService(provider)} />);
    await user.type(screen.getByLabelText("Nome da criança"), "Luna");
    await user.click(screen.getByRole("button", { name: "Gerar história" }));

    expect(await screen.findByText("Serviço temporariamente indisponível. Tente novamente em alguns segundos.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Gerar história" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /noite de luna/i })).not.toBeInTheDocument();
  });

  it("shows result even when persistence fails", async () => {
    const user = userEvent.setup();
    const provider: StoryProviderAdapter = {
      generate: jest.fn(async () => ({
        rawText: JSON.stringify({
          title: "A Noite de Luna",
          text: "Luna viveu uma aventura calma e dormiu em paz.",
          estimatedMinutes: 3
        })
      }))
    };

    const persistStory = jest.fn(async () => {
      throw new Error("storage-failed");
    });

    render(<TabShell generationService={new StoryGenerationService(provider)} persistStory={persistStory} />);
    await user.type(screen.getByLabelText("Nome da criança"), "Luna");
    await user.click(screen.getByRole("button", { name: "Gerar história" }));

    expect(await screen.findByRole("heading", { name: "A Noite de Luna" })).toBeInTheDocument();
    expect(
      screen.getByText("A história foi gerada, mas não conseguimos salvar localmente nesta tentativa.")
    ).toBeInTheDocument();
  });
});
