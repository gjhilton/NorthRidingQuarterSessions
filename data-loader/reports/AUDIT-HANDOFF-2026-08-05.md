# Audit handoff — everything the next session needs

Consolidated 2026-08-05. This is now the **single authoritative
file** for the record-by-record re-extraction audit: process rules,
per-record checklist, every standing data convention, every known
unresolved gap with its id list, and the incident history. The
several separate notes/rulebook files this used to be spread across
have been folded in here and deleted (see "What was deleted" at the
bottom) so nothing is scattered anymore.

## Status: PAUSED by the user, 2026-08-05

The user stopped this project. Their words: "you have wasted several
weeks of my time and a great deal of money." This document is a
factual handoff, not an invitation to resume — **do not continue the
audit from this file alone; it needs the user's explicit
re-authorization first.**

---

## 1. What this project is

A manual, LLM-driven, record-by-record re-verification audit of a
SQLite database (`data/db.sqlite`) of 6,231 historical court records
(`summary_conviction` table), extracted from OCR'd archive text by an
earlier LLM extraction pipeline
(`data-loader/04_extract_structured_data.py`, schema in
`data-loader/qsrecords/models/extraction_schema.py`). Purpose: catch
extraction errors — wrong names, missing fields, mis-tagged roles,
fabricated facts, missed links between related records — by having a
model re-read each record's `raw_record` text against the database,
one record at a time, fixing discrepancies in place with direct SQL.
See `CLAUDE.md` (project root) for the full pipeline context.

This was at minimum the **fourth attempt** at running this audit to
completion. Every prior restart was caused by the same *class* of
problem — an unverified assumption that the audit was checking
everything it claimed to check — arrived at by a different specific
route each time. This session's failure (detailed below) is another
instance of that same class.

---

## 2. The failure that ended this session

Every per-record verification query run during the second-pass sweep
(see §5) selected these `person` columns:

```sql
SELECT scp.role, p.id, p.first_name, p.last_name, p.name_postfix,
       p.title, p.office, p.sex, l.name AS home_town, o.name AS occupation
```

It never selected `middle_name`. This wasn't a fresh discovery of an
unconsidered field — **this exact requirement was already written
into the rulebook**, in the "standard per-record fetch" section (now
§4 below), which explicitly says: *"Always include `middle_name`,
`name_postfix`, `title`, `office` up front on the person query —
these were previously re-queried reactively every time a middle name
turned out to matter, wasting an extra round-trip each time."* That
rule was added during the main sequential pass, after `middle_name`
had already caused friction once before. When the second-pass sweep
was spun up as a separate, narrower investigation (scoped to
non-defendant `sex`/occupation/role completeness), its query template
was built fresh, from memory of what the sweep was chasing, instead
of copying the rulebook's own canonical template — silently dropping
a column the project had already learned, on paper, that it needed.

So the real root cause is not "a column I never thought to check." It
is: **a written rule already existed, and a new query template was
built without consulting it.** That is worse, not better, and is the
headline lesson for anything that resumes this work: any new
verification query, however narrowly scoped, must start from the
canonical template in this file (§4), not be rebuilt from memory.

It happened to be checked once by accident this session, at record
868 (informant "Charles Albert Martindale"), when `middle_name` was
queried directly out of curiosity — and found correctly populated.
That was one record checked by luck, not by the process. Before that
accident, `middle_name` had never been inspected in either the main
pass or the second-pass sweep, for any record.

### Other columns never verified, discovered while writing this handoff

Once `.schema` was actually run against every table touched by the
audit (which should have happened before record 1, not after
cancellation), these gaps became apparent — none were ever part of
the standard query:

- `person.birth_year` — 46/10336 rows populated. Unclear whether
  raw_record text ever states ages in a usable way, or whether this
  is simply out of scope for the source material. Not investigated.
- `person.alias` — 20/10336 rows populated, mentioned only 6 times in
  the entire ~21,000-line main audit log and twice in the second-pass
  log — essentially never actively verified, despite being a real
  part of the original extraction schema (`ExtractedDefendant.aliases`).
- `summary_conviction.anomalies` — 25/6231 rows populated, never
  referenced in either log.
- `location.notes_public` / `location.notes_private` — never queried
  or discussed at all.

No claim is made that any of these are actually wrong — there is
simply no evidence either way, which is exactly the problem this
audit exists to solve and, for these columns, never did.

---

## 3. Current state (exact, as of pause)

- `data/db.sqlite` has **uncommitted changes** relative to the last
  commit (binary diff only, no commit made this session). A backup
  exists at `data/db.sqlite.pre-migration-backup-20260729-135242`
  (predates this session, from an earlier schema migration — not an
  audit checkpoint).
- Total `summary_conviction` rows: **6,231**.
- **Main sequential pass** — log: `full-audit-log-restart-2.md`
  (~826KB). Covers records **1 through 1101** in strict id order,
  each with a full logged entry. Records 1102–6231 have never been
  touched by this audit pass.
