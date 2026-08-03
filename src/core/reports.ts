import type { Win } from "./win.js";

export interface ReportsFilter {
  period?: string;
  job?: string;
  tag?: string;
}

export interface ReportCount {
  key: string;
  count: number;
}

export interface ReportsWin {
  period: string;
  job: string | undefined;
  tags: string[];
}

export interface ReportsModel {
  wins: ReportsWin[];
  byPeriod: ReportCount[];
  byJob: ReportCount[];
  byTag: ReportCount[];
}

export function buildReports(wins: Win[]): ReportsModel {
  return aggregateReports(wins.map(toReportsWin));
}

export function filterReportsWins(wins: ReportsWin[], filter: ReportsFilter): ReportsWin[] {
  return wins.filter((win) => {
    if (filter.period !== undefined && win.period !== filter.period) return false;
    if (filter.job !== undefined && win.job !== filter.job) return false;
    if (filter.tag !== undefined && !win.tags.includes(filter.tag)) return false;
    return true;
  });
}

export function aggregateReports(wins: ReportsWin[]): ReportsModel {
  return {
    wins,
    byPeriod: countBy(wins.map((win) => win.period)),
    byJob: countBy(wins.map((win) => win.job).filter(isDefined)),
    byTag: countBy(wins.flatMap((win) => win.tags)),
  };
}

function toReportsWin(win: Win): ReportsWin {
  return { period: win.period.milestone, job: win.job, tags: win.tags };
}

function countBy(values: string[]): ReportCount[] {
  const counts = new Map<string, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => a.key.localeCompare(b.key));
}

function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}
