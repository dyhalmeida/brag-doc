# Brag Doc

Sistema pessoal para registrar conquistas profissionais ao longo dos anos, construído sobre recursos nativos do GitHub (Issues, Milestones, Labels, Actions, Pages) em vez de um banco de dados. Modelo de domínio inspirado no getbragdoc.com.

## Language

**Win**:
Uma conquista registrada — a unidade central de captura. Tem título, data, contexto e, opcionalmente, impacto mensurável.
_Avoid_: Achievement, task, accomplishment (use "Win"), conquista (no código/labels)

**Job**:
Um período de trabalho (empresa + cargo + intervalo de datas) ao qual um Win pertence. Um Win pertence a exatamente um Job.
_Avoid_: Company, employer, role (o Job carrega os três)

**Tag**:
Rótulo livre para categorizar Wins por tema/skill (ex.: "liderança", "performance", "mentoria").
_Avoid_: Category, label (no domínio é "Tag"; "Label" é o primitivo do GitHub que a implementa)

**Impact Metric**:
Um resultado quantificado de um Win, no formato métrica + valor (ex.: "Redução de latência: 40%").
_Avoid_: KPI, result, número

**Kudos**:
Reconhecimento vindo de outra pessoa (colega/cliente), não auto-declarado. Distinto de um Win por ser externo. **Fora do v1** — a coleta via link público exige backend, proibido pelo [[0001-hybrid-static-generation]]. Reavaliar só se um serverless gratuito entrar em jogo.
_Avoid_: Feedback, praise, recognition

**Brag Doc**:
O documento de output: um recorte *curado* de Wins (e Kudos) montado para um público específico (performance review, entrevista). Não é a coleção inteira — é uma seleção.
_Avoid_: Report, resume, portfolio

**Período**:
Uma janela temporal (trimestre ou ano) usada para agrupar Wins. Derivado da data do Win — nunca digitado à mão. Materializado como Milestone no GitHub.
_Avoid_: Ciclo (Ciclo/Review é outro conceito, fora do v1), sprint

**Report**:
Uma visão agregada/analítica dos Wins por período (contagens, gráficos, export). Diferente do Brag Doc: Report é sumário estatístico, Brag Doc é narrativa curada.
_Avoid_: Dashboard, summary

## GitHub como substrato

Os conceitos de domínio acima são mapeados para primitivos do GitHub (Issue, Milestone, Label, etc.). Os mapeamentos específicos são decididos nos ADRs em `docs/adr/`.