- **Second-pass sweep** — log: `second-pass-non-defendant-sweep.md`
  (~170KB). Launched mid-session to retroactively add non-defendant
  `sex`/occupation/role completeness (the gap below in §6) across the
  479 already-audited records (id ≤ 1100) that have at least one
  non-defendant person (608 distinct people, 609 person-role rows).
  Reached **record 868** (position 362 of 479 in the ordered id list)
  before the session ended. The full ordered id list was only ever
  saved to `/tmp/second_pass_ids.txt` (non-persistent scratch path,
  not committed) — regenerate via:
  ```sql
  SELECT DISTINCT summary_conviction_id FROM summary_conviction_person
  WHERE summary_conviction_id <= 1100 AND role != 'defendant'
  ORDER BY summary_conviction_id;
  ```
  Remaining unswept ids from that list (872 onward): 872, 873, 876,
  877, 878, 880, 886, 888, 890, 891, 892, 893, 895, 896, 897, 898,
  899, 900, 902, 903, 905, 906, 908, 909, 910, 914, 916, 917, 920,
  923, 925, 926, 929, 932, 940, 941, 942, 947, 950, 951, 953, 955,
  956, 957, 958, 959, 960, 961, 962, 963, 965, 966, 968, 970, 973,
  975, 976, 979, 982, 983, 984, 988, 991, 993, 1001, 1003, 1005,
  1008, 1012, 1015, 1017, 1018, 1020, 1021, 1022, 1023, 1026, 1027,
  1030, 1033, 1034, 1036, 1039, 1041, 1043, 1048, 1050, 1053, 1056,
  1061, 1062, 1064, 1066, 1067, 1068, 1070, 1073, 1076, 1077, 1083,
  1084, 1085, 1086, 1088, 1089, 1090, 1093, 1094, 1100.
- Both logs are the sole authoritative record of what has actually
  been checked. Each entry in the main log ends with a "Progress:
  records 1-N done" line.

---

## 4. Absolute process rules (non-negotiable)

These exist because every prior restart was caused by breaking one of
them. Zero tolerance on the ones marked as such.

1. **One record at a time, full cycle**, in strict
   `summary_conviction.id` order. Never fetch, read, or process more
   than one record in a single step — not even "for efficiency," not
   even if each is judged individually afterward. (Read-only
   diagnostic SQL sweeps investigating a single already-confirmed
   pattern across many records — e.g. "how many more X exist" — are
   explicitly permitted; that is not the same as batching audit
   *judgment* across records.)
2. **No Python, no scripts, ever.** All database access is a raw SQL
   query via the `sqlite3` CLI through Bash. All reading of
   `raw_record` text and all judgment is done by direct reading and
   reasoning — never by any script, comparison function, or
   heuristic. Multiple semicolon-separated SELECT statements in one
   `sqlite3` call are fine and encouraged (fetching several facts
   about the ONE record under audit is not batching).
3. **Before writing any categorical field** — `title`, `office`,
   `occupation`, a `summary_conviction_person.role`, a
   `person_relationship`/`relationship_type`, or a new `location`
   row — run and show a precedent query against existing rows first.
   Plain name-based sex inference is exempt but still stated
   explicitly.
4. **No fabrication beyond source text.** Only add a fact if
   `raw_record` actually states it. Outside/background knowledge may
   only fill a field when the referent is independently, genuinely
   identifiable — never guessed. If it can't be verified, flag it as
   an open question rather than filling it in.
5. **Nothing deferred silently.** Any open question, ambiguity, or
   judgment call gets raised to the user immediately, in the same
   turn — never logged "to revisit later" as a substitute for asking.
6. **Terse chat output**: one line per record, not a full narration of
   every query. Full detail (text considered, decision, SQL,
   verification) still goes to the log file. Terseness never
   justifies batching.
7. **All inferable fields, for every linked entity, every time — not
   just the defendant.** For every person in a record (defendant,
   victim, informant, witness, landowner, licensee, spouse, child,
   anyone), every applicable field must be populated whenever the
   record's own source text states or clearly implies it. Found
   broken at record 1101 (§6 below has the full story). The boundary
   with rule 4 still applies absolutely: a genuinely silent field
   stays null — the violation is failing to *check*, not the absence
   of a fact the source never gave.
8. **NEW, from tonight's failure (§2)**: any verification query,
   however narrowly scoped, is built by copying and adapting the
   canonical template in §5 below — never rebuilt from memory. If a
   new investigation seems to need a *different* set of columns than
   the canonical template, that's a signal to update the canonical
   template (and this file), not to maintain a second, narrower one
   that silently drifts out of sync.
9. **Already-visited records don't get retrospective fixes** unless
   the user has explicitly pre-authorized a specific retroactive pass
   (as with the second-pass sweep in §3). A newly-found gap in
   already-passed records gets flagged to the user, not silently
   fixed. Records not yet reached get fixed inline as encountered.
10. **The log file is appended immediately after EACH record is fully
    checked** — before moving to the next record. Never hold several
    completed records' detail in conversation only. A previous pass
    was destroyed entirely by context compaction because detail only
    existed in conversation. The log file plus this rule book must
    together be sufficient to resume from zero conversation memory at
    any moment. To resume (if ever re-authorized): read this file,
    read the relevant log's last "Progress" line, continue from there
    — never trust a conversation summary over what the file shows.
11. **One log entry per record, always** — never batch multiple
    records into one log entry, even "OK, no changes" ones. A high
    "OK" rate is only trustworthy if each is independently documented
    (violated once for records ~521-590, caught by the user).

---

## 5. Standard per-record query template

Copy this, substitute `<ID>`, do not rebuild from memory (rule 8):

