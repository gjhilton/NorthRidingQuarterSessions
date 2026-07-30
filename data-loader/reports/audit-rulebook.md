# Re-extraction audit — rule book

This is the definitive process for the record-by-record re-extraction
audit. It is written down and agreed BEFORE resuming at record 1, so that
no further "discovered missing" check forces another restart. If a check
is ever added or changed after this point, it must be written into this
file and agreed before continuing, not just applied silently.

## Absolute process rules (non-negotiable)

1. **One record at a time, full cycle**, in strict `summary_conviction.id`
   order, starting at 1. Never fetch, read, or process more than one
   record in a single step — not even "for efficiency," not even if each
   is judged individually afterward.
2. **No Python, no scripts, ever.** All database access is a raw SQL
   query via the `sqlite3` CLI, run through Bash, one query at a time.
   All reading of `raw_record` text and all judgment (does this match?
   is this OK or does it need a fix?) is done by direct reading and
   reasoning — never by any script, comparison function, or heuristic.
3. **Before writing any categorical field** — `title`, `office`,
   `occupation`, a `summary_conviction_person.role`, a
   `person_relationship`/`relationship_type`, or a new `location` row —
   a precedent query against existing rows runs and is shown first.
   Plain name-based sex inference is exempt (not categorical in the same
   sense) but still gets stated explicitly.
4. **No fabrication beyond source text.** Only add a fact if the
   `raw_record` text actually states it. Outside/background knowledge
   (e.g. identifying a real historical peer) may only be used to fill a
   field when the referent is independently, genuinely identifiable —
   never guessed or invented. If it can't be verified, flag it as an
   open question rather than filling it in.
5. **Nothing deferred silently.** Any open question, ambiguity, or
   judgment call — no matter how small — gets raised to the user
   immediately, in the same turn. Never logged to a notes file "to
   revisit later" as a substitute for asking.
6. **Terse chat output**: one line per record (`id: OK` / `id: FIXED —
   <what and why>`), not a full narration of every query. Full detail
   (text considered, decision, SQL, verification) still gets written to
   the per-record log file. Terseness never justifies batching — it's
   about print volume for a single record, not about processing several
   at once.

## What must be checked, per record

For `summary_conviction` id N, read `raw_record` in full, then check
every one of the following against it. Nothing here is optional or
assumed "probably fine because the last several records were clean."

### A. The conviction record itself
- `conviction_date`, `offence_date` / `offence_date_raw`, `offence_time`
- `charge_description` matches the charge as stated
- `anomalies` — any scribal typo, archival mismatch, or source-side
  oddity noted in the text gets a note here if not already present
  (established pattern: typos, title/description name mismatches,
  spelling mismatches — see existing rows for the note style)

### B. Every person linked via `summary_conviction_person`
For each person on the record, in any role (the full existing role
vocabulary includes defendant, victim, informant, witness, landowner,
premises owner, various spouse-of-X roles, co-defendant, employer,
occupier, police/police officer, letter addressee, and many more — a
new record may need a role not yet seen; check precedent per rule 3
before inventing new phrasing for one that's a near-duplicate of an
existing one):
- `first_name` / `middle_name` / `last_name` match the text
- `sex` — unambiguous given name only; flag if genuinely ambiguous
- `title`, `office`, `name_postfix` — only via precedent check (rule 3);
  see the Normanby precedent (peerage → `office`, not `title`/
  `name_postfix`) and the Sir/Bailiff precedent (`title`)
- **`office` is for aristocratic/peerage pedigree only** (e.g. Normanby's
  "1st Marquess of Normanby (Viscount Normanby 1812 - 1831; Earl of
  Mulgrave 1831 - 1838)") — job titles and police ranks (harbour master,
  constable, assistant constable, acting sergeant of police,
  superintendent of police, etc.) always go in `occupation`
  (person_occupation), never `office`. When describing what a record
  contains, say "occupation=X", not "office=X", for these — a wording
  mix-up here (not an actual data error) happened once already at
  record 191/39/148/7 and was corrected.
- `occupation` (via `person_occupation`/`occupation`) matches, or is
  correctly absent if the text states none. **When the text states a
  marital-status word (singlewoman/spinster/widow) for ANY person, not
  just defendants, verify the occupation link with a dedicated
  `person_occupation` query for that exact person_id** -- a corpus-wide
  check at record 275 found ~215 records where this was missing
  entirely, including one (193) where the wide join query had been
  misread as showing it present when it wasn't. Don't trust the wide
  join alone for this specific field; confirm directly. Also always
  match the exact word stated (widow vs spinster vs singlewoman) --
  don't default to whichever one was fixed most recently.
