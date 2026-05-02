import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import {
  CreateTab,
  type StoryDraftState,
  SPECIAL_DETAIL_MAX_LENGTH,
  validateStoryParams
} from "@/components/create-tab";
import type { StoryParams } from "@/domain/story";

const baseDraft: StoryDraftState = {
  childName: "",
  childAge: "6",
  theme: "adventure",
  storyType: "bedtime",
  duration: "short",
  specialDetail: ""
};

describe("validateStoryParams", () => {
  it("returns a trimmed valid payload and omits empty special detail", () => {
    const result = validateStoryParams({
      ...baseDraft,
      childName: "  Luna  ",
      childAge: " 7 ",
      specialDetail: "   "
    });

    expect(result.errors).toEqual({});
    expect(result.params).toEqual({
      childName: "Luna",
      childAge: 7,
      theme: "adventure",
      storyType: "bedtime",
      duration: "short"
    });
  });

  it("rejects decimal age and out of range values", () => {
    expect(validateStoryParams({ ...baseDraft, childName: "Luna", childAge: "7.5" }).errors.childAge).toBeTruthy();
    expect(validateStoryParams({ ...baseDraft, childName: "Luna", childAge: "0" }).errors.childAge).toBeTruthy();
    expect(validateStoryParams({ ...baseDraft, childName: "Luna", childAge: "13" }).errors.childAge).toBeTruthy();
  });

  it("rejects empty, whitespace-only, and non numeric name/age values", () => {
    expect(validateStoryParams({ ...baseDraft, childName: "" }).errors.childName).toBeTruthy();
    expect(validateStoryParams({ ...baseDraft, childName: "   " }).errors.childName).toBeTruthy();
    expect(validateStoryParams({ ...baseDraft, childName: "Luna", childAge: "" }).errors.childAge).toBeTruthy();
    expect(validateStoryParams({ ...baseDraft, childName: "Luna", childAge: "seis" }).errors.childAge).toBeTruthy();
  });

  it("accepts boundary ages 1 and 12", () => {
    expect(validateStoryParams({ ...baseDraft, childName: "Luna", childAge: "1" }).params).toBeTruthy();
    expect(validateStoryParams({ ...baseDraft, childName: "Luna", childAge: "12" }).params).toBeTruthy();
  });

  it("rejects invalid fixed options", () => {
    expect(
      validateStoryParams({
        ...baseDraft,
        childName: "Luna",
        theme: "wrong" as StoryDraftState["theme"]
      }).errors.form
    ).toBeTruthy();
  });
});

describe("CreateTab", () => {
  function CreateTabHarness({ onSubmit }: { onSubmit: (params: StoryParams) => void | Promise<void> }) {
    const [draft, setDraft] = useState<StoryDraftState>(baseDraft);
    return <CreateTab draft={draft} onDraftChange={setDraft} onSubmit={onSubmit} />;
  }

  it("blocks submit when name is blank", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    const onDraftChange = jest.fn();

    render(<CreateTab draft={baseDraft} onDraftChange={onDraftChange} onSubmit={onSubmit} />);
    await user.click(screen.getByRole("button", { name: "Gerar história" }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText("Informe o nome da criança.")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /nome da criança/i })).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("textbox", { name: /nome da criança/i })).toHaveAccessibleDescription(
      "Informe o nome da criança."
    );
  });

  it("clears inline error after correction and allows keyboard submit", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(<CreateTabHarness onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: "Gerar história" }));
    expect(screen.getByText("Informe o nome da criança.")).toBeInTheDocument();

    await user.type(screen.getByRole("textbox", { name: /nome da criança/i }), "Luna");
    expect(screen.queryByText("Informe o nome da criança.")).not.toBeInTheDocument();

    await user.clear(screen.getByRole("textbox", { name: /idade/i }));
    await user.type(screen.getByRole("textbox", { name: /idade/i }), "8");
    await user.keyboard("{Enter}");
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("blocks submit when special detail exceeds the limit", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    const tooLongDraft: StoryDraftState = {
      ...baseDraft,
      childName: "Luna",
      specialDetail: "a".repeat(SPECIAL_DETAIL_MAX_LENGTH + 1)
    };

    render(<CreateTab draft={tooLongDraft} onDraftChange={jest.fn()} onSubmit={onSubmit} />);
    await user.click(screen.getByRole("button", { name: "Gerar história" }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(
      screen.getByText(`O detalhe especial pode ter até ${SPECIAL_DETAIL_MAX_LENGTH} caracteres.`)
    ).toBeInTheDocument();
  });

  it("submits one valid payload and prevents duplicate submits while pending", async () => {
    const user = userEvent.setup();
    const deferred = new Promise<void>((resolve) => {
      setTimeout(resolve, 25);
    });
    const onSubmit = jest.fn(async () => deferred);

    const validDraft: StoryDraftState = {
      ...baseDraft,
      childName: "  Luna  ",
      childAge: " 8 ",
      specialDetail: "  gosta de estrelas  "
    };

    render(<CreateTab draft={validDraft} onDraftChange={jest.fn()} onSubmit={onSubmit} />);

    const submitButton = screen.getByRole("button", { name: "Gerar história" });
    await user.click(submitButton);
    await user.click(screen.getByRole("button", { name: "Gerando história..." }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      childName: "Luna",
      childAge: 8,
      theme: "adventure",
      storyType: "bedtime",
      duration: "short",
      specialDetail: "gosta de estrelas"
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Gerar história" })).toBeEnabled();
    });
  });

  it("submits selected chip and segmented-control values", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    render(<CreateTabHarness onSubmit={onSubmit} />);

    await user.type(screen.getByRole("textbox", { name: /nome da criança/i }), "Luna");
    await user.click(screen.getByRole("button", { name: "Animais" }));
    await user.click(screen.getByRole("button", { name: "Educativa" }));
    await user.click(screen.getByRole("button", { name: "Média (~7 min)" }));

    expect(screen.getByRole("button", { name: "Animais" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Educativa" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Média (~7 min)" })).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("button", { name: "Gerar história" }));

    expect(onSubmit).toHaveBeenCalledWith({
      childName: "Luna",
      childAge: 6,
      theme: "animals",
      storyType: "educational",
      duration: "medium"
    });
  });
});
