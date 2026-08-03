# 02 — Capturar e parsear um Win

**What to build:** O usuário registra uma conquista abrindo uma Issue por um Issue Form dedicado, e o sistema transforma essa Issue crua num objeto `Win` do domínio, com o Período derivado da data. Demonstrável rodando um comando local que lista os Wins parseados como JSON.

**Blocked by:** 01 — Scaffold do projeto.

**Status:** ready-for-agent

- [ ] Issue Form `.github/ISSUE_TEMPLATE/win.yml` com os campos: título (obrigatório), data, Job (dropdown), detalhes (opcional), Impact Metric (opcional), links (opcional)
- [ ] O form aplica automaticamente o label `type:win` (via `labels:` na config do template)
- [ ] `derivePeriod(date) → { year, quarter, milestone: "AAAA-Qn" }` puro, com testes cobrindo: primeiro/último dia de cada trimestre, virada de ano, ano bissexto, data inválida, timezone
- [ ] `parseWin(rawIssue) → Win` puro: extrai os campos das seções `### Campo` do corpo, lê Job/Tag/brag dos labels, inclui número/URL da Issue e o Período derivado
- [ ] Win malformado (data inválida, campo faltando) é **sinalizado** (retorno de erro/marcação), sem lançar exceção que derrube o lote
- [ ] Issues sem o label `type:win` são ignoradas pelo parser
- [ ] Fixtures versionadas de Issue crua (markdown do form + labels) servem de input aos testes
- [ ] Comando local que busca as Issues e imprime os Wins parseados como JSON
