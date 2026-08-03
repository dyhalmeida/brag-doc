import { describe, expect, it } from "vitest";
import { renderDashboardHtml } from "./render-dashboard.js";
import { buildSite } from "./site.js";
import { parseWin, type RawIssue, type Win } from "./win.js";
import { issueWithMultipleLabels, issueWithoutOptionalFields, wellFormedIssue } from "./fixtures/wins.js";

function parseOrThrow(rawIssue: RawIssue): Win {
  const result = parseWin(rawIssue);
  if (result.kind !== "win") throw new Error(`fixture expected to parse as a win, got "${result.kind}"`);
  return result.win;
}

// wellFormedIssue: issue 42, 2026-03-15, job:acme, tag:performance, brag:review-2026
// issueWithMultipleLabels: issue 11, 2026-05-20, job:acme, brag:review-2026 + brag:entrevista-x
// issueWithoutOptionalFields: issue 7, 2026-02-10, no job/tag/brag labels
const reducedDeployTime = parseOrThrow(wellFormedIssue);
const ledMigration = parseOrThrow(issueWithMultipleLabels);
const presentedArchitecture = parseOrThrow(issueWithoutOptionalFields);

const wins = [reducedDeployTime, ledMigration, presentedArchitecture];

describe("renderDashboardHtml", () => {
  it("renders every win's title, regardless of brag:* labels", () => {
    const dashboard = buildSite(wins, []).dashboard;

    const html = renderDashboardHtml(dashboard);

    expect(html).toContain("Reduzi o tempo de deploy em 70%");
    expect(html).toContain("Liderei a migração do banco de dados");
    expect(html).toContain("Apresentei a arquitetura para o time");
  });

  it("shows which brag:* docs each win already integrates", () => {
    const dashboard = buildSite(wins, []).dashboard;

    const html = renderDashboardHtml(dashboard);

    expect(html).toContain("review-2026");
    expect(html).toContain("entrevista-x");
  });

  it("carries data attributes for client-side search and filtering", () => {
    const dashboard = buildSite(wins, []).dashboard;

    const html = renderDashboardHtml(dashboard);

    expect(html).toContain('data-job="acme"');
    expect(html).toContain('data-period="2026-Q1"');
    expect(html).toContain('data-tags="performance"');
  });

  it("includes tags and brag:* slugs in the win's searchable text", () => {
    const dashboard = buildSite(wins, []).dashboard;

    const html = renderDashboardHtml(dashboard);

    const ledMigrationLi = html.slice(html.indexOf("data-period=\"2026-Q2\""));
    expect(ledMigrationLi.slice(0, ledMigrationLi.indexOf("</li>"))).toContain(
      'data-search="liderei a migração do banco de dados acme performance lideranca review-2026 entrevista-x"',
    );
  });

  it("renders each win's links", () => {
    const dashboard = buildSite(wins, []).dashboard;

    const html = renderDashboardHtml(dashboard);

    expect(html).toContain("https://github.com/acme/repo/pull/123");
    expect(html).toContain("https://figma.com/file/xyz");
  });

  it("renders without throwing when there are no wins", () => {
    const dashboard = buildSite([], []).dashboard;

    expect(() => renderDashboardHtml(dashboard)).not.toThrow();
  });

  it("escapes win content so it cannot inject markup", () => {
    const dangerousWin: Win = { ...reducedDeployTime, title: '<script>alert("xss")</script>' };
    const dashboard = buildSite([dangerousWin], []).dashboard;

    const html = renderDashboardHtml(dashboard);

    expect(html).not.toContain("<script>alert(");
    expect(html).toContain("&lt;script&gt;");
  });

  it("renders details as markdown, not as escaped plain text", () => {
    const winWithMarkdownDetails: Win = {
      ...reducedDeployTime,
      details: "Migrei o **pipeline** de CI e paralelizamos os testes.",
    };
    const dashboard = buildSite([winWithMarkdownDetails], []).dashboard;

    const html = renderDashboardHtml(dashboard);

    expect(html).toContain("<strong>pipeline</strong>");
  });
});
