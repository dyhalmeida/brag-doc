import { describe, expect, it } from "vitest";
import { planMilestoneAssignment } from "./milestone-plan.js";

describe("planMilestoneAssignment", () => {
  it("creates and assigns when no milestone with the desired title exists", () => {
    const plan = planMilestoneAssignment({
      desiredTitle: "2026-Q1",
      existingMilestones: [],
      currentMilestoneNumber: null,
    });

    expect(plan).toEqual({ action: "create-and-assign", title: "2026-Q1" });
  });

  it("assigns the existing milestone when the issue has none yet", () => {
    const plan = planMilestoneAssignment({
      desiredTitle: "2026-Q1",
      existingMilestones: [{ number: 5, title: "2026-Q1", state: "open" }],
      currentMilestoneNumber: null,
    });

    expect(plan).toEqual({ action: "assign", milestoneNumber: 5 });
  });

  it("is a noop when the issue is already on the right milestone", () => {
    const plan = planMilestoneAssignment({
      desiredTitle: "2026-Q1",
      existingMilestones: [{ number: 5, title: "2026-Q1", state: "open" }],
      currentMilestoneNumber: 5,
    });

    expect(plan).toEqual({ action: "noop" });
  });

  it("reassigns to the existing milestone when the date edit changed the period", () => {
    const plan = planMilestoneAssignment({
      desiredTitle: "2026-Q2",
      existingMilestones: [
        { number: 5, title: "2026-Q1", state: "open" },
        { number: 6, title: "2026-Q2", state: "open" },
      ],
      currentMilestoneNumber: 5,
    });

    expect(plan).toEqual({ action: "assign", milestoneNumber: 6 });
  });

  it("creates and reassigns when the new period has no milestone yet", () => {
    const plan = planMilestoneAssignment({
      desiredTitle: "2026-Q3",
      existingMilestones: [{ number: 5, title: "2026-Q1", state: "open" }],
      currentMilestoneNumber: 5,
    });

    expect(plan).toEqual({ action: "create-and-assign", title: "2026-Q3" });
  });

  it("matches an existing closed milestone instead of creating a duplicate", () => {
    const plan = planMilestoneAssignment({
      desiredTitle: "2025-Q4",
      existingMilestones: [{ number: 2, title: "2025-Q4", state: "closed" }],
      currentMilestoneNumber: null,
    });

    expect(plan).toEqual({ action: "assign", milestoneNumber: 2 });
  });
});
