import { describe, expect, it } from "vitest";
import { parseWin } from "./win.js";
import {
  issueMissingDate,
  issueMissingTitle,
  issueWithInvalidDate,
  issueWithMalformedBody,
  issueWithMultipleLabels,
  issueWithoutOptionalFields,
  nonWinIssue,
  wellFormedIssue,
} from "./fixtures/wins.js";

describe("parseWin", () => {
  it("parses a well-formed Win issue into a Win", () => {
    const result = parseWin(wellFormedIssue);

    expect(result).toEqual({
      kind: "win",
      win: {
        title: "Reduzi o tempo de deploy em 70%",
        date: "2026-03-15",
        job: "acme",
        tags: ["performance"],
        details:
          "Migrei o pipeline de CI para cache de dependências e paralelizamos os testes.",
        impactMetric: "Redução de latência: 40%",
        links: ["https://github.com/acme/repo/pull/123", "https://figma.com/file/xyz"],
        issueNumber: 42,
        issueUrl: "https://github.com/diegoja/my-brag-doc/issues/42",
        brags: ["review-2026"],
        period: { year: 2026, quarter: 1, milestone: "2026-Q1" },
      },
    });
  });

  it("treats absent optional fields as undefined, not as literal placeholder text", () => {
    const result = parseWin(issueWithoutOptionalFields);

    expect(result.kind).toBe("win");
    if (result.kind !== "win") return;
    expect(result.win.job).toBeUndefined();
    expect(result.win.details).toBeUndefined();
    expect(result.win.impactMetric).toBeUndefined();
    expect(result.win.links).toEqual([]);
  });

  it("flags a Win with a missing required title instead of throwing", () => {
    const result = parseWin(issueMissingTitle);

    expect(result).toEqual({
      kind: "invalid",
      issueNumber: 8,
      issueUrl: "https://github.com/diegoja/my-brag-doc/issues/8",
      reason: "Campo obrigatório ausente: Título",
    });
  });

  it("flags a Win with an invalid date instead of throwing", () => {
    const result = parseWin(issueWithInvalidDate);

    expect(result).toEqual({
      kind: "invalid",
      issueNumber: 9,
      issueUrl: "https://github.com/diegoja/my-brag-doc/issues/9",
      reason: 'Data inválida: "2026-13-40"',
    });
  });

  it("flags a Win with a missing Data section instead of throwing", () => {
    const result = parseWin(issueMissingDate);

    expect(result).toEqual({
      kind: "invalid",
      issueNumber: 12,
      issueUrl: "https://github.com/diegoja/my-brag-doc/issues/12",
      reason: "Campo obrigatório ausente: Data",
    });
  });

  it("flags a Win whose body has no ### sections instead of throwing", () => {
    const result = parseWin(issueWithMalformedBody);

    expect(result).toEqual({
      kind: "invalid",
      issueNumber: 13,
      issueUrl: "https://github.com/diegoja/my-brag-doc/issues/13",
      reason: "Campo obrigatório ausente: Título",
    });
  });

  it("ignores issues that don't carry the type:win label", () => {
    const result = parseWin(nonWinIssue);

    expect(result).toEqual({ kind: "not-a-win" });
  });

  it("reads multiple tag: and brag: labels", () => {
    const result = parseWin(issueWithMultipleLabels);

    expect(result.kind).toBe("win");
    if (result.kind !== "win") return;
    expect(result.win.job).toBe("acme");
    expect(result.win.tags).toEqual(["performance", "lideranca"]);
    expect(result.win.brags).toEqual(["review-2026", "entrevista-x"]);
  });
});