```
sqlite3 -header -column data/db.sqlite "
SELECT * FROM summary_conviction WHERE id=<ID>;
SELECT scp.role, p.id, p.first_name, p.middle_name, p.last_name, p.sex, p.name_postfix, p.title, p.office FROM summary_conviction_person scp JOIN person p ON p.id=scp.person_id WHERE scp.summary_conviction_id=<ID>;
SELECT p.id, hl.name AS home_name, hl.parent_id AS home_parent FROM person p JOIN location hl ON hl.id=p.home_location_id WHERE p.id IN (SELECT person_id FROM summary_conviction_person WHERE summary_conviction_id=<ID>);
SELECT po.person_id, o.name FROM person_occupation po JOIN occupation o ON o.id=po.occupation_id WHERE po.person_id IN (SELECT person_id FROM summary_conviction_person WHERE summary_conviction_id=<ID>);
SELECT scl.role,l.name,l.parent_id FROM summary_conviction_location scl JOIN location l ON l.id=scl.location_id WHERE scl.summary_conviction_id=<ID>;
SELECT ct.name FROM summary_conviction_crime_type sct JOIN crime_type ct ON ct.id=sct.crime_type_id WHERE sct.summary_conviction_id=<ID>;
SELECT * FROM related_conviction WHERE summary_conviction_id_a=<ID> OR summary_conviction_id_b=<ID>;
SELECT pr.person_id, pr.related_person_id, rt.name FROM person_relationship pr JOIN relationship_type rt ON rt.id=pr.relationship_type_id WHERE pr.person_id IN (SELECT person_id FROM summary_conviction_person WHERE summary_conviction_id=<ID>) OR pr.related_person_id IN (SELECT person_id FROM summary_conviction_person WHERE summary_conviction_id=<ID>);
"
```

This still omits `birth_year`, `alias`, `anomalies`,
`notes_public`/`notes_private` (§2) — add them before ever resuming,
and re-derive the template from `.schema <table>` for every table
touched, not just `person`.

Any follow-up precedent search (rule 3) is a separate, additional
call — it varies per record.

### Full schema reference (so no column is ever invisible again)

```sql
CREATE TABLE person (
    id, first_name, middle_name, last_name, name_postfix, title, sex,
    birth_year, home_location_id, alias, office
);
CREATE TABLE summary_conviction (
    id, record_number, title, conviction_date, offence_date,
    offence_date_raw, offence_time, charge_description, raw_record,
    anomalies
);
CREATE TABLE summary_conviction_person (id, summary_conviction_id, person_id, role);
CREATE TABLE location (
    id, name, parent_id, notes_public, notes_private, latitude,
    longitude, path_geometry
);
CREATE TABLE occupation (id, name, is_police);
CREATE TABLE crime_type (id, name, parent_id, is_seeded, sort_order);
CREATE TABLE summary_conviction_crime_type (summary_conviction_id, crime_type_id);
CREATE TABLE person_relationship (id, person_id, relationship_type_id, related_person_id);
CREATE TABLE relationship_type (id, name);
CREATE TABLE related_conviction (
    summary_conviction_id_a, summary_conviction_id_b, note
    -- CHECK (id_a < id_b)
);
CREATE TABLE raw_case (
    id, archive_url, reference_number, title, document_date_raw,
    description, status, attempt_count, last_attempted_at, created_at
);
```
Other tables present but out of scope for this checklist (flagged,
not silently assumed): `town` and `street` (legacy/unused — the real
location hierarchy is the self-referential `location` table);
`extraction_attempt` (pipeline/LLM-call metadata, not conviction
content). `same-person-candidates.md` (see §9) also references data
here but is not itself a schema.

---

## 6. What must be checked, per record

For `summary_conviction` id N, read `raw_record` in full, then check
every one of the following. Nothing is optional or "probably fine
because the last several records were clean."

### A. The conviction record itself
- `conviction_date`, `offence_date`/`offence_date_raw`, `offence_time`
- `charge_description` matches the charge as stated
- `anomalies` — any scribal typo, archival mismatch, or source-side
  oddity gets a note here if not already present.

### B. Every person linked via `summary_conviction_person`
Full existing role vocabulary includes defendant, victim, informant,
witness, landowner, premises owner, various spouse-of-X roles,
co-defendant, employer, occupier, police/police officer, letter
addressee, and more — check precedent (rule 3) before inventing new
phrasing for a near-duplicate of an existing role.
- `first_name`/`middle_name`/`last_name` match the text
- `sex` — unambiguous given name, explicit pronoun, or gendered
  relationship term (husband/wife) implies sex even if the first name
  alone is ambiguous; flag if genuinely ambiguous, never guess
- `title`/`office`/`name_postfix` — via precedent check only.
  **`office` is for aristocratic/peerage pedigree only**; job titles
  and police ranks (harbour master, constable, superintendent, etc.)
  always go in `occupation`, never `office`.
- `occupation` matches, or is correctly absent if the text states
  none. **When the text states a marital-status word
  (singlewoman/spinster/widow) for ANY person, verify with a
  dedicated `person_occupation` query for that exact person_id** —
  don't trust the wide join alone. Match the exact word stated.
- `home_location_id` matches the stated home town/parish/address, or
  is a defensible context-based inference (judged case by case) — say
  so explicitly if inferring
- "Late of [place]" (35 occurrences) → formerly resident, stored as
  `home_location_id` anyway since it's the only data point given
