# 01 — Scaffold do projeto

**What to build:** Uma base de projeto Node + TypeScript com Vitest funcionando, sobre a qual todos os outros tickets são construídos. Ao final, um teste trivial roda verde e o layout do repo está pronto para receber o núcleo de domínio e os scripts das Actions.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] `package.json` com scripts de `test` (Vitest), `build` e `generate` (placeholder)
- [ ] TypeScript configurado (`tsconfig`) mirando Node
- [ ] Vitest configurado e um teste trivial passando (`npm test` verde)
- [ ] Layout de diretórios separando **núcleo puro** (domínio, testável) das **bordas** (shells de I/O do GitHub)
- [ ] Esqueleto de CI que roda `npm test` em push/PR
- [ ] `.gitignore` cobre artefatos de build e a saída da visão completa local (nunca versionada)
