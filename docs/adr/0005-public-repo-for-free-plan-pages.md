# Repositório público para viabilizar Pages no plano Free

Status: accepted — **contradiz o pressuposto de privacidade do [[0001-hybrid-static-generation]]**, revisitado deliberadamente por restrição de plano.

## Contexto

O plano GitHub Free **não habilita Pages em nenhum repositório privado**, para nenhum método de publicação (`build_type: workflow` ou branch `gh-pages`) — confirmado via API (`POST /repos/.../pages` retorna 422 "Your current plan does not support GitHub Pages for this repository" em ambos os casos). Pages em repo privado exige GitHub Pro/Team/Enterprise. O ADR-0001 assumia repo privado com o Pages recebendo só o recorte curado; essa arquitetura pressupõe um plano pago que o usuário não tem hoje.

## Decisão

Tornar o repositório **público**, para desbloquear Pages no plano Free.

## Consequências

- **Toda Issue de Win vira pública**, não só o recorte curado em `docs/brag/<slug>.yml`. Qualquer pessoa pode navegar diretamente pelas Issues no GitHub e ver todo o histórico de conquistas — nome de empresa, detalhes, métricas, links — independentemente de ter sido marcado com `brag:*`.
- A curadoria por label deixa de ser um controle de **privacidade** e passa a ser só um controle de **narrativa/apresentação**: ela decide o que vira uma página polida para compartilhar, não o que é visível.
- O guard anti-vazamento (`src/core/publish-guard.ts`) continua útil — evita que um Win removido de um doc continue aparecendo na página publicada — mas não é mais a única barreira de privacidade, porque não há mais barreira de privacidade nenhuma sobre os dados crus.
- **Antes de capturar um Win**, considere que qualquer coisa escrita em Título/Detalhes/Impact Metric/Links é pública a partir de agora — nomes de clientes, dados sensíveis da empresa ou informação confidencial não devem entrar ali.
- Reversível a qualquer momento voltando o repo para privado (Settings → General → Danger Zone), mas isso não reescreve o histórico: qualquer conteúdo já publicamente indexado (por buscadores, forks, caches) pode persistir fora do controle do usuário.
