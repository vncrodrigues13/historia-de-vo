import type { StoryDuration, StoryTheme, StoryType } from "@/domain/story";
import type { StoryParams } from "@/domain/story";
import { useState } from "react";
import type { FormEvent } from "react";

export type StoryDraftState = {
  childName: string;
  childAge: string;
  theme: StoryTheme;
  storyType: StoryType;
  duration: StoryDuration;
  specialDetail: string;
};

type CreateTabProps = {
  draft: StoryDraftState;
  onDraftChange: (next: StoryDraftState) => void;
  onSubmit: (params: StoryParams) => Promise<void> | void;
};

type StoryFormField = "childName" | "childAge" | "specialDetail" | "form";
export const SPECIAL_DETAIL_MAX_LENGTH = 160;
const MIN_CHILD_AGE = 1;
const MAX_CHILD_AGE = 12;

export const themeOptions: { value: StoryTheme; label: string }[] = [
  { value: "adventure", label: "Aventura" },
  { value: "animals", label: "Animais" },
  { value: "space", label: "Espaço" },
  { value: "princess_prince", label: "Princesa/Príncipe" },
  { value: "dinosaurs", label: "Dinossauros" },
  { value: "fantasy_magic", label: "Fantasia e magia" },
  { value: "nature", label: "Natureza" }
];

export const storyTypeOptions: { value: StoryType; label: string }[] = [
  { value: "funny", label: "Divertida" },
  { value: "educational", label: "Educativa" },
  { value: "bedtime", label: "Para Dormir" },
  { value: "moral_lesson", label: "Com Lição de Moral" }
];

export const durationOptions: { value: StoryDuration; label: string }[] = [
  { value: "short", label: "Curta (~3 min)" },
  { value: "medium", label: "Média (~7 min)" },
  { value: "long", label: "Longa (~12 min)" }
];

export function validateStoryParams(draft: StoryDraftState) {
  const errors: Partial<Record<StoryFormField, string>> = {};
  const childName = draft.childName.trim();
  const childAgeRaw = draft.childAge.trim();
  const specialDetailTrimmed = draft.specialDetail.trim();

  if (!childName) {
    errors.childName = "Informe o nome da criança.";
  }

  if (!childAgeRaw) {
    errors.childAge = "Informe a idade da criança.";
  } else if (!/^\d+$/.test(childAgeRaw)) {
    errors.childAge = "A idade deve ser um número inteiro entre 1 e 12.";
  } else {
    const childAge = Number(childAgeRaw);
    if (childAge < MIN_CHILD_AGE || childAge > MAX_CHILD_AGE) {
      errors.childAge = "A idade deve estar entre 1 e 12 anos.";
    }
  }

  if (specialDetailTrimmed.length > SPECIAL_DETAIL_MAX_LENGTH) {
    errors.specialDetail = `O detalhe especial pode ter até ${SPECIAL_DETAIL_MAX_LENGTH} caracteres.`;
  }

  if (!themeOptions.some((option) => option.value === draft.theme)) {
    errors.form = "Selecione um tema válido.";
  }

  if (!storyTypeOptions.some((option) => option.value === draft.storyType)) {
    errors.form = "Selecione um tipo de história válido.";
  }

  if (!durationOptions.some((option) => option.value === draft.duration)) {
    errors.form = "Selecione uma duração válida.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const params: StoryParams = {
    childName,
    childAge: Number(childAgeRaw),
    theme: draft.theme,
    storyType: draft.storyType,
    duration: draft.duration
  };

  if (specialDetailTrimmed) {
    params.specialDetail = specialDetailTrimmed;
  }

  return { errors: {}, params };
}

