# 06 — Dashboard local completo

**What to build:** Uma visão privada de TODOS os Wins, para o usuário revisar o que fez antes de decidir o que curar. Gerada apenas localmente (nunca no Pages, que seria público), com busca e filtros. Demonstrável rodando o gerador local e abrindo o HTML no navegador.

**Blocked by:** 04 — Núcleo `buildSite`.

**Status:** ready-for-agent

- [ ] `buildSite` passa a montar também o `dashboard` do `SiteModel` (todos os Wins normalizados)
- [ ] Renderização HTML da visão completa, gerada só localmente / como artifact — **gitignored, nunca no diretório publicado**
- [ ] Busca por texto nos Wins
- [ ] Filtros por Job, Tag e Período
- [ ] Cada Win mostra em quais `brag:*` já está incluído
- [ ] Comando local único gera e abre/aponta o dashboard
