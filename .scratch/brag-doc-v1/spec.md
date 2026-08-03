# Spec: Brag Doc v1

Status: ready-for-agent

> Glossário em `CONTEXT.md`. Decisões de arquitetura em `docs/adr/0001..0004`. Este spec respeita todas elas.

## Problem Statement

Eu (engenheiro) faço conquistas no trabalho o tempo todo, mas na hora da avaliação de desempenho ou de uma entrevista não lembro do que fiz nem consigo provar o impacto. Ferramentas SaaS (getbragdoc.com) resolvem isso, mas guardam meus dados no servidor delas, são pagas, e eu não controlo o formato. Eu quero registrar minhas conquistas ao longo dos anos com dados que são **meus, versionados e portáveis**, sem manter um servidor nem pagar assinatura.

## Solution

Um sistema de brag document construído **inteiramente sobre o GitHub**, sem banco de dados e sem backend:

- **Captura** de cada conquista (Win) como uma GitHub Issue, usando a UI/app nativo do GitHub (Issue Form). Nenhuma tela de captura própria pra manter.
- **Automação** via GitHub Actions: ao abrir uma Issue de Win, uma Action deriva o Período da data e atribui a Milestone correspondente.
- **Curadoria** declarativa: marcar Wins com o label `brag:<slug>` os inclui num Brag Doc específico, cuja configuração (título, introdução, toggles) vive num arquivo YAML versionado.
- **Geração estática**: uma Action lê as Issues em build-time (com `GITHUB_TOKEN`, server-side) e gera HTML. O recorte curado é publicado no GitHub Pages (público) como link compartilhável; a visão completa de todos os Wins é gerada apenas localmente/como artifact (nunca no Pages, que seria público no plano Free/Pro).

Os dados privados nunca são lidos pelo browser — a autorização acontece só na Action, em build-time. Não há autenticação em runtime.

## User Stories

### Captura de Wins

1. Como usuário, quero abrir uma Issue a partir de um Issue Form dedicado a Wins, para registrar uma conquista com campos estruturados sem inventar formato.
2. Como usuário, quero um campo de título obrigatório no form, para que todo Win tenha uma descrição curta do que realizei.
3. Como usuário, quero um campo de data no form, para registrar quando a conquista aconteceu (fonte única de verdade do tempo).
4. Como usuário, quero um dropdown de Job no form, para associar o Win ao trabalho/empresa em que ele aconteceu.
5. Como usuário, quero um campo de detalhes (prosa markdown) opcional, para contextualizar a conquista com narrativa.
6. Como usuário, quero um campo de Impact Metric opcional, para quantificar o resultado (ex.: "Redução de latência: 40%").
7. Como usuário, quero um campo de links opcional, para anexar referências (PR, Figma, doc, gravação).
8. Como usuário, quero poder adicionar labels de Tag ao Win, para categorizá-lo por tema/skill.
9. Como usuário, quero registrar um Win pelo app mobile do GitHub, para capturar a conquista no momento em que ela acontece, longe do computador.
10. Como usuário, quero anexar arquivos ao Win usando o anexo nativo de Issues, para guardar evidências (prints, PDFs).

### Automação de Período (Milestone)

11. Como usuário, quero que o sistema derive o Período (trimestre e ano) da data do Win automaticamente, para não precisar calcular nem digitar isso.
12. Como usuário, quero que a Issue seja atribuída à Milestone do seu Período automaticamente ao ser aberta, para ver meus Wins agrupados por período na aba nativa de Milestones.
13. Como usuário, quero que a Milestone do Período seja criada automaticamente se ainda não existir, para nunca ter que criar milestones na mão.
14. Como usuário, quero que, se eu editar a data de um Win, a Milestone seja recalculada, para que o agrupamento nunca divirja da data.
15. Como usuário, quero que a atribuição de Milestone seja idempotente, para que reabrir/reprocessar uma Issue não crie duplicatas.

### Curadoria de Brag Docs

16. Como usuário, quero marcar um Win com o label `brag:<slug>` para incluí-lo num Brag Doc específico (ex.: `brag:review-2026`).
17. Como usuário, quero que o mesmo Win possa aparecer em vários Brag Docs, para reaproveitar uma conquista forte em review e em entrevista.
18. Como usuário, quero definir cada Brag Doc num arquivo `docs/brag/<slug>.yml` com título e introdução, para dar contexto ao recorte.
19. Como usuário, quero toggles no arquivo de definição (mostrar/ocultar métricas, datas, empresa, links), para controlar o que aparece em cada Brag Doc.
20. Como usuário, quero definir a ordem dos Wins no Brag Doc (mais recente/mais antigo primeiro), para contar a história na ordem que eu quiser.
21. Como usuário, quero remover um Win de um Brag Doc apenas removendo o label, para curar sem mexer no conteúdo do Win.

