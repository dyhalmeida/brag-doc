# 07 — Reports (agregados)

**What to build:** Uma visão agregada dos Wins que mostra cadência e distribuição — contagens por Período, Tag e Job — com filtros, para dar um panorama numa avaliação. Gerada localmente como o dashboard. Demonstrável rodando o gerador e vendo as contagens e os filtros funcionando.

**Blocked by:** 04 — Núcleo `buildSite`.

**Status:** ready-for-agent

- [ ] `buildSite` passa a montar também os `reports` do `SiteModel` (agregados)
- [ ] Agregados: contagem de Wins por Período, por Tag e por Job
- [ ] Filtros por Período, Job e Tag aplicáveis à visão de Reports
- [ ] Testes dos agregados com fixtures (contagens corretas, filtros combinados)
- [ ] Renderização local (não vai para o Pages)
