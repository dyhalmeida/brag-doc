import { describe, expect, it } from "vitest";
import { renderReportsHtml } from "./render-reports.js";
import { buildReports } from "./reports.js";
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

describe("renderReportsHtml", () => {
  it("lists distinct periods, jobs and tags as filter options", () => {
    const html = renderReportsHtml(buildReports(wins));

    expect(html).toContain('<option value="2026-Q1">2026-Q1</option>');
    expect(html).toContain('<option value="2026-Q2">2026-Q2</option>');
    expect(html).toContain('<option value="acme">acme</option>');
    expect(html).toContain('<option value="performance">performance</option>');
    expect(html).toContain('<option value="lideranca">lideranca</option>');
  });

  it("carries data attributes per win for client-side aggregation", () => {
    const html = renderReportsHtml(buildReports(wins));

    expect(html).toContain('data-period="2026-Q2" data-job="acme" data-tags="performance|lideranca"');
    expect(html).toContain('data-period="2026-Q1" data-job="" data-tags=""');
  });

  it("renders a section per aggregate dimension", () => {
    const html = renderReportsHtml(buildReports(wins));

    expect(html).toContain('<h2>Por Período</h2>');
    expect(html).toContain('<h2>Por Tag</h2>');
    expect(html).toContain('<h2>Por Job</h2>');
  });

  it("renders without throwing when there are no wins", () => {
    expect(() => renderReportsHtml(buildReports([]))).not.toThrow();
  });

  it("escapes job and tag values so they cannot inject markup via data attributes", () => {
    const dangerousWin: Win = { ...reducedDeployTime, job: '"><script>alert(1)</script>' };
    const html = renderReportsHtml(buildReports([dangerousWin]));

    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).toContain("&lt;script&gt;");
  });
});
