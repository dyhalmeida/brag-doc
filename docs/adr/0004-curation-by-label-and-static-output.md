# Curadoria por Label e publicação estática

## Contexto

O Brag Doc é um recorte curado de Wins. Precisávamos de um jeito de definir "quais wins entram neste doc" que não exigisse app de seleção, auth nem estado fora do git. Alternativas: seleção interativa client-side (recorte vive na URL, não versionado) e filtro por período (sem escolha fina).

Fato relevante: no plano Free/Pro, **GitHub Pages de repo privado continua público** (Pages privado é só Enterprise). Logo a visão completa de todos os Wins não pode ir para o Pages sem vazar.

## Decisão

- **Curadoria = Label.** Marcar um Win com `brag:<slug>` o inclui naquele doc. Um Win pode estar em vários docs.
- **Definição do doc = arquivo YAML** em `docs/brag/<slug>.yml`: título, introdução e toggles (mostrar métricas/datas/empresa/links).
- **Geração estática por Action.** Para cada label `brag:*`, a Action renderiza uma página HTML e a publica no **Pages (público)**. A URL do Pages é o "link compartilhável".
- **Visão completa (todos os Wins)** é gerada **apenas localmente / como artifact** da Action — nunca no Pages, porque seria pública.

## Consequências

- Curar é uma ação nativa e versionável: adicionar/remover um label. Sem app de seleção, sem auth, consistente com o [[0001-hybrid-static-generation]].
- Publicar um doc é um ato deliberado (marcar o label + existir o `docs/brag/<slug>.yml`) — reduz o risco de vazar Wins privados sem querer.
- Resolve o "markdown vs YAML" no output: **YAML** para config do doc, **markdown** para a prosa dos Wins, **HTML** para o resultado publicado.
- Trade-off: sem seleção interativa em tempo real (estilo getbragdoc); trocar a composição de um doc exige mexer em labels e re-rodar a Action.
