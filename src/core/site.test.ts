import { describe, expect, it } from "vitest";
import { buildSite } from "./site.js";
import { parseWin, type RawIssue, type Win } from "./win.js";
import { issueWithMultipleLabels, issueWithoutOptionalFields, wellFormedIssue } from "./fixtures/wins.js";
import {
  emptyDoc,
  entrevistaXDoc,
  review2026Doc,
  review2026DocAllHidden,
  review2026DocMetricsHidden,
  review2026DocOldestFirst,
} from "./fixtures/site.js";

function parseOrThrow(rawIssue: RawIssue): Win {
  const result = parseWin(rawIssue);
  if (result.kind !== "win") throw new Error(`fixture expected to parse as a win, got "${result.kind}"`);
  return result.win;
}

// wellFormedIssue: issue 42, 2026-03-15, brag:review-2026
// issueWithMultipleLabels: issue 11, 2026-05-20, brag:review-2026 + brag:entrevista-x
// issueWithoutOptionalFields: issue 7, 2026-02-10, no brag labels
const reducedDeployTime = parseOrThrow(wellFormedIssue);
const ledMigration = parseOrThrow(issueWithMultipleLabels);
const presentedArchitecture = parseOrThrow(issueWithoutOptionalFields);

const wins = [reducedDeployTime, ledMigration, presentedArchitecture];

describe("buildSite", () => {
  it("filters wins into a doc by the matching brag:<slug> label", () => {
    const site = buildSite(wins, [review2026Doc]);

    expect(site.docs).toHaveLength(1);
    expect(site.docs[0]?.wins.map((win) => win.issueNumber)).toEqual([11, 42]);
  });

  it("includes the same win in every doc whose slug it carries", () => {
    const site = buildSite(wins, [review2026Doc, entrevistaXDoc]);

    expect(site.docs[0]?.wins.map((win) => win.issueNumber)).toContain(11);
    expect(site.docs[1]?.wins.map((win) => win.issueNumber)).toContain(11);
  });

  it("orders wins newest-first", () => {
    const site = buildSite(wins, [review2026Doc]);

    expect(site.docs[0]?.wins.map((win) => win.date)).toEqual(["2026-05-20", "2026-03-15"]);
  });

  it("orders wins oldest-first", () => {
    const site = buildSite(wins, [review2026DocOldestFirst]);

    expect(site.docs[0]?.wins.map((win) => win.date)).toEqual(["2026-03-15", "2026-05-20"]);
  });

  it("hides fields whose show toggle is off, leaving untoggled fields visible", () => {
    const site = buildSite([reducedDeployTime], [review2026DocAllHidden]);
    const win = site.docs[0]?.wins[0];

    expect(win?.date).toBeUndefined();
    expect(win?.job).toBeUndefined();
    expect(win?.impactMetric).toBeUndefined();
    expect(win?.links).toEqual([]);
    expect(win?.title).toBe("Reduzi o tempo de deploy em 70%");
    expect(win?.details).toBe("Migrei o pipeline de CI para cache de dependências e paralelizamos os testes.");
  });

  it("toggles each show.* field independently, without one flag gating the others", () => {
    const site = buildSite([reducedDeployTime], [review2026DocMetricsHidden]);
    const win = site.docs[0]?.wins[0];

    expect(win?.impactMetric).toBeUndefined();
    expect(win?.date).toBe("2026-03-15");
    expect(win?.job).toBe("acme");
    expect(win?.links).toEqual(["https://github.com/acme/repo/pull/123", "https://figma.com/file/xyz"]);
  });

  it("produces a doc with an empty wins list when no win carries its slug", () => {
    const site = buildSite(wins, [emptyDoc]);

    expect(site.docs[0]?.wins).toEqual([]);
  });
});

describe("buildSite dashboard", () => {
  it("includes every win, regardless of brag:* labels", () => {
    const site = buildSite(wins, []);

    expect(site.dashboard.wins.map((win) => win.issueNumber)).toEqual(
      expect.arrayContaining([42, 11, 7]),
    );
    expect(site.dashboard.wins).toHaveLength(3);
  });

  it("orders wins newest-first", () => {
    const site = buildSite(wins, []);

    expect(site.dashboard.wins.map((win) => win.date)).toEqual(["2026-05-20", "2026-03-15", "2026-02-10"]);
  });

  it("shows every win's brag:* slugs, unaffected by any doc's show toggles", () => {
    const site = buildSite(wins, [review2026DocAllHidden]);

    const led = site.dashboard.wins.find((win) => win.issueNumber === 11);
    expect(led?.brags).toEqual(["review-2026", "entrevista-x"]);
    expect(led?.date).toBe("2026-05-20");
    expect(led?.job).toBe("acme");

    const presented = site.dashboard.wins.find((win) => win.issueNumber === 7);
    expect(presented?.brags).toEqual([]);
  });

  it("carries the derived period milestone", () => {
    const site = buildSite(wins, []);

    const led = site.dashboard.wins.find((win) => win.issueNumber === 11);
    expect(led?.period).toBe("2026-Q2");
  });

  it("produces an empty dashboard when there are no wins", () => {
    const site = buildSite([], []);

    expect(site.dashboard.wins).toEqual([]);
  });
});
