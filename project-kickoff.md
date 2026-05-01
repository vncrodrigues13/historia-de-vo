# MVP — Narrativas Infantis com IA
## Plano de Construção para Validação de Conceito

---

## Visão Geral do Produto

O produto começa como uma **aplicação Web**: uma plataforma de histórias infantis geradas por IA, controlada pelos responsáveis da criança e acessada pelo navegador. O responsável configura os parâmetros da história pela interface Web; a história é gerada, convertida em áudio via TTS e reproduzida — idealmente em um dispositivo de caixa de som conectado ao computador ou celular (como uma Alexa em modo speaker bluetooth, speaker bluetooth comum ou saída de áudio do sistema), desconectando a criança da tela. O objetivo é criar um ritual de escuta imersivo, especialmente no momento de dormir.

---

## Contexto e Premissa

- O MVP será uma **aplicação Web local**, executada no navegador durante a validação de conceito
- A aplicação não exige instalação nativa nem backend no MVP; o armazenamento deve ficar no próprio navegador
- Os **responsáveis** são os operadores da experiência — eles configuram, a criança escuta
- A criança não interage diretamente com a aplicação; ela ouve a história reproduzida
- O MVP deve validar: geração de história, qualidade narrativa, experiência de narração e ciclo básico de uso (gerar → ouvir → salvar)

---

## Fluxos da Aplicação

### Fluxo 1 — Configuração e Geração de História (RF01)

**Ponto de entrada:** Página principal da aplicação Web

O responsável acessa a seção de criação de história e preenche um formulário com os seguintes campos:

1. **Nome da criança** — campo de texto livre
2. **Idade da criança** — seletor numérico (1 a 12 anos)
3. **Tema da história** — seleção única entre opções fixas: Aventura, Animais, Espaço, Princesa/Príncipe, Dinossauros, Fantasia e Magia, Natureza
4. **Tipo de história** — seleção única: Divertida, Educativa, Para Dormir, Com Lição de Moral
5. **Duração aproximada** — seleção única: Curta (~3 min), Média (~7 min), Longa (~12 min)
6. **Detalhe especial** — campo de texto livre opcional, onde o responsável pode descrever algo específico que quer na história (ex: "quero que a história ensine sobre dividir brinquedos" ou "o personagem pode ter medo de escuro como meu filho")

Após preencher, o responsável clica em **"Gerar História"**.

**O que acontece internamente:**
- A aplicação monta um prompt estruturado com todos os parâmetros
- Envia para a API de LLM (Claude ou similar)
- O prompt instrui o modelo a: adaptar vocabulário e complexidade para a idade informada, incluir o nome da criança no enredo, respeitar o tipo e tema escolhidos, planejar a lição moral antes de narrar, respeitar o tamanho estimado de palavras baseado na duração
- O texto da história retorna e é exibido na página enquanto o áudio é processado

**O que o usuário vê:**
- Indicador de carregamento com mensagem amigável ("Criando a história de [nome]...")
- Texto da história exibido após geração
- Botão para iniciar a narração

---

### Fluxo 2 — Narração via TTS (RF02)

**Ponto de entrada:** Após geração da história, ou ao acessar uma história do histórico/favoritos

A história gerada é convertida em áudio usando um serviço de TTS (Text-to-Speech).

**Controles de reprodução disponíveis:**
- **Play / Pause** — inicia ou pausa a narração
- **Reiniciar** — volta ao começo da história
- **Retomar** — continua do ponto onde parou (se pausado)

**Opções de configuração do áudio (configuráveis antes ou durante a reprodução):**
- **Escolha de voz** — seleção entre: Voz Feminina Suave, Voz Masculina Suave, Voz Feminina Animada, Voz Masculina Animado (as opções reais dependem das vozes disponíveis na API de TTS escolhida)
- **Velocidade da narração** — controle deslizante: Lenta / Normal / Rápida

