import { derivePeriod, type Period } from "./period.js";

export interface RawIssue {
  number: number;
  url: string;
  body: string | null;
  labels: string[];
}

export interface Win {
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
  period: Period;
}

export type ParseWinResult =
  | { kind: "win"; win: Win }
  | { kind: "not-a-win" }
  | { kind: "invalid"; issueNumber: number; issueUrl: string; reason: string };

const WIN_LABEL = "type:win";

export function parseWin(rawIssue: RawIssue): ParseWinResult {
  if (!rawIssue.labels.includes(WIN_LABEL)) {
    return { kind: "not-a-win" };
  }

  const sections = extractSections(rawIssue.body ?? "");

  const title = normalizeOptional(sections.get("Título"));
  if (!title) {
    return invalid(rawIssue, "Campo obrigatório ausente: Título");
  }

  const rawDate = normalizeOptional(sections.get("Data"));
  if (!rawDate) {
    return invalid(rawIssue, "Campo obrigatório ausente: Data");
  }

  const periodResult = derivePeriod(rawDate);
  if (!periodResult.ok) {
    return invalid(rawIssue, periodResult.reason);
  }

  const links = (normalizeOptional(sections.get("Links")) ?? "")
    .split(/\r?\n/)
    .map((link) => link.trim())
    .filter(Boolean);

  return {
    kind: "win",
    win: {
      title,
      date: rawDate,
      job: labelsWithPrefix(rawIssue.labels, "job:")[0],
      tags: labelsWithPrefix(rawIssue.labels, "tag:"),
      details: normalizeOptional(sections.get("Detalhes")),
      impactMetric: normalizeOptional(sections.get("Impact Metric")),
      links,
      issueNumber: rawIssue.number,
      issueUrl: rawIssue.url,
      brags: labelsWithPrefix(rawIssue.labels, "brag:"),
      period: periodResult.period,
    },
  };
}

function invalid(rawIssue: RawIssue, reason: string): ParseWinResult {
  return { kind: "invalid", issueNumber: rawIssue.number, issueUrl: rawIssue.url, reason };
}

function extractSections(body: string): Map<string, string> {
  const sections = new Map<string, string>();
  let currentHeading: string | null = null;
  let currentLines: string[] = [];

  const flush = () => {
    if (currentHeading !== null) {
      sections.set(currentHeading, currentLines.join("\n").trim());
    }
  };

  for (const line of body.split(/\r?\n/)) {
    const headingMatch = /^### (.+)$/.exec(line);
    if (headingMatch) {
      flush();
      currentHeading = headingMatch[1].trim();
      currentLines = [];
    } else if (currentHeading !== null) {
      currentLines.push(line);
    }
  }
  flush();

  return sections;
}

function normalizeOptional(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  const trimmed = value.trim();
  if (trimmed === "" || trimmed === "_No response_") return undefined;
  return trimmed;
}

function labelsWithPrefix(labels: string[], prefix: string): string[] {
  return labels.filter((label) => label.startsWith(prefix)).map((label) => label.slice(prefix.length));
}