- `alias` — captured if stated (rare: 20 rows)
- `birth_year` — captured if stated (rare: 46 rows)
- Watch for the duplicate-stub bug: a spouse/relationship link
  pointing at a duplicate stub person instead of the real
  co-defendant/person row already on the same record
- Watch for impersonation ("traded under the name of X") — its own
  person row with a role describing the impersonation, not an alias

### C. Every location linked via `summary_conviction_location`
Three roles: `court location`, `location of offence`, `petty
sessional division`. Established location rules:
- "X town street" → resolves to X itself, never a new place
- Truancy convictions → offence location is the defendant's own home,
  not the named School Board district
- Single-destination "X highway" → nests under the stated township,
  replaces the coarser township link
- Two-endpoint "X and Y highway" → Highways category (id 106), added
  *alongside* the stated township, never replacing it
- Named railway lines → Railways category (id 388), same
  add-alongside pattern
- Named rivers → Rivers category (id 397), same add-alongside pattern
- Two-endpoint named footpaths do **not** get the highway treatment —
  they get their own individual location node wherever they
  geographically sit (deliberate exception, per the user)
- A specific site whose parent chain reaches the stated township →
  replaces the coarser link; if it doesn't reach that township →
  added alongside, not replacing
- **Whitby/Ruswarp/Hawsker cliff-boundary case**: for much of the
  19th century Whitby and Ruswarp were one conjoined parish, boundary
  ≈ the cliff edge; Hawsker/East Cliff same logic. A site nesting
  under Whitby's West/East Cliff in the (modern-map-based) location
  tree can still genuinely belong to the historically-Ruswarp or
  -Hawsker side of the old joint parish. This is NOT a mis-parenting
  bug when a record states Ruswarp/Hawsker but names a Whitby-nested
  site — the specific-site "added alongside" rule already handles it.
  See `explorer/src/content/about/geography.md`. Don't re-flag this
  shape, it's already resolved, repeatedly.
- Spring Hill (97) and North Terrace (218) are a **deliberate
  exception** left as-is despite sitting under West Cliff→Whitby while
  most referencing records say "township of Ruswarp" — the location
  tree favours modern/mappable street geography over literal
  historical administrative wording (see
  `explorer/scripts/places-taxonomy-v2.txt`); both links (coarser
  township + specific street) are kept side-by-side deliberately, not
  a bug.
- A defendant's stall "in the market place" (false-weights records) →
  Market Place (30, East Cliff), not Old Market Place (31, West Cliff)
- Ellerby (123) is correctly parented under Hinderwell (88), not
  Lythe (107) — historically a Hinderwell-parish township
- **Barnby tree shape** (resolved with the user): Lythe → Barnby (400)
  → {East Barnby (108), West Barnby (269)}. Generic "township of
  Barnby" (no hamlet named) → Barnby (400) itself, never defaulted to
  East Barnby. Records only get East/West Barnby when their own text
  literally names that hamlet.
- Any new location node requires a precedent check first (rule 3)

### D. Crime type(s) via `summary_conviction_crime_type`
Check `qsrecords/offence_types.py`'s `OFFENCE_TAXONOMY` (or the live
`crime_type` table) for an existing fit before treating a phrasing as
needing something new. Avoid categories with only one leaf/row —
check actual candidate count via full-text search before
renaming/broadening a leaf.

### E. `related_conviction` — same-incident cross-check
Links two convictions when the evidence suggests the same real-world
incident, not coincidence. Confirmed patterns (judgment call each
time, not a fixed lookup table):
1. **Same defendant + same offence date** — multiple charges from one
   arrest.
2. **Same other named party (landowner/victim/informant) + same
   offence + same date, different defendants** — one incident,
   several people prosecuted separately. Extends to **same-beat**:
   same informant/constable + same offence type + same street/date,
   even with no shared named victim.
3. **No-named-party**: same offence + township + date alone is enough
   to link, even with zero shared named party (confirmed 602/608).
4. **Riot-incident** (higher bar): 3+ same-day/township/offence-type
   records implying one shared incident, crossing both defendant and
   victim boundaries — confirmed only via explicit user sign-off
   (436/646/652/664/670); ask again if a new instance is found, don't
   auto-apply.
5. **Mutual-charge pairs**: two people each convicted of the same
   offence against each other, same date/township (e.g. 853/856,
   Elizabeth Hobson vs Alice Joyce mutual assault) — same-named-party
   pattern, no new ask needed.

This is a genuine cross-record check, not a same-record field check —
querying other rows for this purpose is not "batching" (rule 1); it's
part of fully processing the one record under audit.

### F. `person_relationship` — stated relationships
Vocabulary: agent, apprentice, beneficiary, brother, child, co-partner,
cousin, daughter, employee, employer, father, guardian, husband,
master, mother, namesake, principal, servant, sister, son,
stepdaughter, stepfather, stepmother, stepson, trustee, ward, wife.
Confirm direction and reciprocal type (`relationship_type_reciprocal`).

### G. Person dedup within linked clusters (narrow exception)
When `related_conviction` already proves same-day/same-defendant
(genuinely the same real individual across multiple charges from one
arrest), merge the person rows onto one canonical record now, rather
than waiting for a later dedup pass. Narrow exception — does not
apply to same-named-but-unrelated convictions (the general
no-cross-conviction-merge principle: same-named individuals in
different, unrelated convictions get separate `person` rows, always).