**Saída de áudio:**
- O áudio é reproduzido pelo dispositivo onde o navegador está executando a aplicação
- Se conectado via Bluetooth a um speaker externo, o áudio sai pelo speaker — permitindo o cenário "sem tela" onde a criança só ouve

---

### Fluxo 3 — Timer de Sono (RF06)

**Ponto de entrada:** Painel da história, disponível antes ou durante a reprodução

O responsável pode ativar um temporizador de sono com as seguintes opções:

- **Duração do timer** — seleção: 10 minutos, 20 minutos, 30 minutos, ou "Encerrar ao fim da história"
- **Fade-out de volume** — ao ativar o timer, o volume reduz gradualmente nos últimos 2 minutos antes de encerrar

**Comportamento esperado:**
- Ao atingir o tempo definido, o áudio encerra suavemente (fade-out)
- Se "Encerrar ao fim da história" estiver ativo, a aplicação encerra a reprodução automaticamente quando o texto acabar, sem precisar do timer manual

---

### Fluxo 4 — Histórico de Histórias (RF05)

**Ponto de entrada:** Seção "Histórico" na navegação principal

A aplicação salva automaticamente todas as histórias geradas, contendo:
- Texto da história
- Parâmetros usados (nome, idade, tema, tipo, duração)
- Data e hora de criação
- Arquivo de áudio gerado (ou referência para gerar novamente)

**Ações disponíveis no histórico:**
- Listar todas as histórias salvas (ordem cronológica reversa)
- Clicar em uma história para abrir e ouvir novamente
- Excluir uma história específica (com confirmação)

**Observação para o MVP:** o áudio pode ser re-gerado via TTS no momento em que o usuário abre a história do histórico, sem necessidade de armazenar o arquivo de áudio localmente (reduz complexidade).

---

### Fluxo 5 — Favoritar Histórias (RF06-Favoritos)

**Ponto de entrada:** Dentro da história aberta, ou no card do histórico

O responsável pode marcar uma história como favorita clicando em um ícone de estrela/coração.

**Seção "Favoritas"** na navegação principal:
- Exibe apenas as histórias marcadas como favoritas
- Permite reprodução direta da lista
- Permite remover dos favoritos

---

## Estrutura de Páginas e Seções (MVP Web)

A aplicação Web terá 4 seções principais:

```
[ Criar ]  [ Histórico ]  [ Favoritas ]  [ Configurações ]
```

### Seção: Criar
- Formulário de geração de história (Fluxo 1)
- Após geração: texto da história + controles de reprodução (Fluxo 2) + opção de ativar timer (Fluxo 3)

### Seção: Histórico
- Lista de histórias geradas anteriormente (Fluxo 4)
- Ao clicar: abre a história com os controles de reprodução

### Seção: Favoritas
- Lista de histórias favoritadas (Fluxo 5)
- Ao clicar: abre a história com os controles de reprodução

### Seção: Configurações
- Voz padrão preferida
- Velocidade padrão de narração
- Preferências de timer (tempo padrão)
- (Futuro: perfis de crianças salvas)

---

## Modelo de Dados (simplificado)

### História
```
id: string
titulo: string (gerado automaticamente ou nome da criança + tema)
texto: string
parametros: {
  nomeCrianca: string
  idade: number
  tema: string
  tipo: string
  duracao: string
  detalhe: string (opcional)
}
voz: string
velocidade: number
favoritada: boolean
criadaEm: timestamp
```

---

## Integrações Externas (MVP)

| Integração | Finalidade | Observação |
|---|---|---|
| API de LLM (Claude / GPT) | Geração do texto da história | Chamada única por geração |
| API de TTS | Conversão texto → áudio | Google TTS, ElevenLabs, ou OpenAI TTS |
| Armazenamento local | Salvar histórias | localStorage ou IndexedDB no navegador (sem backend) |

---

## Regras de Negócio Essenciais

