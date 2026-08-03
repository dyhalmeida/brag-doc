import { describe, expect, it } from "vitest";
import { parseDocConfig } from "./doc-config.js";

const validYaml = `
title: Review 2026
intro: Conquistas para minha review anual.
order: newest
show:
  metrics: true
  dates: true
  company: true
  links: false
`;

describe("parseDocConfig", () => {
  it("parses a well-formed docs/brag/<slug>.yml into a DocConfig", () => {
    const result = parseDocConfig("review-2026", validYaml);

    expect(result).toEqual({
      ok: true,
      docConfig: {
        slug: "review-2026",
        title: "Review 2026",
        intro: "Conquistas para minha review anual.",
        order: "newest",
        show: { metrics: true, dates: true, company: true, links: false },
      },
    });
  });

  it("treats a missing intro as undefined", () => {
    const yamlWithoutIntro = `
title: Entrevista X
order: oldest
show:
  metrics: false
  dates: false
  company: false
  links: false
`;
    const result = parseDocConfig("entrevista-x", yamlWithoutIntro);

    expect(result.ok).toBe(true);
    expect(result.ok && result.docConfig.intro).toBeUndefined();
  });

  it("rejects a config missing the required title", () => {
    const result = parseDocConfig("review-2026", `order: newest\nshow:\n  metrics: true\n  dates: true\n  company: true\n  links: true\n`);

    expect(result).toEqual({ ok: false, reason: expect.stringContaining("title") });
  });

  it("rejects an order value that isn't newest or oldest", () => {
    const result = parseDocConfig(
      "review-2026",
      `title: Review 2026\norder: sideways\nshow:\n  metrics: true\n  dates: true\n  company: true\n  links: true\n`,
    );

    expect(result).toEqual({ ok: false, reason: expect.stringContaining("order") });
  });

  it("rejects a config missing a show.* toggle", () => {
    const result = parseDocConfig(
      "review-2026",
      `title: Review 2026\norder: newest\nshow:\n  metrics: true\n  dates: true\n  company: true\n`,
    );

    expect(result).toEqual({ ok: false, reason: expect.stringContaining("show.links") });
  });

  it("rejects malformed YAML", () => {
    const result = parseDocConfig("review-2026", `title: [unclosed`);

    expect(result.ok).toBe(false);
  });
});