### Geração e publicação

22. Como usuário, quero que uma Action gere o HTML de cada Brag Doc a partir das Issues, para não montar nada à mão.
23. Como usuário, quero que apenas os Brag Docs curados sejam publicados no GitHub Pages, para nunca vazar Wins privados que não escolhi expor.
24. Como usuário, quero que a URL do Pages de um Brag Doc seja o "link compartilhável", para enviar a um gestor/recrutador.
25. Como usuário, quero que a visão completa de todos os Wins seja gerada só localmente ou como artifact, para navegar tudo em privado sem publicar.
26. Como usuário, quero que a geração rode automaticamente quando Issues ou arquivos de definição mudam, para o site publicado ficar sempre atualizado.
27. Como usuário, quero poder rodar a geração localmente por um comando, para pré-visualizar antes de publicar.

### Dashboard local completo

28. Como usuário, quero uma página local que liste todos os meus Wins, para revisar o que fiz antes de decidir o que curar.
29. Como usuário, quero buscar Wins por texto no dashboard local, para achar rapidamente uma conquista específica.
30. Como usuário, quero filtrar Wins por Job, Tag e Período no dashboard local, para focar num recorte enquanto reviso.
31. Como usuário, quero ver num Win quais Brag Docs (`brag:*`) ele já integra, para saber o que já foi curado.

### Reports (agregados)

32. Como usuário, quero ver a contagem de Wins por Período, para perceber minha cadência de conquistas ao longo do tempo.
33. Como usuário, quero ver a contagem de Wins por Tag, para entender em que temas eu mais entrego.
34. Como usuário, quero ver a contagem de Wins por Job, para separar conquistas por empresa/cargo.
35. Como usuário, quero filtrar os Reports por período/job/tag, para recortar a análise para uma avaliação específica.

### Export PDF

36. Como usuário, quero exportar um Brag Doc como PDF, para enviar um anexo a quem não vai abrir um link.
37. Como usuário, quero que o HTML do Brag Doc tenha CSS de impressão caprichado, para que "imprimir → salvar como PDF" produza um documento apresentável sem feature dedicada.

### Lembrete semanal

38. Como usuário, quero que uma Action agendada abra uma Issue de lembrete uma vez por semana, para criar o hábito de registrar Wins.
39. Como usuário, quero que o lembrete seja uma Issue simples com um checklist/pergunta, para responder registrando os Wins da semana.
40. Como usuário, quero poder ajustar o dia/frequência do lembrete no arquivo do cron, para adequá-lo à minha rotina.

### Robustez de captura

41. Como usuário, quero que um Win com data inválida ou campo faltando seja sinalizado (label ou comentário), para corrigir sem que ele quebre a geração inteira.
42. Como usuário, quero que a geração ignore Issues que não são Wins (ex.: lembretes, issues avulsas), para o brag doc não misturar ruído.

## Implementation Decisions

### Arquitetura (herdada dos ADRs)

- **Híbrido com geração estática** (ADR-0001): captura via Issues nativas; geração via Action em build-time com `GITHUB_TOKEN`; publicação via Pages; **sem backend, sem auth em runtime**. Repo **privado**; Pages recebe só o recorte curado.
- **Win = Issue via Issue Form** (ADR-0002): `.github/ISSUE_TEMPLATE/win.yml`. O dado é o markdown em seções `### Campo` que o form gera; o parser é acoplado à estrutura de seções do form.
- **Mapeamento GitHub** (ADR-0003): Job = label `job:<slug>`; Tag = label `tag:<slug>`; Data = campo do form (fonte única de tempo); Período = Milestone `AAAA-Qn` derivada por Action.
- **Curadoria por label** (ADR-0004): `brag:<slug>` + `docs/brag/<slug>.yml`; Pages publica um doc por label; visão completa só local.

### Stack

- **Node + TypeScript** para o núcleo de domínio e os scripts das Actions.
- **Vitest** como test runner.
- Geração de HTML por **templating** (string/template engine simples) — **não** há React nem SPA. Output = HTML estático + CSS (incluindo `@media print`).
- YAML para config (form template + `docs/brag/<slug>.yml`); markdown para prosa dos Wins; HTML para output. (Fecha o "markdown vs YAML".)

### Módulos e fronteira núcleo/bordas

Regra central: **todo I/O do GitHub fica em shells finas nas bordas; a lógica de domínio é um núcleo puro e testável.**

**Núcleo puro (testado):**

