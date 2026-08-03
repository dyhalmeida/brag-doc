# 08 — Lembrete semanal

**What to build:** Um empurrão para criar o hábito de registrar Wins: uma Action agendada abre, uma vez por semana, uma Issue de lembrete com um checklist/pergunta. Demonstrável disparando o workflow e vendo a Issue de lembrete ser criada. Independente do resto do pipeline.

**Blocked by:** 01 — Scaffold do projeto.

**Status:** ready-for-agent

- [ ] Action agendada (cron) que abre uma Issue de lembrete uma vez por semana
- [ ] A Issue de lembrete tem um checklist/pergunta ("O que você conquistou esta semana?")
- [ ] O lembrete **não** recebe o label `type:win` — é ignorado pela geração e pelo parser
- [ ] O dia/frequência é ajustável editando o cron do workflow
- [ ] Suporta disparo manual (`workflow_dispatch`) para teste
