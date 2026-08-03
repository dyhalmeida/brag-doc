import type { Win } from "./win.js";

export interface DocConfigShow {
  metrics: boolean;
  dates: boolean;
  company: boolean;
  links: boolean;
}

export interface DocConfig {
  slug: string;
  title: string;
  intro: string | undefined;
  order: "newest" | "oldest";
  show: DocConfigShow;
}

export interface DocModelWin {
  title: string;
  date: string | undefined;
  job: string | undefined;
  tags: string[];
  details: string | undefined;
  impactMetric: string | undefined;
  links: string[];
  issueNumber: number;
  issueUrl: string;
}

export interface DocModel {
  slug: string;
  title: string;
  intro: string | undefined;
  wins: DocModelWin[];
}

export interface DashboardWin {
  title: string;
  date: string;
  job: string | undefined;
  tags: string[];
  details: string | undefined;
  impactMetric: string | undefined;
  links: string[];
  issueNumber: number;
  issueUrl: string;
  brags: string[];
  period: string;
}

export interface DashboardModel {
  wins: DashboardWin[];
}

export interface SiteModel {
  dashboard: DashboardModel;
  docs: DocModel[];
}

export function buildSite(wins: Win[], docConfigs: DocConfig[]): SiteModel {
  return {
    dashboard: buildDashboard(wins),
    docs: docConfigs.map((docConfig) => buildDoc(wins, docConfig)),
  };
}

function buildDashboard(wins: Win[]): DashboardModel {
  return { wins: orderByDate(wins, "newest").map(toDashboardWin) };
}

function toDashboardWin(win: Win): DashboardWin {
  return {
    title: win.title,
    date: win.date,
    job: win.job,
    tags: win.tags,
    details: win.details,
    impactMetric: win.impactMetric,
    links: win.links,
    issueNumber: win.issueNumber,
    issueUrl: win.issueUrl,
    brags: win.brags,
    period: win.period.milestone,
  };
}

function buildDoc(wins: Win[], docConfig: DocConfig): DocModel {
  const curated = wins.filter((win) => win.brags.includes(docConfig.slug));
  const ordered = orderByDate(curated, docConfig.order);

  return {
    slug: docConfig.slug,
    title: docConfig.title,
    intro: docConfig.intro,
    wins: ordered.map((win) => toDocModelWin(win, docConfig.show)),
  };
}

function orderByDate(wins: Win[], order: "newest" | "oldest"): Win[] {
  const direction = order === "newest" ? -1 : 1;
  return [...wins].sort((a, b) => direction * a.date.localeCompare(b.date));
}

function toDocModelWin(win: Win, show: DocConfigShow): DocModelWin {
  return {
    title: win.title,
    date: show.dates ? win.date : undefined,
    job: show.company ? win.job : undefined,
    tags: win.tags,
    details: win.details,
    impactMetric: show.metrics ? win.impactMetric : undefined,
    links: show.links ? win.links : [],
    issueNumber: win.issueNumber,
    issueUrl: win.issueUrl,
  };
}
