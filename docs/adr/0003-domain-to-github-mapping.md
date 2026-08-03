# Mapeamento do domínio para primitivos do GitHub

## Contexto

Os conceitos de domínio (Win, Job, Tag, período) precisam de uma representação nativa no GitHub que seja capturável pela UI nativa e parseável pela Action. Milestones, Labels e o campo de data do Issue Form competem para representar tempo e classificação.

## Decisão

| Domínio | Primitivo GitHub |
|---|---|
| **Win** | Issue (via Issue Form) |
| **Job** | Label `job:<slug>` |
| **Tag** | Label `tag:<slug>` |
| **Data do Win** | Campo do Issue Form (fonte única de verdade para tempo) |
| **Período (ano/tri)** | Milestone `2026-Q1`, **derivada da data por Action** |

- **Data é a única fonte de verdade para tempo.** Ano e trimestre são derivados dela.
- Como Issue Forms **não conseguem atribuir milestone** (o front-matter aceita `labels`/`assignees`/`title`/`projects`, mas não `milestone`), uma Action `on: issues` lê a data, garante a milestone do período (cria se faltar) e atribui a issue.
- Isso preserva o agrupamento nativo na aba Milestones sem digitação manual e sem risco de a milestone divergir da data.

## Consequências

- Job/Tag como labels são filtráveis nativamente na UI do GitHub e triviais de agregar na geração.
- A milestone vira um artefato *gerado*, não um input — não confie nela como fonte primária; regenere a partir da data se precisar.
- Se a lógica de derivação de período mudar (ex.: passar de trimestre para semestre), as milestones existentes precisam ser recalculadas por uma Action de migração.
