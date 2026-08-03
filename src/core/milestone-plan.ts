export interface MilestoneRef {
  number: number;
  title: string;
  state: "open" | "closed";
}

export interface MilestonePlanInput {
  desiredTitle: string;
  existingMilestones: MilestoneRef[];
  currentMilestoneNumber: number | null;
}

export type MilestonePlan =
  | { action: "noop" }
  | { action: "assign"; milestoneNumber: number }
  | { action: "create-and-assign"; title: string };

export function planMilestoneAssignment(input: MilestonePlanInput): MilestonePlan {
  const existing = input.existingMilestones.find((milestone) => milestone.title === input.desiredTitle);

  if (!existing) {
    return { action: "create-and-assign", title: input.desiredTitle };
  }

  if (input.currentMilestoneNumber === existing.number) {
    return { action: "noop" };
  }

  return { action: "assign", milestoneNumber: existing.number };
}
