# Win = Issue, capturado via Issue Form (YAML)

## Contexto

Um Win precisa de campos estruturados (data, job, impact metric, links) além da prosa. Esses campos precisam ser preenchíveis com boa UX e parseáveis pela Action de geração. Consideramos: bloco YAML front-matter escrito à mão no corpo; primitivos nativos + markdown livre; e Issue Forms.

## Decisão

Cada **Win é uma GitHub Issue**. O título da issue é o título do Win. Os campos estruturados são capturados por um **Issue Form** em `.github/ISSUE_TEMPLATE/win.yml`.

O YAML é o *template* do formulário; o *dado armazenado* é o markdown consistente que o GitHub gera no corpo da issue (seções `### Campo` + resposta). A Action parseia por essas seções.

## Consequências

- Dissolve o dilema "markdown vs YAML": YAML define o form, markdown guarda o dado, e a consistência do form torna o markdown parseável de forma confiável.
- UX nativa: dropdowns, campos, funciona no app mobile do GitHub, difícil de digitar errado.
- Trade-off: o parser da Action fica acoplado à estrutura de seções do form. Renomear um campo do form exige atualizar o parser (e, a rigor, migrar issues antigas). Por isso é registrado aqui.
- A ordem/nomes das seções do form viram um contrato implícito com o gerador.
