# Record-by-record re-extraction audit — working notes

Started 2026-07-29. Goal: read every conviction's `raw_record` directly,
cross-check every proper name (person or place) against the database, and
fix gaps — missing people, missing locations, missing relationships.
Working through `summary_conviction` in `id` order.

**Minor open item found at record 1622, not swept**: 24 records carry a
source-side "dated X but endorsed Y" (or "[sic]") archival annotation
about a discrepancy between the document's written date and its filing
date — each with different specific dates, not a single repeatable
pattern like the workhouse/highway gaps. Two already have `anomalies`
notes (184, 1098); the rest don't. IDs: 184, 407, 413, 419, 425, 431,
437, 443, 449, 455, 459, 464, 550, 1098, 1622 (done), 1637, 2054, 2279,
2444, 2719, 3459, 3477, 3483, 5524. Purely documentational (no location/
person data affected) — worth an `anomalies`-note pass whenever
convenient, not urgent.

**Log file split**: the per-record ledger is split into
`full-audit-log.md` (records 1–1400), `full-audit-log-2.md` (1401+), and
a new file every ~1000 records after that (`full-audit-log-3.md`, etc).
Check the highest-numbered file first when resuming.

**Major corpus-wide sweep at record 1465**: found "X wife of [blank]
SURNAME OCCUPATION" records where the husband's occupation had been
wrongly attached to the wife's own person row instead of a separate
blank-first-name husband stub (the same convention used correctly
elsewhere for "[blank] Seddon"/"[blank] Dickinson"-type informants).
Searched the full corpus for `%wife of [blank]%` / `%husband of
[blank]%` (32 hits) and checked each one systematically:
- 9 were already correct (husband stub existed with the right
  occupation/home already attached: 2832, 3026, 3068 ×2, 4698, 5366,
  5402, 6183, 6184).
- 7 had the misattached-occupation bug: 2579 (hawker), 2825 (jet
  worker), 4192 (labourer), 4225 (labourer), 4350 (fisherman), 5244
  (sailor), 5374 (sailor). Fixed by removing the occupation from the
  wife and creating the husband stub with it.
