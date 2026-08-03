# Arquitetura híbrida com geração estática (sem UI própria, sem backend)

## Contexto

O getbragdoc.com é um SaaS com UI polida e banco de dados. Queremos o mesmo modelo de domínio, mas com os dados versionados e sob nosso controle no GitHub, sem manter um frontend nem pagar por um produto.

Consideramos três formas: (1) GitHub puro sem UI; (2) recriar a UI sobre a API do GitHub; (3) híbrido com camada fina de visualização.

## Decisão

Adotamos o **híbrido com geração estática (SSG)**:

- **Captura**: Wins são GitHub Issues, criadas pela UI/app nativo do GitHub. Não recriamos a tela de captura.
- **Geração**: um GitHub Action roda em build-time, lê as Issues usando o `GITHUB_TOKEN` (autorização server-side, de graça), e gera artefatos estáticos (JSON + HTML).
- **Visualização/curadoria**: site estático servido pelo GitHub Pages. Seleção de Wins e montagem do Brag Doc acontecem 100% client-side (JS sobre o JSON gerado); o "link compartilhável" é uma URL com a seleção codificada.
- **Privacidade**: o repo é **privado** (Wins crus são privados). O Pages publica **apenas o Brag Doc curado** — o recorte que o usuário escolheu expor.

## Consequências

- **Sem autenticação em runtime e sem backend.** O browser nunca chama a API do GitHub para dados privados; só consome um JSON já gerado. Isso resolve a impossibilidade de guardar um segredo/token com segurança numa página estática.
- Provedores de auth externos (Auth0, Clerk, Firebase) foram descartados: eles autenticam *quem* é o usuário, mas não fornecem autorização (token) para ler Issues de repo privado — não resolvem o problema real.
- Trade-off aceito: a captura fica limitada à UI nativa do GitHub (não customizável); em troca, zero frontend de captura para manter.
- O que é publicado no Pages precisa de cuidado deliberado: só o subconjunto curado, nunca o dump completo das Issues privadas.