1. **Adequação à idade:** o prompt enviado para a IA deve instruir explicitamente que vocabulário, complexidade moral e tensão narrativa sejam apropriados para a faixa etária informada. Crianças de 2 a 5 anos recebem histórias mais simples e sem conflitos assustadores; crianças de 6 a 12 anos toleram maior complexidade.

2. **Lição de moral planejada:** quando o tipo for "Com Lição de Moral" ou "Educativa", o prompt deve instruir o modelo a definir a lição antes de narrar — e a lição deve ser demonstrada por ação do personagem, não apenas declarada.

3. **Histórias para dormir:** quando o tipo for "Para Dormir", o prompt deve instruir o modelo a usar ritmo narrativo desacelerado, ausência de cliffhangers, vocabulário que induz relaxamento, e resolução tranquila no final. O timer de sono deve ser sugerido automaticamente nesse caso.

4. **Sem dados sensíveis persistidos:** no MVP, o nome da criança é usado para personalizar a história e pode aparecer no histórico, mas nenhuma informação adicional sobre a criança é armazenada além do que o responsável digitou no formulário.

5. **Conteúdo seguro:** o prompt deve incluir instrução explícita de que a história deve evitar violência, medo excessivo, conteúdo assustador, preconceito ou qualquer elemento inapropriado para crianças.

---

## O que está FORA do MVP

Os itens abaixo são reconhecidos como desejáveis, mas não fazem parte do escopo de validação:

- Compartilhamento de história (texto ou MP3) — RF09
- Exportação de áudio em arquivo
- Perfis múltiplos de crianças
- Controle parental com senha
- Backend/sincronização em nuvem
- Integração direta com Alexa/Google Home via skill
- Imagens ilustrativas geradas por IA
- Narração com música de fundo

---

## Critério de Sucesso do MVP

O MVP estará validado quando for possível:

1. Gerar uma história coerente, segura e adequada para a idade em menos de 30 segundos
2. Ouvir a narração com qualidade inteligível, com controle de play/pause
3. Encontrar uma história anterior no histórico e reproduzi-la novamente
4. Favoritar uma história e acessá-la rapidamente
5. Ativar o timer de sono e verificar o fade-out automático

---



## Definição Técnica Formal

### Objetivo técnico

Construir um MVP Web local-first para geração, narração, histórico e favoritagem de histórias infantis personalizadas por IA, com uma superfície de backend mínima apenas para proteger credenciais e intermediar chamadas externas de LLM e TTS.

O sistema deve permitir validar o ciclo completo:

```text
configurar história -> gerar texto -> gerar narração -> reproduzir -> salvar -> reabrir -> favoritar
```

### Decisões arquiteturais

| Decisão | Definição | Justificativa |
|---|---|---|
| Plataforma | Aplicação Web responsiva | Reduz atrito de instalação e permite validação rápida em desktop e celular |
| Framework recomendado | Next.js com TypeScript | Entrega frontend e API routes no mesmo projeto, mantendo baixa complexidade |
| Backend do MVP | Backend mínimo via API routes | Necessário para esconder chaves de LLM/TTS; não haverá banco, autenticação ou domínio separado no MVP |
| Persistência | Browser storage | Histórias e preferências ficam locais no dispositivo do responsável |
| Storage recomendado | IndexedDB para histórias; localStorage para preferências simples | IndexedDB suporta volumes maiores de texto e metadados com mais segurança operacional que localStorage |
| Áudio | `<audio>` nativo com controle por código; Web Audio API apenas para fade-out se necessário | Mantém simplicidade e cobre play, pause, restart e volume |
| Integrações externas | Adaptadores isolados para LLM e TTS | Evita acoplamento direto da UI ao provedor e facilita troca futura |
| Segurança de credenciais | `.env.local` lido somente no servidor | Nenhuma chave de API deve ser enviada para o bundle do navegador |

### Arquitetura proposta