- 3 had the husband's occupation/home entirely dropped (no
  misattachment, just missing): 4403 (master mariner, home "8 John
  Street" — resolves to the existing Ruswarp/West-Cliff-conflict "John
  Street" node, id 212), 4876 (mariner), 4924 (labourer). Fixed by
  creating the husband stub with the stated occupation/home.
- 5 had no occupation stated in the source at all, just a missing
  relationship link: 4097, 5062, 5148, 6250, 6251. Fixed by creating a
  bare husband stub (home only, where stated) and linking the
  relationship.
All 15 fixes create a `first_name=NULL` husband person row, a "spouse
of offender/informant" link on the conviction, and a `wife` relationship
row pointing from the wife to the husband — same shape as the
already-correct 9. Record 1465 (Mary Wray/fruiterer) was the seed case
that surfaced this pattern; not part of the 32-hit search count since it
uses `raw_record` text slightly differently ("wife of [blank] fruiterer"
— occupation directly after `[blank]`, not after the surname).

**"North Eastern Railway" sweep, resolved with the user.** 21 records
mention the North Eastern Railway; read each individually and sorted
into three treatments rather than one blanket fix:
1. Already-named branch lines get their own node (same convention as
   the existing Whitby & Pickering and Cleveland & North Yorkshire
   nodes): created "Stockton & Whitby Railway" (406) for 1729/2430, and
   "Whitby & Loftus Railway" (407) for 2515/3126. Record 1864's "North
   Yorkshire Branch line" (no "Cleveland and" prefix) was judged the
   same line as 614/928 and linked to the existing node (391) rather
   than treated as a distinct/uncertain reference.
2. **User's guidance: "these are really places"** — explicitly named
   specific sites get their own location node even when the mention is
   otherwise generic "North Eastern Railway Company" phrasing. Created
   "Whitby (Town) Station" (408, under Whitby) for 1972 (explicitly
   named in the text); "Glaisdale Station" (409, under Glaisdale) for
   1852 (not literally named "station" in the text, but the informant
   is the Glaisdale station master and it's the same defendant/officer
   pair as 1729 two days earlier — station is the clear referent); and
   "Railway Warehouse" (410, under Ruswarp) for 5707/5709 (a described
   building, same incident, two boys).
3. Left unlinked (no specific place named, correctly resolve to their
   stated township only): 1577 ("the north line" — too vague), 2087,
   2099 (bare company land, Egton), 2310 (bare company land, Ruswarp),
   2911 (ticket offence with no station named — and the one station
   master mentioned is Whitby's, not Ruswarp's, so genuinely unclear
   which station), 4043 (bare premises, Newholm cum Dunsley), 5940,
   5944 (bare "walking on the railway", Egton), 6131 (bare "the
   Company's line", Eskdaleside).

**Second corpus-wide sweep at record 1482**: found a missing
location-of-offence link for "the Whitby Union workhouse" (the record
mentioned it but no `summary_conviction_location` row pointed at the
existing "Union Workhouse" node, id 81, Green Lane). Searched the full
corpus for `%union workhouse%` (57 hits) against the already-linked set
(31 records, including the Stakesby Road/Ruswarp site, id 399) and found
29 more genuine gaps: 2494, 2790, 2799, 3264, 3360, 3414, 3446, 3515,
3528, 3561, 3579, 3630, 3666, 3668, 3682, 3856, 4130, 4220, 4262, 4264,
4683, 5153, 5353, 5355, 6018, 6020, 6042, 6089, 6126. Checked each
one's text for a Ruswarp/Stakesby-Road mention before fixing (per the
existing Green-Lane-vs-Stakesby-Road disambiguation rule) — none of the
29 referenced Ruswarp, so all were linked to the main Green Lane node
(81) in one batch.

**Progress: reviewed through id 291 as of this note** (plus a full-corpus
duplicate-stub sweep, see open question #2 — that touched scattered
records well beyond the reviewed range). Next session should resume from
id 292 onward for the record-by-record read-through.

Fixes applied in the 207-291 range (brief): 220 (added Whitby & Hawsker
Highway alongside Whitby), 257 (Union Workhouse, existing id 81, replaces
coarser Whitby link). Everything else in that range was already correct.

**Corpus-wide sweep: two-endpoint cross-parish highways missing their
alongside township.** Finding 470/478 (both missing their stated township
next to a two-endpoint highway) prompted checking whether this was
one-off or systemic, given the exact same bug shape was already fixed
once before at 128/130 earlier in the audit. A full-corpus query (every
`summary_conviction_location` row under a `parent_id=106` — i.e. a
two-endpoint cross-parish highway — that is the ONLY `location of
offence` row on its conviction) found **79 records** with this gap, not
just the 4 caught by hand. Extracted each one's stated township directly
from its own `raw_record` via the (very consistent, single-format)
"Offence committed at the township of X on" phrase, matched each X
against the existing `location` table, and added it alongside the highway
link (same treatment as 128/130/470/478 — established rule, not a new
judgment call). Fixed 75 of the 79:
- 2 (records 3042, 3045) have NO stated township at all ("Offence
  committed on 24 December 1885" — date only, no "township of" clause) —
  correctly left as highway-only, nothing to add.
- 2 (records 1068, 3784) name "township of Barnby" — held back pending
  open question #5 (Barnby/East Barnby/West Barnby), not resolved here.
Re-ran the detection query after — only those same 4 remain, confirming
the sweep is complete for the other 75. `PRAGMA foreign_key_check` clean.

**Second duplicate-stub sweep — a new variant of the bug, found by
accident.** While reviewing record 906 ("not sending his daughter Minnie
Walker to school"), found Minnie's "daughter" relationship pointed at a
stub person (10339, first_name="William George" merged into one field,
no home) instead of the real, correctly-parsed defendant already on the
conviction (970, first_name="William", middle_name="George", home=74).
Same double-count bug as the spouse-stub sweep earlier, but this time on
a parent-child relationship, not a spouse one — meaning the bug isn't
spouse-specific, it can occur on ANY relationship type. Ran a precise
detection query (relationship target has a merged "First Middle" in
first_name with no middle_name AND zero summary_conviction_person links,
while a person with the split first+middle name IS already linked as a
participant on the same conviction) across the whole corpus: found 13
more (convictions 211, 1220, 1223, 1554, 3153, 3808, 5443×4, 6213, 6218,
6227). Verified each stub had zero other references, repointed the
relationship to the real person, deleted the stub. `PRAGMA
foreign_key_check` clean after both rounds (14 total this time).
**Important negative result**: also tried a looser detection query
(target has no conviction link + shares only last_name, not first/middle,
with someone on the conviction) hoping to catch more — this produced ~30
hits that are almost all FALSE positives (legitimate "spouse of
offender/victim" stubs, e.g. husband "William Bryan" vs wife "Isabella
Bryan" — different real people who happen to share a surname, exactly the
normal pattern this session has been enriching with home_location all
night). Did NOT act on any of those 30 — flagging so a future pass
doesn't repeat this dead end. The precise signal for this bug is the
merged-name-with-zero-other-links shape, not surname matching alone.

**Progress update: reviewed through id 906.** Pattern #6: 890 Henry
Miller, 891 John Henry Smith (both spouse of offender) — home=Whitby.

**Progress update: reviewed through id 881.** Pattern #7: Hannah Cooper
and Harriet Hicks (860, witnesses, "both of the township of Whitby
singlewomen") — added "singlewoman" occupation to both. Pattern #6: 860
Thomas Gaines, 868 William Henry Hezlewood (both spouse of offender) —
home=Whitby. Highway sweep holding up at 879.

**Progress update: reviewed through id 831.** Pattern #6: 853 William
Hobson, 856 Patrick Joyce (both spouse of offender in a mutual-assault
pair of companion convictions — Elizabeth Hobson vs Alice Joyce and vice
versa, correctly two separate summary_conviction rows) — home=Whitby.
Rest of range already correct.

**Progress update: reviewed through id 831.** Pattern #6: 816 Simon
Robert Leck (spouse of victim) — home=Whitby. Highway sweep holding up
correctly at 808/823. Rest of range already correct.

**Progress update: reviewed through id 806.** Pattern #6: 792 James
Miller, 802 Sampson Storm, 790 and 799 William George Baker (two separate
person rows, same recurring real-world pair across two convictions,
correctly not merged) — all spouse of offender with occupation already
correct, home=Whitby added. 783 Charles Jackson (spouse of offender)
correctly has nothing captured — text truly states no location/occupation
for him, unlike the others. Record 800's bracketed alt-name ("Elizabeth
Sneaton [Elizabeth Skinner]") was already correctly captured in
`person.alias`, not a gap. Rest of range already correct.

**Progress update: reviewed through id 756.** Pattern #6: 759 Isaac Hick,
762 Richard Gatenby, 766 Thomas Pennock (all spouse of offender) —
home=Whitby. New locations: 769 named a specific inn at a specific hamlet
("William Bradley of The Fox and Hounds Inn at Ainthorpe in Danby in the
township of Danby") that only had the coarse "Danby" township captured as
his home — created "Ainthorpe" (392, under Danby) and "Fox and Hounds Inn"
(393, under Ainthorpe), set as his home_location_id, replacing the
coarser Danby link (matches the Tiger Inn/King's Head Inn precedent from
earlier this session). Good sign: 778/781 daughter relationships already
correctly captured (matches 751's pattern, confirms 703 was a one-off).

**Progress update: reviewed through id 756.** Fix: 748 John Henry Smith,
754 Thomas Fisher (both spouse of offender) — home=Whitby. Good sign: 751
(James Foster/son John Foster, explicit "his son") already had the
son-relationship correctly captured — confirms the parent-child gap fixed
at 703 was a one-off miss, not a systemic pattern like #6/#7.

**Progress update: reviewed through id 731.** Fix: 710 John Brough (spouse
of offender, "of the township of Pickering stonemason") — home=Pickering
(277). Rest of range already correct; highway sweep holding up at 727.

**Progress update: reviewed through id 706.** Fix: 703 (John Smith the
elder, "applying for relief... on behalf of HIS children John, Annie and
Charles") — the three children (10276-10278) had role='child' on the
conviction but NO `person_relationship` row linking them to their father
at all; added `relationship_type='child'` (id 14) from each child to John
Smith (761) — unlike record 500 (Charlotte Clark's two named children,
where the text does NOT say "her children", correctly left unlinked),
here "his children" is explicit, so this is a real gap, not a fabrication
risk. Rest of range already correct.

**Progress update: reviewed through id 681.** Fix: 677 (Thomas Hodgson,
"of the township of Whitby sailor for being drunk. Offence committed on
25 July 1869" — no offence-location clause stated at all) had NO location
of offence captured, unlike the comparable 536/540 case (innkeepers with
the same kind of silent offence-location, where Whitby was correctly
inferred) — added Whitby for consistency with that established inference.
Rest of range already correct ("common prostitute" occupation consistently
captured at 659/662/665; highway sweep holding up at 680 area; etc.).

**Progress update: reviewed through id 656.** Pattern #6: 655 Amos Craven
(spouse of offender, "of Kingston upon Hull labourer") — home=Kingston
upon Hull (321, matching his wife's already-correct home). 653 Isaac Hick
correctly has nothing captured — text truly states no location/occupation
for him. Confirmed the corpus-wide highway sweep is holding up correctly
on new records reached in the normal read-through (655, 656 both already
show highway + township together). Rest of range already correct.

**Progress update: reviewed through id 631.** Fix: 614 named a real
railway line as the offence site ("interfering with the comfort of other
passengers on the Cleveland and North Yorkshire line of the North Eastern
Railway") that didn't exist yet — created "Cleveland & North Yorkshire
Railway" (new id 391, under Cross-Parish Railways 388, matching the
established rule), added alongside the existing Eskdaleside-cum-Ugglebarnby
link. Pattern #6: 619 William George Hansell, 626 Robert Austin (both
spouse of offender, occupations already correct) — home=Whitby. Pattern
#7: 626 Ann Appleton ("widow") and Annie Austin ("singlewoman") — both
missing their stated descriptor as occupation, added.

**Progress update: reviewed through id 606.** Fix: 597 John Feeley
(spouse of victim) — home=Whitby. Record 605 ("collecting alms under
false pretences... claiming a young woman had recently been confined in
the Old Post Office Yard") correctly has no location captured for "Old
Post Office Yard" — it's part of the defendant's fabricated pretext, not
a real event site, so capturing it as a location would misrepresent the
record; left alone, not flagged further. Rest of range (582-606) already
correct.

**Progress update: reviewed through id 581.** Fixes (pattern #6, going
forward): 557 Thomas Readman (spouse of victim) — home=Whitby. 566
Charles Sams (spouse of offender) — home=Whitby. Record 561's Robert
Dobson home + the record's own offence location both already point to
"East Barnby" (108) for stated "township of Barnby" — consistent with the
existing majority precedent already noted under open question #5, no new
action, just another data point (already counted there). Everything else
in this range (562-581, including several "X town street" boilerplate
records, e.g. Egton, Aislaby Street as a genuine distinct street) was
already correct.

**Progress update: reviewed through id 548.** Fixes (all matching #6/#7
patterns already established, applied going forward): 526 Mary Ann
Stonehouse — occupation "singlewoman" added. 533 John McDermott (spouse of
offender) — home=Whitby. 537 Thomas Ward (spouse of offender, already had
occupation "common lodging house keeper") — home=Whitby. 548 Richard Cail
(spouse of offender) — home=Whitby, occupation "currier" added (text:
"Hannah Cail wife of Richard Cail of Whitby currier" — modifies the
husband per the established convention). Also 544 ("trespassing... on the
lands of the Earl of Mulgrave") — no person row existed at all for "the
Earl of Mulgrave" despite being named as the landowner; created a
blank-fields stub (person 10341, role='landowner') matching the EXACT
precedent already set for "the Marquis of Normanby" (record 177, open
question #1) rather than leaving it uncaptured — see open question #1
update below, this is now a second occurrence of that same unresolved
structuring question. Record 548 also has an odd repeated "Hannah Cail...
and Hannah Cail" in its own raw_record (likely an archival scribal
duplication, not an extraction bug) — correctly resolved to one person
row already, no fix needed. Records 536/540 (innkeepers "opening his
house..." with no location clause in the offence sentence at all, unlike
their twins 407 etc.) were left as Whitby — matches the established
"silence as evidence of local" reasoning (his own stated premises), not a
new judgment call. Fixes: 509 was missing
"Glaisdale Street" (existing id 354, already used correctly by twin
record 501 for the identical phrasing) — had only the coarser Glaisdale
link, replaced per the specific-site rule. Edmund Turton (516, landowner,
person 6750) — text says "Edmund Turton esquire"; at the time this was
captured as occupation "esquire" (then believed to be the corpus's
established convention). **REVERSED, see the corrected rule below** —
"esquire" was a mistake to keep treating as real information; not
re-added here. Mary Ann Parker (521, person
569) — "of the township of Whitby singlewoman", occupation was missing;
added "singlewoman" (matches how Martha Dixon's identical descriptor was
already correctly captured elsewhere).

**New open question #7, same shape as #6**: fixing 468/480/521 above
surfaced that "singlewoman"/"spinster"/"widow" as a captured occupation is
inconsistently applied corpus-wide, same as the spouse-home-location gap
(#6) — a corpus-wide text search for these three words hits **234
records**, far more than can be read one at a time as a special detour.
Same resolution as #6: apply going forward when encountered in the normal
sequential read-through, don't blanket-sweep by regex (attribution to the
right person isn't always as mechanical as the highway-township case),
and don't retroactively re-open already-passed records for this alone.

**Progress update: reviewed through id 491.** Fixes: 470 and 478 were
both missing their stated township alongside a two-endpoint cross-parish
highway ("Whitby & Stainsacre highway"/"Whitby and Guisborough highway")
— added Hawsker-cum-Stainsacre (87) and Aislaby (1) respectively; this is
the exact same rule already applied at records 128/130 (Aislaby +
Whitby & Guisborough), just two more recurrences the earlier pass hadn't
reached yet. Also: "spinster" wasn't in the occupation table at all (only
"singlewoman"/"widow" existed as marital-status "occupations") despite
being explicitly stated in the text for two people in this range (Jane
Thompson, victim in 468; Esther Thompson, co-defendant in 480) — added
"spinster" as occupation id 406, linked to both. Continuing the new
spouse-home-location pattern from #6 going forward: Adam Lee (475, spouse
of offender Catherine Lee) — added home=Whitby (occupation "hawker" was
already correctly captured on him).

**Progress update: reviewed through id 467.** Fixed 452 (John Abdallah,
person 10193: added home=Whitby, occupation=labourer, and a second role
'informant' — he swears the oath himself, distinct from his wife Mary the
victim), 456 (John Kelly, person 10194: added home=Whitby,
occupation=labourer, text: "wife of John Kelly of the township of Whitby
labourer" — occupation/home clause modifies the husband, standard
construction in this corpus), 465 (Cuthbert Wray, person 9904: added
home=Whitby; occupation "fruit hawker" was already correctly captured on
him, just home was missing).

**New open question #6, potentially large in scope** — see below. While
fixing the above, discovered this is NOT a one-off: a full-corpus query
(`role IN ('spouse of victim','spouse of offender',...)`  AND
`home_location_id IS NULL`) returns **340 of 341** spouse-stub person rows
missing home_location_id (only record 158's William Hardcastle has it set
— proves it's capturable, not a schema limitation, just inconsistently
applied during the original extraction). Occupation is missing on 36 of
341 too, a smaller gap. This spans the WHOLE corpus, including hundreds of
records already marked "reviewed, zero fixes" earlier in this audit
(examples confirmed missing: 226, 554, 557, 597, 816, 877, 1301 — all well
before id 467). Per the user's explicit "don't parse the text in code, use
your own reading" instruction, this can't be blanket-fixed by a regex
sweep — each one needs its raw_record actually read to confirm the
location really does attach to the spouse (not always guaranteed
unambiguous). Decision needed: (a) apply this newly-recognized pattern
only going FORWARD from id 467, leaving 136-467's instances unfixed for
now (what I'm doing by default, lowest risk / no re-litigating "done"
ground), or (b) go back and re-sweep the whole reviewed range once this
pattern is confirmed. Left unresolved — flagging rather than deciding
unilaterally given the scale (200+ records) this could touch. Fixed a real bug affecting 5
records (415, 421, 427, 1192, 1201 — found via corpus-wide grep for
"Runswick Lane" while reviewing the twin records 421/427, "killing three
hares at night on Runswick Lane"): all 5 had been linked to "Runswick Bay"
(id 169) as location of offence, but the raw text names a specific street
("Runswick Lane"), not the bay — matches the established specific-named-
site rule, not a new judgment call. Created "Runswick Lane" (new id 390,
parent = Runswick id 298), replaced the wrong Runswick Bay link on all 5
records. For 415/421/427 (stated township "Mickleby", whose ancestry
Runswick Lane doesn't reach) also added Mickleby (id 175) alongside per
the existing alongside-vs-replace rule; 1192/1201's stated township
(Hinderwell) is already an ancestor of Runswick Lane, so no additional
link needed there. `PRAGMA foreign_key_check` clean after.

**Progress update: reviewed through id 409.** Records 379-409 required
zero fixes (one more instance of open question #4a at record 390 —
already logged, no new entry needed). One new open question logged, #5
(Barnby/East Barnby/West Barnby inconsistency) — found by cross-checking
record 399 against other "township of Barnby" records elsewhere in the
corpus, not a fix to 399 itself (399 already matches the majority
precedent, left unchanged).

**Progress update: reviewed through id 378.** Records 348-378 also
required zero new fixes (two more instances of open question #4a at
record 360, and #4 "river Esk" at record 373 — both already logged, no
new entries needed).

**Progress update (earlier): reviewed through id 347.** Records 292-347 required
ZERO fixes — every proper name, location, and relationship already
correctly captured (one new open question logged, #4a, see below).
Reassuring cross-check along the way: record 331's "Thomas Walker
apprentice to John Milburn" relationship is the exact same John
Milburn/Thomas Walker pair whose 404 bug was fixed earlier this session
(before this audit started) — confirmed still rendering correctly and
NOT a duplicate-stub case (no other John Milburn on that conviction).

## New watch-item (found during the full-field restart pass, record 31)

- "One of the constables of/for the North Riding" should map to occupation
  "constable of the North Riding" (id 96) or "constable for the North
  Riding" (id 94) — NOT the bare "constable" (id 93), which loses the
  qualifier actually present in the text. Fixed at record 31; watching for
  recurrences during the record-by-record pass (not swept in bulk, since
  distinguishing "constable" that's genuinely bare in the text from
  "constable" that should have been the fuller phrase requires reading
  each one).

## Corrected rule on `person.sex` (id 103, corrected after user feedback)

- Initial read (WRONG, corrected by the user): thought sex was only ever
  set from an explicit pronoun in the text. The user clarified a large
  number of records were manually gendered in an earlier round (i.e. from
  the name itself, not just pronouns) — inferring sex from an
  unambiguously gendered English name (James/John/Thomas/Samuel/Joseph =
  male, Mary/Elizabeth/Ann/Sarah = female, etc.) is expected and correct,
  not fabrication. **Applied retroactively**: fixed 6 people left
  wrongly-null in the 103-127 batch (120-125: James Sharpe, John Barber,
  Thomas Binns, Samuel Holmes, Joseph Spence, John Lindsay — all set to
  male).
- **Standing instruction**: if a name's sex is genuinely ambiguous (a
  unisex name, initials only, no name at all), ASK rather than guess or
  silently leave it blank.

## Corrected rule on "esquire" (resolved with the user via record 351,
"Bailiff Appleton", which is what prompted revisiting it)

- Previous rule (WRONG, corrected by the user): "esquire" was captured as
  an `occupation` whenever stated, on the theory that some status needed
  to be captured. Applied to ~15 people over the course of this session
  (Sir Charles Mark Palmer, Robert Kirby, George Cholmley x2, Edmund
  Turton, Robert Carey Elwes, John Havelock, and others).
- **User's correction**: "esquire" is just an honorific/courtesy title,
  not real information about the person, and should always be ignored —
  not stored as an occupation, not stored as a title, not captured
  anywhere. All 19 existing instances removed (`person_occupation` links
  deleted, the "esquire" occupation row itself deleted so it can't be
  reused). Do NOT re-add this going forward, even though it was the
  documented convention earlier in this same file.

## New rule: title/office-only names, and "licensee" as a real occupation
(resolved with the user via record 351)

- **"Bailiff Appleton"** (record 351) — only "Bailiff" is ever given as
  a name for him, always attached to "the licensed premises of Bailiff
  Appleton." User's read: "Bailiff" is his OFFICE, not a personal given
  name — he has no personal name recorded in the source at all. Fixed:
  `title='Bailiff'`, `first_name=NULL`, `last_name='Appleton'`, sex=male
  (the office was male-held). Generalizes: when a word functions
  grammatically as someone's only "name" but is actually a known office/
  title (bailiff, and presumably others like it — reeve, steward, etc.
  if they ever show up this way), it belongs in `title`, not
  `first_name`, and no personal name should be fabricated.
- **"The licensed premises of X" is evidence X is the licensee** — this
  is now captured as a real `occupation` ("licensee", new id 408), not
  left to the conviction-level `role='licensee'` alone. Corpus-wide
  sweep applied it to all 119 people with `role='licensee'` and no
  occupation captured, plus the 4 who already had "licensed victualler"
  (a distinct trade, not synonymous with holding the licence for this
  specific premises — both facts coexist). Going forward: every new
  `role='licensee'` person should also get occupation "licensee".

## New field: `summary_conviction.anomalies` (added at the user's request)

A free-text column for genuine source-side artifacts — scribal typos,
archival title/description mismatches, impossible dates, dropped digits,
duplicated phrasing — that were previously only noted in this log's
prose. Populated retroactively for the 9 instances already flagged by
that point (records 4, 27, 78, 121, 184, 353, 465, 500, 993). **Going
forward: populate this field whenever a new one is found, in addition
to (not instead of) noting it in the per-batch log entry** — the log
entry explains the reasoning/context for the audit trail, the DB field
makes it queryable/visible directly on the record.

## Established rules this session (see memory files for full reasoning)

- "X town street" → maps to the township X itself, never a new location.
- Truancy convictions ("not sending child to school") → location of
  offence is the offender's own home, not any School Board district
  wording.
- "X and Y highway" (two endpoints) → Highways category (id 106, renamed
  from "Cross-Parish Highways" per the user), added *alongside* any
  stated township (doesn't imply it via ancestry).
- "X highway" (one destination) → the road *toward* X, nests under the
  record's *stated* township, replaces the coarser township link.
- "X and Y railway" → Railways category (id 388, renamed from
  "Cross-Parish Railways"), same treatment as highways but kept
  separate.
- Rivers spanning multiple townships → Rivers category (id 397, renamed
  from "Cross-Parish Rivers"), same treatment again.
- "X and Y footpath" does NOT get the highway treatment. Asked the user
  at record 1157 (the sole existing instance, id 252 "Whitby and Ruswarp
  Footpath", parented under West Cliff) whether to reparent it under
  Highways like the road cases — decided no, footpaths stay
  where they are; the highway/railway convention doesn't generalize to
  them.
- A specific named site (street, beck, inn, workhouse, hall) always gets
  its own location row nested under whatever it's actually inside —
  replaces the coarser link if nesting reaches the stated township,
  added alongside if it doesn't (cross-parish/unrelated branch cases).
- Company/business defendants (e.g. "Holt and Company") → one `person`
  row, `last_name` only, `sex` NULL.
- "Traded under the name of X" → impersonation, not an alias — X gets its
  own person/company row with a role describing the impersonation, never
  folded into the real defendant's `person.alias`.
- Never add a fact (occupation, relationship, hometown) the raw text
  doesn't actually state, even when true from outside knowledge — flag it
  as outside knowledge instead of writing it in.
- Unstated home town: OK to leave/infer home=offence-town when
  occupation/context supports "lived where they worked" AND sibling
  records in the same batch show the scribe stating hometown only when
  it's elsewhere — judged case by case, not automatic.
- Watch multi-defendant "X and Y his wife, and Z and W his wife" records
  for a spouse relationship pointing at a *duplicate stub* person instead
  of the real co-defendant already on the same conviction — repoint and
  delete the stub.

Full reasoning + examples for every rule above: see the memory files
listed in `MEMORY.md` under the project's memory directory (search for
`project_` files matching each bullet).

## OPEN QUESTIONS — unresolved, needs review together

1. ~~Record 177 / title-only landowners~~ — RESOLVED with the user, and
   expanded into a much bigger cleanup (also covers the still-open
   Bailiff Appleton sex question from the same discussion). Summary of
   everything decided and applied:
   - **New `person.office` column** added (alongside `title`). `title`
     is for a prefix attached to a real personal name (Sir, etc.);
     `office` is for a specific position/peerage a person is identified
     by (Marquis of X, N-th Baronet, etc.). **Rule: always record BOTH
     the fullest known personal name AND the fullest known office when
     the user supplies them** — never one at the expense of the other.
     (Caught and corrected my own mistake mid-session: I first left
     Constantine Henry Phipps's name fields blank on the theory the
     user wanted title-only per the source text, and the source text
     alone still doesn't name him — but the user explicitly wants the
     name recorded once supplied, regardless of what the raw record
     itself says. Retrofitted all 17 of his rows.)
   - **"Esquire" — dropped everywhere**, not stored as occupation OR
     title. It's a courtesy honorific, not real information. Removed
     from all 19 people who had it (as occupation, the prior — now
     reversed — convention), deleted the occupation row itself.
   - **"Baronet" — same treatment, "not and never will be an
     occupation."** Removed from the 3 people who had it, deleted the
     occupation row.
   - **"The licensed premises of X" → X gets occupation "licensee"**
     (new occupation id 408), not just the conviction-level
     `role='licensee'`. Swept corpus-wide: 119 people with the role and
     no occupation, plus 4 who already had "licensed victualler" (a
     distinct trade, confirmed to coexist rather than substitute).
   - **Bailiff Appleton** (record 351) — "Bailiff" is his OFFICE (he
     has no personal given name at all in the source, just the surname
     Appleton) — but unlike the peers, HE decided `title` was still the
     right field for it, not `office` (an office attached to a real
     surname reads differently to him than an office replacing an
     entire missing name — noted as his call, not a mechanical rule to
     generalize from). `title='Bailiff'`, `first_name=NULL`,
     `last_name='Appleton'`, sex=male, occupation "licensee" added.
   - **Constantine Henry Phipps** — the Marquis of Normanby (16
     sightings, 1845-1873) and the Earl of Mulgrave (1 sighting, 1833,
     record 544) are the SAME real person at two different stages of
     his peerage (confirmed: all "Marquis" dates are after his 1838
     elevation, the "Earl" date is within his 1831-1838 tenure — no
     anachronism). Consolidated onto one office string across all 17
     rows: `office='1st Marquess of Normanby (Viscount Normanby 1812 -
     1831; Earl of Mulgrave 1831 - 1838)'`, name=`first_name='Constantine',
     middle_name='Henry', last_name='Phipps'`.
   - **Sir John Vanden-Bempde-Johnstone, baronet** (records 2119, 2962)
     — his surname is the whole hyphenated triple-barrel
     "Vanden-Bempde-Johnstone" (was wrongly split with "Vanden Bempde"
     as a middle name) — corrected. `office='2nd Baronet of Hackness
     Hall'`. Home = new location "Hackness" (id 396, under Scarborough)
     — not stated in any record's text, added because the user supplied
     it directly (same standard as the office/name additions above).
   - **Sir George Elliot(t), 1st Baronet** (records 1225, 4236, 4238,
     5215, and a 5th found later — 1553, "land occupied by Sir George
     Elliott" with no trailing "baronet" this time, which is why it
     hadn't matched the original search) — `office='1st Baronet'`,
     "baronet" removed from occupation (see above), sex=male on all 5.
     A 6th "George Elliott" (record 5187, Hinderwell labourer,
     assaulting a constable) is a genuinely different, unrelated person
     — no title, no office, correctly untouched.
   - **Sir Charles Mark Palmer** — checked, needed NO changes. The 3
     records that say "Sir" (2, 3, 4) and the 9 that don't (1350, 1362,
     1365, 3026, 3053, 3068, 3361, 6156, 6158) are both genuinely
     accurate to their own source text — he wasn't yet knighted when
     the earlier convictions happened. Not an inconsistency.
   - **Viscountess/Viscount Downe** (found via a follow-up corpus search
     for other peer titles) — turned out to be TWO different real
     people across the 5 sightings, not one: **Louisa Maria Dawnay,
     Dowager Viscountess Downe (1780-1867)**, widow of the 6th Viscount,
     for the single 1862 sighting (record 3642 — the 8th Viscount would
     only have been ~18 and unmarried by then, so this reads as the
     dowager, not a current wife); and **Hugh Richard Dawnay, 8th
     Viscount Downe (1844-1924)** for all four 1870-1881 sightings
     (records 6029, 4352, 4364, 5743) — he held the title continuously
     across that whole span. Both given full name + full office per the
     rule above.

## Confirmed-pattern fixes applied while working solo (not new judgment
calls — matched an already-established rule from earlier tonight)

- Record 167: same duplicate-stub bug as record 136 — Jane Reed's "wife"
  relationship was pointing at a duplicate stub "John Reed" instead of
  the real defendant (person 175) already on the same conviction.
  Repointed, deleted the stub (had its own now-redundant occupation link
  too, also cleaned up).
- Record 181: same bug again, compounded by a name-parsing bug — Charles
  Alcrow's "apprentice" relationship pointed at a stub literally named
  first_name="Thomas Marwood the", last_name="younger" (the "the
  younger" postfix got merged into first_name instead of being split
  into `name_postfix`), instead of the correctly-parsed real "Thomas
  Marwood" (person 6536, master/shipowner) already on the same
  conviction. Repointed to 6536, deleted the mis-parsed stub. Note: this
  exact mis-parse ("Thomas Marwood the younger" -> first_name="Thomas
  Marwood the", last_name="younger") was ALSO seen as a stub during the
  earlier site-update session (before this audit even started) — this is
  at least the second occurrence, worth watching for as a recurring
  parse bug on "the younger"/"the elder" postfixes specifically on stub
  (relationship-only) person rows.
- Record 168: William Wilkinson (superintendent of police, complainant)
  — text says "William Wilkinson the younger", `name_postfix` was empty.
  Set to "the younger" (same missing-postfix pattern as record 146's
  Thomas Beeforth).
- Record 192: same duplicate-stub bug a THIRD time (Emma Binns' "wife"
  relationship pointed at a duplicate stub Edward Binns instead of the
  real defendant already on the conviction). This bug has now shown up
  at records 136, 167, 192 — no longer a rare one-off, looks systemic
  wherever a record states "assaulting [name] his/her wife" or similar.
  Worth a proper SQL sweep for every occurrence across the whole corpus
  rather than only catching them one at a time during this audit — see
  open question #2 below.

## OPEN QUESTIONS (cont'd)

2. ~~Systemic duplicate-stub sweep~~ — RESOLVED WHILE WORKING SOLO (not
   left open): ran a detection query (every `person_relationship` row
   whose `related_person_id` shares a first+last name with someone
   already `summary_conviction_person`-linked to the SAME conviction as
   the relationship's owner, where the `related_person_id` itself has no
   non-spouse link to that conviction) across the WHOLE corpus, not just
   the range reviewed by hand. Found exactly 12 more beyond the 3 already
   fixed while reading records one at a time (convictions 451, 1367,
   1558, 1761, 1791, 1949, 2086, 2465, 2621, 2822, 2996, 3115 — all
   identical shape: a spouse stub with exactly one `summary_conviction_person`
   row (`role='spouse of ...'`) and exactly one incoming relationship).
   Verified each had no other references before fixing, applied the same
   repoint+delete treatment as the first 3, then re-ran the detection
   query and confirmed zero remain anywhere in the database. Ran
   `PRAGMA foreign_key_check` after — clean. **Flagging this even though
   resolved**, since it was a bigger, more mechanical action than the
   normal one-record-at-a-time judgment calls this file is otherwise for
   — worth a quick look together to confirm the detection logic was
   sound, even though it re-verified itself against its own query.
3. ~~"Case heard in the division of Whitby Strand" phrasing~~ — RESOLVED
   with the user. Confirmed a true one-off: only record 191 in the whole
   corpus uses this phrasing (checked via `raw_record LIKE '%Case heard
   in the division of%' AND NOT LIKE '%case heard at%'`, count=1). User:
   court location is Whitby. Added `court location=Whitby` to record 191.
4a. ~~Workhouse-vs-stated-township conflict~~ — RESOLVED with the user.
   Two distinct real buildings turned out to be involved, both called
   "the Whitby Union workhouse" in the text:
   - **Green Lane** (existing location id 81, already correctly nested
     under East Cliff → Whitby) — this is the building behind records
     324, 330, 360, 390, 444 (all Jan-Mar 1848, stated township Hawsker-
     cum-Stainsacre despite the building's real location in Whitby).
     User confirmed Green Lane genuinely sits in what's known as "the
     Hawsker area of Whitby" — not a conflict, just two true facts about
     the same place. Added location id 81 alongside the stated Hawsker
     township on all 5 records (kept the existing Whitby/Green Lane
     parent as-is, matching the West Cliff/Ruswarp precedent — add
     alongside, don't reparent an already-correct, already-used node).
   - **Stakesby Road** (new location id 399, "Union Workhouse, Stakesby
     Road", nested under Ruswarp) — a SEPARATE building the user
     specifically flagged as different from Green Lane, behind records
     5357 (2 Dec 1882) and three more found by searching for the same
     phrasing (5919, 5921, 5923 — all 12 Nov 1881). Since this site's
     own ancestry (Ruswarp) matches the stated township directly, it
     REPLACES the coarser Ruswarp link on all 4 records rather than
     sitting alongside it (the normal specific-site rule, not the
     alongside exception used for Green Lane/Hawsker).
5. ~~"Township of Barnby" vs "East Barnby"/"West Barnby"~~ — RESOLVED
   with the user. Records 5407 ("George Jackson of **West Barnby in the
   township of Barnby**") and 3952 ("George Jackson of **East Barnby in
   the township of Barnby**") prove the archive itself treats "Barnby"
   as a real parent township, with East/West Barnby as hamlets within
   it — not a naming inconsistency. User confirmed the tree shape:
   Lythe → **Barnby** (new location id 400) → {East Barnby (108), West
   Barnby (269)} (both reparented from Lythe directly to sit under the
   new Barnby node).
   Corpus-wide sweep applied on top of the restructure:
   - 18 `location of offence` links wrongly defaulted to East Barnby
     for records whose own offence clause only says generic "township
     of Barnby" (no hamlet named) → moved to Barnby (400): 187, 399,
     561, 1132, 1240, 2473, 2661, 2852, 3028, 3409, 3413, 3803, 3903,
     4157, 4325, 4327, 4368, 5755.
   - The two long-held-back highway records (1068, 3784 — "Whitby and
     Guisborough highway" / "Lythe and Barnby highway", generic
     "township of Barnby", no Barnby-level link at all previously) —
     added Barnby (400) alongside their highway link, same as every
     other 2-endpoint highway case.
   - Truancy/silent-offence-clause records resolved per the existing
     home-as-offence-location rule, using whichever specificity the
     text actually gives for each person's own home: 3560 (home only
     "township of Barnby", generic) → Barnby (400); 3952 (home "East
     Barnby in the township of Barnby", specific) → East Barnby (108);
     5407 (home "West Barnby...", specific) → West Barnby (269); 1205
     (home "Tofts Farm in the township of Barnby" — existing location
     109, reparented from Lythe to sit under the new Barnby node) →
     Tofts Farm (109) added as the offence location too (no offence
     clause stated at all, silence-as-local rule).
   - `person.home_location_id`: 21 more people (across both defendant
     and secondary roles — informants, landowners, victims) had been
     defaulted to East Barnby despite their own text only saying
     generic "township of Barnby" — corrected to Barnby (400). Verified
     with a final corpus-wide check that zero people remain linked to
     East Barnby or West Barnby whose own text doesn't literally name
     that specific hamlet.
   - Found one more instance via a phrasing variant search ("parish of
     Barnby" instead of "township of Barnby"): record 2368, fixed the
     same way (East Barnby → Barnby generic).
   - Checked for false positives: "Barnby Sleights" (location id 262,
     under Sleights, record 6134) is a genuinely separate, unrelated
     place near Sleights — confirmed already correctly distinct from
     the Barnby-near-Lythe family, not touched.
   - Noted in passing, not acted on: 3560/3952/5407 are three separate
     George Jackson person rows (correctly unmerged per the
     no-cross-conviction-merge policy) but all three convictions are
     "not sending his son Joseph Jackson to school" — very likely the
     same real father prosecuted three separate times. Logged to
     `same-person-candidates.md`.
4. ~~"The river Esk"~~ — RESOLVED with the user (analogous to Esk
   Valley — a real cross-parish geographic feature, not tied to one
   township). Created "Cross-Parish Rivers" (id 397, parent North
   Riding) matching the existing Cross-Parish Highways/Railways
   pattern, with "River Esk" (id 398) as its child. Added alongside the
   already-correct stated township on all 20 corpus mentions (168, 171,
   268, 373, 474, 603, 1502, 1526, 1544, 1674, 2394, 2438, 4430, 4553,
   4572, 4602, 4604, 4634, 5674, 5676) — every one already had a proper
   township as `location of offence`, so this was a pure addition, no
   replacement needed anywhere.
   Later (record 1227): found "the Mirk Esk", a real tributary of the
   Esk, entirely uncaptured. Created "Mirk Esk" (id 403) as a child of
   River Esk (398) rather than a sibling, since it's specifically a
   tributary — first new addition under the renamed Rivers category.

## Fixes applied so far (by record id, brief)

- 1: Sir Charles Mark Palmer — title='Sir' added (3 person rows).
- 6: added Whitby & Ruswarp Highway (new) as 2nd location of offence.
- 9, 23, 24: truancy rule — offence location corrected to offender's home.
- 11, 12: added Whitby & Robin Hood's Bay Highway alongside township.
- 13: new "Staithes Lane End" location, replaces coarser Staithes link.
- 17, 18, 19: new "Hinderwell & Ellerby Highway", added alongside township.
- 20: added Ruswarp alongside Stakesby Vale (specific site doesn't imply it).
- 25: new "Normanby Highway" under Fylingdales, replaces coarser link.
- 29: new "Whitby & Aislaby Highway", added alongside Ruswarp.
- 34, 35: new "Staithes Beck", replaces coarser Hinderwell link.
- 41: new "Stonegate Beck" (replaces Glaisdale link); new "Tiger Inn" home.
- 42: Stonegate Beck link too; new "Lealholm Hall" home.
- 43, 44: new "Fryup Beck", replaces coarser Danby link.
- 46: added Whitby and Ruswarp Footpath (existing id 252) alongside Ruswarp.
- 60: added Ruswarp alongside Skinner Street (doesn't imply it).
- 67: truancy rule — offence location corrected to Baxtergate (her home).
- 68: truancy rule — offence location corrected to Hospital Yard (his home).
- 69, 70: new "Union Workhouse" link (existing id 81), replaces Whitby.
- 77, 79: truancy rule — offence location corrected to Timber Hill (home).
- 82: added Whitby & Robin Hood's Bay Highway (existing) alongside Fylingdales.
- 84: added Ruswarp alongside Upgang Lane (doesn't imply it).
- 104: reviewed, left as-is (see memory: unstated home town inference).
- 128, 130: added Aislaby alongside Whitby & Guisborough Highway.
- 129: added Whitby (offence-location role) alongside Whitby & Hawsker Highway.
- 134: new "King's Head Inn" (replaces Church Street); added "John Spark
  and Co" as a new company person row, role='company impersonated'.
- 136: fixed duplicate-stub bug — repointed Margaret Robinson's and Mary
  Grotes's "wife" relationships to the real co-defendant rows (136, 138),
  deleted the two duplicate stub person rows (were 9896, 9897).
- 146: name_postfix='the younger' added for Thomas Beeforth.
- 141, 146: new "Cross-Parish Railways" category (388) + "Whitby &
  Pickering Railway" (389), added alongside township.
- 415, 421, 427, 1192, 1201: new "Runswick Lane" (390, under Runswick
  298), replaces wrong "Runswick Bay" link; 415/421/427 also gained
  Mickleby (175) alongside since Runswick Lane doesn't nest under it.
- 452: John Abdallah — home=Whitby, occupation=labourer, +informant role.
- 456: John Kelly — home=Whitby, occupation=labourer.
- 465: Cuthbert Wray — home=Whitby (occupation already correct).
- 470: added Hawsker-cum-Stainsacre (87) alongside the two-endpoint
  "Whitby & Stainsacre highway" link (same rule as 128/130).
- 478: added Aislaby (1) alongside "Whitby & Guisborough highway" link.
- 468, 480: new occupation "spinster" (406), linked to Jane Thompson and
  Esther Thompson (previously uncaptured despite being stated).
- 475: Adam Lee — home=Whitby.
- Corpus-wide sweep: 75 records fixed for the two-endpoint cross-parish
  highway "missing alongside township" gap (full list in the log above,
  ids 510 through 5105) — 2 left correctly bare (3042/3045, no stated
  township at all), 2 held back (1068, 3784 — open question #5, Barnby).
- 509: added Glaisdale Street (354), replacing coarser Glaisdale link.
- 516: Edmund Turton — added occupation "esquire".
- 521: Mary Ann Parker — added occupation "singlewoman".

All other records reviewed in this range (a large majority) were already
correct as extracted — no change needed.

## Resolved: Spring Hill / North Terrace parented under Whitby despite
## "township of Ruswarp" wording (records 1901-1905 batch, decided with user)

Both "Spring Hill" (location 97) and "North Terrace" (location 218) sit
under West Cliff -> Whitby in the location tree, but nearly every record
that references them (9/9 Spring Hill, 7/8 North Terrace) states "the
township of Ruswarp" as the offence location — only one outlier (2324)
says Whitby. Raised with the user rather than guessed (a re-parenting
call, not a routine link fix). Decision: **leave the tree as-is** — the
user has a separate explainer doc (`explorer/scripts/places-taxonomy-v2.txt`)
establishing that the location tree favours modern/mappable street
geography for the explorer's map feature over literal historical
administrative-township wording; Spring Hill and North Terrace are real
present-day Whitby/West Cliff streets, and Ruswarp is immediately
adjacent, so the "township of Ruswarp" phrasing is read as a genuine
historical administrative-boundary quirk, not evidence the street
belongs in the Ruswarp branch. Both links (coarser township + specific
street) are correctly kept side-by-side for these two streets specifically
— this is a deliberate exception to the general "specific site replaces
coarser township link" convention, not a bug to fix. No DB changes made.

## Corpus-wide fix: Green Lane missing Hawsker-cum-Stainsacre township link
## (found during records 1941-1945 batch)

Green Lane (location 79) is parented under East Cliff -> Whitby, same
shape as the Spring Hill / North Terrace exception above — but unlike
that case, here the coarser township link was simply MISSING (not a
parenting question): 6 of 8 records referencing Green Lane state "the
township of Hawsker cum Stainsacre" as the offence location, with no
Hawsker link at all. Ran a corpus-wide check and added Hawsker-cum-
Stainsacre (87) as an alongside "location of offence" link to all 6
(1942, 2443, 2458, 4444, 4446, 5941), following the same treatment
already applied to Spring Hill/North Terrace/Bagdale/Whitby Railway
Station. Left alone: 3955, the one Green Lane record that explicitly
states "the township of Whitby" and matches the tree as-is.

## INCIDENT: re-fabricated the already-resolved title/occupation mistake
## (records 2119, 2233, 2236 — caught by the user, reverted)

During the "next 1200" batch stretch, hit Constantine Henry Phipps
(Marquis of Normanby, records 2128/2233/2236) and Sir John
Vanden-Bempde-Johnstone (record 2119) with a person-lookup query that
did not select `office`. Seeing `title=NULL` on rows that were actually
already fully correct via `office`, fabricated `title='Marquis'` (3
rows) and a brand-new occupation `'baronet'` (1 row) — inventing values
that appear nowhere else in the corpus, duplicating the exact
esquire/baronet-as-occupation mistake already resolved with the user
earlier in this same audit (see the "OPEN QUESTIONS #1" section above).
Logged both as confident "FIXED" entries in full-audit-log-2.md at the
time.

User caught it and asked for a postmortem. Verified via direct query
that `office` had held the correct, already-user-confirmed data the
whole time (17/17 Phipps rows, both Johnstone rows) — nothing was
actually lost, only wrong noise added on top. Reverted: title set back
to NULL on all 3 Phipps rows, the fabricated "baronet" occupation link
and the occupation row itself deleted. Corrected the full-audit-log-2.md
entries for 2119/2233/2236 to describe what actually happened rather
than leaving the false "FIXED" narrative in place.

Root cause: (1) the standard person-lookup query used all session never
selected `office`, so the field was invisible throughout, not
overwritten; (2) never actually read this file's own already-documented
rule for this exact scenario, despite citing this file by name in the
log header of every batch; (3) no check for "have I already reasoned
about this exact recurring person earlier in this session" before
writing a schema-categorical field (title/office/occupation/
name_postfix) — a discipline already applied reflexively to `sex` but
not extended to these fields. Full writeup: memory file
`feedback_check_precedent_before_categorical_fields`.

Going forward: `office` is now part of the standard person query
template for this audit. No other titled/notable individuals were
encountered in the affected stretch (checked against the Downe/Elliott/
Palmer names already resolved above), so the damage is scoped to
exactly these 3 rows, now clean.

**Resolved** (was open at record 184, restart #2 pass): new location
node 415, "Butchers Arms (near the Fish Market)", created for John
Gardner's 1818 handbill-licensing conviction. User confirmed: Butchers
Arms is on Church Street, near Market Place (both under East Cliff).
Reparented from Whitby (4) to Church Street (26); `notes_private` flag
cleared.

**TRACKED, ONGOING (found at record 275, restart #2 pass)**: corpus-wide
gap where a person's own text states "singlewoman", "spinster", or
"widow" but the occupation was never linked in `person_occupation`.
Confirmed via direct query, ~215 affected records (spans the whole
corpus, id range roughly 142-5563). Already fixed as encountered: 142
(Dorothy/Jane Harrison -- role "unspecified" not this pattern exactly,
already handled separately), 158, 193, 226 (already had occupation,
not affected), 246, 275. User's explicit decision: do NOT batch-fix the
remaining ~210 -- fix each one only when the sequential one-record-at-
a-time audit naturally reaches it. This note exists so a future session
resuming the audit knows this is a known, already-diagnosed pattern,
not a fresh discovery each time it's hit -- check the exact record's
own wording (singlewoman/spinster/widow) rather than assuming, and
verify with a dedicated `person_occupation` query per person_id rather
than trusting a wide join, since that's exactly how record 193 was
missed the first time. Remaining known ids (not exhaustive, re-verify
each against its own text when reached): 439, 480, 547,
552, 577, 597, 626, 678, 743, 822, 824, 848, 932, 953, 997, 1015, 1097,
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
5304, 5342, 5356 (and others, this list was captured at record 275 and
may not be exhaustive for ids beyond that point in the corpus).

**TRACKED, ONGOING (found at record 330, restart #2 pass)**: corpus-
wide crime_type taxonomy fragmentation -- the identical offence text
("wilfully destroying his own clothes whilst being relieved in the
Whitby Union workhouse", various minor wordings) was split across two
existing leaves: `malicious/property damage` (id 60, category 4
"property offences") and `workhouse offence` (id 47, category 8 "poor
law & family maintenance"). User's decision: neither existing leaf is
correct -- create a dedicated new leaf instead. Created id 73
"destroying own clothes" under category 8 (alongside sibling leaves
"refusing workhouse labour" id 31 and "workhouse offence" id 47).
Same "fix only as reached in sequence" policy as the marital-status
gap above: record 330 itself retagged to 73; the remaining 54 are left
as-is until the linear audit naturally reaches them. Full remaining id
list (retag each to crime_type 73 when reached, verify the record's
own text matches this exact offence pattern first):

Currently tagged `malicious/property damage` (38 ids, 360/390 fixed): 987,
990, 1482, 1531, 1815, 1880, 1975, 1978, 1981, 2064, 2088, 2277, 2283,
2286, 4130, 4220, 4262, 4264, 4324, 4375, 4377, 4589, 4683, 5153, 5353,
5355, 5913, 5915, 5917, 5927, 5929, 5931, 5933, 6018, 6020, 6042, 6089,
6126.

Currently tagged `workhouse offence` (14 ids): 69, 70, 2124, 2799,
3264, 3446, 3515, 3528, 3657, 3666, 3668, 3673, 3682, 3856.