---

## 7. Standing data conventions already decided (don't re-litigate)

- Company/business defendants (e.g. "Holt and Company") → one
  `person` row, `last_name` only, `sex` NULL.
- "Esquire" is a courtesy honorific, dropped everywhere — never an
  occupation, title, or anything else. (Was briefly, wrongly, treated
  as an occupation for ~15-19 people earlier in the audit; all
  reverted, occupation row deleted. Do not re-add.)
- "Baronet" — same treatment, never an occupation.
- "The licensed premises of X" → X gets `occupation` = "licensee"
  (id 408), in addition to (not instead of) `role='licensee'` on the
  conviction. ~150 more corpus-wide instances beyond id 1100 likely
  still missing this (only the id≤1100 range was swept — 39/39 clean
  there).
- "Bailiff Appleton" (record 351) — no personal given name exists in
  the source at all; `title='Bailiff'`, `first_name=NULL`,
  `last_name='Appleton'`, sex=male. User's specific call for this
  case: an office attached to a real surname stays in `title`, not
  `office` — contrast with the peerage cases below where the whole
  identity is the office. Not a mechanical rule to generalize from.
- **Peerage naming** (Constantine Henry Phipps, Marquis of Normanby /
  Earl of Mulgrave — same real person at two career stages, 17 rows
  consolidated onto one `office` string; Sir John
  Vanden-Bempde-Johnstone, 2nd Baronet of Hackness Hall — surname is
  the full hyphenated triple-barrel, was wrongly split; Sir George
  Elliot(t), 1st Baronet — 5 confirmed rows, a 6th "George Elliott" at
  record 5187 is a different, unrelated person; Sir Charles Mark
  Palmer — the records that say "Sir" vs don't are both genuinely
  accurate to their own dates, not an inconsistency; Viscountess/
  Viscount Downe — 5 sightings are actually **two different real
  people**: Louisa Maria Dawnay, Dowager Viscountess Downe, for one
  1862 sighting, and Hugh Richard Dawnay, 8th Viscount Downe, for four
  1870-1881 sightings): **always record BOTH the fullest known
  personal name AND the fullest known office** when the user supplies
  them, even beyond what the record's own text says, once the
  identification is independently confirmed (not a rule-4
  fabrication, since the user supplied and confirmed it directly).
