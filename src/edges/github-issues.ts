import { execFileSync } from "node:child_process";
import { parseWin, type RawIssue, type Win } from "../core/win.js";

interface GhIssue {
  number: number;
  url: string;
  body: string | null;
  labels: { name: string }[];
}

export function fetchRawIssues(): RawIssue[] {
  const output = execFileSync(
    "gh",
    ["issue", "list", "--state", "all", "--limit", "500", "--json", "number,url,body,labels"],
    { encoding: "utf8" },
  );
  const issues: GhIssue[] = JSON.parse(output);
  return issues.map((issue) => ({
    number: issue.number,
    url: issue.url,
    body: issue.body,
    labels: issue.labels.map((label) => label.name),
  }));
}

export function loadWins(): Win[] {
  const wins: Win[] = [];
  for (const rawIssue of fetchRawIssues()) {
    const result = parseWin(rawIssue);
    if (result.kind === "win") {
      wins.push(result.win);
    } else if (result.kind === "invalid") {
      console.error(`Win inválido na issue #${result.issueNumber} (${result.issueUrl}): ${result.reason}`);
    }
  }
  return wins;
}