```text
Browser
  UI Next.js
  Estado de tela
  IndexedDB/localStorage
  Audio player
      |
      | HTTP interno
      v
Next.js API routes
  /api/stories/generate
  /api/stories/narrate
      |
      | HTTPS externo
      v
LLM provider / TTS provider
```

### Estrutura inicial de pastas

```text
src/
  app/
    page.tsx
    api/
      stories/
        generate/route.ts
        narrate/route.ts
  components/
    story-form.tsx
    story-reader.tsx
    story-library.tsx
    audio-player.tsx
    sleep-timer.tsx
    settings-panel.tsx
  domain/
    story.ts
    story-options.ts
    prompt-builder.ts
    safety-rules.ts
  services/
    llm-provider.ts
    tts-provider.ts
    story-storage.ts
    settings-storage.ts
  lib/
    validation.ts
    ids.ts
    dates.ts
tests/
  domain/
  services/
public/
assets/
spec/
```

### Módulos e responsabilidades

| Módulo | Responsabilidade |
|---|---|
| `story-form` | Capturar parâmetros da história, validar campos e disparar geração |
| `prompt-builder` | Transformar parâmetros em prompt estruturado, seguro e adequado à idade |
| `safety-rules` | Centralizar regras de conteúdo infantil seguro e restrições narrativas |
| `/api/stories/generate` | Validar request, chamar LLM, normalizar resposta e devolver texto/título |
| `/api/stories/narrate` | Validar texto e opções de voz, chamar TTS e devolver áudio ou URL temporária |
| `story-reader` | Exibir texto da história, metadados e ações principais |
| `audio-player` | Controlar play, pause, restart, velocidade, volume e estado de reprodução |
| `sleep-timer` | Encerrar reprodução por tempo ou fim da história, aplicando fade-out |
| `story-storage` | Salvar, listar, atualizar favorito e excluir histórias no browser |
| `settings-storage` | Persistir preferências de voz, velocidade e timer |
| `story-library` | Listar histórico e favoritas com ações de abrir, tocar, favoritar e excluir |

### Rotas e navegação

Para o MVP, a aplicação pode ser uma única página com navegação por abas internas:

```text
/ -> Criar, Histórico, Favoritas, Configurações
```

Rotas de API:

```text
POST /api/stories/generate
POST /api/stories/narrate
```

Rotas futuras, fora do MVP:

```text
/stories/:id
/children
/account
```

### Contratos de API

#### `POST /api/stories/generate`

Request:

```ts
type GenerateStoryRequest = {
  childName: string;
  childAge: number;
  theme: StoryTheme;
  storyType: StoryType;
  duration: StoryDuration;
  specialDetail?: string;
};
```

Response de sucesso:

```ts
type GenerateStoryResponse = {
  title: string;
  text: string;
  estimatedReadingMinutes: number;
  promptVersion: string;
};
```

Erros esperados:

```text
400 invalid_input
429 provider_rate_limited
502 provider_generation_failed
500 unexpected_error
```

#### `POST /api/stories/narrate`

Request:

```ts
type NarrateStoryRequest = {
  storyId?: string;
  text: string;
  voice: VoiceOption;
  speed: number;
};
```

Response de sucesso:

```ts
type NarrateStoryResponse = {
  audioContentType: "audio/mpeg" | "audio/wav";
  audioBase64: string;
  providerVoiceId: string;
};
```

Erros esperados:

```text
400 invalid_input
413 text_too_large
429 provider_rate_limited
502 provider_tts_failed
500 unexpected_error
```

### Modelo de domínio

