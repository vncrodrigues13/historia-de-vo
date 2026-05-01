import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TabShell } from "@/components/tab-shell";

describe("TabShell", () => {
  it("renders all MVP tabs", () => {
    render(<TabShell />);

    expect(screen.getByRole("tab", { name: "Create" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "History" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Favorites" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Settings" })).toBeInTheDocument();
  });

  it("preserves current story draft when switching tabs", async () => {
    const user = userEvent.setup();
    render(<TabShell />);

    const childNameInput = screen.getByLabelText("Child name");
    await user.type(childNameInput, "Luna");

    await user.click(screen.getByRole("tab", { name: "History" }));
    await user.click(screen.getByRole("tab", { name: "Create" }));

    expect(screen.getByLabelText("Child name")).toHaveValue("Luna");
  });
});
