import type { RawIssue } from "../win.js";

export const issueWithoutOptionalFields: RawIssue = {
  number: 7,
  url: "https://github.com/diegoja/my-brag-doc/issues/7",
  labels: ["type:win"],
  body: `### Título

Apresentei a arquitetura para o time

### Data

2026-02-10

### Job

_No response_

### Detalhes

_No response_

### Impact Metric

_No response_

### Links

_No response_
`,
};

export const issueMissingTitle: RawIssue = {
  number: 8,
  url: "https://github.com/diegoja/my-brag-doc/issues/8",
  labels: ["type:win"],
  body: `### Título

_No response_

### Data

2026-02-10
`,
};

export const issueWithInvalidDate: RawIssue = {
  number: 9,
  url: "https://github.com/diegoja/my-brag-doc/issues/9",
  labels: ["type:win"],
  body: `### Título

Corrigi um bug crítico em produção

### Data

2026-13-40
`,
};

export const issueMissingDate: RawIssue = {
  number: 12,
  url: "https://github.com/diegoja/my-brag-doc/issues/12",
  labels: ["type:win"],
  body: `### Título

Corrigi um bug crítico em produção
`,
};

export const issueWithMalformedBody: RawIssue = {
  number: 13,
  url: "https://github.com/diegoja/my-brag-doc/issues/13",
  labels: ["type:win"],
  body: "Só escrevi um comentário solto, sem usar o form.",
};

export const nonWinIssue: RawIssue = {
  number: 10,
  url: "https://github.com/diegoja/my-brag-doc/issues/10",
  labels: ["type:reminder"],
  body: "Você registrou algum Win essa semana?",
};

export const issueWithMultipleLabels: RawIssue = {
  number: 11,
  url: "https://github.com/diegoja/my-brag-doc/issues/11",
  labels: ["type:win", "job:acme", "tag:performance", "tag:lideranca", "brag:review-2026", "brag:entrevista-x"],
  body: `### Título

Liderei a migração do banco de dados

### Data

2026-05-20
`,
};

export const wellFormedIssue: RawIssue = {
  number: 42,
  url: "https://github.com/diegoja/my-brag-doc/issues/42",
  labels: ["type:win", "job:acme", "tag:performance", "brag:review-2026"],
  body: `### Título

Reduzi o tempo de deploy em 70%

### Data

2026-03-15

### Job

Acme Corp

### Detalhes

Migrei o pipeline de CI para cache de dependências e paralelizamos os testes.

### Impact Metric

Redução de latência: 40%

### Links

https://github.com/acme/repo/pull/123
https://figma.com/file/xyz
`,
};
