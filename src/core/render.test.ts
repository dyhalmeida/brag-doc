import { describe, expect, it } from "vitest";
import { renderDocHtml } from "./render.js";
import { buildSite } from "./site.js";
import { parseWin, type RawIssue, type Win } from "./win.js";
import { wellFormedIssue } from "./fixtures/wins.js";
import { review2026Doc, review2026DocAllHidden } from "./fixtures/site.js";

function parseOrThrow(rawIssue: RawIssue): Win {
  const result = parseWin(rawIssue);
  if (result.kind !== "win") throw new Error(`fixture expected to parse as a win, got "${result.kind}"`);
  return result.win;
}

const reducedDeployTime = parseOrThrow(wellFormedIssue);

describe("renderDocHtml", () => {
  it("renders the doc title, intro, and each visible win field", () => {
    const doc = buildSite([reducedDeployTime], [review2026Doc]).docs[0]!;

    const html = renderDocHtml(doc);

    expect(html).toContain("Review 2026");
    expect(html).toContain("Conquistas para minha review anual.");
    expect(html).toContain("Reduzi o tempo de deploy em 70%");
    expect(html).toContain("2026-03-15");
    expect(html).toContain("acme");
    expect(html).toContain("Redução de latência: 40%");
    expect(html).toContain("https://github.com/acme/repo/pull/123");
    expect(html).toContain("https://github.com/diegoja/my-brag-doc/issues/42");
  });

  it("omits fields hidden by the doc's show toggles", () => {
    const doc = buildSite([reducedDeployTime], [review2026DocAllHidden]).docs[0]!;

    const html = renderDocHtml(doc);

    expect(html).toContain("Reduzi o tempo de deploy em 70%");
    expect(html).not.toContain("2026-03-15");
    expect(html).not.toContain("acme");
    expect(html).not.toContain("Redução de latência: 40%");
    expect(html).not.toContain("https://github.com/acme/repo/pull/123");
  });

  it("renders a doc with no wins without throwing", () => {
    const doc = buildSite([], [review2026Doc]).docs[0]!;

    expect(() => renderDocHtml(doc)).not.toThrow();
  });

  it("escapes win content so it cannot inject markup", () => {
    const dangerousWin: Win = {
      ...reducedDeployTime,
      title: '<script>alert("xss")</script>',
    };
    const doc = buildSite([dangerousWin], [review2026Doc]).docs[0]!;

    const html = renderDocHtml(doc);

    expect(html).not.toContain("<script>alert(");
    expect(html).toContain("&lt;script&gt;");
  });

  it("renders details as markdown, not as escaped plain text", () => {
    const winWithMarkdownDetails: Win = {
      ...reducedDeployTime,
      details: "Migrei o **pipeline** de CI e paralelizamos os testes.",
    };
    const doc = buildSite([winWithMarkdownDetails], [review2026Doc]).docs[0]!;

    const html = renderDocHtml(doc);

    expect(html).toContain("<strong>pipeline</strong>");
  });

  it("strips raw HTML embedded in a win's details instead of passing it through", () => {
    const winWithRawHtmlDetails: Win = {
      ...reducedDeployTime,
      details: '<script>alert("xss")</script>\n\nTexto normal.',
    };
    const doc = buildSite([winWithRawHtmlDetails], [review2026Doc]).docs[0]!;

    const html = renderDocHtml(doc);

    expect(html).not.toContain("<script>");
    expect(html).toContain("Texto normal.");
  });
});
