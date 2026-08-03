# Brag Doc — Guia Técnico de Uso

Guia prático de como operar o sistema: setup, comandos e todas as features, com exemplos. Para o "porquê" das decisões de arquitetura, veja `docs/adr/`. Para o glossário de domínio, veja `CONTEXT.md`.

## Visão geral da arquitetura

Não há backend nem banco de dados. O sistema é 100% GitHub + scripts Node/TypeScript rodando em GitHub Actions ou localmente:

| Conceito de domínio | Onde vive no GitHub |
|---|---|
| Win (conquista) | Issue, criada via Issue Form `.github/ISSUE_TEMPLATE/win.yml` |
| Job (empresa/cargo) | Label `job:<slug>` |
| Tag (tema/skill) | Label `tag:<slug>` |
| Data do Win | Campo "Data" do formulário (fonte única de verdade de tempo) |
| Período (trimestre) | Milestone `AAAA-Qn`, derivada automaticamente da data |
| Curadoria de Brag Doc | Label `brag:<slug>` + arquivo `docs/brag/<slug>.yml` |

O parser reconhece uma Issue como Win pelo label `type:win` (aplicado automaticamente pelo Issue Form) e pela estrutura de seções `### Campo` que o form gera no corpo da Issue.

## Requisitos e setup inicial

- **Node.js 25+** (usado pelo `tsconfig.json`/CI).
- **GitHub CLI (`gh`)** instalado e autenticado localmente (`gh auth login`) — os comandos locais (`npm run wins`, `generate`, `dashboard`, `reports`) chamam `gh` para ler as Issues do repositório atual. Nas Actions, a autorização vem de `secrets.GITHUB_TOKEN`, já configurado nos workflows.
- **Repositório privado.** A arquitetura assume isso: os Wins crus nunca devem ser públicos. Só o recorte curado (`brag:*`) vai para o Pages.
- **GitHub Pages habilitado** no repositório, com a fonte configurada para "GitHub Actions" (Settings → Pages → Build and deployment → Source: GitHub Actions), para que o workflow `pages.yml` possa publicar.

Instalação de dependências:

```bash
npm install
```

Rodar os testes do núcleo de domínio:

```bash
npm test
```

## Feature 1 — Capturar um Win

Abra uma nova Issue no repositório escolhendo o template **"Win"** (menu Issues → New issue → Win). Isso é pura UI nativa do GitHub — web, mobile app, ou API.

Campos do formulário (`.github/ISSUE_TEMPLATE/win.yml`):

- **Título** (obrigatório) — ex.: `Reduzi o tempo de deploy em 70%`
- **Data** (obrigatório, formato `AAAA-MM-DD`) — ex.: `2026-03-15`
- **Job** — dropdown apenas de referência visual; a classificação real usada pelo sistema é o label `job:<slug>` (veja abaixo)
- **Detalhes** — texto livre em markdown
- **Impact Metric** — ex.: `Redução de latência: 40%`
- **Links** — um link por linha

Depois de abrir a Issue, adicione manualmente os labels que a classificam:

- `job:acme-corp` — associa o Win a esse Job
- `tag:lideranca`, `tag:performance` — quantos quiser, para categorizar por tema
- `brag:review-2026` — inclui o Win num Brag Doc específico (veja Feature 3); pode omitir se ainda não for curar

Para anexar evidências (prints, PDFs), use o anexo nativo de arquivo do editor de Issues — basta arrastar o arquivo para o corpo ou comentário.

**Exemplo de Issue completa:**

- Título: `Liderei a migração do serviço de pagamentos para Kubernetes`
- Data: `2026-02-10`
- Labels: `type:win` (automático), `job:acme-corp`, `tag:lideranca`, `tag:infra`, `brag:review-2026`
- Detalhes: `Coordenei um time de 4 pessoas na migração...`
- Impact Metric: `Redução de custo de infra: 25%`
- Links: `https://github.com/acme/payments/pull/482`

Uma Issue **sem** o label `type:win` (ex.: o lembrete semanal automático) é ignorada por todo o pipeline — não quebra a geração nem aparece em nenhum Brag Doc.

Se faltar um campo obrigatório (Título/Data) ou a Data for inválida, o Win é sinalizado como inválido: os scripts locais e a Action de milestone imprimem um erro no log referenciando o número da Issue, mas **não** derrubam o restante do processamento — os outros Wins continuam sendo processados normalmente.

## Feature 2 — Período automático (Milestone)

Ao abrir ou editar uma Issue de Win, o workflow `.github/workflows/milestone.yml` roda automaticamente e:

