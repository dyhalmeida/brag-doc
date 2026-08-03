import { describe, expect, it } from "vitest";
import { findLeaks } from "./publish-guard.js";
import { buildSite, type SiteModel } from "./site.js";
import { parseWin, type RawIssue, type Win } from "./win.js";
import { issueWithMultipleLabels, issueWithoutOptionalFields, wellFormedIssue } from "./fixtures/wins.js";
import { review2026Doc } from "./fixtures/site.js";

function parseOrThrow(rawIssue: RawIssue): Win {
  const result = parseWin(rawIssue);
  if (result.kind !== "win") throw new Error(`fixture expected to parse as a win, got "${result.kind}"`);
  return result.win;
}

const reducedDeployTime = parseOrThrow(wellFormedIssue); // brag:review-2026
const ledMigration = parseOrThrow(issueWithMultipleLabels); // brag:review-2026, brag:entrevista-x
const presentedArchitecture = parseOrThrow(issueWithoutOptionalFields); // no brag labels

const wins = [reducedDeployTime, ledMigration, presentedArchitecture];

describe("findLeaks", () => {
  it("finds no leaks in a SiteModel produced honestly by buildSite", () => {
    const site = buildSite(wins, [review2026Doc]);

    expect(findLeaks(wins, site)).toEqual([]);
  });

  it("flags a win included in a doc it does not carry the brag:<slug> label for", () => {
    const rogueSite: SiteModel = {
      dashboard: { wins: [] },
      reports: { wins: [], byPeriod: [], byTag: [], byJob: [] },
      docs: [
        {
          slug: review2026Doc.slug,
          title: review2026Doc.title,
          intro: review2026Doc.intro,
          wins: [
            {
              title: presentedArchitecture.title,
              date: presentedArchitecture.date,
              job: presentedArchitecture.job,
              tags: presentedArchitecture.tags,
              details: presentedArchitecture.details,
              impactMetric: presentedArchitecture.impactMetric,
              links: presentedArchitecture.links,
              issueNumber: presentedArchitecture.issueNumber,
              issueUrl: presentedArchitecture.issueUrl,
            },
          ],
        },
      ],
    };

    expect(findLeaks(wins, rogueSite)).toEqual([
      { slug: "review-2026", issueNumber: presentedArchitecture.issueNumber },
    ]);
  });
});
