import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TabShell } from "@/components/tab-shell";

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
});