1. Deriva o trimestre da Data (`2026-02-10` → `2026-Q1`).
2. Verifica se a Milestone `2026-Q1` já existe no repositório; cria se não existir.
3. Atribui a Issue a essa Milestone.

Isso é **idempotente**: reabrir ou reeditar a Issue várias vezes não cria milestones duplicadas nem reatribui desnecessariamente — se a Issue já está na milestone correta, a Action não faz nada (`noop`).

Editar a Data de um Win já existente e salvar a Issue dispara o evento `edited`, recalculando e reatribuindo a milestone se o trimestre mudou.

Não é necessário rodar nada manualmente para isso — é 100% automático via o evento `on: issues`.

## Feature 3 — Curadoria de Brag Docs

### 3.1 Marcar Wins para curadoria

Adicione o label `brag:<slug>` a qualquer Win para incluí-lo no Brag Doc daquele slug. Para remover um Win de um Brag Doc, basta remover o label — o conteúdo do Win não é tocado.

Um Win pode ter vários labels `brag:*` ao mesmo tempo (ex.: `brag:review-2026` e `brag:entrevista-empresa-x`), aparecendo em ambos os documentos.

### 3.2 Definir o Brag Doc

Crie um arquivo `docs/brag/<slug>.yml` (o diretório `docs/brag/` ainda não existe no repositório recém-criado — crie-o na primeira vez). O nome do arquivo (sem `.yml`) é o `slug` que precisa bater com o label `brag:<slug>` usado nas Issues.

**Exemplo — `docs/brag/review-2026.yml`:**

```yaml
title: "Performance Review 2026 — Diego Almeida"
intro: >
  Recorte das principais conquistas do primeiro semestre de 2026,
  organizadas da mais recente para a mais antiga.
order: newest
show:
  metrics: true
  dates: true
  company: false
  links: true
```

Campos:

- `title` (obrigatório) — título exibido no topo da página gerada.
- `intro` (opcional) — parágrafo de introdução/contexto.
- `order` (obrigatório) — `newest` (mais recente primeiro) ou `oldest` (mais antigo primeiro).
- `show` (obrigatório, todos os quatro sub-campos booleanos):
  - `metrics` — exibir ou ocultar o Impact Metric de cada Win.
  - `dates` — exibir ou ocultar a data de cada Win.
  - `company` — exibir ou ocultar o Job (empresa/cargo).
  - `links` — exibir ou ocultar a lista de links de referência.

Um arquivo malformado (campo obrigatório faltando, `show` incompleto, YAML inválido) faz a geração falhar com uma mensagem apontando exatamente qual campo está errado — nada é publicado parcialmente.

**Segundo exemplo, recorte mais enxuto para uma entrevista — `docs/brag/entrevista-empresa-x.yml`:**

```yaml
title: "Highlights — Diego Almeida"
order: newest
show:
  metrics: true
  dates: false
  company: true
  links: false
```

## Feature 4 — Geração e publicação

### Geração automática

O workflow `.github/workflows/pages.yml` roda e republica os Brag Docs automaticamente quando:

- Qualquer arquivo em `docs/brag/**` muda (push na `main`);
- Qualquer Issue é aberta, editada, rotulada, desrotulada, fechada ou reaberta;
- Ou manualmente via "Run workflow" (`workflow_dispatch`) na aba Actions do GitHub.

Cada slug com um `docs/brag/<slug>.yml` correspondente vira uma página em `public/<slug>/index.html`, publicada no GitHub Pages. A URL final segue o padrão do Pages do repositório, ex.: `https://<usuario>.github.io/<repo>/<slug>/`.

### Geração local (preview antes de publicar)

```bash
npm run generate
```

Isso builda o TypeScript, busca as Issues via `gh`, e escreve os HTMLs em `public/` — o mesmo diretório que a Action publica, então você pode abrir os arquivos localmente (`open public/review-2026/index.html`) para conferir antes do push. Esse diretório está no `.gitignore` — não é commitado.

Se não houver nenhum arquivo em `docs/brag/*.yml`, o comando imprime um aviso e não gera nada (não é erro).

### Guard anti-vazamento

Toda geração roda um guard que verifica: nenhum Win aparece num Brag Doc publicado sem o label `brag:<slug>` correspondente ainda presente na Issue. Se detectar uma inconsistência, a geração **falha** com uma mensagem listando o número da Issue e o slug afetado, e nada é escrito — isso existe justamente para nunca publicar por engano um Win que foi descurado.

## Feature 5 — Dashboard local (visão completa)

```bash
npm run dashboard
```

Gera `.local/dashboard.html` com **todos** os Wins (curados ou não) e abre automaticamente no navegador padrão (`open`/`start`/`xdg-open`, dependendo do SO). Esse arquivo nunca é commitado nem publicado — vive só na sua máquina (`.local/` está no `.gitignore`).