- `home_location_id` matches the stated home town/parish/address, or is
  a defensible context-based inference per the existing "unstated home
  town inference" rule (judged case by case, not automatic) — if
  inferring, say so explicitly
- "Late of [place]" (35 occurrences in the corpus) means formerly
  resident there, not necessarily currently — existing convention still
  stores that place as `home_location_id`, since it's the only location
  information the text gives; not a fabrication, just the closest
  available data point
- `alias` — captured if the text states one (rare: 20 rows currently)
- `birth_year` — captured if stated (rare: 46 rows currently)
- Watch for the duplicate-stub bug: a spouse/relationship link pointing
  at a duplicate stub person instead of the real co-defendant/person row
  already present on the same record
- Watch for impersonation ("traded under the name of X") — captured as
  its own person row with a role describing the impersonation, not as
  an alias

### C. Every location linked via `summary_conviction_location`
Three roles exist: `court location`, `location of offence`, `petty
sessional division`. For location of offence specifically, apply the
established location rules:
- "X town street" → resolves to X itself, never a new place
- Truancy convictions → location of offence is the defendant's own
  home, not the named School Board district
- Single-destination "X highway" → nests under the stated township,
  replaces the coarser township link
- Two-endpoint "X and Y highway" → Cross-Parish Highways (id 106), added
  alongside the stated township, never replacing it
- Named railway lines → Cross-Parish Railways (id 388), distinct from
  highways and from ordinary station locations
- A specific site (street, building) whose parent chain reaches the
  stated township → replaces the coarser link; if its parent chain does
  NOT reach the stated township (e.g. Bagdale/Upgang Lane under West
  Cliff, not Ruswarp) → added alongside, not replacing
