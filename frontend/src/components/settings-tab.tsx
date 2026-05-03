import { useState } from "react";
import type { UserSettings } from "@/domain/settings";
import type { SleepTimerOption, StoryDuration, StoryType, VoiceOption } from "@/domain/story";
import { saveUserSettings } from "@/services/settings-storage";

type SettingsTabProps = {
  settings: UserSettings;
  onSettingsSaved: (settings: UserSettings) => void;
};

type Option<Value extends string | number> = {
  value: Value;
  label: string;
};

const storyTypeOptions: Option<StoryType>[] = [
  { value: "funny", label: "Divertida" },
  { value: "educational", label: "Educativa" },
  { value: "bedtime", label: "Para Dormir" },
  { value: "moral_lesson", label: "Com Lição de Moral" }
];

const durationOptions: Option<StoryDuration>[] = [
  { value: "short", label: "Curta (~3 min)" },
  { value: "medium", label: "Média (~7 min)" },
  { value: "long", label: "Longa (~12 min)" }
];

const sleepTimerOptions: Option<SleepTimerOption>[] = [
  { value: "none", label: "Sem timer" },
  { value: "10m", label: "10 minutos" },
  { value: "20m", label: "20 minutos" },
  { value: "30m", label: "30 minutos" },
  { value: "end_of_story", label: "Fim da história" }
];

const voiceOptions: Option<VoiceOption>[] = [
  { value: "soft_female", label: "Feminina Suave" },
  { value: "soft_male", label: "Masculina Suave" },
  { value: "animated_female", label: "Feminina Animada" },
  { value: "animated_male", label: "Masculino Animado" }
];

const speedOptions: Option<number>[] = [
  { value: 0.85, label: "Lenta" },
  { value: 1, label: "Normal" },
  { value: 1.25, label: "Rápida" }
];

export function SettingsTab({ settings, onSettingsSaved }: SettingsTabProps) {
  const [draft, setDraft] = useState<UserSettings>(settings);
  const [feedback, setFeedback] = useState<"saved" | "error" | null>(null);

  const setDraftField = <Field extends keyof UserSettings>(field: Field, value: UserSettings[Field]) => {
    setDraft((current) => ({
      ...current,
      [field]: value
    }));
    setFeedback(null);
  };

  const handleSave = () => {
    try {
      saveUserSettings(draft);
      onSettingsSaved(draft);
      setFeedback("saved");
    } catch {
      setFeedback("error");
    }
  };

  return (
    <section className="settings-screen" aria-label="Configurações">
      <header className="settings-header">
        <h2 className="section-title">Configurações</h2>
        <p className="section-copy">
          Defina os padrões usados nas próximas histórias e nos controles de leitura deste dispositivo.
        </p>
      </header>

      <div className="settings-sections">
        <section className="settings-section" aria-labelledby="story-preferences-title">
          <h3 id="story-preferences-title" className="settings-section-title">
            Preferências da história
          </h3>
          <div className="settings-card">
            <fieldset className="settings-field">
              <legend>Tipo padrão de história</legend>
              <div className="chip-group">
                {storyTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className="chip-button"
                    aria-pressed={draft.defaultStoryType === option.value}
                    onClick={() => setDraftField("defaultStoryType", option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="settings-field">
              <legend>Duração padrão</legend>
              <div className="segmented-control">
                {durationOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={draft.defaultStoryDuration === option.value}
                    onClick={() => setDraftField("defaultStoryDuration", option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
        </section>

        <section className="settings-section" aria-labelledby="reader-preferences-title">
          <h3 id="reader-preferences-title" className="settings-section-title">
            Preferências de leitura
          </h3>
          <div className="settings-card">
            <label className="settings-select-field" htmlFor="default-voice">
              Voz padrão
              <select
                id="default-voice"
                value={draft.defaultVoice}
                onChange={(event) => setDraftField("defaultVoice", event.target.value as VoiceOption)}
              >
                {voiceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <fieldset className="settings-field">
              <legend>Velocidade padrão</legend>
              <div className="segmented-control">
                {speedOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={draft.defaultSpeed === option.value}
                    onClick={() => setDraftField("defaultSpeed", option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="settings-field">
              <legend>Timer padrão de sono</legend>
              <div className="chip-group">
                {sleepTimerOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className="chip-button"
                    aria-pressed={draft.defaultSleepTimer === option.value}
                    onClick={() => setDraftField("defaultSleepTimer", option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
        </section>

        <section className="settings-section" aria-labelledby="about-settings-title">
          <h3 id="about-settings-title" className="settings-section-title">
            Sobre
          </h3>
          <div className="settings-card settings-about">
            <p>Contos de Ninar · v0.1.0</p>
            <p>
              Suas histórias e preferências ficam salvas neste dispositivo. Mantemos a experiência simples, privada e
              pronta para a rotina da família.
            </p>
          </div>
        </section>
      </div>

      <button type="button" className="primary-button settings-save-button" onClick={handleSave}>
        Salvar configurações
      </button>
      {feedback === "saved" && (
        <p className="settings-feedback" role="status" aria-live="polite">
          Configurações salvas neste dispositivo.
        </p>
      )}
      {feedback === "error" && (
        <p className="settings-feedback settings-feedback-error" role="alert">
          Não foi possível salvar as configurações. Tente novamente.
        </p>
      )}
    </section>
  );
}
