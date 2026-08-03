import { describe, expect, it } from "vitest";
import { aggregateReports, buildReports, filterReportsWins } from "./reports.js";
import { parseWin, type RawIssue, type Win } from "./win.js";
import { issueWithMultipleLabels, issueWithoutOptionalFields, wellFormedIssue } from "./fixtures/wins.js";

function parseOrThrow(rawIssue: RawIssue): Win {
  const result = parseWin(rawIssue);
  if (result.kind !== "win") throw new Error(`fixture expected to parse as a win, got "${result.kind}"`);
  return result.win;
}

// wellFormedIssue: issue 42, 2026-Q1, job:acme, tag:performance
// issueWithMultipleLabels: issue 11, 2026-Q2, job:acme, tag:performance + tag:lideranca
// issueWithoutOptionalFields: issue 7, 2026-Q1, no job/tag
const reducedDeployTime = parseOrThrow(wellFormedIssue);
const ledMigration = parseOrThrow(issueWithMultipleLabels);
const presentedArchitecture = parseOrThrow(issueWithoutOptionalFields);

const wins = [reducedDeployTime, ledMigration, presentedArchitecture];

describe("buildReports", () => {
  it("counts wins by period", () => {
    const reports = buildReports(wins);

    expect(reports.byPeriod).toEqual([
      { key: "2026-Q1", count: 2 },
      { key: "2026-Q2", count: 1 },
    ]);
  });

  it("counts wins by tag", () => {
    const reports = buildReports(wins);

    expect(reports.byTag).toEqual([
      { key: "lideranca", count: 1 },
      { key: "performance", count: 2 },
    ]);
  });

  it("counts wins by job, ignoring wins without a job", () => {
    const reports = buildReports(wins);

    expect(reports.byJob).toEqual([{ key: "acme", count: 2 }]);
  });

  it("produces empty aggregates when there are no wins", () => {
    const reports = buildReports([]);

    expect(reports.byPeriod).toEqual([]);
    expect(reports.byTag).toEqual([]);
    expect(reports.byJob).toEqual([]);
  });
});

describe("filterReportsWins + aggregateReports", () => {
  const reportsWins = buildReports(wins).wins;

  it("filters by a single dimension", () => {
    const filtered = filterReportsWins(reportsWins, { period: "2026-Q1" });

    expect(aggregateReports(filtered).byJob).toEqual([{ key: "acme", count: 1 }]);
  });

  it("combines period, job and tag filters together", () => {
    const filtered = filterReportsWins(reportsWins, { period: "2026-Q2", job: "acme", tag: "lideranca" });

    expect(filtered).toHaveLength(1);
    expect(aggregateReports(filtered).byTag).toEqual([
      { key: "lideranca", count: 1 },
      { key: "performance", count: 1 },
    ]);
  });

  it("produces an empty result when a combined filter matches nothing", () => {
    const filtered = filterReportsWins(reportsWins, { period: "2026-Q1", tag: "lideranca" });

    expect(filtered).toEqual([]);
    expect(aggregateReports(filtered).byPeriod).toEqual([]);
  });

  it("leaves the win set unchanged when the filter is empty", () => {
    const filtered = filterReportsWins(reportsWins, {});

    expect(filtered).toEqual(reportsWins);
  });
});