export function CreateTab({ draft, onDraftChange, onSubmit }: CreateTabProps) {
  const [errors, setErrors] = useState<Partial<Record<StoryFormField, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFieldChange = (field: StoryFormField, value: string) => {
    onDraftChange({
      ...draft,
      [field]: value
    });

    if (Object.keys(errors).length > 0) {
      setErrors({});
    }
  };

  const onOptionChange = <Field extends "theme" | "storyType" | "duration">(
    field: Field,
    value: StoryDraftState[Field]
  ) => {
    onDraftChange({
      ...draft,
      [field]: value
    });

    if (Object.keys(errors).length > 0) {
      setErrors({});
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const validation = validateStoryParams(draft);
    if (!validation.params) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      await onSubmit(validation.params);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="create-screen" aria-label="Criar história">
      <div className="create-intro">
        <h2 className="section-title">Nova História</h2>
        <p className="section-copy">
          Prepare um momento especial. Escolha os detalhes abaixo e nós criaremos um conto de ninar único para embalar o sono.
        </p>
      </div>

      <form className="story-form" onSubmit={handleSubmit} noValidate>
        <label className="story-field" htmlFor="child-name">
          Nome da criança
          <input
            id="child-name"
            name="childName"
            value={draft.childName}
            placeholder="Ex: Sofia"
            aria-invalid={Boolean(errors.childName)}
            aria-describedby={errors.childName ? "child-name-error" : undefined}
            onChange={(event) =>
              onFieldChange("childName", event.target.value)
            }
          />
          {errors.childName && (
            <span id="child-name-error" className="field-error" role="alert">
              {errors.childName}
            </span>
          )}
        </label>

        <label className="story-field" htmlFor="child-age">
          Idade da criança (anos)
          <input
            id="child-age"
            name="childAge"
            inputMode="numeric"
            value={draft.childAge}
            placeholder="Ex: 4"
            aria-invalid={Boolean(errors.childAge)}
            aria-describedby={errors.childAge ? "child-age-error" : "child-age-help"}
            onChange={(event) =>
              onFieldChange("childAge", event.target.value)
            }
          />
          <span id="child-age-help" className="field-help">
            Digite um número inteiro de 1 a 12.
          </span>
          {errors.childAge && (
            <span id="child-age-error" className="field-error" role="alert">
              {errors.childAge}
            </span>
          )}
        </label>

        <fieldset className="story-field option-field story-field-wide">
          <legend>Tema da história</legend>
          <div className="chip-group">
            {themeOptions.map((theme) => (
              <button
                key={theme.value}
                type="button"
                className="chip-button"
                aria-pressed={draft.theme === theme.value}
                disabled={isSubmitting}
                onClick={() => onOptionChange("theme", theme.value)}
              >
                {theme.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="story-field option-field story-field-wide">
          <legend>Tipo de história</legend>
          <div className="chip-group">
            {storyTypeOptions.map((storyType) => (
              <button
                key={storyType.value}
                type="button"
                className="chip-button"
                aria-pressed={draft.storyType === storyType.value}
                disabled={isSubmitting}
                onClick={() => onOptionChange("storyType", storyType.value)}
              >
                {storyType.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="story-field option-field duration-field">
          <legend>Duração</legend>
          <div className="segmented-control">
            {durationOptions.map((duration) => (
              <button
                key={duration.value}
                type="button"
                aria-pressed={draft.duration === duration.value}
                disabled={isSubmitting}
                onClick={() => onOptionChange("duration", duration.value)}
              >
                {duration.label}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="story-field story-field-wide" htmlFor="special-detail">
          Detalhe especial
          <textarea
            id="special-detail"
            name="specialDetail"
            value={draft.specialDetail}
            maxLength={SPECIAL_DETAIL_MAX_LENGTH + 20}
            placeholder="Opcional... ex: medo do escuro, perdeu um dentinho hoje"
            aria-invalid={Boolean(errors.specialDetail)}
            aria-describedby={errors.specialDetail ? "special-detail-error" : "special-detail-help"}
            onChange={(event) =>
              onFieldChange("specialDetail", event.target.value)
            }
          />
          <span id="special-detail-help" className="field-help">
            Até {SPECIAL_DETAIL_MAX_LENGTH} caracteres.
          </span>
          {errors.specialDetail && (
            <span id="special-detail-error" className="field-error" role="alert">
              {errors.specialDetail}
            </span>
          )}
        </label>

        <button
          type="submit"
          className="primary-button"
          disabled={isSubmitting}
          aria-label={isSubmitting ? "Gerando história..." : "Gerar história"}
        >
          {isSubmitting ? "Gerando história..." : "✦ Gerar História"}
        </button>
        {errors.form && (
          <span className="field-error" role="alert">
            {errors.form}
          </span>
        )}
      </form>
    </section>
  );
}