```ts
type StoryTheme =
  | "aventura"
  | "animais"
  | "espaco"
  | "princesa_principe"
  | "dinossauros"
  | "fantasia_magia"
  | "natureza";

type StoryType =
  | "divertida"
  | "educativa"
  | "para_dormir"
  | "licao_de_moral";

type StoryDuration = "curta" | "media" | "longa";

type StoryParams = {
  childName: string;
  childAge: number;
  theme: StoryTheme;
  storyType: StoryType;
  duration: StoryDuration;
  specialDetail?: string;
};

type SavedStory = {
  id: string;
  title: string;
  text: string;
  params: StoryParams;
  voice: VoiceOption;
  speed: number;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
  promptVersion: string;
};

type UserSettings = {
  defaultVoice: VoiceOption;
  defaultSpeed: number;
  defaultSleepTimer: "none" | "10m" | "20m" | "30m" | "end_of_story";
};
```

### Regras técnicas de validação

- `childName` é obrigatório, deve ser aparado e limitado a tamanho razoável.
- `childAge` deve estar entre 1 e 12.
- `theme`, `storyType` e `duration` devem aceitar apenas valores enumerados.
- `specialDetail` é opcional, mas deve ter limite de caracteres.
- A geração deve impedir prompt vazio, input excessivamente longo e opções desconhecidas.
- A narração deve recusar texto vazio ou acima do limite operacional definido para o provedor TTS.
- Nenhuma API key pode aparecer em código client-side, logs visíveis ao usuário ou storage do navegador.

### Prompt engineering

O prompt deve ser montado por função pura em `prompt-builder`, versionado por `promptVersion`.

O prompt precisa conter:

- papel do modelo como contador de histórias infantis;
- idade da criança e restrições de vocabulário;
- tema, tipo, duração e detalhe especial;
- instruções de segurança infantil;
- regras para histórias de dormir;
- regras para histórias educativas ou com lição de moral;
- formato de saída previsível, com título e texto final;
- instrução para não incluir metacomentários, análise interna ou explicações sobre o processo.

### Persistência local

Histórias:

- armazenar em IndexedDB;
- listar em ordem cronológica reversa;
- atualizar `favorite` sem recriar o registro;
- excluir por `id` com confirmação na UI;
- não armazenar áudio no MVP, salvo decisão posterior.

Preferências:

- armazenar em localStorage;
- carregar valores padrão ao iniciar a aplicação;
- aplicar preferências no formulário e no player.

### Estados principais da interface

```text
idle
validating
generating_story
story_ready
generating_audio
audio_ready
playing
paused
timer_active
error
```

Erros devem ser exibidos com mensagem recuperável e ação clara, como tentar novamente ou ajustar parâmetros.

### Qualidade, testes e validação

Testes unitários prioritários:

- validação de parâmetros de história;
- montagem de prompt por faixa etária, tipo e duração;
- cálculo de duração estimada;
- operações de salvar/listar/favoritar/excluir no storage;
- comportamento de timer e fade-out em unidade isolada quando possível.

Testes de integração prioritários:

- `POST /api/stories/generate` com input válido;
- `POST /api/stories/generate` com input inválido;
- `POST /api/stories/narrate` com texto válido;
- tratamento de erro do provedor externo.

Testes manuais obrigatórios no MVP:

- gerar história curta para criança de 3 anos;
- gerar história educativa para criança de 8 anos;
- gerar história para dormir e confirmar sugestão/uso do timer;
- pausar, retomar e reiniciar narração;
- salvar automaticamente no histórico;
- favoritar e remover dos favoritos;
- excluir história com confirmação;
- reproduzir usando saída de áudio Bluetooth configurada no sistema operacional.

### Configuração esperada

Arquivo `.env.example`:

```text
LLM_PROVIDER=
LLM_API_KEY=
LLM_MODEL=
TTS_PROVIDER=
TTS_API_KEY=
TTS_VOICE_DEFAULT=
```

Comandos esperados após scaffold:

```bash
npm run dev
npm test
npm run build
npm run lint
```

### Riscos técnicos