- `parseWin(rawIssue) → Win` — recebe o payload cru de uma Issue (corpo markdown + labels + metadados) e devolve um objeto `Win` do domínio. Reconhece Wins pela estrutura do form; devolve erro/marcação para Issues malformadas ou não-Wins, sem lançar de forma que derrube o batch.
- `derivePeriod(date) → Period` — função pura: data → `{ year, quarter, milestone: "AAAA-Qn" }`. Cobre viradas de trimestre/ano e datas inválidas.
- `buildSite(wins[], docConfigs[]) → SiteModel` — o seam mais alto. Aplica curadoria (`brag:*`), toggles e ordenação de cada `docConfig`; calcula agregados dos Reports; monta a visão completa. `SiteModel` é a estrutura de dados que os templates consomem (`{ dashboard, docs: DocModel[], reports }`), **não** HTML.

**Bordas (shells finas, não testadas por unidade):**

- Buscar Issues (via `gh`/API do GitHub) → alimenta `parseWin`.
- Garantir/atribuir Milestone (API) — a lógica de *qual* milestone vem de `derivePeriod`; a shell só executa a chamada de forma idempotente.
- Renderizar `SiteModel` → arquivos HTML e escrevê-los em disco.
- Publicar no Pages (Action oficial de deploy).
- Abrir Issue de lembrete (cron Action).

### Contratos

- **`Win`** (saída de `parseWin`): título, data, job, tags[], detalhes (markdown), impactMetric?, links[], número/URL da Issue, brags[] (slugs derivados dos labels `brag:*`).
- **`docs/brag/<slug>.yml`**: `title`, `intro?`, `order: newest|oldest`, `show: { metrics, dates, company, links }`.
- **Nome de Milestone**: `AAAA-Qn` (ex.: `2026-Q1`). Contrato compartilhado entre a Action `on: issues` e a geração.

## Testing Decisions

- **O que é um bom teste aqui:** exercita comportamento externo do núcleo puro — dado um input (Issue crua, data, conjunto de Wins + configs), asserta sobre o **objeto/modelo de saída**, nunca sobre detalhes internos nem sobre strings de HTML renderizado.
- **Seams testados** (todos no núcleo puro, com Vitest):
  - `derivePeriod` — casos de borda: primeiro/último dia de cada trimestre, virada de ano, ano bissexto, data inválida, timezone.
  - `parseWin` — form bem formado; campos opcionais ausentes; markdown malformado; Issue que não é Win; múltiplos labels `job:`/`tag:`/`brag:`.
  - `buildSite` (**seam principal**) — fixtures de Wins + `docConfigs`: filtragem por `brag:<slug>`; toggles ocultando campos; ordenação newest/oldest; agregados de Reports (contagem por período/tag/job); Win em múltiplos docs; doc sem nenhum Win.
- **Estratégia de fixtures:** payloads de Issue crus (markdown do form + labels) como fixtures versionadas, servindo de input pros testes de `parseWin` e, encadeados, de `buildSite`.
- **Fora do teste unitário:** as shells de I/O (chamadas ao `gh`/API, escrita em disco, deploy do Pages) — são finas e integradas manualmente/por smoke test da Action.
- **Prior art:** nenhum (greenfield). Este spec estabelece o padrão: núcleo puro + fixtures de Issue crua.

## Out of Scope

- **Kudos** — coleta de reconhecimento de terceiros exige backend/link público (viola ADR-0001). Fora do v1; reavaliar só com serverless gratuito.
- **Escrita pela interface** — qualquer criação/edição de Win ou label via UI própria; toda mutação acontece na UI nativa do GitHub. Não há SPA nem tela de captura própria.
- **AI Summary** — geração de resumo por IA do getbragdoc.
- **Autenticação/multiusuário** — sistema é pessoal, single-user.
- **Pages privado** — indisponível no plano Free/Pro; por isso a visão completa fica local.
- **Export CSV** e feature dedicada de export PDF — PDF sai via print CSS + browser; CSV não entra no v1.

## Further Notes

- **Read-only por design:** a consequência de "sem backend/auth" é que qualquer visualização gerada é somente-leitura. Isso é uma feature, não limitação: mantém a superfície de captura no GitHub (mobile, notificações, API de graça) e zera o frontend de captura a manter.
- **Cuidado com vazamento:** publicar no Pages é ato deliberado (existir `docs/brag/<slug>.yml` + Wins com o label). A geração da visão completa nunca deve tocar o diretório publicado. Vale um teste/guard que garanta que o output público contém só Wins com label `brag:*`.
- **Ordem de construção sugerida (menor risco primeiro):** (1) loop essencial — `win.yml` + `parseWin` + `derivePeriod` + Action de milestone + `buildSite` + geração do doc curado + deploy Pages; (2) dashboard local; (3) lembrete semanal (cron trivial); (4) CSS de print pra PDF; (5) Reports (mais lógica de agregação).
