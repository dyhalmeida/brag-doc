import { describe, expect, it } from "vitest";
import { derivePeriod } from "./period.js";

describe("derivePeriod", () => {
  it("derives year and quarter from the first day of Q1", () => {
    const result = derivePeriod("2026-01-01");

    expect(result).toEqual({
      ok: true,
      period: { year: 2026, quarter: 1, milestone: "2026-Q1" },
    });
  });

  it("derives the last day of the year as Q4 of that year", () => {
    const result = derivePeriod("2025-12-31");

    expect(result).toEqual({
      ok: true,
      period: { year: 2025, quarter: 4, milestone: "2025-Q4" },
    });
  });

  it("accepts February 29th on a leap year", () => {
    const result = derivePeriod("2028-02-29");

    expect(result).toEqual({
      ok: true,
      period: { year: 2028, quarter: 1, milestone: "2028-Q1" },
    });
  });

  it("rejects February 29th on a non-leap year", () => {
    const result = derivePeriod("2027-02-29");

    expect(result).toEqual({ ok: false, reason: 'Data inválida: "2027-02-29"' });
  });

  it("rejects a nonsensical date string", () => {
    const result = derivePeriod("not-a-date");

    expect(result.ok).toBe(false);
  });

  it.each([
    ["2026-01-01", 1],
    ["2026-03-31", 1],
    ["2026-04-01", 2],
    ["2026-06-30", 2],
    ["2026-07-01", 3],
    ["2026-09-30", 3],
    ["2026-10-01", 4],
    ["2026-12-31", 4],
  ])("maps %s to quarter %i", (date, quarter) => {
    const result = derivePeriod(date);

    expect(result.ok && result.period.quarter).toBe(quarter);
  });

  it("is unaffected by the process timezone", () => {
    const original = process.env.TZ;
    process.env.TZ = "Pacific/Kiritimati";
    const inKiritimati = derivePeriod("2026-01-01");
    process.env.TZ = "Etc/GMT+12";
    const inGmtMinus12 = derivePeriod("2026-01-01");
    process.env.TZ = original;

    expect(inKiritimati).toEqual(inGmtMinus12);
    expect(inKiritimati).toEqual({
      ok: true,
      period: { year: 2026, quarter: 1, milestone: "2026-Q1" },
    });
  });
});
