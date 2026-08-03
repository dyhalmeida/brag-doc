# Brag Doc — Documentação de Produto

## O problema

Você faz conquistas no trabalho o tempo todo — resolveu um incidente crítico, liderou um projeto, mentorou alguém, melhorou uma métrica — mas na hora de uma avaliação de desempenho ou de uma entrevista, não lembra do que fez nem consegue provar o impacto.

Existem ferramentas SaaS para isso (ex.: getbragdoc.com), mas elas guardam seus dados no servidor delas, são pagas, e você não controla o formato nem a portabilidade.

## A solução

**Brag Doc** é um sistema pessoal de registro de conquistas profissionais construído inteiramente sobre o GitHub — sem banco de dados, sem backend, sem assinatura. Seus dados são **seus**: versionados em um repositório Git privado, no formato que você quiser, sem depender de nenhum serviço além do GitHub.

A ideia central: cada conquista ("**Win**") é uma Issue do GitHub. Você já usa Issues; o sistema só organiza, agrega e publica o que você já registrou.

## Como funciona, na prática

### 1. Registrar uma conquista (Win)

Sempre que você realizar algo digno de nota, abre uma **Issue** usando um formulário dedicado ("Win") — pelo navegador, pelo app mobile do GitHub, ou de onde estiver. O formulário pede:

- **Título** — o que você fez, em uma frase.
- **Data** — quando aconteceu (essa é a única fonte de verdade de tempo no sistema).
- **Job** — a empresa/cargo onde aconteceu (via label).
- **Detalhes** — a narrativa, em markdown, se quiser contextualizar.
- **Impact Metric** — um resultado quantificado (ex.: "Redução de latência: 40%").
- **Links** — referências: PR, Figma, gravação, documento.

Você também pode anexar prints ou PDFs como evidência, usando o anexo nativo de Issues, e marcar **Tags** livres (ex.: "liderança", "performance") para categorizar por tema.

### 2. Organização automática por período

Assim que a Issue é aberta, uma automação lê a data e agrupa o Win no trimestre correspondente (ex.: "2026-Q1"), usando a aba nativa de **Milestones** do GitHub. Você nunca precisa calcular ou digitar isso — e se editar a data depois, o agrupamento se ajusta sozinho.

### 3. Curadoria: escolher o que vira um Brag Doc

Um **Brag Doc** não é a coleção inteira de Wins — é um recorte curado para um público específico (uma review de performance, uma entrevista). Você decide o que entra em cada recorte marcando o Win com um rótulo de curadoria (ex.: "review-2026", "entrevista-empresa-x"). O mesmo Win pode aparecer em vários Brag Docs diferentes.

Cada Brag Doc tem sua própria configuração: título, texto de introdução, ordem dos Wins (mais recente ou mais antigo primeiro), e o que exibir ou ocultar (métricas de impacto, datas, nome da empresa, links).

### 4. Publicação como link compartilhável

Cada Brag Doc curado é publicado automaticamente como uma página web (via GitHub Pages) sempre que você atualiza a curadoria. Essa URL é o "link compartilhável" que você manda para um gestor ou recrutador — sem precisar montar nada manualmente.

**Nota sobre privacidade (variante de repositório público):** nesta configuração, o repositório é **público** — decisão registrada em [`docs/adr/0005-public-repo-for-free-plan-pages.md`](docs/adr/0005-public-repo-for-free-plan-pages.md) para viabilizar o GitHub Pages no plano Free, que não habilita Pages em repositórios privados. Isso muda a garantia original do sistema: **toda Issue de Win é pública**, não só o recorte curado — qualquer pessoa pode navegar diretamente pelas Issues no GitHub. A curadoria por rótulo continua controlando o que vira uma página polida e compartilhável, mas deixou de ser um controle de privacidade. Evite registrar informação confidencial (nomes de clientes, dados sensíveis da empresa) nos campos de um Win.

### 5. Revisão local de tudo que você já fez

Antes de decidir o que curar, você pode abrir um painel local (no seu navegador, mas sem publicar nada) que lista todos os seus Wins, com busca por texto e filtros por empresa, tag e período. Esse painel também mostra em quais Brag Docs cada Win já foi incluído.

### 6. Reports: enxergar padrões ao longo do tempo

Além da narrativa curada, o sistema oferece uma visão agregada e estatística: quantos Wins por período, por tag, por empresa — filtrável para recortar a análise. Isso ajuda a perceber sua cadência de conquistas e em que temas você mais entrega.

### 7. Exportação em PDF

Qualquer Brag Doc pode virar um PDF apresentável usando o próprio recurso de impressão do navegador ("Imprimir → Salvar como PDF") — útil para quem vai receber um anexo em vez de um link.

### 8. Lembrete semanal

Uma vez por semana, o sistema abre automaticamente uma Issue de lembrete, para criar o hábito de registrar Wins com regularidade, mesmo em semanas corridas.

## Por que isso é diferente de um SaaS

- **Seus dados, seu controle.** Tudo vive em um repositório Git seu, exportável e versionado — não em um banco de dados de terceiros. (Nesta variante o repositório é público por restrição do plano Free — veja a nota de privacidade acima.)
- **Sem assinatura.** O sistema roda sobre recursos gratuitos do GitHub (Issues, Milestones, Labels, Actions, Pages).
- **Sem tela de captura para manter.** Você usa a própria interface do GitHub (web ou mobile) para registrar Wins — nada de app ou formulário próprio para aprender.
- **Somente leitura por design.** Toda visualização gerada (dashboard, reports, Brag Docs publicados) é read-only. Qualquer edição acontece na própria Issue, na UI nativa do GitHub — isso simplifica o sistema e evita duas fontes de verdade.

## O que este sistema não faz (por escolha, no momento)

- **Kudos** — reconhecimento vindo de outra pessoa. Exigiria um link público de coleta e, portanto, algum backend — fora do modelo "sem servidor" atual.
- **Resumo por IA** das conquistas.
- **Múltiplos usuários / autenticação** — é um sistema pessoal, de um usuário só.
- **Export em CSV** — a exportação suportada é em PDF, via impressão do navegador.

## Um dia típico de uso

1. Você termina de liderar a virada de um incidente complexo. Abre uma Issue de Win pelo celular, no caminho de volta pra casa, com título, data e uma métrica de impacto.
2. Toda sexta, um lembrete automático aparece nas suas Issues perguntando o que você conquistou na semana — você revisa e registra o que faltou.
3. Um mês antes da sua avaliação de desempenho, você abre o painel local, revisa todos os Wins do período, e marca os mais relevantes com o rótulo de curadoria da review.
4. Você compartilha o link publicado (ou exporta um PDF) com seu gestor.
5. Nos Reports, você percebe que registrou poucos Wins em um trimestre específico — um sinal para prestar mais atenção à própria cadência daqui pra frente.