- **Whitby/Ruswarp/Hawsker cliff-boundary case**: for much of the 19th
  century, Whitby and Ruswarp were one conjoined parish, with the
  boundary approximating the cliff edge (river/estuary) rather than any
  modern town boundary — the same logic applied to Hawsker on the East
  Cliff side. The location tree's West Cliff/East Cliff nesting under
  Whitby is built on the *modern* map, so a site nesting there (e.g.
  Stakesby Vale, under West Cliff/Whitby) can still genuinely belong to
  the historically-Ruswarp or -Hawsker side of the old joint parish.
  When a record states its offence township as Ruswarp or Hawsker but
  names a site that nests under Whitby's West/East Cliff, this is NOT a
  mis-parenting bug — it's this known historical/modern mismatch, and
  the specific-site rule above (added alongside, since the parent chain
  doesn't reach the stated township) already handles it correctly. See
  `explorer/src/content/about/geography.md` for the canonical
  explanation. Don't flag this shape as an open question — it's already
  resolved, repeatedly.
- **Footpaths are treated as specific sites, not highways** — even a
  two-endpoint named footpath (e.g. "Whitby and Ruswarp Footpath") gets
  its own individual location node, nested wherever it geographically
  sits (which may itself trigger the cliff-boundary case above), rather
  than being bucketed into a shared "Cross-Parish" node the way
  two-endpoint highways are. Arbitrary but deliberate, per the user: a
  footpath is conceptually more like a named street than a road.
- Named rivers → cross-parish "Rivers" category node (id 397), same
  add-alongside pattern as highways/railways (e.g. River Esk, id 398)
- A defendant's stall "in the market place" (false-weights records) →
  link to Market Place (30, East Cliff), confirmed by the user -- not
  Old Market Place (31, West Cliff), which is a separate site
- Any new location node requires a precedent check first (rule 3)
- **Known fix**: Ellerby (location id 123) was reparented from Lythe
  (107) to Hinderwell (88) at record 124 -- Ellerby is historically a
  township in Hinderwell parish (see the "Hinderwell & Ellerby Highway"
  cross-parish node), not Lythe. If any record's location resolution
  seems to depend on Ellerby's parent, it is now correctly Hinderwell.

### D. Crime type(s) via `summary_conviction_crime_type`
Matches the offence(s) described. Check `qsrecords/offence_types.py`'s
`OFFENCE_TAXONOMY` (or the live `offence_type`/`crime_type` table) for an
existing fit before treating a phrasing as needing something new.

### E. `related_conviction` — same-incident cross-check
**This was the gap that triggered this restart.** `related_conviction`
links two convictions whenever the evidence suggests they document the
same real-world incident, not just a coincidental similarity. Two
confirmed patterns exist already (from the existing 1,338 rows), and
more may exist — this is a judgment call each time, not a fixed lookup
table of exact phrasings:
1. **Same defendant + same offence date** — multiple separate charges
   from one arrest. Note style: "Same defendant and same offence date —
   likely multiple charges from one arrest."
2. **Same other named party (landowner/victim/informant) + same offence
   + same date, different defendants** — one incident, several people
   prosecuted separately (e.g. a group poaching/trespass). Note style:
   "Same landowner (X), same offence, same date — likely one incident,
   N men prosecuted separately." This extends to the "same beat
   constable" sub-case: same informant/constable + same offence type +
   same street/location + same date, even with no shared named victim
   or specific single premises (confirmed at records 355/361 — user
   decided this level of overlap is sufficient, not too coincidental).

For every record, reason about whether it shares strong overlap with
another record on: offence date, offence/crime type, and any named
person in any role (defendant, victim, landowner, informant, etc.) — not
just an exact match on one specific field combination. If the evidence
points to a shared underlying event and no link exists yet, add one,
writing a note in the same descriptive style as the existing pattern
that fits (or a new, clearly-worded variant if neither existing pattern
fits — precedent-checked per rule 3, not invented loosely).
- This is a genuine cross-record check, not a same-record field check —
  it requires querying other rows. That is not "batching multiple
  records together" (rule 1) — it's part of fully processing the ONE
  record currently being audited. The record under audit is still the
  unit of work; this is one of its required checks, same as any other.

- **Known fix**: at record 181, found 4 relationship pairs stored
  bidirectionally (both apprentice->master and master->apprentice, or
  both wife->husband and husband->wife) instead of the established
  single-direction convention. Removed the redundant reverse rows
  (ids 369, 371, 372, 536). Affects records 181, 206, 211, and 5983 --
  when reaching those, this is already resolved, not a new finding.

### F. `person_relationship` — stated relationships between people
Check the full existing vocabulary (agent, apprentice, beneficiary,
brother, child, co-partner, cousin, daughter, employee, employer,
father, guardian, husband, master, mother, namesake, principal, servant,
sister, son, stepdaughter, stepfather, stepmother, stepson, trustee,
ward, wife) for any relationship the text states between two people on
the record, and confirm it's captured correctly (direction, reciprocal
type via `relationship_type_reciprocal`).

### G. Tables confirmed out of scope (flagged, not silently assumed)
- `town` (106 rows) and `street` (322 rows) appear to be legacy/unused —
  the actual location hierarchy in use is the self-referential
  `location` table (parent_id tree). Not part of this checklist unless
  told otherwise.
- `extraction_attempt` is pipeline/LLM-call metadata, not conviction
  content — not part of this checklist.

## Log file

Full detail (text, current DB state read, decision, SQL if a fix is
needed, verification query) goes to a per-record audit log, one entry
per record, same format as prior passes. Chat gets the terse one-liner
per rule 6.

**The log file must be appended immediately after EACH record is fully
checked — before moving to the next record.** Never hold several
completed records' detail in conversation only, planning to write them
to the file "later" or "at the end of a batch." The current log file is
`data-loader/reports/full-audit-log-restart-2.md`; each entry ends with
an updated "Progress: records 1-N done" line so the file alone always
shows the true last-completed id.

**Why this is non-negotiable, not just tidy practice:** a previous pass
of this audit was destroyed entirely by context compaction — the
per-record detail only existed in conversation, and when that
conversation's context filled up and compacted, the pass "completely
died and had to be thrown away." The log file plus this rule book must
together be sufficient to resume from zero conversation memory at any
moment — after a compaction, a crash, or a brand new session. To resume:
read this rule book, read the log file's last "Progress" line to find
the next id, and continue. Never trust a conversation summary over what
the file actually shows.

## Before resuming

This file should be reviewed and agreed before record 1 is touched
again. Anything missing from it, or wrong in it, should be corrected now
— not discovered five hundred records in.
