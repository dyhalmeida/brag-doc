import type { SiteModel } from "./site.js";
import type { Win } from "./win.js";

export interface Leak {
  slug: string;
  issueNumber: number;
}

export function findLeaks(wins: Win[], site: SiteModel): Leak[] {
  const winsByIssueNumber = new Map(wins.map((win) => [win.issueNumber, win]));

  const leaks: Leak[] = [];
  for (const doc of site.docs) {
    for (const docWin of doc.wins) {
      const original = winsByIssueNumber.get(docWin.issueNumber);
      if (!original || !original.brags.includes(doc.slug)) {
        leaks.push({ slug: doc.slug, issueNumber: docWin.issueNumber });
      }
    }
  }
  return leaks;
}
