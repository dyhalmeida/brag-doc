# 04 — Núcleo `buildSite` (modelo de docs)

**What to build:** O coração puro e testável do sistema: dada a lista de Wins e as definições de Brag Doc, produz o modelo de dados que os templates vão renderizar — aplicando curadoria por label, toggles e ordenação. Nenhum I/O. Demonstrável por teste/CLI que imprime o `SiteModel` a partir de fixtures.

**Blocked by:** 02 — Capturar e parsear um Win.

**Status:** ready-for-agent

- [x] Schema do arquivo de definição `docs/brag/<slug>.yml`: `title`, `intro?`, `order: newest|oldest`, `show: { metrics, dates, company, links }`
- [x] `buildSite(wins[], docConfigs[]) → SiteModel`, onde `SiteModel = { docs: DocModel[] }` (dashboard e reports entram nos tickets 06/07)
- [x] Filtra os Wins de cada doc pelo label `brag:<slug>` correspondente
- [x] Aplica os toggles `show.*` ocultando campos no `DocModel` (métricas/datas/empresa/links)
- [x] Aplica a ordenação `newest`/`oldest`
- [x] `SiteModel` é estrutura de dados, **nunca** HTML
- [x] Testes com fixtures: filtragem por slug, toggles ocultando campos, ordenação, Win em múltiplos docs, doc sem nenhum Win