Na página:

- Campo de busca por texto livre (procura em título, detalhes, impact metric, job, tags e brags).
- Filtro por **Job**.
- Filtro por **Tag**.
- Filtro por **Período** (milestone).
- Cada Win exibe em quais Brag Docs (`brag:*`) ele já está incluído — ou "Ainda não curado em nenhum Brag Doc" se nenhum.

Todos os filtros e a busca rodam client-side (JS puro, sem dependências) sobre o HTML já gerado — não fazem nenhuma chamada de rede.

## Feature 6 — Reports (agregados)

```bash
npm run reports
```

Gera `.local/reports.html` e abre no navegador, com três seções de contagem:

- **Por Período** — quantos Wins em cada milestone/trimestre.
- **Por Tag** — quantos Wins em cada tag.
- **Por Job** — quantos Wins em cada empresa/cargo.

Filtros por Período, Job e Tag recalculam as três contagens simultaneamente (client-side). Use isso para, por exemplo, ver sua cadência de conquistas só na Acme Corp, ou só no tema "liderança".

## Feature 7 — Export em PDF

Não há um comando dedicado de export. Abra a URL publicada de um Brag Doc (ou o `public/<slug>/index.html` gerado localmente) no navegador e use **Imprimir → Salvar como PDF**. O CSS de impressão embutido (`@media print` em `src/core/render.ts`) já cuida de:

- Remover o link de volta para a Issue (`#123`) do PDF final.
- Evitar quebra de página no meio de um Win (`page-break-inside: avoid`).
- Evitar título órfão no fim da página (`page-break-after: avoid` em `h1`/`h2`).
- Margem de página (`2cm`) e fonte reduzida (`11pt`) adequadas para impressão.
- Preservar a cor de fundo das tags mesmo em impressão (`print-color-adjust: exact`).

## Feature 8 — Lembrete semanal

Configurado em `.github/workflows/reminder.yml`, roda por padrão **toda sexta-feira às 15h UTC** e abre uma Issue simples (sem o label `type:win`, então é ignorada pela geração) com um checklist lembrando de registrar os Wins da semana.

Para ajustar dia/horário, edite a expressão cron:

```yaml
on:
  schedule:
    - cron: "0 15 * * 5" # minuto hora dia-do-mês mês dia-da-semana (5 = sexta)
```

Também pode ser disparado manualmente a qualquer momento pela aba Actions (`workflow_dispatch`).

## Feature 9 — Inspecionar Wins crus (debug)

```bash
npm run wins
```

Busca todas as Issues, faz o parse de cada uma, e imprime a lista de `Win`s (já estruturados, com período derivado) como JSON no terminal — útil para depurar por que um Win não está aparecendo onde esperado, sem precisar abrir o dashboard.

## Referência rápida de comandos

| Comando | O que faz | Onde roda |
|---|---|---|
| `npm test` | Roda os testes do núcleo (Vitest) | Local / CI (`ci.yml`) |
| `npm run build` | Compila TypeScript para `dist/` | Local / Actions |
| `npm run wins` | Imprime todos os Wins parseados (JSON) | Local |
| `npm run generate` | Gera os Brag Docs curados em `public/` | Local (preview) / Action `pages.yml` |
| `npm run dashboard` | Gera e abre `.local/dashboard.html` (todos os Wins) | Local apenas |
| `npm run reports` | Gera e abre `.local/reports.html` (agregados) | Local apenas |

## Troubleshooting

- **"Win inválido na issue #N: Campo obrigatório ausente: Data"** — a Issue tem o label `type:win` mas falta Título ou Data, ou a Data não está no formato `AAAA-MM-DD`. Edite a Issue e corrija o campo; a geração ignora esse Win até lá, sem quebrar os demais.
- **`npm run generate` diz "Nenhum docs/brag/*.yml encontrado"** — crie ao menos um arquivo conforme a Feature 3 antes de tentar publicar.
- **Erro do guard anti-vazamento** — algum Win listado num Brag Doc já gerado não tem mais o label `brag:<slug>` correspondente (foi removido depois da última geração). Rode `npm run generate` de novo para republicar sem esse Win, ou readicione o label se a remoção foi acidental.
- **`gh` falha localmente com erro de autenticação** — rode `gh auth login` e garanta que está autenticado no mesmo repositório de onde você está rodando os comandos.
- **Milestone não foi atribuída automaticamente** — confira se o workflow `milestone.yml` rodou na aba Actions da Issue; se falhou, o log aponta a causa (geralmente permissão de `issues: write` ou a Data em formato inválido).
