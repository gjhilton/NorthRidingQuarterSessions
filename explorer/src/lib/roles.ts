import { DEFENDANT_ROLE } from "@/lib/queries/personFragments";

// Shared category for grouping the people associated with a conviction --
// reused wherever this split (offender / police / everyone else) needs to
// be classified or labelled consistently, not just on the conviction
// detail page it started on.
export enum Roles {
  offender = "offender",
  police = "police",
  other = "other",
}

// Singular/plural by actual count -- "Offender"/"Offenders", "Other"/
// "Others". "Police" doesn't inflect either way (same word for one officer
// or several), so count is accepted but ignored for that case.
export function roleLabel(role: Roles, count: number): string {
  switch (role) {
    case Roles.offender:
      return count === 1 ? "Offender" : "Offenders";
    case Roles.police:
      return "Police";
    case Roles.other:
      return count === 1 ? "Other" : "Others";
  }
}

// The literal role text is almost never "police"/"police officer" -- the
// informant on a case was very often a constable performing their duty, but
// summary_conviction_person.role just says "informant" regardless. isPolice
// (derived from occupation.is_police -- see personFragments.ts) is the
// reliable signal; the literal role values are kept as a fallback for any
// row isPolice doesn't cover.
const POLICE_ROLE_VALUES = new Set(["police", "police officer"]);

// The DB now stores the literal role 'defendant' (see
// summary_conviction_person.role in data-loader/qsrecords/models/core.py),
// but the site's own UI copy has always said "Offender" -- this is the one
// place that translation happens, so every caller that used to hand-roll a
// separate "offender" bucket for defendant rows (peopleList.ts,
// peopleNetwork.ts, this file's own former defendant/involved-person split)
// can now run every role -- defendant included -- through this single
// classifier instead.
export function classifyInvolvedPersonRole(role: string | null, isPolice?: boolean): Roles {
  if (role === DEFENDANT_ROLE) return Roles.offender;
  if (isPolice || (role && POLICE_ROLE_VALUES.has(role))) return Roles.police;
  return Roles.other;
}
