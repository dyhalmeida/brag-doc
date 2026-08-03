import type { DocConfig } from "../site.js";

export const review2026Doc: DocConfig = {
  slug: "review-2026",
  title: "Review 2026",
  intro: "Conquistas para minha review anual.",
  order: "newest",
  show: { metrics: true, dates: true, company: true, links: true },
};

export const review2026DocOldestFirst: DocConfig = {
  ...review2026Doc,
  order: "oldest",
};

export const review2026DocAllHidden: DocConfig = {
  slug: "review-2026",
  title: "Review 2026 (recortado)",
  intro: undefined,
  order: "newest",
  show: { metrics: false, dates: false, company: false, links: false },
};

export const entrevistaXDoc: DocConfig = {
  slug: "entrevista-x",
  title: "Entrevista X",
  intro: undefined,
  order: "newest",
  show: { metrics: true, dates: true, company: true, links: true },
};

export const review2026DocMetricsHidden: DocConfig = {
  slug: "review-2026",
  title: "Review 2026 (sem métricas)",
  intro: undefined,
  order: "newest",
  show: { metrics: false, dates: true, company: true, links: true },
};

export const emptyDoc: DocConfig = {
  slug: "does-not-exist",
  title: "Doc vazio",
  intro: undefined,
  order: "newest",
  show: { metrics: true, dates: true, company: true, links: true },
};
