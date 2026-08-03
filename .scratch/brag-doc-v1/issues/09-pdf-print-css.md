# 09 — Export PDF via print CSS

**What to build:** Poder mandar um Brag Doc como PDF sem feature dedicada: o HTML do doc curado ganha CSS de impressão caprichado, de modo que "imprimir → salvar como PDF" produza um documento apresentável. Demonstrável abrindo um doc curado, dando Ctrl+P e conferindo o preview de impressão.

**Blocked by:** 05 — Doc curado em HTML + deploy no Pages.

**Status:** ready-for-agent

- [ ] Regras `@media print` no HTML do doc curado: tipografia, margens, quebras de página sensatas
- [ ] Elementos de navegação/UI escondidos na impressão
- [ ] Links continuam legíveis/utilizáveis no PDF
- [ ] Verificação visual: Ctrl+P → salvar como PDF gera um documento apresentável de ponta a ponta