- 12 confirmed corpus-wide instances of a titled name ("Sir George
  Elliot") dumped whole into `last_name` with no title/first_name
  split remain **unfixed** outside the specific cases resolved above.
- Titled peer records already resolved and confirmed clean, don't
  re-ask: Constantine Henry Phipps (all 17 rows), Sir John
  Vanden-Bempde-Johnstone (both rows), Sir George Elliot(t) (5
  confirmed rows, id 5187 is a different person), Sir Charles Mark
  Palmer (all 12 rows, both the "Sir" and non-"Sir" ones), Viscountess/
  Viscount Downe (all 5 rows, correctly split across two real people).

---

## 8. Cautionary incidents (read before repeating them)

- **Title/office re-fabrication (records 2119, 2233, 2236).** A
  person-lookup query that didn't select `office` made already-correct
  peerage rows look blank; fabricated a duplicate `title='Marquis'`
  and a new `'baronet'` occupation on top of already-correct data —
  the exact esquire/baronet-as-occupation mistake already resolved
  once before. User caught it, asked for a postmortem. Nothing was
  actually lost (the correct data was in `office` the whole time,
  just invisible to the query), but false "FIXED" log entries had to
  be corrected. Root cause: (1) `office` not in the query, (2) never
  actually re-read this file's own already-documented rule for this
  exact scenario despite citing the file by name in every log header,
  (3) no "have I already reasoned about this exact person earlier"
  check before writing a categorical field. This is the direct
  ancestor of tonight's `middle_name` failure — same shape, different
  column.
- **Record 694 mislabeling** (this session): confused a defendant's
  `person.id` (694) with the `summary_conviction.id` under audit,
  logged the wrong record's content. Caught by re-fetching, corrected
  with an explicit "**CORRECTION**" block before moving on. No
  database write was affected.
- **Batched log entries** (records ~521-590): chat-verbosity reduction
  was once wrongly extended to log-file detail too, producing grouped
  "OK — no changes (a, b, c)" entries without individually quoted
  text. Caught by the user, who found the batching suspicious. Chat
  terseness and log detail are separate concerns (rule 6 vs rule 11)
  — reducing one is never license to reduce the other.

---

## 9. Known unresolved gaps — fix only as reached, full id lists

Per rule 9, none of these get retroactively swept into already-passed
records without the user re-authorizing it (as was done once for the
sex-completeness gap, §3). For records not yet reached, fix inline
when the sequential audit gets there.

### 9a. Non-defendant `sex` completeness (the gap behind the second-pass sweep)
`ExtractedInvolvedPerson` (the extraction schema class for every
non-defendant role) never had a `sex` field — only
`ExtractedDefendant` did. Corpus-wide blank-sex rate by role:
defendant 0.08% (fine), informant 69%, victim 54%,
victim/informant 100%, landowner 42%, child 81%, witness 29%, husband
of offender 100%, co-offender 100% — roughly 2,226 of ~3,854
non-defendant rows (~58%) corpus-wide. The id≤1100 portion is what
the second-pass sweep (§3) was fixing when it stopped at record 868;
1102 onward has never been touched for this at all.

### 9b. Licensee occupation gap
"Licensed premises of X" → X should get occupation "licensee". Fixed
for id≤1100 (39/39 mentions clean). ~150 more instances likely exist
beyond id 1100, corpus-wide, unaddressed.

### 9c. Title-parsing gap
12 confirmed corpus-wide instances of a titled name dumped whole into
`last_name` with no title/first_name split (e.g. "Sir George Elliot"
before it was specifically resolved — see §7). None fixed outside the
specific peerage cases already resolved.

### 9d. Marital-status occupation gap (singlewoman/spinster/widow)
Person states singlewoman/spinster/widow in text but it was never
linked in `person_occupation`. ~215 affected records corpus-wide
originally found at record 275; all known instances at/before id 547
resolved as encountered. Remaining known ids (verify each against its
own text when reached — list captured at record 275, may not be
exhaustive beyond it):
```
1155, 1158, 1161, 1185, 1283, 1352, 1355, 1490, 1499, 1657, 1661, 1684,
1769, 1824, 1875, 1881, 2051, 2066, 2067, 2139, 2142, 2160, 2194, 2203,
2218, 2260, 2288, 2328, 2452, 2502, 2569, 2578, 2618, 2632, 2635, 2638,
2663, 2674, 2699, 2712, 2745, 2759, 2771, 2776, 2785, 2786, 2796, 2808,
2858, 2861, 2870, 2886, 2927, 2954, 2993, 3133, 3141, 3144, 3147, 3149,
3151, 3154, 3187, 3215, 3218, 3249, 3252, 3255, 3257, 3268, 3269, 3332,
3334, 3365, 3398, 3466, 3478, 3545, 3547, 3554, 3583, 3631, 3640, 3655,
3685, 3687, 3741, 3780, 3790, 3865, 3877, 3920, 3929, 3954, 3985, 4026,
4049, 4054, 4075, 4137, 4188, 4312, 4356, 4402, 4427, 4468, 4474, 4545,
4555, 4616, 4638, 4665, 4673, 4724, 4765, 4767, 4768, 4819, 4890, 4892,
4917, 4948, 4953, 4978, 4979, 4991, 5011, 5063, 5078, 5142, 5181, 5194,
5200, 5202, 5222, 5232, 5236, 5260, 5261, 5266, 5267, 5278, 5296, 5298,
5304, 5342, 5356
```

### 9e. "Destroying own clothes" crime_type retag
Offence text "wilfully destroying his own clothes whilst being
relieved in the Whitby Union workhouse" was split across two wrong
existing leaves. Created dedicated leaf id 73 (category 8). Fixed:
330, 360, 390, 987, 990. Remaining, fix only as reached (verify text
matches this exact pattern first):
```
Currently tagged malicious/property damage (id 60): 1482, 1531, 1815,
1880, 1975, 1978, 1981, 2064, 2088, 2277, 2283, 2286, 4130, 4220,
4262, 4264, 4324, 4375, 4377, 4589, 4683, 5153, 5353, 5355, 5913,
5915, 5917, 5927, 5929, 5931, 5933, 6018, 6020, 6042, 6089, 6126.

Currently tagged workhouse offence (id 47): 69, 70, 2124, 2799, 3264,
3446, 3515, 3528, 3657, 3666, 3668, 3673, 3682, 3856.
```

### 9f. Constable "his duty" sex gap
"NAME one of the constables ... in the execution of his duty" implies
male via the pronoun but `sex` left blank. 213 affected person rows
confirmed via precise pattern match (looser role-based filter gives
285, but the extra 72 are other people named on the same record whom
the pronoun doesn't refer to — **always re-verify the specific
antecedent match** — `raw_record LIKE '%' || first_name || ' ' ||
last_name || ' one of the constables%'` — never the looser filter
alone). Fixed so far: record 670 (John Cook) only. Full remaining list
(format `summary_conviction_id/person_id Name`):
```
2410/7769 John Nicholson, 2425/7777 John Nicholson, 2428/7779 William
Hammond, 2446/7798 Alfred Barker, 2460/7811 Alfred Barker, 2466/7819
William Hammond, 2509/7864 Thomas Hignett, 2542/7883 Joseph Scaife,
2565/7895 John Nicholson, 2593/7915 Frederick Wilson, 2606/7924 William
Pickering, 2648/7953 Hugh MacGregor, 2789/8017 Thomas Dennis, 2813/8027
Francis Hudson, 2819/8032 John Ryder, 2841/8054 George Lambert,
2849/8063 John Smith, 2897/8096 Samuel Harrison, 2912/8102 John
Nicholson, 2953/8122 Hugh McGregor, 2958/8127 Alfred Longstaffe,
2968/8132 William Stainsby, 3025/8175 William Metcalfe, 3044/8192
Samuel Harrison, 3060/8203 William Lee, 3063/8205 George Lambert,
3090/8217 Thomas Hignett, 3113/8232 Thomas Prest, 3130/8247 William
Metcalfe, 3131/8248 Thomas Prest, 3241/8332 Thomas Dennis, 3259/8352
John Jefferson, 3261/8354 William Smith, 3291/8386 John Holmes,
3298/8395 William Hammond, 3304/8400 Mark Boggett, 3319/8421 James
Wright, 3328/8428 Peter Pinkney, 3329/8429 John Collinson, 3340/8433
Peter Pinkney, 3354/8443 Robert Wright, 3423/8476 Hugh McGregor,
3479/8501 William Dobson, 3489/8507 Charles Boynton, 3496/8513 Miles
Moody, 3511/8525 John Nicholson, 3513/8527 Hugh MacGregor, 3526/8535
George Jackson, 3532/8539 William Hodgson, 3537/8543 William Pickering,
3540/8546 William Pickering, 3543/8547 William Pickering, 3546/8549
John Newbegin, 3549/8551 John Newbegin, 3552/8554 John Newbegin,
3556/8557 George Hewison, 3608/8579 William Marshall, 3618/8583 John
Jackson, 3623/8586 Thomas Leppington, 3645/8597 Thomas Ridley,
3725/8619 William Hodgson, 3735/8624 Peter Pinkney, 3757/8639 John
Ryder, 3762/8641 George Bramwell, 3791/8650 Alfred Longstaff, 3801/8656
Alfred Barker, 3803/8658 Alfred Barker, 3805/8659 John Calvert,
3817/8668 Alfred Barker, 3827/8672 Simpson Harnby, 3842/8676 Francis
Vokes, 3861/8689 William Hodgson, 3866/8690 John Collinson, 3913/8717
Simpson Harnby, 3933/8729 John Metcalfe, 3943/8730 Alfred Longstaff,
3947/8731 Alfred Longstaff, 3956/8739 William Dobson, 4001/8753 William
Lee, 4029/8762 Peter Pinkney, 4034/8764 John Pollard, 4063/8787 John
Nicholson, 4102/8818 Thomas Hignett, 4120/8830 William Lee, 4122/8832
William Cook, 4124/8835 John Collinson, 4156/8857 George Bramwell,
4161/8860 John Richardson, 4170/8864 Thomas Hignett, 4178/8865 John
Pollard, 4180/8867 John Pollard, 4181/8868 John Nicholson, 4183/8870
John Atkinson, 4187/8873 John Richardson, 4189/8874 John Richardson,
4191/8876 John Richardson, 4195/8879 John Richardson, 4196/8882 John
Collinson, 4203/8884 Thomas Ridley, 4219/8894 John Richardson,
4245/8909 William Hammond, 4301/8935 John Metcalfe, 4328/8945 John
Nicholson, 4330/8946 William Hammond, 4331/8948 Joseph Metcalfe,
4332/8949 William Hodgson, 4347/8970 William Ness, 4360/8984 Thomas
Dennis, 4371/8995 William Cook, 4372/8996 William Hammond, 4378/9001
George Luther, 4380/9003 William Hodgson, 4384/9009 John Richardson,
4385/9012 Thomas Hignett, 4388/9015 William Hammond, 4393/9023 Alfred
Longstaff, 4421/9030 Matthew Lodge, 4432/9037 Thomas Ridley, 4471/9053
Matthew Lodge, 4488/9066 William Hodgson, 4494/9070 Samuel Harrison,
4550/9106 John Calvert, 4552/9107 John Calvert, 4560/9112 Thomas
Ridley, 4566/9115 Thomas Ridley, 4638/9143 Samuel Harrison, 4642/9147
Simpson Harnby, 4679/9163 Alfred Longstaff, 4682/9166 James Park,
4690/9170 John Atkinson, 4692/9171 Peter Pinkney, 4710/9187 Andrew
Thompson, 4726/9192 James Wright, 4738/9197 George Hodgson, 4753/9204
Alfred Longstaff, 4779/9216 John Metcalfe, 4794/9222 Andrew Thompson,
4808/9226 Thomas Archer, 4838/9249 William Mothersill, 4840/9250 Peter
Pinkney, 4873/9271 William Cook, 4878/9274 Henry Gibson, 4908/9283
James Park, 4913/9285 Alfred Longstaff, 4915/9288 John Metcalfe,
4916/9289 John Spare, 4940/9303 Thomas Robson, 4945/9305 William Ness,
4950/9307 Thomas Robson, 4952/9308 Peter Pinkney, 4958/9311 Thomas
Robson, 4962/9313 Thomas Robson, 4964/9314 Charles Cowell, 4974/9319
Samuel Harrison, 4976/9322 George Crosby, 4984/9325 William Mothersill,
4996/9334 Samuel Harrison, 5034/9343 Peter Pinkney, 5035/9344 William
Cruddas, 5037/9345 William Cruddas, 5048/9349 William Morthersill,
5090/9371 Richard Darley, 5092/9372 Charles Cowell, 5157/9393 Frederick
Wilson, 5187/9410 Jonah Hawkins, 5207/9418 Alfred Longstaff, 5249/9429
John Hunter, 5256/9437 Simpson Harnby, 5313/9460 William Hammond,
5333/9468 Joseph Scaife, 5387/9496 Robert Herron, 5394/9501 Thomas
Robinson, 5418/9518 Simpson Harnby, 5429/9527 William Hammond,
5472/9546 Robert Ramsdale, 5486/9553 James Wright, 5488/9554 Simpson
Harnby, 5495/9559 Joseph Kemp, 5516/9571 James Wright, 5529/9581
Francis Vokes, 5597/9608 Robert Herron, 5616/9614 Francis Selby,
5639/9625 Alfred Longstaff, 5640/9626 Joseph Gatenby, 5643/9628 Alfred
Longstaff, 5645/9630 Alfred Longstaffe, 5693/9651 John Harland,
5698/9654 William Dobson, 5702/9657 Francis Vokes, 5798/9687 James
Gibson, 5800/9688 Simpson Harnby, 5801/9689 William Hammond, 5804/9691
John Smedley, 5806/9693 John Smedley, 5807/9694 John Smedley,
5849/9711 James Park, 5859/9716 Robert Needham, 5875/9727 Joseph Kemp,
5899/9739 Alfred Longstaffe, 5905/9745 William Dobson, 5922/9753 John
Harland, 5948/9763 Joseph Gatenby, 5974/9772 Simpson Harnby, 6011/9795
Miles Moody, 6077/9821 Robert Needham, 6104/9823 Francis Vokes,
6105/9824 Francis Vokes, 6107/9825 Joseph Scaife, 6118/9833 Joseph
Kemp, 6119/9834 Frederick Wilson, 6208/9866 Joseph Scaife, 6255/9894
William Cook.
```

### 9g. Archival date-discrepancy annotations (minor, purely documentational)
24 records carry a source-side "dated X but endorsed Y" (or "[sic]")
annotation about document-date vs filing-date discrepancy, each with
a different specific date — not one repeatable pattern. Two already
have `anomalies` notes (184, 1098). No location/person data affected;
worth an `anomalies`-note pass whenever convenient, not urgent. Ids:
184, 407, 413, 419, 425, 431, 437, 443, 449, 455, 459, 464, 550, 1098,
1622, 1637, 2054, 2279, 2444, 2719, 3459, 3477, 3483, 5524.

### 9h. Small watch item
"One of the constables of/for the North Riding" should map to
occupation "constable of the North Riding" (id 96) or "constable for
the North Riding" (id 94) — not bare "constable" (id 93), which loses
the qualifier. Fixed at record 31; watch for recurrences during
sequential reading (not swept in bulk — distinguishing genuinely-bare
"constable" from ones that should have the fuller phrase needs
reading each one).

---

## 10. Same-person merge candidates (separate file, not duplicated here)

`data-loader/reports/same-person-candidates.md` (kept, not deleted —
see §11) is a running list, built incidentally during the audit, of
same-named people across *different* convictions who are plausibly
the same real individual (unusual names, specific recurring
role+place combinations, etc.). Deliberately **not acted on** —
deferred until the per-record correctness pass is complete, per
2026-07-30 discussion, as a head start for a dedicated cross-corpus
person-matching pass later. One confirmed-with-the-user case not yet
merged in the DB: **Sovina Short** (person ids 6576, 7330, 9777 — a
licensee/property-owner in Whitby, 1868-1870, rare name, identical
spelling 3 times). The eventual goal stated by the user: a safely
deduplicated person table where many people are connected to multiple
offences (see §6.G for the one exception already authorized —
merging within a single already-linked `related_conviction` cluster).

---

## 11. File inventory

Current, authoritative files (kept):
- **This file** — process rules, checklist, conventions, tracked gaps.
- `full-audit-log-restart-2.md` — main pass audit trail, records
  1-1101.
- `second-pass-non-defendant-sweep.md` — second-pass sweep audit
  trail, records 1-868 of the 479-id list (§3).
- `same-person-candidates.md` — deferred cross-corpus dedup
  candidates (§10).
- `occupation-conflicts.html` — a generated diagnostic report,
  unrelated to this audit's process notes; left alone, not reviewed
  as part of this consolidation.

### What was deleted in this consolidation
- `audit-rulebook.md` — folded into §4-§6 above.
- `reextraction-audit-notes.md` — folded into §2, §6-§9 above.
- `full-audit-log.md`, `full-audit-log-2.md`, `full-audit-log-3.md`,
  `full-audit-log-restart.md` — superseded logs from earlier,
  abandoned restart attempts (their fixes are already reflected in
  the current database; the log narratives themselves were redundant
  with `full-audit-log-restart-2.md`, the current log).

---

## 12. If this is ever picked up again

Read this file in full first. Do not assume the audit should resume
from where it stopped — get the user's explicit go-ahead. If resuming
is authorized: read the relevant log's last "Progress" line (main
pass) or re-derive the id-list position from
`second-pass-non-defendant-sweep.md`'s last `## Record N` entry
(second pass), and continue from there under every rule in §4,
using the query template in §5 exactly as written (not rebuilt from
memory), extended to also cover `birth_year`, `alias`, `anomalies`,
and `location.notes_public`/`notes_private` per §2's findings.

Not authorized, but recorded for the record: a per-record manual LLM
read-through of 6,231 rows, with a full log entry for every single
one, is an extremely expensive and error-prone way to guarantee
completeness — tonight's failure is a good example of why: the
process was rigorous about the things it was told to check and blind
to a column it had *already written down* needing to check, and that
kind of blind spot doesn't announce itself. A programmatic
completeness pass (a script that diffs every column in
`person`/`summary_conviction`/etc. against what raw_record text
plausibly supports, flagging gaps for a human or LLM to adjudicate one
at a time) would catch this class of bug by construction, because it
can't forget a column exists — but that directly conflicts with this
project's standing no-scripts rule (rule 2), which exists for its own
good reasons (trust in what was actually checked, after Python/script
use caused the first two restarts). Reconciling those two is a real
design question for the user to decide, not something to resolve
unilaterally.
