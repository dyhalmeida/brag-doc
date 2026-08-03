# 06 — Dashboard local completo

**What to build:** Uma visão privada de TODOS os Wins, para o usuário revisar o que fez antes de decidir o que curar. Gerada apenas localmente (nunca no Pages, que seria público), com busca e filtros. Demonstrável rodando o gerador local e abrindo o HTML no navegador.

**Blocked by:** 04 — Núcleo `buildSite`.

**Status:** ready-for-agent

- [x] `buildSite` passa a montar também o `dashboard` do `SiteModel` (todos os Wins normalizados)
- [x] Renderização HTML da visão completa, gerada só localmente / como artifact — **gitignored, nunca no diretório publicado**
- [x] Busca por texto nos Wins
- [x] Filtros por Job, Tag e Período
- [x] Cada Win mostra em quais `brag:*` já está incluído
- [x] Comando local único gera e abre/aponta o dashboard
