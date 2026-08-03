import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { planMilestoneAssignment, type MilestoneRef } from "../core/milestone-plan.js";
import { parseWin, type RawIssue } from "../core/win.js";

interface IssuesEventPayload {
  issue: {
    number: number;
    html_url: string;
    body: string | null;
    labels: { name: string }[];
    milestone: { number: number } | null;
  };
}

function readEventPayload(): IssuesEventPayload {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath) {
    throw new Error("GITHUB_EVENT_PATH não está definido — este script deve rodar dentro de uma Action.");
  }
  return JSON.parse(readFileSync(eventPath, "utf8"));
}

function toRawIssue(payload: IssuesEventPayload): RawIssue {
  return {
    number: payload.issue.number,
    url: payload.issue.html_url,
    body: payload.issue.body,
    labels: payload.issue.labels.map((label) => label.name),
  };
}

function fetchExistingMilestones(): MilestoneRef[] {
  const output = execFileSync("gh", ["api", "repos/:owner/:repo/milestones?state=all&per_page=100"], {
    encoding: "utf8",
  });
  const milestones: { number: number; title: string; state: "open" | "closed" }[] = JSON.parse(output);
  return milestones.map((milestone) => ({
    number: milestone.number,
    title: milestone.title,
    state: milestone.state,
  }));
}

function createMilestone(title: string): number {
  const output = execFileSync(
    "gh",
    ["api", "repos/:owner/:repo/milestones", "--method", "POST", "-f", `title=${title}`],
    { encoding: "utf8" },
  );
  const created: { number: number } = JSON.parse(output);
  return created.number;
}

function assignMilestone(issueNumber: number, milestoneNumber: number): void {
  execFileSync(
    "gh",
    [
      "api",
      `repos/:owner/:repo/issues/${issueNumber}`,
      "--method",
      "PATCH",
      "-F",
      `milestone=${milestoneNumber}`,
    ],
    { encoding: "utf8" },
  );
}

function main(): void {
  const payload = readEventPayload();
  const rawIssue = toRawIssue(payload);

  const result = parseWin(rawIssue);
  if (result.kind === "not-a-win") {
    console.log(`Issue #${rawIssue.number} não é um Win, ignorando.`);
    return;
  }
  if (result.kind === "invalid") {
    console.error(`Win inválido na issue #${result.issueNumber}: ${result.reason}`);
    return;
  }

  const plan = planMilestoneAssignment({
    desiredTitle: result.win.period.milestone,
    existingMilestones: fetchExistingMilestones(),
    currentMilestoneNumber: payload.issue.milestone?.number ?? null,
  });

  if (plan.action === "noop") {
    console.log(`Issue #${rawIssue.number} já está na milestone correta (${result.win.period.milestone}).`);
    return;
  }

  const milestoneNumber = plan.action === "create-and-assign" ? createMilestone(plan.title) : plan.milestoneNumber;
  assignMilestone(rawIssue.number, milestoneNumber);
  console.log(`Issue #${rawIssue.number} atribuída à milestone ${result.win.period.milestone}.`);
}

main();
