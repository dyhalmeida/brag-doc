# 05 — Doc curado em HTML + deploy no Pages

**What to build:** Um Brag Doc curado vira uma página pública compartilhável. Uma Action busca as Issues, roda `buildSite`, renderiza os `DocModel` em HTML e publica **apenas os docs curados** no GitHub Pages — com um guard que impede vazar qualquer Win não curado. Demonstrável marcando Wins com `brag:<slug>`, adicionando a definição e dando push: a URL pública do Pages mostra o doc.

**Blocked by:** 04 — Núcleo `buildSite`.

**Status:** ready-for-agent

- [ ] Templating que renderiza um `DocModel` em HTML estático (título, intro, Wins com os campos permitidos pelos toggles)
- [ ] Action que roda quando Issues ou arquivos `docs/brag/*.yml` mudam: busca Issues → `buildSite` → renderiza → publica no Pages
- [ ] Apenas os docs curados vão para o diretório publicado; a visão completa nunca é publicada
- [ ] **Guard anti-vazamento:** a geração falha se o output público contiver qualquer Win sem label `brag:*` (com teste cobrindo o guard)
- [ ] A URL do Pages de cada doc é estável e serve como link compartilhável
- [ ] Comando local reproduz a mesma renderização para pré-visualizar antes do push
