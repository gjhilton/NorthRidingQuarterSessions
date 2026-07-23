// Shared category for grouping the people associated with a conviction --
// reused wherever this split (offender / police / everyone else) needs to
// be classified or labelled consistently, not just on the conviction
// detail page it started on.
export enum Roles {
  offender = "offender",
  police = "police",
  other = "other",
}

export const ROLE_LABELS: Record<Roles, string> = {
  [Roles.offender]: "Offenders",
  [Roles.police]: "Police",
  [Roles.other]: "Other",
};

// Only the literal "police"/"police officer" role values count as Police --
// "informant" (the largest single role in involved_persons by far) is
// often but not always a constable in this era and isn't reliably
// distinguishable from the wording alone, so it deliberately stays Other
// rather than being inferred into Police.
const POLICE_ROLE_VALUES = new Set(["police", "police officer"]);

export function classifyInvolvedPersonRole(role: string | null): Roles {
  return role && POLICE_ROLE_VALUES.has(role) ? Roles.police : Roles.other;
}