| Risco | Impacto | Mitigação |
|---|---|---|
| Latência de geração acima de 30 segundos | Reduz valor do MVP | Loading claro, duração curta padrão, timeout e retry controlado |
| Custo ou limite de API externa | Interrompe validação | Adaptadores por provedor, mensagens de erro e logs server-side |
| TTS com payload grande | Falha em histórias longas | Limite por duração e opção de dividir texto em trechos no futuro |
| Conteúdo inadequado gerado por IA | Risco crítico de produto | Prompt seguro, validação de saída e testes manuais por faixa etária |
| Storage local cheio ou indisponível | Perda de histórico | Tratamento de erro e possibilidade de continuar sem salvar |
| Exposição de chaves no client | Risco de segurança | API routes server-side e revisão de variáveis públicas |

### Questões técnicas em aberto

- Qual provedor inicial será usado para LLM?
- Qual provedor inicial será usado para TTS?
- A resposta de TTS deve retornar `base64` diretamente ou um arquivo temporário servido pela rota?
- O MVP deve começar com IndexedDB desde o primeiro commit ou usar localStorage até o histórico crescer?
- Haverá moderação adicional de saída além das instruções no prompt?
- Qual limite máximo de caracteres será aceito para `specialDetail`?
- Qual é o menor conjunto de navegadores suportados na validação?

### Backlog técnico inicial

#### Fundação do projeto

- [ ] Criar scaffold Next.js com TypeScript.
- [ ] Configurar lint, formatter e scripts padrão.
- [ ] Criar `.env.example` com variáveis de LLM e TTS.
- [ ] Definir layout base com abas: Criar, Histórico, Favoritas e Configurações.
- [ ] Criar tipos de domínio em `src/domain/story.ts`.

#### Geração de história

- [ ] Implementar validação dos parâmetros do formulário.
- [ ] Implementar `prompt-builder` com `promptVersion`.
- [ ] Criar adaptador `llm-provider`.
- [ ] Implementar `POST /api/stories/generate`.
- [ ] Exibir estados de carregamento, sucesso e erro na UI.
- [ ] Salvar história gerada no storage local.

#### Narração e player

- [ ] Criar adaptador `tts-provider`.
- [ ] Implementar `POST /api/stories/narrate`.
- [ ] Criar componente `audio-player`.
- [ ] Implementar play, pause, restart e resume.
- [ ] Implementar seleção de voz e controle de velocidade.
- [ ] Implementar tratamento de erro de geração de áudio.

#### Timer de sono

- [ ] Criar componente `sleep-timer`.
- [ ] Implementar opções 10, 20, 30 minutos e fim da história.
- [ ] Implementar fade-out nos 2 minutos finais quando aplicável.
- [ ] Integrar timer ao estado do player.

#### Histórico e favoritas

- [ ] Implementar `story-storage` com criar, listar, atualizar e excluir.
- [ ] Criar seção Histórico com ordenação reversa por criação.
- [ ] Abrir história salva no leitor.
- [ ] Favoritar e desfavoritar história.
- [ ] Criar seção Favoritas filtrando registros favoritos.
- [ ] Confirmar exclusão antes de remover história.

#### Configurações

- [ ] Implementar `settings-storage`.
- [ ] Permitir configurar voz padrão.
- [ ] Permitir configurar velocidade padrão.
- [ ] Permitir configurar timer padrão.
- [ ] Aplicar preferências ao criar nova história e ao abrir histórias salvas.

#### Qualidade e validação

- [ ] Criar testes unitários de domínio e prompt.
- [ ] Criar testes de storage.
- [ ] Criar testes das API routes com providers mockados.
- [ ] Criar checklist manual do MVP.
- [ ] Validar build de produção.

### Critério técnico de pronto para iniciar implementação

O projeto estará pronto para sair da fase de definição quando:

- a stack inicial estiver confirmada;
- os provedores de LLM e TTS estiverem escolhidos;
- os contratos das rotas internas estiverem aceitos;
- o backlog técnico inicial estiver convertido em atividades de sprint;
- as variáveis de ambiente necessárias estiverem documentadas em `.env.example`.
