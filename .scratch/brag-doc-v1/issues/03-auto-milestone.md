# 03 — Action de auto-milestone

**What to build:** Ao abrir ou editar um Win, o sistema agrupa a Issue no Período certo automaticamente: uma GitHub Action deriva o Período da data e cria/atribui a Milestone correspondente, sem o usuário tocar em milestones. Demonstrável abrindo/editando um Win e vendo a milestone aparecer/atualizar na aba nativa do GitHub.

**Blocked by:** 02 — Capturar e parsear um Win (usa `derivePeriod`).

**Status:** ready-for-agent

- [ ] Action `on: issues` (opened, edited) que só age em Issues com label `type:win`
- [ ] Deriva o Período via `derivePeriod` a partir da data do Win
- [ ] Garante a existência da Milestone `AAAA-Qn` (cria se faltar) e atribui a Issue a ela
- [ ] Idempotente: reprocessar a mesma Issue não cria milestone duplicada nem reatribui à toa
- [ ] Editar a data de um Win recalcula e reatribui a Milestone; a antiga é substituída
- [ ] A lógica de *qual* milestone é do núcleo puro; a shell da Action só executa as chamadas de API
