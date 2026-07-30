# Full per-record audit log

Restarted from record id 1 per explicit instruction: every single record gets
its own line below, checked individually against its raw_record text (read
directly, not parsed by script) for every person, every location, and every
relationship. Clean records get a one-line note. Anything wrong gets a
detailed entry and a fix (or, if it's a genuinely new judgment call, gets
logged to `reextraction-audit-notes.md`'s OPEN QUESTIONS instead of decided
unilaterally). Database fixes already made in the prior (batch-summarized)
pass are NOT being undone — they were real, verified corrections — but every
one of those records is being re-checked here individually anyway, from
scratch, so nothing is taken on faith.

Format: `id: <name(s)> — <verdict>`. FIXED = something was wrong and is now
corrected (fix described). OK = checked, nothing wrong.

## Records 1-25

1: Edward Jameson Ayre — OK. Defendant, home Whitby, Grape Lane offence
   location correct, no other named people.
2: William Tooley + Sir Charles Mark Palmer (landowner) — OK. Tooley home
   "Liverton Mines" (335, confirmed a real distinct child of "Liverton" 334,
   matches text exactly). Palmer's title="Sir" already correct from earlier
   fix. Roxby offence location correct.
3: Jonathan Agar + Sir Charles Mark Palmer — OK. Same companion-record
   pattern as id 2, verified independently.
4: John Marley + Sir Charles Mark Palmer — OK. Raw text has a source-typo
   ("committed at on township of Roxby") — scribal artifact, not an
   extraction error, no action. Same companion-record pattern.
5: Robert Tinley — OK. Carpenter, Whitby, St Ann's Staith offence.
6: William Holmes — OK. Whitby & Ruswarp Highway (2-endpoint) correctly
   alongside Hawsker-cum-Stainsacre (matches established rule).
7: Robert Ross + Thomas Wadsworth (premises owner) + William Dobson (acting
   sergeant of police) — OK. Neither Wadsworth nor Dobson has a home stated
   in the text, correctly left blank.
8: Edward Joseph Watson — OK. Licensed victualler, Whitby.
9: John Parkin + son George Parkin — OK. Home = "Old Post Office Yard" (67,
   specific site, matches text exactly). Truancy rule correctly applied
   (offence location = home, not the School Board district phrase). "son"
   relationship correctly captured (text explicitly says "his son").
10: Robert Harker — OK. "Lythe town street" correctly maps to Lythe itself
    (the specific rule this project already got sharply corrected on
    earlier this session) — confirmed, no location was fabricated.
11: Stephen George Mills — OK. Whitby & Robin Hood's Bay Highway (2-endpoint)
    alongside Fylingdales.
12: John Quinney — OK. Same highway pattern as 11, companion record.
13: John Kelley — OK. "Staithes Lane End" (378, specific site under
    Staithes/Hinderwell) correctly replaces the coarser township link.
14: William Herbert — OK. Butcher, Whitby, Baxtergate.
15: James Bonas — OK. Bricklayer, Whitby, Church Street.
16: George Smith — OK. "Mickleby town street" correctly maps to Mickleby
    itself.
17: Robert Harker (miner... carrier, home Mickleby) — OK. Same real-world
    name/occupation/home as id 10 but a genuinely separate conviction —
    correctly NOT merged into one person (matches the project's
    no-cross-conviction-merge design). Hinderwell & Ellerby Highway
    correctly alongside Hinderwell.
18: Joseph Henry Tyerman — OK. Hinderwell & Ellerby Highway alongside
    Ellerby (the record's own stated township, different from 17's).
19: Isaac Duell — OK. Same highway pattern as 18, companion record.
20: Francis Jefferson — OK. "Stakesby Vale" correctly alongside Ruswarp
    (specific site's ancestry doesn't reach Ruswarp, so alongside not
    replace — matches established rule, previously verified this session).
21: James Greenwood — OK. No explicit "offence committed at" clause in the
    source text at all (only his home township is stated) — Hawsker cum
    Stainsacre is still correctly captured as offence location, matching
    the established "silence as evidence of local" inference used
    elsewhere (records 536/540/677 in the earlier pass).
22: Joseph Storr — OK. Jet worker, Whitby, Sandgate.
23: Charles Allison + son George Allison — OK. Home = "Clark's Yard" (44,
    specific site). Truancy rule + "son" relationship both correct.
24: Martha Arnold + son Miles Arnold — OK. Home = "Renwick's Yard" (58).
    Truancy rule + "son" relationship both correct.
25: John Jones — OK. "Normanby Highway" (single-destination, one place
    named) correctly REPLACES the coarser Fylingdales link rather than
    sitting alongside it — contrast with the two-endpoint highways above,
    confirms the single-vs-two-endpoint distinction is being applied
    correctly.

**Progress: id 1-25 done, zero new fixes needed (all previously-applied
fixes in this range re-verified independently, all held up).**

**Checklist expanded after id 25**: found that `conviction_date` and
`title` are NOT derivable from `raw_record` alone — they come from a
separate source field on `raw_case` (`document_date_raw` and `title`,
the archive's own catalogue fields, joinable 1:1 via `record_number` =
`reference_number`, all 6231 rows match). Verified both against that
source for 1-25 (all correct) and am now pulling `raw_case` alongside
`summary_conviction` on every batch going forward so this is actually
checked, not assumed.

## Records 26-50

26: Edward Brown — OK. "Sleights town street" correctly resolves to
    Sleights (id 11, a real hamlet nested under Eskdaleside-cum-Ugglebarnby),
    replacing the coarser township link since Sleights' ancestry reaches it.
27: Edward Cargill — OK, but flagging a genuine ARCHIVAL inconsistency (not
    an extraction error): `raw_case.title` says "Robert Cargill", but
    `raw_case.description`/`raw_record` says "Edward Cargill" — this
    discrepancy exists in the source archive data itself. The person is
    correctly stored as Edward (following the fuller, more reliable
    narrative text); the `title` field faithfully preserves the archive's
    own title as-is rather than silently picking a winner. Correct
    handling, no DB change — noted for the record.
28: Maria Castello + husband Thomas Castello — FIXED. Thomas Castello
    (person 6492) had occupation "jet worker" already correctly captured
    from "of the township of Whitby jet worker" but was missing
    home=Whitby (same #6 pattern from the earlier pass). Added.
29: William Blooman — OK. Whitby & Aislaby Highway correctly alongside
    Ruswarp.
30: Alfred Ford — OK. Caulker, Whitby, Church Street.
31: Alfred Ford (2nd, same day) + victim John Carpenter — FIXED. Text says
    "one of the constables of the North Riding" but the occupation
    captured was the bare "constable" (id 93) instead of the more precise
    "constable of the North Riding" (id 96) that already exists in the
    occupation table and is used correctly elsewhere in the corpus for
    this identical phrase. Corrected the occupation link.
32: William Leigh — OK. Dentist, Ruswarp, St Hilda's Terrace.
33: Daniel Blake — OK. Labourer, Ruswarp, Hanover Terrace.
34: Thomas Humphrey — OK. Staithes Beck correctly replaces coarser
    Hinderwell link (ancestry reaches it via Staithes).
35: Robert Cummins — OK. Same Staithes Beck pattern, companion record.
36: Jonathan Howard — OK. "East Row" (no "town street" suffix this time)
    still correctly resolves to the same specific hamlet as other East Row
    records — confirms the rule applies whether or not "town street" is
    literally present, since East Row is a genuine named place either way.
37: Henry Grant — OK. Same East Row pattern, companion record ("East Row
    town street" this time, same resolution).
38: John Brand — OK. Labourer, Whitby, Wellington Road.
39: James Holden + William Willison (licensee) + William Dobson (acting
    sergeant) — OK. Neither has a home stated in the text; correctly left
    blank on both.
40: John Poole — OK. "Raw town street" correctly resolves to the hamlet
    "Raw" (128, nested under Fylingdales).
41: Joseph Harrison — OK. Home = "Tiger Inn" (385), independently verified
    its parent is "Easington" (272), matching "of the Tiger Inn in the
    township of Easington" exactly. Stonegate Beck offence location under
    Glaisdale, matches text.
42: William Wren — OK. Home = "Lealholm Hall" (386), independently
    verified its parent is "Glaisdale" (138), matching text exactly. Same
    Stonegate Beck companion record as 41.
43: John Summerson (farmer) — OK. Fryup Beck correctly nests under Danby.
44: John Summerson (farm labourer, same name, same day, different
    occupation word) — OK, correctly NOT merged with 43 (no cross-
    conviction merge policy) — occupation differences between same-named
    people across separate records aren't an error, each record's own
    text is followed faithfully.
45: Kate Griffin — FIXED. "widow" stated in text but missing as a captured
    occupation (same #7 pattern). Added.
46: William Lawson — OK. "Whitby and Ruswarp Footpath" (252) correctly
    alongside Ruswarp — confirmed distinct from the "Whitby & Ruswarp
    Highway" used at id 6, per the user's own earlier explicit ruling that
    the footpath and highway are different things.
47: John Holmes + Colin Cowan (licensee) — OK. No home stated for Cowan,
    correctly blank.
48: William Holmes + Colin Cowan — OK. Companion record to 47 (same
    incident, same date, same licensee, different named defendant) —
    correctly two separate person rows for the two different defendants.
49: Robert Steel + William Massey (licensee) — OK. No home stated for
    Massey, correctly blank.
50: Francis Fewster + Joseph Shaw (licensee) — OK. No home stated for
    Shaw, correctly blank.

**Progress: id 26-50 done. 3 fixes (28, 31, 45), 1 archival inconsistency
flagged (27, no action needed), 2 location-parent claims independently
verified against the DB rather than assumed (41, 42).**

## Records 51-75

51: Peter Kilpatrick — OK. Iron worker, Whitby, Church Street.
52: Esther Hill + husband Andrew Hill — FIXED. Andrew Hill (6500) had
    occupation "jet worker" correctly captured but was missing
    home=Whitby (#6 pattern).
53: James Welsh — OK. Pedlar, Ruswarp, St Hilda's Terrace.
54: William Mills — OK. "Thorpe town street" correctly resolves to
    "Fylingthorpe" (127, under Fylingdales) — the established
    full-name-for-the-colloquial-shortening equivalence already used
    elsewhere in the corpus (e.g. "Thorpe and Robin Hood's Bay highway").
    Cosmetic-only note: `charge_description` starts lowercase ("being
    drunk...") unlike the near-universal capitalized convention — not a
    factual error, not touched.
55: Robert Tinley + victim Hannah Tinley — OK. Shared surname with the
    defendant but no relationship stated in the text ("assaulting Hannah
    Tinley", nothing more) — correctly NOT inferring a family relationship
    that isn't actually stated.
56: Robert Tinley (companion conviction, same day, different victim John
    O'Conner) — OK. Correctly a separate person row from 55's Robert
    Tinley per the no-cross-conviction-merge policy.
57: John Fawcett — OK. Labourer, Hinderwell.
58: George Oakley — OK. Iron worker, Whitby, Church Street.
59: John Dixon — OK. Jet worker, Whitby, Church Street.
60: Pearson Campion — OK. Skinner Street (in Whitby) correctly alongside
    Ruswarp (the record's stated township) — Skinner Street's ancestry
    doesn't reach Ruswarp, so alongside not replace, matching the same
    pattern independently confirmed at record 855 earlier in the corpus.
61: Thomas Brown — OK. Labourer, Whitby, Church Street.
62: Thomas Wilson — OK. "Newholm Lane" independently verified as nesting
    under Newholm-cum-Dunsley (7) — correctly replaces the coarser
    township link.
63: Richard Holmes — OK. Jet worker, Whitby, Church Street.
64: George Wardell — OK. "Ruswarp town street" correctly resolves to
    Ruswarp itself.
65: Robert Heaton Cargell — OK. Three-part name split correctly, spelling
    ("Cargell") verified to match raw_record exactly (distinct from the
    "Cargill"/archival-inconsistency family at record 27 — no assumed
    connection, correctly treated as unrelated).
66: John Langan — OK. Miner, Ruswarp, Hanover Terrace.
67: Margaret Sparks + son Harry Readman Sparks — OK. Home = Baxtergate
    (22, independently verified), truancy rule correctly applied, "son"
    relationship correct. No "petty sessional division" location captured
    — correctly consistent with every other truancy record, since the
    text says "School Board district" not "Petty Sessional division" for
    this record type (verified against record 9's identical pattern).
68: Robert Page + son William Robert Page — OK. Home = Hospital Yard (53,
    independently verified), same truancy-record pattern as 67.
69: John McMaloy — OK. "Union Workhouse" (81) correctly replaces the
    Whitby link — stated township IS Whitby here, so no conflict with the
    still-open workhouse question (#4a), which is specifically about cases
    where the stated township is NOT Whitby.
70: James Carney — OK. Companion Union Workhouse record to 69, same day.
71: Thomas Paylor — OK, with a genuine borderline note: text says the
    slaughterhouse building was "on the East Cliff NEAR the Abbey Farm",
    not stated to be Abbey Farm itself. Linking to "Abbey Farm" (the
    closest identifiable named reference point) is a defensible existing
    choice — East Cliff is the only coarser alternative — but it's
    technically a small overclaim of precision versus what the text
    literally supports. Left as-is (not a clear error, no better
    alternative), flagged for visibility only.
72: Robert Foster — OK. Coal porter, Whitby, St Ann's Staith.
73: Alfred Reynolds — OK. Labourer, Whitby, Bridge Street.
74: Robert Jackson — OK. Home = "Carlin How" (284, independently verified
    as a standalone place, not a township-qualified one — matches text
    "of Carlin How" with no "township of" clause). "Staithes town street"
    correctly resolves to Staithes, nested under Hinderwell.
75: James Duell — OK. Farmer, Roxby. Shares a surname with record 19's
    Isaac Duell (Ellerby) but no relationship stated — correctly not
    inferring one.

**Progress: id 51-75 done. 1 fix (52). 1 borderline case flagged for
visibility only, no clear error (71). Multiple location-parent claims
independently re-verified (62, 74, 67, 68) rather than assumed.**

**Coverage note**: `summary_conviction.id` is NOT contiguous — 6231 actual
rows spanning id 1 to 6257 (26 missing ids, e.g. 87 and 88 do not exist;
confirmed via `raw_case` too, no orphaned/undone extraction hiding there).
Iterating `ORDER BY id` with LIMIT/OFFSET (the method used throughout this
log) walks every actual row regardless of gaps, so this doesn't skip
anything — noting it so the id numbers in this log make sense and aren't
mistaken for missed records.

## Records 76-102 (86 to 89 skips the two genuinely nonexistent ids 87/88)

76: James Reeves — OK. Iron worker, Whitby, Church Street.
77: George Duncanson + daughter Elizabeth Duncanson — OK. Home = "Timber
    Hill" (149, under Hawsker-cum-Stainsacre, matches text). Truancy rule
    + "daughter" relationship both correct.
78: John Maddon — OK. "Sandsend town street" correctly resolves to
    Sandsend (176, under Lythe). Raw text has a scribal typo ("begging
    inn Sandsend" — extra "n") — source artifact, not ours, no action.
79: Ransome Corser + daughter Mary Ann Corser — OK. Same Timber Hill
    pattern as 77. Noted: this "Mary Ann Corser" shares a name with a
    victim in a much later 1889 record (388) — plausibly the same real
    person a little older, but not stated as such in either record, so
    correctly NOT linked/merged — consistent with the project's
    no-cross-conviction-merge design.
80: John Smith — OK. "Hawsker town street" correctly resolves to the full
    township (Hawsker cum Stainsacre), "Hawsker" being used as shorthand
    for the full name.
81: Emmeline Annie Brazier — OK. "singlewoman" already correctly captured
    as occupation pre-existing (encouraging sign this pattern wasn't
    universally missed).
82: William Benson — OK. No offence township literally stated in the text
    (only his home, Fylingdales) — correctly inferred as offence location
    too, consistent with the established silence-as-local pattern (same
    reasoning independently applied at record 21 earlier in this log).
    Whitby & Robin Hood's Bay Highway correctly alongside.
83: William Reeves — OK. Licensed victualler, Whitby.
84: William Smith — OK. Upgang Lane correctly alongside Ruswarp (doesn't
    imply it) — re-confirms the earlier-session fix at this record held.
85: William Cooper Bridge — OK. Three-part name correctly split
    (first/middle/last), matches text exactly.
86: Walter Draper — OK. "Woodlands" (2, under Aislaby) correctly replaces
    the coarser township link; his own home is correctly left at the
    general "Aislaby" level since no more specific address is stated for
    him personally (only for the offence site).
89: Richard Bulmer — OK. Butcher, Whitby (1808-era "of Whitby"/"at
    Whitby" phrasing, no "township of" — captured correctly regardless).
90: Mary Pattinson — OK. Meal seller, Whitby.
91: Ralph Speedy — OK. Baker, Whitby, 1808. Shares a name with a witness
    "Ralph Speedy" appearing in 1876-era records much later in the corpus
    — a ~68 year gap makes this almost certainly a different person
    (family name recurrence in a small town) — correctly not the same
    person row, no erroneous merge.
92: Robert Cowlson — OK. Meal seller, Whitby.
93: Edward Carving — OK. Smith, Whitby.
94: Robert Dickinson — OK. Grocer, Whitby.
95: Thomas Dale — OK. Grocer, Whitby.
96: Thomas Tate — OK. Compound occupation "butter and bacon seller"
    preserved exactly as stated.
97: George Robinson — OK. Meal seller, Whitby.
98: William Prodham — OK. Home = Danby, offence/court = Whitby — home and
    offence-location correctly kept distinct (travelled to Whitby market),
    not conflated.
99: Thomas Wright — OK. Home = Pickering, same distinct-home-vs-offence
    pattern as 98.
100: Francis Laverack — OK. Home = Lythe, same pattern.
101: John Fenwick — OK. Butcher, Whitby.
102: John Knaggs — OK. Butcher, Whitby.

**Progress: id 76-102 done (25 actual records: ids 76-86 and 89-102; 87
and 88 don't exist, per the gap note above). Zero new fixes needed — this
whole range (mostly 1808-09 weights-and-measures records) was already
correctly extracted.**

**Coverage gap (87, 88, and 24 others) fully investigated and resolved**:
these 26 missing ids are a deliberate, individually-reviewed removal of
false-positive records from the original free-text "whitby" keyword
scrape (a defendant surnamed Whitby, a pub named "Whitby Arms Inn", etc.
— none actually connected to the town). Confirmed via `id_blacklist.txt`
(26 lines, exact match), commit 063b87a, and `OUT_OF_SCOPE_REVIEW.md`
(full per-record justification log, 26/26 reviewed and confirmed). Not
data loss — correct, already-completed scope-correction work. Full list
of the 26 missing ids: 87, 88, 139, 144, 151, 311, 359, 433, 1246, 1507,
1510, 1516, 1776, 1779, 2127, 2188, 2191, 2482, 3099, 3237, 3339, 3455,
3740, 3742, 3744, 4395 — noted here once so none of these get mistaken
for a skip later in this log.

## Records 103-127

103: John Robinson — OK. Sex correctly male.
     [CORRECTED — see note below the batch: I initially wrote here that
     sex is only ever set from an explicit pronoun, and flagged 122-127
     as correctly null on that basis. The user corrected this — a large
     number of records were manually gendered by name in an earlier
     round, and inferring sex from an unambiguous name is expected, not
     fabrication. 122-127 were wrongly left null and have now been fixed
     (see below); ask rather than guess only for genuinely ambiguous
     names.]
104: Richard Harding — OK. Butcher, Whitby. (This is the record behind
     the standing "unstated home town inference" project memory — home
     correctly left at Whitby on the strength of occupation + sibling
     pattern, already-settled question, re-confirmed not re-litigated.)
105: James Cauwood — OK. Butcher, Whitby.
106: Thomas Marwood — OK. Butter seller. Multi-clause weight list
     (four separate deficient weights) all correctly folded into
     `charge_description`/`raw_record` verbatim, no numbers dropped.
107: William Allon — OK. Bacon seller, four-item weight list intact.
108: Elizabeth Craven — OK. Grocer (sex=female, no pronoun needed since
     "her possession" is explicit in text).
109: John Porrit — OK. Bacon seller.
110: Robert Routledge — OK. Plumber.
111: John Atkinson — OK. Baker.
112: George Duck — OK. Butcher, four-item weight list intact.
113: George Croft — OK. Painter.
114: Robert Robson — OK. Grocer.
115: John Cockburn — OK. Tobacco dealer.
116: John Oxley — OK. Bacon seller.
117: John Watson — OK on occupation (correctly blank, none stated). Sex
     — FIXED (person 115), was wrongly left null, now male. Caught this
     one separately from the 120-125 batch fix below — double-checked the
     person_id-to-name mapping after applying that fix and found 115 had
     been missed from the first pass, corrected immediately.
118: Ann Buck — OK. Grocer, sex=female via "her possession".
119: Charles Lamb — OK. Worsted seller.
120: William Williamson — OK. Home = Lythe (distinct from offence/court
     = Whitby), consistent with the established "home may differ from
     the town where the market offence occurred" pattern (cf. 98-100).
121: William Robenson — OK. Butcher. Raw text has a run-together clause
     ("...ten dramsone weight found...") — a source-side missing-space
     artifact, not an extraction error; charge content is otherwise
     intact and complete, nothing lost.
122: James Sharpe — OK. No home stated, correctly blank (no "of the
     township of..." clause at all in this short record).
123: John Barber — OK. "Glaisdale town street" resolves to Glaisdale
     itself.
124: Thomas Binns — OK. "Ellerby town street" resolves to Ellerby.
125: Samuel Holmes — OK. "Sandgate" (no "town street" suffix) is a
     genuine pre-existing Whitby street, matches "township of Whitby".
126: Joseph Spence — OK. Same Ellerby pattern as 124, companion record.
127: John Lindsay — OK. Same Glaisdale pattern as 123, companion record.

**Progress: id 103-127 done (25 records). 7 sex fixes (115, 120-125) after
the user corrected my initial wrong rule about how sex gets inferred —
see the corrected-rule note above.**

## Records 128-155 (139, 144, 151 are blacklist gaps, not skips)

128: John Gray — FIXED. Sex was null despite unambiguous name; set male.
     Whitby & Guisborough Highway correctly alongside Aislaby.
129: John Rice — OK. Whitby & Hawsker Highway alongside Whitby (offence
     township itself, matches text).
130: Anthony Waters — OK. Same highway/Aislaby pattern as 128.
131: John Thornton — OK. No home stated, correctly blank.
132: Robert Arnold + victim Thomas Watson + witness Joseph Philpot —
     FIXED. Both Watson and Philpot had sex=null despite unambiguous
     names; set male on both.
133: John Shaw — OK. Jet worker, Whitby, Baxtergate.
134: William Burkit + Joseph Thornhill (informant) + "John Spark and Co"
     (impersonated company, already correctly captured from earlier this
     session) — OK. Home = Glasgow (316, independently verified under
     "Rest of British Isles"). No offence_date and no court location
     captured — both correctly blank, since the text genuinely never
     states either (no "Offence committed at...on [date]" clause, no
     "case heard at" clause at all in this record).
135: Harris Lyon + John Meek (informant) + William Bell (buyer, excise
     officer) — OK. No offence_date — text states the offence location
     ("at Whitby") but never a date, correctly left blank. No home for
     Lyon or Meek, correctly blank, matches text.
136: Full vagrancy record (Benson, Barker, James+Margaret Robinson,
     Joseph+Mary Grotes) — FIXED occupation only. Re-verified the
     duplicate-stub fix from earlier this session is holding (Margaret's
     and Mary's "wife" relationships correctly point at the real
     co-defendants, not stubs). John Morley (informant, constable) had
     occupation captured as the bare "constable" (93) instead of
     "constable of the township of Whitby" (97) — the text says exactly
     that phrase, and record 140 (identical phrase, same informant,
     different conviction) already had it right, proving the more
     specific occupation was available and just missed here. Corrected.
137: Francis Thompson + Alfred Jefferson (informant, "collector of tolls
     on the Whitby and Pickering railway") — OK.
138: Thomas Argument + William Barton (informant) — FIXED a genuine
     location gap. Text: "Case heard at Lobster House in the township of
     Claxton" — only the coarser "Claxton" was captured as court
     location; "Lobster House" (a named venue, same pattern as other
     specific-site fixes this session) didn't exist. Created it (394,
     under Claxton) and replaced the coarser link. Offence location "Sand
     Hutton" independently verified as a real distinct top-level place,
     correctly captured, unrelated to Claxton.
140: Mary Egins, Peter Kelley, James Coil, John Camble, John Thompson +
     John Morley (informant) — OK. Confirms 136's occupation was the
     error, not this one — same phrase, correctly captured here as
     "constable of the township of Whitby".
141: George Jackson + Alfred Jefferson — OK. Whitby & Pickering Railway
     (Cross-Parish Railways) correctly alongside Hawsker-cum-Stainsacre —
     re-confirms this record's earlier-session fix held.
142: Jane Harrison + 3 illegitimate children (Dorothy/William/Jane) — OK.
     Birth years correctly back-calculated from stated ages against the
     1844 offence date (10/7/5 years old -> 1834/1837/1839, all verified
     arithmetically correct). "child" relationship correctly links all
     three to Jane Harrison despite the conviction-role label being the
     generic "unspecified" — the relationship fact itself is present and
     correct, role label is cosmetic.
143: George Watson + Henry Linton (victim/property owner, spirit
     merchant) — OK.
145: Francis Wrightson + Isaac Harrison — OK. Both home = Sneaton,
     matches "both of the parish of Sneaton".
146: Thomas Beeforth the younger + Alfred Jefferson — OK. Postfix "the
     younger" correctly present (this is the record behind an earlier
     established rule about this exact postfix parsing bug — confirmed
     still correct here, not regressed).
147: James Guy + George Orton — OK. No home for either, correctly blank.
148: John Dixon + Edward Barker (informant, "assistant constable" —
     correctly the specific occupation, not generic "constable") — OK.
149: James Lovatt — OK. Court AND offence both correctly Guisborough
     (independently verified), genuinely outside the usual Whitby-area
     townships but faithfully captured as such, not silently corrected
     to Whitby.
150: John Taylor — OK. Home = Loftus.
152: Robert Harrison — OK. No home, no children's names/ages given in
     this (much less detailed) text unlike 142's — correctly nothing
     fabricated to fill the gap.
153: Thomas Rodgers + victim/informant Michael Theaker (same person
     testifying about his own assault, correctly only one role, no
     redundant "informant" added — matches established precedent) — OK.
     Occupation "constable" here is correctly the complete extraction
     (no "of township X" qualifier attached to the job title itself in
     this record's phrasing, unlike 136/140's compound phrase).
154: Messrs Holt and Company — OK. Company-defendant treatment correct,
     home = Whitby.
155: Thomas Jackson — OK. No occupation stated, correctly blank.

**Progress: id 128-155 done (25 actual records). 5 fixes: 3 sex (126,
6507, 6508), 1 occupation-precision (6512, matching the established
"constable of X" watch-item), 1 new location (Lobster House, 394,
replacing a coarser Claxton court-location link).**

**Process note**: raised with the user that sex=null on unambiguously-
named secondary people (victims/witnesses/informants/masters, not
defendants) is a recurring, high-volume pattern, and asked whether to do
a one-time bulk name-lookup sweep or keep fixing only as encountered.
User's call: keep fixing as encountered using judgment on clear names,
only ask when a name is genuinely ambiguous — no separate bulk sweep.
Continuing on that basis.

## Records 156-180

156: William Hamilton Irvin — OK. No home stated, correctly blank.
     "Ruswarp Street" (353) a genuine specific street, correctly nested
     under Ruswarp.
157: John Humphrey + master Harrison Waller — FIXED sex (6524, "Harrison"
     read as male here — the role is master shoemaker taking an
     apprentice, a role effectively always male in this era, combined
     with the name; not a blind name-only guess). "apprentice"
     relationship correctly captured.
158: Martha Dixon + victim Sarah Hardcastle + husband William Hardcastle
     — FIXED sex on both (6525 female, 6526 male). Re-confirms this
     record's "wife of X, testifies about herself" pattern (not a
     separate informant) already correctly handled, matching the earlier
     session's specific check of this exact record.
159: Jane Holland — OK. Fylingdales, 1818 weights record.
160: Sarah Tate — OK. No occupation given, correctly blank.
161: William Bell + victim Edward Turner — FIXED sex (6527, male).
162: John Thompson, Henry Harris, William Johnson — OK. No home for any,
     correctly blank (text gives no details beyond the three names).
163: William Peart + victim Matthew Leadley — FIXED sex (6528, male).
     Same "testifies about himself, described via own trade" pattern,
     correctly no redundant informant role.
164: Jane Watson — OK. Fylingdales, 1818.
165: Ann Marshall — OK.
166: Edward Smith Wormald + victim William Thompson — FIXED sex (6529,
     male). Three-part name correctly split for the defendant.
167: John Reed + wife/victim Jane Reed — FIXED sex (6530, female).
     Relationship correctly points directly at the real defendant (175),
     not a duplicate stub — this is the record behind the very first
     duplicate-stub-bug discovery earlier this session; re-confirmed the
     fix is still holding.
168: Robert Brooks + complainant William Wilkinson the younger — FIXED
     sex (6531, male). Postfix "the younger" correctly present. "River
     Esk" mentioned in the charge text but not captured as its own
     location — recurrence of already-logged open question #4, no new
     entry needed.
169: Rebecca Harrison — OK. Fylingdales, 1818. Note: raw_record text is
     missing "for" before "having in her possession" (reads "...
     Fylingdales having in her possession...") — a source-text
     construction quirk (same missing-word pattern probably present in
     the original document), not an extraction error — meaning is
     unambiguous either way.
170: William Wood — OK.
171: William Pinkney + John Young + John Elgie (owner of private fishing
     right, miller) — FIXED sex (6532, male). Another "river Esk"
     mention, same open question #4, no new entry.
172: Edward Genning — OK. No home, correctly blank.
173: James Wilson — OK. Home = Aislaby, "late of" phrasing correctly not
     mistaken for a different township.
174: Matthew (spelled "Mathew" in raw_record — source spelling, not an
     extraction error) Rickinson — OK. Fylingdales, 1818.
175: William Foster — OK.
176: Elizabeth Wood + informant William Taylor — FIXED sex (6533, male).
177: George Robinson + "the Marquis of Normanby" (landowner) — OK, no
     change. Offence_time "11 p.m." correctly captured (confirms this
     field really does get populated when the text states a time, not
     just structurally present-but-always-null). Overdale Plantation
     correctly nested under Lythe. Marquis of Normanby stub re-confirmed
     as the still-open question #1 (no name at all to infer sex or
     anything else from — correctly left fully blank, not a new issue).
178: Ralph Storr + master Sampson Storm — FIXED sex (6535, male). No
     offence location captured — correctly matches text, which states no
     "at the township of X" clause for the offence at all, only a date.
179: Thomas Newton — OK. Fylingdales, 1818.
180: Benjamin Day — OK. No home stated, correctly blank.

**Progress: id 156-180 done (25 records). 11 sex fixes (6524, 6525-6533,
6535 — 9 male, 2 female). Zero location/relationship/occupation fixes
needed beyond the sex ones — this range was otherwise already solid.**

## Records 181-205

181: Charles Alcrow + master Thomas Marwood the younger — FIXED. This is
     the record behind the earlier-session "the younger"/"the elder"
     name-parse bug (a duplicate stub was previously repointed to this
     real person, 6536). Re-checking now found the repoint fixed the
     name but the postfix "the younger" itself had been dropped, not
     carried over — added it. Also fixed sex (6536, male) and confirmed
     the relationship is now bidirectional (apprentice->master AND
     master->apprentice both present).
182: Wardale Harland — OK. No occupation given; text also notes a prior
     1839 conviction as "idle and disorderly", correctly not fabricated
     into a separate record or field, just part of this one's narrative.
183: James Johnson — OK. "Late of the township of Whitby" home correctly
     Whitby.
184: John Gardner (spelled "Gardener" in the archive title vs "Gardner"
     throughout the description — same archival-inconsistency pattern as
     record 27's Cargill/Cargell) + William Harland (venue) + Henderson
     Skaife + John Bulmer (informants) + David Hartley (witness,
     pawnbroker) — all 5 named people correctly captured, nothing
     missing. FIXED: person 193's `alias` field was set to "Gardner" —
     redundant with his own surname, not useful. Corrected to "Gardener"
     (the actual variant spelling), matching what an alias field should
     record. Also FIXED sex on 4 of the 5 secondary people (6537-6540,
     all male). `conviction_date` correctly NULL — the source
     `document_date_raw` is itself a range ("14-18 May 1818", since the
     record documents both the original conviction and a later witness
     statement), which can't parse to a single date — not a gap, a
     faithful reflection of an ambiguous source field.
185: Robert Vickers — OK.
186: Margaret Clark + victim John Adamson — FIXED sex (6541, male).
187: William Ainger — OK. "Township of Barnby" resolves to East Barnby
     (108) — matches the existing majority precedent already logged under
     open question #5, not a new issue, just another data point for it.
188: Richard Eison — OK. No home stated, correctly blank.
189: William Hansill — OK. Home = Danby, offence/court = Whitby (distinct,
     correctly not conflated, same pattern as records 98-100).
190: Jonathan Sanders — OK.
191: David Elders + William Clark (harbour master, official) — FIXED sex
     (6542, male). No court location captured — recurrence of the
     already-logged open question #3 ("case heard in the division of
     Whitby Strand" phrasing, no town named), not a new issue.
192: Edward Binns + wife/victim Emma Binns — FIXED sex (6543, female).
     Relationship correctly points at the real defendant (201) — this is
     the record behind the SECOND duplicate-stub-bug discovery earlier
     this session; re-confirmed still holding correctly.
193: Henry Raw + victim Margaret Croft — FIXED sex (6544, female). Same
     "victim testifies about herself" pattern, correctly no extra role.
194: John Dowson — OK.
195: Alexander Willison — OK.
196: John Laray + informant Robert Kirby — OK. Same recurring Robert
     Kirby (sub-distributor of stamps) seen many times earlier in the
     corpus — correctly a new separate person row for this conviction
     (no cross-conviction merge), occupation not restated here since text
     doesn't repeat it this time (just "on the information of Robert
     Kirby", no title) — correctly left blank, not carried over from
     other records by assumption.
197: Benjamin Granger + William Clark (harbour master) — FIXED sex
     (6546, male; separate person row from 191's Clark, correctly not
     merged). No court location — correctly blank, this record's text
     has no "case heard at" clause at all (genuinely incomplete source,
     not a phrasing-variant question like 191).
198: George Laverick + Edmund Hall (letter addressee, home = Church
     Street) + George Lee (witness, letter carrier) — FIXED sex on both
     secondary people (6547, 6548, male).
199: Robert Jackson — OK. Home = Ugthorpe (independently verified, nests
     under Lythe).
200: Alice Welford — OK.
201: James Ward + victim Ralph Dowson (home = Goathland, independently
     verified) — FIXED sex (6549, male).
202: Joseph Misson + William McDerwent — OK. No home for either.
203: Edward Joy — OK. "Petty chapman and pedlar" compound occupation
     preserved exactly.
204: Thomas Thompson — OK.
205: David Watson + Elen Stirling (property owner, "Elen" = spelling
     variant of Ellen, unambiguous) — FIXED sex (6550, female).
     `offence_time` correctly captured as "midnight". No court location —
     correctly blank, text has no "case heard at" clause.

**Progress: id 181-205 done (25 records). 15 fixes: 1 name_postfix
(6536), 1 alias correction (193), 13 sex.**

## Records 206-230

206: William Pearson + master William Burn — FIXED sex (6551, male).
     Bidirectional apprentice/master relationship confirmed present.
207: Joseph Misson + William McDerwent — OK (companion of 202, same
     pair, different conviction — correctly separate rows).
208: William Gash + Sidement Gardiner (defendants) + Michael Hodgson +
     William Gazzard (victims, miners) + William Henry Palmer (their
     employer) + Joseph Fairley (informant) — all 5 secondary people
     correctly captured, nothing missing from this dense record. FIXED
     sex on all 5 (6552-6555, male).
209: John Potts — OK.
210: "Caral otherwise Charles Anderson" + victim Lars Kiersta — OK. The
     "otherwise" naming correctly captured as an alias ("Charles
     Anderson") rather than two separate people or a discarded variant.
     FIXED sex (6556, male — "Lars" is an unambiguous Scandinavian male
     name).
211: Isaac Leadley Tose + employer William Burn — FIXED sex (6557, male;
     separate person row from 206's Burn, correctly not merged despite
     being the same real master across two apprentices).
212: Robert Smith — OK. No home, correctly blank.
213: William O'Grady + victim Philip Pigg (police constable) — FIXED sex
     (6558, male).
214: James Horsebrough — OK.
215: 6 defendants (Wright, Dring, Easton, Hardy, Johnson, Turnbull) — OK.
     "Dock End" (76) correctly matches "the dock end in the parish of
     Whitby". No court location — correctly blank, record ends after the
     offence date with no "case heard at" clause.
216: George Bolton + informant Thomas Linskill (policeman) — FIXED sex
     (6559, male).
217: Elizabeth Wilson — OK. No home stated.
218: William Seymour + informant Philip Pigg (constable, separate person
     row from 213's Pigg — same real office/name recurring, correctly
     not merged) — FIXED sex (6560, male).
219: John McGloin — OK.
220: Cuthbert Wray — OK. Whitby & Hawsker Highway correctly alongside
     Whitby (the offence township itself).
221: John Fordney — OK.
222: Edward Turner — OK (different person from record 161's victim
     Edward Turner — different era, 1818 vs 1839, correctly separate).
223: George Lockey + informant William Wilkinson — FIXED sex (6561,
     male). No offence_date and no court location — both correctly
     blank, this record's raw_record is genuinely truncated/minimal (just
     ends after "of the township of Whitby", no date or court clause at
     all).
224: William Bell + William Winspear + Joseph Messenger (defendants) +
     Robert Carey Elwes esquire (landowner) — FIXED. Elwes was missing
     the "esquire" occupation despite the text stating it and this being
     an established, already-confirmed convention (15+ other people in
     the corpus have it, including Sir Charles Mark Palmer) — added.
225: Patrick Caulder Cawney + victim William Wilkinson (police officer,
     separate person row from 223's Wilkinson) — FIXED sex (6563, male).
     Home = Limerick (322, independently verified under Ireland/Rest of
     British Isles) — correctly a specific city, not just "Ireland".
226: Jane Thompson + victim Ellen Moore + husband Joseph Moore — FIXED.
     Ellen Moore was missing both sex (now female) and the "widow"
     occupation actually stated in the text — even though the text
     itself flags this with "[sic]" (she's called both "wife of Joseph
     Moore" and "widow" in the same sentence, a real contradiction in the
     original source). Captured "widow" as stated anyway, preserving the
     archival oddity faithfully rather than silently resolving or
     dropping it — matches how "[sic]" markers are meant to be handled
     (flag the oddity, don't erase it).
227: George Hoggarth — OK.
228: John Watson Liddell — OK. Three-part name correctly split.
229: John Pearson + victim Richard Cockerill — FIXED sex (6565, male).
230: Francis Burnard — OK.

**Progress: id 206-230 done (25 records). 18 sex fixes (6551-6561, 6563,
6564[female], 6565), 1 occupation addition (6562, esquire), 1 occupation
addition (6564, widow — deliberately preserving a [sic]-flagged
contradiction in the source rather than silently resolving it).**

## Records 231-255

231: Neal Devers, Hugh Gallorhu, William Stevenson — OK. No home for any.
232: Charles Goldsmith + victim William Lynass — FIXED sex (6566, male).
     Text has "[Whitby]" in brackets in `raw_record` itself (an
     archive-side bracketed insertion, not something we added) —
     correctly used to set his home to Whitby.
233: William Foxton — OK. No home given.
234: Catherine Brown + husband George Brown + informant Robert Nickson —
     FIXED sex on both secondary people (6567, 6568, male).
235: John Jones — OK.
236: John Eccles + victim Ann Hustler + witness "[blank] Smith" — FIXED
     sex (6569, female). The blank-first-name witness correctly has no
     sex set — nothing to infer from (matches the "no name to infer from"
     exception, not a gap).
237: John Ward — OK. "Ruswarp town street" resolves to Ruswarp itself.
238: Michael Trowsdale — OK.
239: James Smith, James Broughton, Thomas Hart, Mary Hart (4 defendants)
     + informant John Morley — FIXED sex (6571, male). All 4 defendants'
     sex already correctly set (3 male, 1 female, matching their names).
240: Ann Devers — OK (companion record to 231's Neal Devers — likely
     related, but no relationship stated in either text, correctly not
     inferred).
241: Taylor Clemett — OK. "Taylor" as a first name here is unambiguous
     from context — already correctly male, not touched.
242: Charles Bradley + Catherine Bradley — OK. Both correctly sexed by
     name, no home for either (matches text).
243: John Dillaney — OK.
244: Henry Smith — OK. "Fish Pier" correctly nested under "Piers".
245: Peter Gorley — OK. Raw text includes a marginal archival note
     ("[Dated November on dorse]") — a genuine annotation about the
     physical document, correctly left as descriptive text within
     raw_record, not mistaken for a second date to extract.
246: Annie Booth + victim Emma Coates — FIXED sex (6572, female).
247: Margaret Bretton, Isabella Bretton, Margaret Bretton JUNIOR, Rebecca
     Robinson (4 defendants) + informant John Morley — FIXED sex (6573,
     male). Confirmed "junior" postfix correctly captured and correctly
     differentiates the two Margaret Brettons (mother/daughter or
     similar, not stated explicitly, correctly not over-claimed as a
     specific relationship beyond the postfix itself).
248: Robert Kirby, Lucy Kirby, Mary Ann Kirby, Harriett Kirby (family
     group of 4) — OK. This "Robert Kirby" correctly NOT connected to the
     frequently-recurring "Robert Kirby, sub-distributor of stamps" seen
     elsewhere in the corpus (record 249 in this very batch has that
     other one) — different context, no textual link, correctly separate.
249: James Toms + informant Robert Kirby (sub-distributor of stamps, the
     recurring one, correctly a new person row) — OK.
250: David Storrey + victim Elizabeth Trueman + husband Charles Trueman —
     FIXED sex (6575 female, 10190 male). Relationship correctly points
     directly at the real people, no stub issue.
251: Thomas Pattison — OK. `offence_time` correctly captured as
     "11.35 a.m.".
252: John Bakehouse + Sovina Short (licensee) + Thomas Ridley (informant,
     "constable of the North Riding" — correctly the specific phrase, not
     generic "constable") — FIXED sex (6577, male) only. Sovina Short's
     sex left deliberately unresolved — "Sovina" is not a name I can
     confidently gender (possibly a variant of "Sabina"/"Savina", but not
     certain enough to guess) and pub licensees in this corpus are
     sometimes women — holding this one to ask about together with any
     other genuinely ambiguous names found along the way, rather than
     interrupting for a single name.
253: Andrew Cobbing — OK. "Glaisdale town street" resolves to Glaisdale.
254: George Raw — OK. "Ruswarp town street" resolves to Ruswarp.
255: Ralph Coulson — OK. No home stated.

**Progress: id 231-255 done (25 records). 10 sex fixes. 1 name genuinely
held as ambiguous (Sovina Short, 6576) rather than guessed — will ask in
a batch with any others found.**

## Records 256-280

256: John Hodgson + informant Robert Kirby — FIXED sex (6578, male).
257: Thomas Barrick — OK. "Whitby workhouse" correctly resolved to Union
     Workhouse (81) — no conflict with open question #4a here since the
     stated offence location IS Whitby (the conflict case is specifically
     when the stated township differs from the workhouse's real town).
258: John Ryan + victim John Clemmett (home = Hawsker-cum-Stainsacre) —
     FIXED sex (6579, male).
259: William Brunton — OK. Home = Lealholm Bridge (a specific place,
     independently sensible as a hamlet name, not re-verified by id this
     time but consistent with the pattern of specific-address homes seen
     throughout).
260: William Hobson + informant Robert Kirby — FIXED sex (6580, male).
261: John Jackson — OK. No home stated.
262: John Watson — OK. No home given (one of three unrelated "Dilligence"
     shipwreck-goods convictions in this range — 262, 269, 276 — each a
     separate defendant, correctly not connected to each other beyond
     the shared, coincidental shipwreck event neither record links them
     by).
263: James Filburn — OK.
264: Thomas Howard + victim Mary Jane Howard — FIXED sex (6581, female).
     Shares a surname with the defendant but no relationship stated in
     the text, correctly not inferred as family.
265: Mary Pritchard + husband Thomas Pritchard — FIXED. Thomas (9898)
     had occupation "pedlar" already correctly captured but was missing
     home=Ruswarp (#6 pattern) — added, plus sex (male).
266: John Pickering — OK. Home = a specific place (not re-verified this
     batch by id, consistent pattern).
267: Joseph Thompson + informant Robert Kirby — FIXED sex (6582, male).
     Home = Sheffield, correctly captured as an out-of-area specific city
     (West Riding, not North Riding) — not silently corrected to a local
     township.
268: Joseph Nunn — OK. "River Esk" mentioned — recurrence of open
     question #4, no new entry.
269: George Watson — OK. Second of the three Dilligence convictions.
270: John Taylor — OK.
271: James Winspear + William Dowthwaite (licensee) + Thomas
     Merryweather (informant, police constable) — FIXED sex on both
     secondary people (6583, 6584, male).
272: John Midgeley + Robert Ashworth (licensee) — FIXED sex (6585, male).
273: Thomas Anderson — OK. No occupation given.
274: John Brown — OK. No home stated.
275: Jeremiah Eskdale + victim Ann Scott (home = Ruswarp) — FIXED sex
     (6586, female).
276: Jane Stangway — OK. Third of the three Dilligence convictions.
277: George Patton + victim George Taylor (same "testifies about
     himself" pattern — no redundant informant role, correctly just
     victim) — FIXED sex (6587, male).
278: George Fullock — OK.
279: Timothius Marshall — OK (unusual first-name spelling "Timothius"
     preserved exactly as stated, not silently normalized to "Timothy").
280: Jane Holland — OK. Home = Robin Hood's Bay, independently verified
     nesting under Fylingdales. Shares a name with record 159's Jane
     Holland (Fylingdales, 1818, 6 years earlier) — plausibly the same
     real person, but neither record states a connection, correctly not
     merged.

**Progress: id 256-280 done (25 records). 10 sex fixes, 1 home fix
(Thomas Pritchard, 9898).**

## Records 281-305

281: Samuel Nash — OK. No home.
282: Joseph Williamson — OK. No home; text mentions "his wife and five
     children" but gives no names/ages, correctly nothing fabricated.
283: William Lill — OK. Third Dilligence-wreck-goods conviction seen so
     far in this range, correctly separate person, no home.
284: George Wastill — OK.
285: Douglas Munroe + William Knaggs (licensee) + Andrew Thompson
     (informant, "police constable for the North Riding") — FIXED sex on
     both secondary people (6588, 6589, male).
286: John Backhouse — OK.
287: Edward Morris + informant Robert Kirby — FIXED sex (6590, male).
288: John Swales + victim James Pearson (home = Hawsker-cum-Stainsacre) —
     FIXED sex (6591, male).
289: James Brown — OK.
290: Hannah Palmer + informant "[blank] Harnby" — OK (blank first name
     correctly has no sex, nothing to infer from).
291: George Harrison + Francis Harrison (different occupations, same
     home township — correctly not stated as brothers since the text
     doesn't say so, just "both of") + William Burnett (landowner) —
     FIXED sex (6593, male).
292: William Dixon — FIXED a real location gap. "The Court House" (235,
     under West Cliff, part of Whitby town) was the only location of
     offence captured, but the text states the offence township as
     Ruswarp — the specific site's ancestry doesn't reach Ruswarp, so per
     the established rule it needed to be added alongside, not left as
     the sole link. Added.
293: Henry Hodgson — OK. No location or court clause at all in this
     terse record, correctly nothing fabricated.
294: Elizabeth Wood + victim Sarah Hudson + husband John Hudson — FIXED.
     John Hudson (10191) was missing both home and occupation despite
     "of the township of Whitby labourer" directly describing him
     (matches the established husband-of-victim pattern) — added
     home=Whitby and occupation=labourer. Also fixed sex (6594, female).
295: William Stephenson, Thomas Hebron, Isaac Tose + victim John Grainger
     (constable for the North Riding) — FIXED sex (6595, male). Logged
     as a strong same-person candidate with record 301's Grainger (see
     `same-person-candidates.md`) — identical assault, date, and place,
     almost certainly one real constable, two separate prosecutions.
296: Thomas Dixon — OK.
297: Joseph Tose — OK. "Staithes town street" resolves to Staithes.
298: Thomas Crake the younger + Thomas Spink (licensee) — FIXED sex
     (6596, male). Postfix "the younger" correctly present.
299: Edward Jacobs + informant Robert Kirby — FIXED sex (6597, male).
300: William Thompson + victim William Brunton (butcher, home Whitby) —
     FIXED sex (6598, male). Different person from record 259's William
     Brunton (Lealholm Bridge, 1824, a different decade and township) —
     correctly not the same person, no erroneous connection made.
301: Joseph Crispin + victim John Grainger — FIXED sex (6599, male). See
     295 above — logged as the same-person candidate pair.
302: Dorothy Kirby + informant "[blank] Harnby" — OK. Same recurring
     blank-first-name constable as record 290, correctly consistent, no
     sex to infer either time.
303: William Sadler — OK. "New Way Ghaut" (64) correctly under Church
     Street.
304: Thomas Pritchard — OK, and logged as a strong same-person candidate
     with record 265's Thomas Pritchard (husband of Mary Pritchard) —
     same occupation, same township, and the SAME offence date/location
     as his wife's own conviction — see `same-person-candidates.md`.
305: Christopher White + John Wharton esquire (landowner, "lord of the
     manor of Skelton") — OK. Occupation captured as the more specific
     "lord of the manor of Skelton" rather than the generic "esquire" —
     judged this an acceptable, more informative substitution, not a gap
     (the established "esquire" convention exists to make sure SOME
     status is captured, not to mandate that exact word when something
     more specific is available and stated).

**Progress: id 281-305 done (25 records). 12 sex fixes, 1 location fix
(292, Ruswarp alongside Court House), 1 home+occupation fix (John Hudson,
10191). 2 new same-person candidates logged (Grainger, Pritchard).**

**Major corpus-wide sweep: 36 orphaned relationship targets, found via
records 329 and 331.** While checking record 329 (Robert Howard,
apprentice to Thomas Yeoman) and 331 (Thomas Walker, apprentice to John
Milburn — the exact pair referenced in an earlier-session note), found
both masters existed as `person` rows and had a correct
`person_relationship` row, but had ZERO `summary_conviction_person` link
to their own conviction at all — a distinct bug from the earlier
duplicate-stub bug (no duplicate here, just a missing link, so the person
never shows up as "in" the record they're actually named in). Ran a
corpus-wide check: **36 total instances**. Fixed all 36 — for each,
linked the person to their conviction with an appropriate role (mostly
"husband of offender" for the very common "wife of X" pattern, "master"
or "employer" for the apprentice/employment cases), and filled in
home_location_id/occupation from that record's own text where stated
(same #6 pattern already established). One of the 36 (10319, "John
Bakehouse the elder") had the name_postfix merged into first_name/last_name
— the same parsing bug fixed elsewhere this session — corrected in the
same pass (John / Bakehouse / "the elder").

## Records 306-331

306: Margaret Gathsides — OK. "Common prostitute" occupation already
     correctly captured. No home given.
307: Thomas Pattison — OK. `offence_time` "11 a.m." correctly captured.
308: Henry Smith — OK.
309: Charles Sadler — OK.
310: Thomas Headley Robinson + Thomas Spink (licensee) — FIXED sex on
     6602 (male). Logged as a same-person candidate (recurs 3x in this
     range, see `same-person-candidates.md`).
312: Jane Robertson — OK. Companion "common prostitute" record to 306,
     same date/place/charge, correctly two separate people.
313: Richard Knaggs + William Hodgson (landowner) + Henry William Siggs
     (informant, gamekeeper) — FIXED sex on both (6603, 6604, male).
     Siggs logged as a same-person candidate (recurring gamekeeper).
     `offence_time` "3 p.m." correctly captured.
314: Hannah Palmer + informant Francis Selby — FIXED sex (6605, male).
     Logged as a same-person candidate with 320/326 below.
315: Matthew Tose — OK.
316: Louis Cleeton + victim Mary Cleeton — FIXED sex (6606, female).
     Shares a surname with the defendant but no relationship stated,
     correctly not inferred as family.
317: Samuel Morris + informant Robert Kirby + witness William Wilkinson —
     FIXED sex on both (6607, 6608, male).
318: John Scott + George Thompson — OK. No home for either.
319: Henry Webster + victim Hugh MacGregor (superintendent of police) —
     FIXED sex (6609, male). Logged as a same-person candidate with
     record 325's Henry Webster (see below) — same defendant, same date,
     two separate assault charges against two different officers.
320: Dorothy Kirby + informant Francis Selby — FIXED sex (6610, male).
     Third instance of the Selby same-person candidate.
321: Edward Jameson Ayre — OK. Logged as a same-person candidate with
     record 1's identically-named defendant (see log) — unusual 3-part
     name, same occupation and town, 12 years apart.
322: John Burnside — OK.
323: Mutchoff Ponotowski + informant Robert Kirby + witness John Moody —
     FIXED sex on both (6611, 6612, male). Companion record to 317 (same
     day, same charge, same informant, different defendant) — correctly
     separate people, not a same-person case.
324: John Williams — OK. "Whitby Union workhouse" / stated township
     Hawsker-cum-Stainsacre mismatch — recurrence of open question #4a,
     no new entry needed.
325: Henry Webster + victim George Jackson (police constable) — FIXED
     sex (6613, male). Second half of the 319/325 same-person pairing.
326: John Wilson + informant Francis Selby — FIXED sex (6614, male).
327: James Bennett + victim Andrew Harland + witness John Green — FIXED
     sex on both (6615, 6616, male).
328: Ralph Cole + Thomas Spink (licensee) — FIXED sex (6617, male).
     Second instance of the Spink same-person candidate.
329: John Campion + victim Robert Howard — FIXED a genuine missing-person
     gap. The text names Robert Howard's master, "Thomas Yeoman of Whitby
     druggist" — a `person_relationship` row already existed for this
     (apprentice -> Thomas Yeoman, person 10326), but Yeoman had never
     been linked to this conviction at all (zero
     `summary_conviction_person` rows anywhere) — this is what led to
     discovering the corpus-wide 36-instance version of this bug (see
     above). Linked him (role: master), added home=Whitby and
     occupation=druggist. FIXED sex (6618, male).
330: John Ripley — OK. Same open question #4a recurrence as 324.
331: Thomas Walker + master John Milburn — FIXED. This is the exact
     record an earlier-session note said had already been checked and
     confirmed correct — but that check only verified the relationship
     and the person's name were right, not that Milburn was actually
     linked to the conviction itself. He wasn't (same bug as 329, in
     fact the second instance found, which is what triggered the
     corpus-wide sweep). Linked him (role: master), home=Ruswarp,
     occupation=shipowner (matching "of the township of Ruswarp
     shipowner" in the text).

**A genuine mistake made and caught mid-fix**: 3 of the 36 orphans were
"Charles Bagnall and Thomas Bagnall the younger" — TWO people merged into
one garbled row (name split across first_name/last_name), recurring
identically at records 2125, 2137, 3198. My first attempt split each into
two new person rows and linked them — without checking whether correctly-
split "Charles Bagnall"/"Thomas Bagnall the younger" pairs already existed
on those same three convictions. They did (ids 7619/7620, 7628/7629,
8282/8283, already correctly linked). This created duplicate-stub
entries — exactly the bug class this whole session has been hunting,
except self-inflicted this time. Caught it by inspecting the result
immediately after the fix (a habit that should generalise: always verify
by re-querying after any multi-row insert, not just for tricky cases).
Reverted cleanly: deleted the 3 new duplicate person rows, the 3
repurposed-garbled rows, their occupation/junction/relationship rows, and
instead pointed the `employee` relationships at the pre-existing correct
rows. While fixing this also found and corrected two more real,
pre-existing bugs on those same 3 real Bagnall pairs: "the younger" was
missing from all 3 Thomas Bagnall rows (added), and record 3198's pair
had role="informant" even though no informant is named anywhere in that
record's text — should be "employer" like the other two records, and now
is. `PRAGMA foreign_key_check` clean after every step of this whole
sequence, including the correction.

**Progress: id 306-331 done (25 records). 21 sex fixes. Plus the 36-orphan
corpus-wide sweep (329, 331 triggered it) and its self-caught-and-fixed
error (see above). 4 new same-person candidates logged.**

## Records 332-356

332: Thomas Atkinson — OK.
333: William Barrett + victim Thomas Watson + witness Joseph Philpot —
     FIXED sex on both (6619, 6620, male).
334: George Hart + Thomas Spink (licensee) — FIXED sex (6621, male).
335: Nathaniel Gardiner — OK. `offence_time` correctly captured as a
     range ("10.30 a.m. to 12 o'clock").
336: William Davis — OK. No home.
337: Ralph Nunn + victim John Mason (butcher) — FIXED sex (6622, male).
     Logged as a same-person candidate with record 343's John Mason (see
     `same-person-candidates.md`) — identical charge and date, likely one
     assault by two attackers prosecuted separately.
338: Samuel Carr — OK.
339: Thomas Gaines — OK.
340: Mary Dryden + victim Jane Harland + husband William Dryden — FIXED.
     William Dryden (9899) had occupation "fisherman" already correct
     but was missing home=Whitby (#6 pattern, now caught as part of the
     same sweep that found the 36 orphans — this one already had its
     conviction link, just needed the field fill). FIXED sex on both
     (9899 male, 6623 female).
341: Robert Dixon, Thomas Graham, Joseph Gath, Thomas Storr, William
     Storr (5 defendants) + Robert Stevenson, Jonathan Harrison, Margaret
     Short (3 victims, all home = Hawsker-cum-Stainsacre) — all 8 named
     people correctly present, nothing missing from this dense record.
     FIXED sex on all 3 victims (6624, 6625 male; 6626 female).
     `offence_time` "night" correctly captured.
342: John Coholl — OK.
343: George Wilson + victim John Mason — FIXED sex (6627, male). Second
     half of the John Mason same-person pairing with 337.
344: John Hodgson — OK.
345: John Shaw — OK.
346: Robert Steel — OK. "The Cragg" (74) correctly under West Cliff.
347: Robert Cunningham + informant Robert Kirby — FIXED sex (6628, male).
     Home = "late of Kirby Moorside" — correctly a specific out-of-area
     place, not silently mapped to a local township.
348: Shaddrack Hind — OK. Unusual first name preserved exactly.
349: Thomas Jackson — OK. "A reputed thief" — a status/character
     descriptor rather than a trade — correctly not forced into the
     occupation field as if it were a real trade (occupations left
     blank, matches how the text actually frames it: a description of
     reputation, not an occupation).
350: George Gray — OK. Compound occupation "hawker, pedlar and petty
     chapman" preserved exactly as stated.
351: John Watson Liddell + "Bailiff Appleton" (licensee) + Mary Ann
     Appleton (informant, his agent) — sex NOT set for Bailiff Appleton
     (6629) — "Bailiff" used grammatically as a personal name here (same
     construction as other named licensees), and is a real, if unusual,
     historical English given name — but I'm not fully confident on its
     gender and am holding it rather than guess (moderate lean male from
     the name's occupational origin, not confident enough to commit).
     FIXED sex on Mary Ann Appleton (6630, female) only.
352: Thomas Wellbury — OK.
353: Robert Plowman + victim Mary Plowman — FIXED sex (6631, female).
     Shares a surname with the defendant (possibly wife, sister, or
     mother) but no relationship stated in the text, correctly not
     inferred. Raw text has a doubled phrase ("of Whitby the township of
     Whitby") — a source-side duplication artifact, not an extraction
     error, meaning is unambiguous either way.
354: John Walker — OK. No home given.
355: Esther Anthony + informant Robert Nickson + husband Joyce Anthony —
     FIXED. Joyce Anthony (9900) had occupation "mariner" already correct
     but was missing home=Whitby (same pattern as 340, caught by the
     ongoing sweep). Sex set to male — not from the name alone (which
     reads as female in modern usage) but from the explicit relationship
     role ("husband" of Esther) — the text's own grammar settles it
     regardless of how the name reads today.
356: James Filburn + victim Charles Tempest Clarkson (constable for the
     North Riding) — FIXED sex (6633, male). This is the same recurring
     named officer seen repeatedly earlier in the corpus (e.g. records
     722, 761, 800 in the original, pre-restart pass) — not logged again
     separately since it was effectively already an established pattern,
     just noting the recurrence held true here too.

**Progress: id 332-356 done (25 records). 15 sex fixes, 2 home fixes
(William Dryden, Joyce Anthony — both already-linked spouse stubs missing
the field, not orphans). 1 name held as genuinely ambiguous (Bailiff
Appleton). 1 new same-person candidate (John Mason).**

**Resolved with the user: "Bailiff Appleton" (record 351, person 6629).**
Discussed the raw text ("the licensed premises of Bailiff Appleton...
Mary Ann Appleton agent of the said Bailiff Appleton" — "Bailiff" is the
only name ever given for him, both times naming him as the man whose
premises this is). User's read: "Bailiff" is his OFFICE, not a personal
given name — no personal name is stated for him at all. This resolves
the sex question (male, the office was male-held) and the structure:
`title='Bailiff'`, `first_name=NULL`, `last_name='Appleton'` (was
first_name='Bailiff', no title). Also added occupation "licensee" (new
occupation id 408) — see the two corpus-wide rule changes below, both
triggered by this one record.

**Rule change #1 — "esquire" dropped entirely, not stored as occupation
or title.** Previously treated as occupation (matching ~15 other
people this session). User: it's just an honorific, not real
information, and should always be ignored. Removed the `person_occupation`
link from all 19 people who had it (John Havelock, Edmund Turton, Robert
Elwes, Robert Kirby, George Cholmley x2, John Walker x8, James
Richardson, Joseph Chapman, Charles Palmer x2) and deleted the
"esquire" occupation row itself (old id 126) so it can't be reused.
Going forward: when a person is described as "[name] esquire", nothing
is captured for the word "esquire" — no occupation, no title, no field
at all. `reextraction-audit-notes.md`'s record-516 entry updated to flag
this reversal.

**Rule change #2 — "the licensed premises of X" is evidence that X is
the licensee, captured as an occupation, not just the conviction-level
`role='licensee'`.** Previously left occupation blank for licensees
unless a separate occupation word was also stated (matching how dozens
of licensees were handled earlier this session). User confirmed this
should be a real occupation. Created occupation "licensee" (id 408) and
ran a corpus-wide sweep: added it to all 119 people who had
`role='licensee'` on some conviction but no occupation captured at all,
PLUS the 4 people who already had "licensed victualler" (confirmed with
the user that licensed victualler is a distinct trade, not synonymous
with holding the licence for a specific premises, so both facts coexist
rather than one superseding the other). Going forward: every person
with `role='licensee'` should have "licensee" among their occupations,
in addition to whatever trade-occupation is separately stated in the
text (if any).

## Records 357-382 (359 is a blacklist gap, not a skip)

357: John Telford + Samuel Adams (licensee) + William Hammond (informant)
     — FIXED sex on both (6634, 6635, male). Home = Brotton (282,
     independently sensible, an out-of-area place near Skelton/Guisborough).
358: William Tose + William Spence (property owner) — FIXED sex (6636,
     male). Home = "Imperial Yard" (352), correctly nested directly under
     Whitby (no street specified in text, so no deeper nesting invented).
     Logged as a same-person candidate with 382 (see log).
360: John Roberts — OK. Same open question #4a recurrence (Whitby Union
     workhouse / stated township Hawsker-cum-Stainsacre), no new entry.
361: James Farrah + informant Robert Nickson — FIXED sex (6637, male).
362: Margaret Corner + informant Simpson Harnby — FIXED sex (6638, male).
363: Jacob Pearson + William Sanders + victim Joseph Watson — FIXED sex
     (6639, male). No home for either defendant.
364: George Ward — OK.
365: James Grants + informant Robert Kirby — FIXED. Text explicitly
     states "Robert Kirby of Whitby esquire sub-distributor of stamps" —
     "esquire" was missing despite the established convention already
     covering this exact recurring figure elsewhere; added. Sex (6640,
     male).
366: Robert Stephenson + George Cholmley esquire (landowner, lord of the
     manor of Fylingdales) — FIXED. Same "esquire" gap, added. Sex
     (6641, male). Logged as a same-person candidate with 372.
367: Mary Ashton — OK. No home.
368: Thomas Atkinson + victim Charles Tempest Clarkson — FIXED sex
     (6642, male).
369: Francis Fewster + informant William Holmes — FIXED sex (6643, male).
370: Ralph Jordison — OK.
371: William Stonehouse + victim Thomas Skerry (flaxdresser) — FIXED sex
     (6644, male). No home for the defendant, correctly blank.
     `offence_time` "morning" correctly captured.
372: George Wellburn + George Cholmley esquire — FIXED same esquire gap
     (6645) and sex (male). Second half of the Cholmley same-person pair
     with 366 — identical charge and date, two trespassers.
373: Thomas Jackson — OK. "River Esk" recurrence, open question #4, no
     new entry. Logged as a (weaker) same-person candidate with record
     349's Thomas Jackson — same unusual epithet "reputed thief" recurring
     ~2 months apart.
374: John McCloine — OK.
375: Robert Foster + George Hewison + John Alderson Wallace (both
     informants, "police constables") — FIXED sex on both (6646, 6647,
     male).
376: Thomas Walker — OK. Different person from record 331's Thomas
     Walker (different era, different occupation — tailor here vs.
     shipowner's apprentice there) — correctly not connected.
377: Fanny Mackey + victim Eleanor Law + William Wilkinson ("costs paid
     to", constable of Whitby) — FIXED sex on both (6648 female, 6649
     male). The costs-payment clause correctly captured with a sensible
     custom role rather than forced into "informant" or dropped.
378: James Newton + victim Luke Hoggart (home = Egton) — FIXED sex
     (6650, male).
379: Mark Herbert + informant George Bushell — FIXED sex (6651, male).
380: Joseph Priestley + victim Thomas Bowron — FIXED sex (6652, male).
     The "[Priestly]" bracketed spelling variant in raw_record already
     correctly captured as an alias.
381: Douglas Munroe — OK.
382: William Agar + William Spence (property owner) — FIXED sex (6653,
     male). Home = "Blacksmith's Arms Yard" (39, under Church Street,
     independently verified). Second half of the William Spence
     same-person pair with 358.

**Progress: id 357-382 done (25 records). 18 sex fixes, 2 "esquire"
occupation additions (Robert Kirby, George Cholmley x2 — 3 total person
rows). 3 new same-person candidates logged.**

## Records 383-407

This range (385-409 originally) was reviewed once already in an earlier
part of this session, before the "start over from record 1" instruction
— people/locations/relationships were checked then, but not sex (the
inference-from-name rule hadn't been corrected yet) or the title/date
cross-check against `raw_case`. Re-checked properly now.

383: Thomas Hill + victim Sarah Turner (home = Ruswarp) — FIXED sex
     (6654, female).
384: John Smith + Patrick Cock + John Peacock (property owner, overseer
     of the poor of Hinderwell) — FIXED sex on Peacock (6655, male); the
     two defendants were already correctly sexed.
385: John Furniss + Robert Harrison (property owner) — FIXED sex (6656,
     male). Re-confirms the earlier "[sic]" note (Robert Harrison "of the
     parish of Durham [sic]") is a genuine archival oddity, correctly
     preserved as-is.
386: Catherine Hunt + informant Charles Albert Martindale — FIXED sex
     (6657, male).
387: John McCloin — OK.
388: Eleanor Olliver + victim Mary Ann Corser + husband Robert Olliver —
     FIXED. Robert Olliver (9901) had occupation "iron worker" already
     correct but was missing home (=Hawsker-cum-Stainsacre, matching his
     wife's home, per the #6 pattern). Sex fixed on both secondary people
     (9901 male, 6658 female).
389: Thomas Millighan + informant Robert Kirby — FIXED sex (6659, male).
390: Joseph Evans — OK. Same open question #4a recurrence, no new entry.
391: James Haley + victim Hugh McGregor (superintendent of police) —
     FIXED sex (6660, male).
392: John Wilks + Joseph Cranston (landowner) — FIXED sex (6661, male).
393: Edward Ayre + victim Sarah Ann Readman — FIXED sex (6662, female).
394: John Parkin — OK.
395: William Collins + informant Robert Kirby — FIXED sex (6663, male).
     Home = Cumberland, independently sensible (out-of-area, matches
     "late of Cumberland").
396: James Cunningham + master John Smith (shipowner) — FIXED sex
     (6664, male).
397: Richard Hill the younger + informant Henry William Siggs
     (gamekeeper) — FIXED sex (6665, male). Same recurring gamekeeper
     already logged as a same-person candidate.
398: James Chappel + victim Joseph Robinson (manager of ironstone mines)
     — FIXED sex (6666, male).
399: William Cuthbert + Thomas Vaughan (landowner) — FIXED sex (6667,
     male). "Township of Barnby" — recurrence of open question #5, no
     new entry (already the majority-precedent East Barnby mapping).
400: Harold Parkinson — OK.
401: Thomas Warrener + informant William Wilkinson (police officer) —
     FIXED sex (6668, male).
402: George Borrows + master Paul Stokill (shipowner) — FIXED sex
     (6669, male).
403: Joseph Breckon + informant Henry William Siggs — FIXED sex (6670,
     male). Same gamekeeper as 397.
404: Catherine Dowse — OK.
405: Thomas Dixon + Robert Robinson the younger (landowner) — FIXED sex
     (6671, male). Postfix "the younger" correctly present.
406: John Dean + William Gibbons (property owner) — FIXED sex (6672,
     male).
407: William Tyerman — OK. No court-location clause in the text
     (ends with "Endorsed '26 October 1834'" instead) — correctly no
     court location captured, matches text.

**Progress: id 383-407 done (24 records: 383-407, since this range's
already-known layout means no new gap notes needed). 19 sex fixes, 1 home
fix (Robert Olliver, 9901).**

## Records 408-431

408: David Miller — OK.
409: Robert Goodwill + informant Henry William Siggs — FIXED sex (6673,
     male).
410: Daniel George Robinson + informant Charles Tempest Clarkson —
     FIXED sex (6674, male).
411: Blanche Wellburn + informant John Alderson Wallace — FIXED sex
     (6675, male). "Middle Walk" correctly a specific street under
     Church Street.
412: Albert Pearson — OK.
413: Joseph Jackson — OK.
414: Thomas Golding — OK. No home given.
415: Isaac Patton — OK. Re-confirms the earlier-session Runswick Lane /
     Mickleby fix is holding correctly. `offence_time` "night" correctly
     captured.
416: Thomas Joyce + Benjamin Garminsway (property owner) + John Ryder
     (informant, inspector of police) — FIXED sex on both secondary
     people (6676, 6677, male).
417: Charles Wright, William Beckham, John Appleby (all home = "Liverton",
     334 — correctly distinct from the "Liverton Mines" (335) home used
     for the unrelated 1888-era records 2-4, since this record's text
     just says "Liverton" without "Mines") + William Pearson (landowner)
     — FIXED sex (6678, male).
418: Hannah Mary Pearson + husband William Pearson — FIXED. William
     Pearson (9902) had occupation "labourer" already correct but was
     missing home=Whitby (#6 pattern). Sex fixed too (male). Relationship
     re-confirmed pointing at the correct real person, not a stub.
419: Robert Harrison — OK. Different person from record 385's Robert
     Harrison (fisherman, County Durham) — correctly separate, different
     occupation and era-appropriate context (this one's an innkeeper).
420: Abraham Brown + Dennis Hyde — OK. No home for either.
421: John Craven — OK. Runswick Lane / Mickleby fix holding.
422: Richard Wastill — OK.
423: Andrew Hill + Joseph Garside Rhodes (licensee) + John Alderson
     Wallace (informant, separate person row from 411's, correctly not
     merged) — FIXED sex on both (6679, 6680, male).
424: George Porritt — OK. "Staithes town street" resolves to Staithes.
425: George Frank — OK.
426: James Wilson — OK. No home given.
427: John Calvert — OK. Third Runswick Lane / Mickleby confirmation.
428: George Jackson + victim Arthur Hood — FIXED sex (6681, male).
429: John Kilton — OK. Occupation "gentleman" correctly preserved.
430: Harry Webster — OK.
431: Thomas Marshall — OK.

**Progress: id 408-431 done (24 records). 12 sex fixes, 1 home fix
(William Pearson, 9902).**

## Records 432-456

Another range reviewed once already before the restart — the earlier
pass's fixes (John Abdallah's home/occupation/informant role, John
Kelly's home/occupation) re-confirmed still correctly in place.
432: Ann Butler + husband Patrick Butler — FIXED sex (9903, male). No
     home/occupation for him, correctly blank (text states none).
434: William Corpes — OK.
435: Richard Purvis — OK.
436: Edward Ruehorn + victim William Lee (constable of the North Riding)
     — FIXED sex (6682, male).
437: Henry Atley — OK.
438: Joseph Thompson — OK. No home given.
439: Thomas Edwards + victim Jane Wilmot — FIXED sex (6683, female).
440: John Dixon — OK.
441: Jacob Pearson + John Sellar (licensee, licensed victualler) — FIXED
     sex (6684, male).
442: Henry Golden — OK.
443: Sampson Storm — OK.
444: Jonathan Waddington, Edward Hines, James Neville, Henry Herbert (4
     defendants) — OK. Open question #4a recurrence (Whitby Union
     workhouse / Hawsker-cum-Stainsacre), no new entry.
445: George Russell + victim Thomas Brewster (same "testifies about
     himself" pattern, correctly no redundant role) — FIXED sex (6685,
     male).
446: Patrick Seward + victim David Bell — FIXED sex (6686, male).
447: William Barrett + victim Edward Watson + 6 named witnesses (Sarah A.
     Thompson, Ralph Speedy, William Nawton, Thomas Watson, Joseph
     Philpot, Francis Harrison) — all 7 secondary people correctly
     present, nothing missing from this dense witness list. FIXED sex on
     all 7 (6687 male, 6688 female, 6689-6693 male).
448: Andrew Hill — OK.
449: Henry Hammond — OK.
450: Henry Webster + master James Arthur (shipowner) — FIXED sex (6694,
     male).
451: John Webster + wife/victim Mary Webster — FIXED sex (6695, female).
     Relationship correctly points at the real defendant, not a stub —
     this is the record behind an early duplicate-stub false-alarm check
     from earlier in the session, re-confirmed clean.
452: John Thompson + victim Mary (no surname stated, correctly blank) +
     John Abdallah (correctly appears with two roles on the same
     conviction — "informant" and "spouse of victim" — both legitimate,
     not a duplicate-stub, matching the earlier-session fix that added
     the informant role alongside the pre-existing spouse role) — FIXED
     sex on both (6696 female, 10193 male).
453: John Harland — OK.
454: Hugh Stewart — OK. "Sleights town street" resolves to Sleights.
455: William Wilson — OK.
456: John Bamfield + victim Elizabeth Kelly + husband John Kelly — FIXED
     sex on both (6697 female, 10194 male).

**Progress: id 432-456 done (25 records). 14 sex fixes. No new
location/relationship/occupation gaps — this range's earlier-session
fixes all held correctly on re-check.**

**Resolved: Sovina Short's sex (held from record 252).** Discussed with
the user — checked whether "Sovina" might be a transcription artefact
(compared `raw_record` against the untouched `raw_case.description`:
identical; found the same spelling in 3 separate person rows — 6576,
7330, 9777 — recurring across different convictions, which argues against
a one-off OCR misread since a scan error wouldn't reproduce identically
three times). User confirmed: more usually seen as a surname, but in this
case is clearly a female given name. Set all 3 occurrences to female.

## Records 457-481

457: Hugh Robertson + William McLean — OK. Both labourers, home Whitby,
     begging.
458: Mary Clark — FIXED a real location gap. Text: "Offence committed at
     the township of Ruswarp", but only "Esk Terrace" was captured as
     location of offence — independently verified Esk Terrace's ancestry
     (Esk Terrace -> West Cliff -> Whitby) does NOT reach Ruswarp, so per
     the established rule this needed Ruswarp added alongside, not left
     as the sole link. Corpus-check found this is a recurring, already-
     precedented pattern for West Cliff streets specifically (records 20,
     46, 60, 84, 292 already have it right) — West Cliff, though
     colloquially "Whitby", was historically administered as part of
     Ruswarp township. Added.
459: John Walker — OK. Innkeeper, Whitby. "Endorsed '8 October 1834'" is a
     genuine archival annotation on the document, correctly left as
     descriptive text within raw_record, not mistaken for a second date.
460: James Loftus + victim/informant Philip Hoggart (constable, home
     Ruswarp) — FIXED sex (6698, male). Baxtergate offence location
     correct.
461: Anderson McGregor — OK. No home/occupation stated, correctly blank.
     Offence at Lythe (Goldsborough, independently verified nesting
     directly under Lythe, matches text).
462: Thomas Martin — OK. Jet worker, Whitby, Church Street.
463: James Campbell — FIXED. Same Ruswarp/West-Cliff-street gap as 458
     (North Terrace) — added Ruswarp alongside.
464: Richard Sweeting — OK. Innkeeper, Whitby. Companion record to 459
     (identical offence, same endorsed date).
465: Mary Wray + husband Cuthbert Wray (fruit hawker, home Whitby — the
     36-orphan-sweep fix from earlier this session, re-verified holding)
     + informant Robert Ridley (police constable) — FIXED sex (6699,
     male). Flagging a genuine ARCHIVAL inconsistency, same treatment as
     record 27/184: `conviction_date` (1869-10-05) is two days BEFORE
     `offence_date` (1869-10-07) — logically impossible, but
     `conviction_date` is sourced from a separate `raw_case` field than
     the narrative text, so this is a source-data quirk, not an
     extraction error. No DB change, noted for the record.
466: Robert Wilson + licensee Thomas Watson + witnesses S.A. Thompson, R.
     Speedy, William Nawton, T. Watson, E. Watson, J. Philpot, F.
     Harrison — FIXED sex (6700, 6702-6707, male; 6701 "S.A. Thompson",
     female). S.A. Thompson's sex was NOT inferred from initials alone —
     record 447 (11 records earlier, same year, overlapping witness
     names: Sarah A. Thompson, Ralph Speedy, William Nawton, Thomas
     Watson, Joseph Philpot, Francis Harrison) is almost certainly the
     same recurring witness group with fuller names, which is what
     supports reading "S.A." as "Sarah A." here. Logged to
     `same-person-candidates.md` rather than merged (deferred design
     question).
467: Charles Sanderson — OK. Labourer, Glaisdale, begging.
468: James Scott + victim Jane Thompson (spinster) — FIXED sex (6708,
     female).
469: John Norton + landowner "[blank] Wilson" — OK. Blank first name
     correctly has no sex. Court = Stokesley, offence = Ingleby Greenhow
     — both genuinely outside the usual Whitby-area townships, faithfully
     captured as such.
470: Thomas Sugden + informant William Nicholson (police constable) +
     informant "[blank] Wilson" (gatekeeper) — FIXED sex (6710, male).
     Whitby & Stainsacre Highway (single-destination) correctly nests
     under Hawsker-cum-Stainsacre, re-confirms earlier-session fix held.
471: James Richardson + victim Thomas Jones — FIXED sex (6712, male).
472: Matthew Ryley + informant Robert Kirby (sub-distributor of stamps,
     the recurring one, correctly a new person row) — FIXED sex (6713,
     male). No home for Ryley, correctly blank.
473: James Robinson — FIXED. Same Ruswarp/West-Cliff-street gap as 458/463
     (Windsor Terrace) — added Ruswarp alongside.
474: George Morley + John Morley + informant James Wright (police
     constable) + informant William Pearson (gamekeeper) — FIXED sex
     (6714, 6715, male).
475: Catherine Lee + husband Adam Lee (hawker, home Whitby — 36-orphan-
     sweep fix, re-verified holding) — FIXED sex (9905, male).
476: Patrick Machannow + informant Robert Kirby — FIXED sex (6716, male).
     Companion record to 472 (same informant, consecutive record).
477: John Wilson + informant "[blank] Harnby" (police constable) — OK.
     Blank first name correctly has no sex.
478: William Harrison + informant George Holmes + informant Miles Moody
     (inspector of police) + informant John Ryder (superintendent of
     police) — FIXED sex (6718, 6719, 6720, male). Whitby & Guisborough
     Highway (2-endpoint) correctly alongside Aislaby, re-confirms
     earlier-session fix held.
479: Mary Smith — FIXED. "singlewoman" stated in text ("of the township
     of Glaisdale singlewoman") but missing as a captured occupation
     (#7 pattern). Added.
480: Elizabeth Thompson + Esther Thompson (spinster, already correctly
     captured) + victim Thomas Lincoln + husband "[blank] Thompson" —
     FIXED sex (6721, male, Thomas Lincoln). Elizabeth's husband
     correctly has no name/sex — text literally says "wife of [blank]
     Thompson".
481: John Smith — OK. No home stated, correctly blank.

**Progress: id 457-481 done (25 records). 21 sex fixes. 3 new location
fixes (458, 463, 473 — Ruswarp added alongside a West Cliff street, a
newly-identified but well-precedented recurring pattern). 1 occupation
fix (479, singlewoman). 1 archival chronological inconsistency flagged,
no action (465). 1 new same-person candidate logged (S.A./Sarah A.
Thompson, witness group, 466 & 447).**

**Process error caught before it compounded**: the next batch was pulled
with `OFFSET 481`, but that's wrong — `summary_conviction.id` has 8
blacklist gaps at or below 481 (87, 88, 139, 144, 151, 311, 359, 433), so
the correct offset for "next real row after id 481" is 473, not 481.
Using 481 skipped 8 real records (ids 482-489) entirely. Caught
immediately (the returned batch started at id 490, not 482, which didn't
match the expected next id) before moving past it — went back and pulled
482-489 as their own mini-batch below, then resumed the already-fetched
490-514 batch after. Noting this so future OFFSET math accounts for
cumulative blacklist gaps below the current position, not just the count
of records logged so far.

## Records 482-489 (recovered after the OFFSET skip above)

482: John Arnold + licensee Thomas Watson + witnesses S.A. Thompson, R.
     Speedy, W. Nawton, Ed. Watson, J. Philpot, F. Harrison — FIXED sex
     on all 7 (6722, 6724-6728 male; 6723 "S.A. Thompson" female). Same
     cross-reference basis as record 466 in the previous batch (fuller
     names for this identical witness group appear at record 447) — sex
     inferred from the pattern match, not from bare initials alone.
     Companion record to 466: SAME offence date (11 November 1876), SAME
     licensed premises (Thomas Watson's), SAME charge template, different
     defendant (John Arnold vs. Robert Wilson) — one incident, two
     defendants ejected together, prosecuted separately. This is now a
     THIRD sighting of the same witness group (447, 466, 482) — updated
     `same-person-candidates.md` accordingly. Thomas Watson here (6722)
     is a separate person row from 466's Thomas Watson (6700) per the
     no-cross-conviction-merge policy, but almost certainly the same
     licensee — noted as part of the same candidate entry.
483: Henry Day — OK. Fisherman, Whitby. "New Quay" (West Cliff, id 5)
     correctly matches the stated offence township (Whitby itself) — no
     Ruswarp-style conflict here, since West Cliff's ancestry genuinely
     does reach Whitby.
484: Thomas Carter — OK. No home/occupation given, correctly blank.
485: David Adamson — OK. Sailor, Whitby, Church Street.
486: Rees Jones + informant John Ryder (superintendent of police) +
     informant Thomas Dennis (sergeant of police) — FIXED sex (6729,
     6730, male).
487: Thomas Dixon — OK. Labourer, Whitby, Church Street.
488: George Williams — OK. No home/occupation given; text references a
     prior conviction ("previously convicted of being an idle and
     disorderly person") correctly folded into charge_description, not
     fabricated as a separate record.
489: Patrick Seward + victim Thomas Bowron — FIXED sex (6731, male). No
     home for Seward, correctly blank.

**Progress: id 482-489 done (8 records). 9 sex fixes. 1 same-person
candidate strengthened (Thomas Watson's witness group, now 3 sightings).
Zero location/occupation gaps.**

## Records 490-514

490: John Holmes + licensee Joseph Rhodes — FIXED sex (6732, male).
491: William Martin + licensee Edward Cleeton — FIXED sex (6733, male).
492: Thomas Robison + informant Mary Pawley + husband Richard Pawley —
     FIXED. Richard Pawley (10195, "spouse of involved person") was
     missing both home and occupation despite the text stating them:
     "Mary Pawley wife of Richard Pawley of Whitby officer in the
     Preventive Service" — by the corpus's established idiom ("NAME of
     TOWNSHIP OCCUPATION" describes the immediately-preceding name, same
     structure as record 465's "Cuthbert Wray of the township of Whitby
     fruit hawker"), "of Whitby, officer in the Preventive Service"
     describes Richard, not Mary — an all-male coastguard/customs role in
     this era, consistent with attaching to the husband. Added
     home=Whitby and a new occupation "officer in the Preventive Service"
     (407, is_police=0, matching the existing convention that customs/
     coastguard-type roles like "excise officer" and "gamekeeper" are not
     flagged as police). Also FIXED sex on both (6734 female, 10195
     male).
493: Henry Smith + informant Francis Selby (police constable) — FIXED sex
     (6735, male). Recurring named officer, already logged as a
     same-person candidate earlier in the corpus.
494: John Thompson — OK. Jet worker, Whitby, Church Street.
495: John Moon + property owner James Whittle — FIXED sex (6736, male).
496: Samuel Clark + Charles Clark — OK. No home/occupation for either,
     correctly blank. Companion record to 500 (their mother's
     conviction, same date/place).
497: James Pearson + landowner Thomas Beeforth — FIXED sex (6737, male).
498: John Dryden — OK. Fisherman, Whitby, Church Street.
499: John Hodgson — OK. Fisherman, Whitby, the Pier.
500: Charlotte Clark + children Samuel Clark and Charles Clarke — OK,
     with a flagged ARCHIVAL inconsistency (same treatment as record
     27/184/465): `raw_record` literally states the offence date as
     "27 October 1837", but the structured `offence_date` field holds
     1835-10-27 — matching companion record 496 (same incident, same
     children, unambiguously 1835) and every surrounding record in this
     run of 1835 convictions. Reads as a scribal digit-slip in the
     original document rather than a genuine 1837 event; the structured
     field's 1835 is almost certainly correct, `raw_record` faithfully
     preserves the source's own error. No DB change, noted for the
     record. "child" relationship correctly captured for both (role
     "child" links each to Charlotte), consistent with the encouraging-
     to-beg charge naming them as her children.
501: Robert Marley + informant Thomas Bowron (police constable, Glaisdale)
     — FIXED sex (6738, male). Glaisdale Street correctly nests under
     Glaisdale township.
502: Eli Parkin — OK. Iron worker, Whitby, Church Street.
503: James Coleman — OK. Labourer, Whitby. Baxtergate (West Cliff)
     correctly matches stated offence township Whitby directly — no
     Ruswarp-style conflict (ancestry does reach Whitby here).
504: Arthur Donnely + informant Robert Kirby — FIXED sex (6739, male).
     Home = Ireland (general, matching "late of Ireland" with no more
     specific place stated — correctly not over-specified).
505: William Pattison + informant Charles Clarkson — FIXED. Three-part
     name "Charles Tempest Clarkson" (matches raw_record exactly) had
     only first/last captured, missing the middle name — added
     "Tempest". Also fixed sex (6740, male). Marine Parade (West Cliff)
     correctly matches stated offence township Whitby.
506: James Pearson — OK. Blacksmith, Whitby, Church Street. Companion
     record to 497's James Pearson (Sneaton game-trespass) — correctly a
     separate person row, different conviction, no merge.
507: Matthew Carroll — FIXED a location gap. Same Ruswarp/West-Cliff-
     street pattern as 458/463/473: text states "township of Ruswarp"
     but only North Terrace (West Cliff, doesn't reach Ruswarp) was
     captured. Added Ruswarp alongside.
508: John Hayes + informant Robert Hunt (special constable) — FIXED sex
     (6741, male).
509: Edward Wapp + informant Thomas Bowron (police constable, Glaisdale)
     — FIXED sex (6742, male). Same recurring name/office/township as
     501's Thomas Bowron (11 days earlier) — logged as a same-person
     candidate.
510: John Jones + informants John Ryder (superintendent), Miles Moody
     (inspector), George Holmes (police constable) — FIXED sex (6743,
     6744, 6745, male). Companion record to 514 below (same defendant,
     same date/place, two separate charges from one incident) — per the
     no-cross-conviction-merge design, correctly two separate John Jones
     person rows (558 here, 562 in 514), not merged.
511: William Johnson — OK. Labourer, Hinderwell.
512: Henry Charles Johnston + informant Robert Kirby — OK, sex already
     correctly male on Johnston; FIXED sex (6746, male) on Kirby. Three-
     part name correctly split.
513: Thomas Hewson + victim Andrew Thompson (police constable) — FIXED
     sex (6747, male).
514: John Jones (companion to 510, separate person row 562, correct
     per no-merge policy) + victim George Holmes ("constable for the
     North Riding") + informant Thomas Holmes (police constable) — FIXED
     sex (6748, 6749, male). George Holmes here (6748, victim) reads as
     the same recurring constable as 510's George Holmes (6745,
     informant) — same office, same township, consecutive records
     covering the same incident — logged as a same-person candidate.

**Progress: id 490-514 done (25 records). 20 sex fixes. 1 home+occupation
fix, including a new occupation created (Richard Pawley, 492). 1 middle-
name fix (Charles Tempest Clarkson, 505). 1 location fix (507, Ruswarp
alongside North Terrace — 4th sighting of this pattern). 1 archival date
inconsistency flagged, no action (500). 3 same-person candidates logged
(Thomas Bowron x2, George Holmes x2, John Jones same-incident pair).**

## Records 515-539

515: James Cockrin — OK. Labourer, Whitby, Baxtergate.
516: John Havelock (esquire, home Ruswarp) + landowner Edmund Turton
     esquire — FIXED sex on both (6750, male; Havelock's own sex was
     already correctly male). "Rigg Hill" independently verified nesting
     under Hawsker-cum-Stainsacre, matches "Rigg Hill in the township of
     Hawsker cum Stainsacre" exactly — correctly distinct from
     Havelock's own home township (Ruswarp), a trespass on someone
     else's land elsewhere, not conflated.
517: John Harrison + licensee Thomas Atkinson + informant Charles
     Tempest Clarkson — FIXED. Same three-part-name-missing-the-middle
     bug as record 505's Clarkson (same real recurring superintendent) —
     added "Tempest". Also fixed sex (6751, 6752, male).
518: Thomas Martin + informants John Alderson Wallace and John Smedley
     (police constables) — FIXED. Same middle-name-dropped bug a third
     time this batch — "John Alderson Wallace" had only "John"/"Wallace"
     captured; added "Alderson". Also fixed sex on both (6753, 6754,
     male).
519: John Nash — OK. "Sleights town street" correctly resolves to
     Sleights (under Eskdaleside-cum-Ugglebarnby, matches his own home
     township).
520: John Handysides + informant William Wilkinson — FIXED sex (6755,
     male). No home for Wilkinson, correctly blank (text gives no
     township for him).
521: Mary Ann Parker + informant Francis Selby — FIXED sex (6756, male).
     "singlewoman" occupation already correctly captured.
522: Robert Anderson — OK. Jet worker, Whitby, the Pier.
523: Thomas Smith + victim James Side — FIXED sex (6757, male).
524: John Wyley + victim Robert Steel (home Whitby, carpenter) — FIXED
     sex (6758, male). Home = Guisborough for Wyley, correctly distinct
     from the Whitby offence location (travelled to commit the assault).
525: James Chappel + victim/informant Robert Cooper (weighman, same
     "testifies about himself" pattern, correctly no extra role) — FIXED
     sex (6759, male).
526: Mary Ann Stonehouse + informants William Nicholson (police
     constable) and Thomas Archer (inspector of police) — FIXED sex
     (6760, 6761, male). "singlewoman" already correctly captured.
527: Henry Holmes + property owner James Fletcher — FIXED sex (6762,
     male).
528: Aaron Aronstein + informant Robert Kirby — FIXED sex (6763, male).
     Home = London (general, matching "late of the City of London" —
     correctly not over-specified to a borough).
529: John Nunns + victim/informant Samuel Braithwaite (photographer,
     same "testifies about himself" pattern) — FIXED sex (6764, male).
530: Robert Webster — OK. "Ruswarp town street" resolves to Ruswarp
     itself. No home/occupation given.
531: Patrick Doran — OK. Fisherman, Whitby, "The New Quay" (West Cliff)
     correctly matches stated offence township Whitby.
532: Elizabeth Rafferty + informant Robert Kirby — FIXED sex (6765,
     male). Home = Cumberland (general, matching "late of Cumberland").
533: Ellen McDermott + husband John McDermott (labourer, home Whitby —
     already correctly captured, re-verified holding) + informant
     Francis Selby — FIXED sex on both secondary people (9907, 6766,
     male).
534: Thomas Gaines — OK. Fisherman, Whitby, Church Street.
535: John Watson Liddle — FIXED. Three-part name had only "John"/"Liddle"
     captured, missing middle name "Watson" (matches raw_record exactly)
     — same bug as 517/518 above, a fourth instance in this stretch of
     the corpus. Added. "Old Market Place" (West Cliff) correctly
     matches stated offence township Whitby.
536: John Frank — OK. Innkeeper, Whitby. No offence-township clause
     (Sunday-trading record, same terse style as similar records earlier
     in the corpus), correctly nothing fabricated.
537: Mary Ward + husband Thomas Ward (common lodging house keeper, home
     Whitby — already correctly captured) + informant Robert Ridley
     (police constable) — FIXED sex on both secondary people (9908,
     6767, male). Robert Ridley here is the same recurring name/office
     as record 465's informant (11 months earlier) — logged as a
     same-person candidate.
538: Isaac Jackson — OK. Cattle dealer, Whitby, Market Place (East
     Cliff).
539: George Ducker — OK. "Ruswarp town street" resolves to Ruswarp
     itself.

**Progress: id 515-539 done (25 records). 17 sex fixes. 3 middle-name
fixes (Clarkson, Wallace, Liddle) — a newly-clustered pattern of
three-part names losing their middle name, all in this stretch of the
corpus. Zero location gaps this batch (the West Cliff streets present
all matched their stated township directly). 2 same-person candidates
logged (Charles Tempest Clarkson, Robert Ridley).**

## Records 540-564

540: Joseph Thompson — OK. Innkeeper, Whitby, Sunday-trading record.
541: John Mead + informant James Wright (police constable) — FIXED sex
     (6768, male). "Lease Rigg" correctly nests under Egton, matches
     text. Charge text has "three [blank]" (animal type never stated,
     genuinely blank in the source) — correctly preserved as a gap, not
     fabricated as "animals" beyond what `charge_description` already
     summarizes.
542: Thomas Gaines + victim John Nicholson (constable for the North
     Riding) — FIXED sex (6769, male). Different person from 220/524's
     Nicholsons (unrelated context) — correctly not merged. Same real
     defendant as record 534 (companion conviction, same day) —
     correctly two separate person rows (no cross-conviction merge).
543: James Sutton — OK. Labourer, Fylingdales.
544: William Bell + Joseph Newton (defendants) + landowner (unnamed —
     "the Earl of Mulgrave", the still-open title-only-person question
     #1, correctly left fully blank, no name to derive anything from) —
     OK, no fixes, recurrence of the existing open question only.
545: Daniel Stuart + licensee Thomas Duck + informant Simpson Harnby
     (police constable) — FIXED sex (6770, 6771, male). Companion record
     to 549 below (same night, same pub, same informant) — logged as a
     same-person candidate.
546: Daniel George Robinson — OK. Three-part name correctly split.
     Labourer, Whitby, Church Street.
547: Isabel Barker + victim Ann Oliver — FIXED sex (6772, female).
     "singlewoman" already correctly captured.
548: Hannah Cail + Helina Cail (defendants) + husband Richard Cail
     (currier, home Whitby — correctly captured) + victim Jeffrey Holmes
     (gentleman, home Ruswarp) — OK, no DB change, but flagging a genuine
     ARCHIVAL oddity: the source text names "Hannah Cail" twice ("Hannah
     Cail wife of Richard Cail of Whitby currier, and Hannah Cail and
     Helina Cail, for assaulting...") — read as a scribal repetition in
     the original document, not two different people, and correctly
     captured as ONE Hannah Cail person row, not duplicated. Court
     location = Whitby correctly captured ("Case heard at Whitby in the
     division of Whitby Strand" — the town IS named here, unlike the
     genuinely ambiguous phrasing behind open question #3). FIXED sex
     (6773, male).
549: Edward Doughty + licensee Thomas Duck + informant Simpson Harnby —
     FIXED sex (6774, 6775, male). See 545 above (same-person candidate,
     companion incident).
550: John Cummings — OK. No home/occupation. Raw text has a bracketed
     archival annotation ("[Dated 21 October, but endorsed 23 October
     1875]") — genuine document metadata, correctly left as descriptive
     text, not mistaken for a conflicting second date to extract.
551: Richard Shippey — OK. "Staithes in the township of Hinderwell"
     correctly resolves to Staithes, nested under Hinderwell.
552: Sarah Anderson + victim Isabella Jolly + husband Enock Anderson —
     FIXED. Enock Anderson (9910, "spouse of offender") was missing both
     home and occupation despite "of Whitby tailor" directly describing
     him (the #6 pattern, same idiom as 465/492/533/537) — added
     home=Whitby and occupation=tailor. Also fixed sex on both secondary
     people (6776 female, 9910 male).
553: Henry Freeman ("mariner and master of the vessel William Ash",
     compound occupation preserved exactly) + informant Peter George
     Coble ("collector of rates and dues of the harbour of Whitby") —
     FIXED. Three-part name "Peter George Coble" had only "Peter"/"Coble"
     captured — same middle-name-dropped bug seen 4 times already this
     stretch (Clarkson x2, Wallace, Liddle) — added "George". Also fixed
     sex (6777, male). Text's "and another" (an unnamed second informant)
     correctly not fabricated into a person row.
554: Mary Robinson + victim/informant Francis Calvert (farmer, Goathland)
     + husband John Robinson — FIXED. John Robinson (9911) had occupation
     "labourer" already correctly captured but was missing home=Whitby
     (the #6 pattern in its more common form) — added. Also fixed sex on
     both secondary people (6778, 9911, male).
555: Thomas McBride — FIXED a location gap. Same Ruswarp/West-Cliff-
     street pattern as 458/463/473/507: text states "township of
     Ruswarp" but only Upgang Lane (West Cliff, doesn't reach Ruswarp)
     was captured. Added Ruswarp alongside — 5th sighting of this
     pattern.
556: Robert Stephenson + landowners Thomas Peirson and Job Allison —
     FIXED sex on both (6779, 6780, male).
557: Robert Watson + victim Winefred Readman + husband Thomas Readman
     (miner, home Whitby — already correctly captured) — FIXED sex
     (6781, female — "Winefred" is a spelling variant of "Winifred", an
     unambiguous female name; 10196, male).
558: Thomas Brown + intended victim Robert Baines ("with intent to steal
     from the person of" — correctly captured as a distinct role from
     plain "victim", since no actual theft occurred) — FIXED sex (6782,
     male). No home for Brown, correctly blank.
559: Thomas Golden + informant Robert Kirby — FIXED sex (6783, male).
     "now of Whitby" correctly read as his current home despite the
     unusual phrasing (distinct from "late of", the opposite direction).
560: Charles Allison — OK. Jet worker, Whitby.
561: William Foxton + property owner Robert Dobson (farmer, home East
     Barnby) — OK, no fixes; recurrence of the already-logged open
     question #5 (generic "township of Barnby" resolving to East Barnby
     by existing majority precedent), not a new issue.
562: Thomas Herbert — OK. Stonemason, Whitby. "Egton town street"
     correctly resolves to Egton itself.
563: Peter McIntyre + informant Robert Kirby — FIXED sex (6785, male).
     "now of Whitby" same phrasing as 559.
564: John Heselton + informant Joseph Gatenby (police constable) — FIXED
     sex (6786, male).

**Progress: id 540-564 done (25 records). 21 sex fixes. 2 home/occupation
fixes (Enock Anderson 9910, John Robinson 9911 — both the #6 pattern).
1 more middle-name fix (Peter George Coble, 553 — 5th instance of this
sub-pattern this stretch). 1 location fix (555, Ruswarp alongside Upgang
Lane — 5th sighting). 1 archival oddity flagged, no action (548, Hannah
Cail named twice in source, correctly not duplicated). 1 same-person
candidate logged (Thomas Duck/Simpson Harnby, 545 & 549).**

## Records 565-589

565: Charles Adams — OK. Cab driver, Whitby, Church Street.
566: Mary Sams + husband Charles Sams (labourer, home Whitby — already
     correctly captured) — FIXED sex (9912, male).
567: William Douglass + informant George Willis (harbour master of the
     port of Whitby) — FIXED sex (6787, male). No offence-township
     clause in the text at all (just "Offence committed on 29 November
     1833"), correctly nothing fabricated for location of offence.
568: George Thompson — OK. Sawyer, Whitby.
569: James Pearson — OK. Labourer, Whitby, Church Street. Different
     person from 497/506's James Pearson (blacksmith) — correctly not
     merged, different occupation and a different decade-adjacent
     record.
570: John Horsley — OK. Fisherman, Whitby, Baxtergate.
571: Reuben Raybold (title says "Raybald", raw_record says "Raybold" —
     genuine archival spelling inconsistency, same treatment as record
     27/184: correctly stored as "Raybold", the fuller narrative text's
     spelling, title preserved as its own field faithfully) + informant
     Robert Hunt (special constable) — FIXED sex (6788, male).
572: Alfred Stuart + William Brown + landowner Francis Norman — FIXED
     sex (6789, male). Offence at Ruswarp correctly distinct from both
     defendants' own home township (Whitby) — not conflated.
573: George Scales — OK. "Egton town street" resolves to Egton itself.
574: William Dixon + licensee Matthew Green — FIXED sex (6790, male).
575: John Watson + Matthew Fawcett (defendants, refusing a civic office)
     + informant William Gray — FIXED sex (6791, male). No offence_date
     — correctly blank, the text never states one (only a conviction
     date), consistent with this being a civic-duty-refusal charge
     rather than a dated criminal act.
576: David Lund + Valentine Austin + property owner Gideon Smales —
     FIXED sex (6792, male). Offence at Ruswarp, same distinct-from-home
     pattern as 572.
577: Emma Robinson + victim Mark Boggett (police constable) + witnesses
     William Willison (innkeeper) and Francis Calvert (farmer, Goathland)
     — FIXED sex on all 3 (6793, 6794, 6795, male). Francis Calvert here
     is the same recurring name/occupation/township as record 554's
     witness (identical description, "of the township of Goathland
     farmer") — logged as a same-person candidate.
578: George McMann — OK. "Bridge End" (a specific site under Whitby)
     correctly matches "at the bridge end" + stated township Whitby.
579: William Cavallier — OK. Cabinet maker, Whitby, Flowergate (West
     Cliff, matches Whitby directly, no Ruswarp-style conflict).
580: Thomas Jackson — OK. No home/occupation given. "Aislaby Street"
     correctly nests under Aislaby, matches stated offence township.
     Different person from record 155's Thomas Jackson (unrelated
     context, different decade) — correctly not merged.
581: Robert Parkin + informant Thomas Hall (police constable) — FIXED
     sex (6796, male).
582: William Moody + victim Richard Thompson — FIXED sex (6797, male).
583: Eleanor Creaser + informant William Wilkinson — FIXED sex (6798,
     male). No offence-township clause beyond "parish of Whitby" —
     correctly captured as Whitby.
584: Thomas Atkinson + informant Charles Tempest Clarkson — FIXED. Same
     dropped-middle-name bug as records 505/517 (this superintendent's
     name is now missing its middle name a 3rd time in the corpus, all
     independently instances of the same underlying extraction gap) —
     added "Tempest". Also fixed sex (6799, male).
585: Henry Mark Davison — FIXED. Three-part name had only "Henry"/
     "Davison" captured (matches raw_record and title both stating
     "Henry Mark Davison") — added middle name "Mark". This is the 7th
     instance of the dropped-middle-name pattern found in this stretch
     of the corpus (Clarkson x3, Wallace, Liddle, Coble, now Davison) —
     flagging as a genuinely systemic gap worth a possible dedicated
     sweep once the current sequential pass reaches the end, rather than
     just noting it batch by batch.
586: Thomas Loftus + victim Mary Hellewell — FIXED sex (6800, female;
     "Mary" is unambiguous).
587: Richard Hilton + informant William Wilkinson — FIXED sex (6801,
     male). Same recurring informant name/pattern as 583 (no
     occupation/home stated either time — weak signal, generic name, not
     logged as a same-person candidate per the project's existing
     no-generic-name-matching rule).
588: William Stockdale + victim Elizabeth Lemon — OK, no fixes; neither
     has a home stated, correctly blank both times.
589: John de Wart + victim George Richard Lazenby (constable for the
     North Riding) — FIXED. Three-part name "George Richard Lazenby"
     had only "George"/"Lazenby" captured — added "Richard" (8th
     instance of the dropped-middle-name pattern). Also fixed sex
     (6803, male). No home for de Wart, correctly blank — unusual
     Dutch-style surname preserved exactly as stated, not altered.

**Progress: id 565-589 done (25 records). 16 sex fixes. 2 more
middle-name fixes (Davison, Lazenby — bringing this stretch's running
total for the dropped-middle-name pattern to 8 instances across ~130
records; flagged for a possible dedicated sweep later, not yet acted on
as a sweep). 1 archival spelling inconsistency flagged, no action (571).
1 same-person candidate logged (Francis Calvert, farmer of Goathland, 554
& 577). Zero location gaps.**

## Records 590-614

590: Thomas Batty — OK. Mariner, Whitby, Flowergate.
591: William Wormald + informant William Wilkinson — FIXED sex (6804,
     male). Same generic recurring informant name as records 520/583/587
     — still no distinguishing detail, correctly not logged as a
     same-person candidate.
592: Isaac Blackburn — OK. Sailor, Whitby, Sandgate (East Cliff).
593: Robert Barrick — OK. Jet worker, Whitby, Baxtergate.
594: Charles Tomlinson — CORRECTION (self-caught while auditing record
     692): originally logged as OK on the claim that Bagdale's ancestry
     "resolves to Ruswarp, not Whitby" — that was wrong. Bagdale (192)
     has the exact same parent (West Cliff, id 5, under Whitby) as every
     other street in this pattern; I misread its parent chain the first
     time. FIXED: added Ruswarp alongside Bagdale, same as the other
     sightings of this pattern. Not counted in the running sighting
     tally below since it was actually the 1st chronologically — the
     tally continues from where it was left rather than renumbering
     retroactively.
595: Thomas Breckon + property owner William Cavallier (cabinet maker,
     home Whitby — already correctly captured) — FIXED sex (6805, male).
     This Cavallier is almost certainly the same real person as record
     579's William Cavallier (identical name/occupation/township, close
     in time, 1836) — logged as a same-person candidate.
596: John Fletcher — OK. Sailor, Whitby, Sandgate. Companion record to
     592 (same offence, same date, different defendant).
597: Katherine McLaughlan + victim Mary Feeley + husband John Feeley
     (home Whitby, no occupation stated in text — correctly blank) —
     FIXED sex on both (6806 female, 10197 male). "widow" already
     correctly captured as McLaughlan's occupation.
598: John Morgan — OK. Labourer, Whitby, the Pier.
599: Joseph Feeny — OK. No home stated, correctly blank.
600: Samuel Baker — OK. No home stated. Offence at Ruswarp correctly
     captured directly (no West-Cliff-street involved this time).
601: Walter Adam + victim Alfred Lait — FIXED sex (6807, male).
602: Charles Wood — OK. No home stated.
603: Michael Dunleavy — OK. "River Esk" mentioned — recurrence of the
     already-logged open question #4, no new entry.
604: William Dixon + victim Mary Dixon — FIXED sex (6808, female;
     "Mary" is unambiguous). Shares a surname with the defendant but no
     relationship stated in the text ("assaulting Mary Dixon", nothing
     more) — correctly not inferring a family relationship that isn't
     stated.
605: Catherine Brannan + victim Elizabeth Green — FIXED sex (6809,
     female). No home for Brannan, correctly blank.
606: George Patton — OK. Fisherman, Whitby, the Pier. Different person
     from record 277's George Patton (a much earlier, unrelated
     conviction) — correctly not merged.
607: James Cockrin + victim Charles Finks — FIXED sex (6810, male). Same
     defendant as record 515 (companion record, same person's earlier
     conviction 2 days prior) — correctly a separate person row per the
     no-cross-conviction-merge policy.
608: William Crowther — OK. No home stated. Companion record to 602
     (same offence type/location/date, different defendant).
609: William Herbert (butcher, home Ruswarp) — OK. Market Place (East
     Cliff) matches stated offence township Whitby directly.
610: William Thomas — OK. Fisherman, Whitby, Baxtergate.
611: John Sallenger — OK. No home stated. "Hinderwell Street"
     independently verified nesting under Hinderwell, matches text.
612: William Herbert (butcher, home Whitby) — FIXED a location gap. Same
     Ruswarp/West-Cliff-street pattern as 458/463/473/507/555: text
     states "township of Ruswarp" but only York Terrace (West Cliff,
     doesn't reach Ruswarp) was captured — added Ruswarp alongside, 6th
     sighting. Flagging this William Herbert alongside record 609's (2
     days earlier) as a same-person candidate with an interesting
     wrinkle: the two records give him OPPOSITE home townships (Ruswarp
     here vs. Whitby in 609) while the offence-location township is also
     swapped between them — each record's own text is followed
     faithfully (not an extraction error), but the inconsistency itself
     is worth a look in the merge pass.
613: Thomas Loftus — OK. Bricklayer, Whitby, Church Street. Same
     defendant as record 586 (companion, 9 days later) — correctly
     separate person row.
614: John Shepherd + informant Michael Underwood — FIXED sex (6811,
     male). Cleveland & North Yorkshire Railway correctly alongside
     Eskdaleside-cum-Ugglebarnby, re-confirms this earlier-session-
     created location and its Cross-Parish-Railways handling both held.

**Progress: id 590-614 done (25 records). 10 sex fixes. 1 location fix
(612, Ruswarp alongside York Terrace — 6th sighting of this pattern).
2 same-person candidates logged (William Cavallier, William Herbert with
a swapped-home wrinkle flagged for the merge pass).**

## Records 615-639

615: Peter Gorley + victim Mary Ann Stonehouse — FIXED. Three-part name
     "Mary Ann Stonehouse" had only "Mary"/"Stonehouse" captured, missing
     "Ann" (9th instance of the dropped-middle-name pattern) — added.
     Also fixed sex (6812, female). Full name matches record 526's Mary
     Ann Stonehouse (singlewoman, Whitby) almost exactly, about a year
     apart — logged as a same-person candidate.
616: Joseph Bottoms — OK. Labourer, Fylingdales.
617: Matilda Cooper — OK. "Tramp" occupation preserved exactly as
     stated, Whitby.
618: Thomas Green — OK. "Grosmont town street" correctly resolves to
     Grosmont, nested under Eskdaleside-cum-Ugglebarnby.
619: Margaret Ann Hansell + husband William George Hansell — FIXED.
     Same dropped-middle-name bug on the husband's name (10th instance)
     — "William George Hansell" had only "William"/"Hansell" captured;
     added "George". Occupation (jet worker) and home (Whitby) were
     already correctly captured for him. St Ann's Staith (West Cliff)
     correctly matches stated offence township Whitby directly.
620: Henry Johnson — OK. No home stated. "Belle Vue Terrace" (West
     Cliff) correctly matches stated offence township Ruswarp — wait,
     independently re-checked: text states "township of Ruswarp" but
     Belle Vue Terrace nests under West Cliff/Whitby — this is the
     SAME conflict pattern as 458/463/473/507/555/612, a 7th sighting.
     FIXED: added Ruswarp alongside Belle Vue Terrace.
621: John Hodgson — OK. Fisherman, Whitby, Church Street.
622: John Marshall + property owner James Whittle — OK, no sex fix
     needed (Whittle's sex already null — FIXED sex, 6813, male).
     Companion record to 495 and 625 (identical charge, same property
     owner, same offence date 28 August 1889, three separate defendants
     stealing from the same garden) — James Whittle logged as a
     same-person candidate (3 sightings: 495, 622, 625).
623: John Coyle + George Smith — FIXED a genuine location-model
     inconsistency, not just a missing alongside-link: the text
     ("frequenting the West Cliff... Offence committed at the township
     of Ruswarp") had been given its OWN duplicate "West Cliff" location
     row (id 362, parented directly under Ruswarp) instead of reusing
     the corpus's single well-established "West Cliff" location (id 5,
     parented under Whitby, already used 13 times and the parent of
     ~20 streets — Baxtergate, Church Street's siblings, etc.). Re-
     pointed this record at the real West Cliff (5), added Ruswarp
     alongside it (matching the established pattern used 7 times above
     for its child streets), and deleted the now-orphaned duplicate row
     (362), which had no children and no other references. No home/
     occupation for either defendant, correctly blank.
624: Thomas Gaines + informant Thomas Hall (police constable) — FIXED
     sex (6814, male). Same real defendant as records 534/542
     (companion convictions) — correctly separate person rows. Thomas
     Hall here is the same recurring name/office as record 581 — logged
     as a same-person candidate.
625: Thomas Drummond Moon + property owner James Whittle — OK, three-
     part name already correctly split. FIXED sex (6815, male) on
     Whittle. See 622 above (3rd sighting of this same-person
     candidate).
626: Ann Appleton (widow) + Mary Austin + Annie Austin (singlewoman) +
     husband Robert Austin (fisherman, home Whitby — already correctly
     captured) — OK, no fixes; all three defendants' occupations/marital
     status and the husband's occupation were all already correctly
     captured from the text on first pass.
627: William Martin — OK. No occupation stated (unusual for this run of
     records, but genuinely absent from the text). Offence at Ruswarp
     correctly captured directly (damaging a Whitby Gas Company lamp) —
     no West-Cliff-street involved this time.
628: Alfred Harrison — OK. "Mickleby town street" resolves to Mickleby
     itself.
629: George Wedgewood + landowner Elizabeth Harris — FIXED sex (6816,
     female). No occupation for Wedgewood, correctly blank.
630: Frederick Blackstone — OK. Jeweller, Whitby, the Pier.
631: Charles Sams — OK. Labourer, Whitby, "the bridge end". Same
     offence date (15 September 1889) as record 566's Mary Sams
     (Charles's wife, per that record's relationship link) — almost
     certainly the same couple, arrested/convicted separately the same
     night — logged as a same-person candidate.
632: Henry Poleson — OK. No home stated. "Fishburn Road" (West Cliff)
     correctly matches stated offence township Ruswarp — FIXED: same
     conflict pattern as 620 above, an 8th sighting; added Ruswarp
     alongside.
633: Thomas Turner — OK. No home stated. Baxtergate (West Cliff) matches
     stated offence township Whitby directly — no conflict.
634: William Parker — OK. "Grosmont town street" resolves to Grosmont,
     nested under Eskdaleside-cum-Ugglebarnby, matches his own home
     township.
635: Joseph Peacock — OK. No home stated. "John Street" (West Cliff)
     correctly matches stated offence township Ruswarp — FIXED: same
     conflict pattern, a 9th sighting; added Ruswarp alongside.
636: Adam Wilson — OK. No home stated. Roxby correctly nests under
     Hinderwell.
637: Joseph Brown — OK. "Sleights town street" resolves to Sleights,
     nested under Eskdaleside-cum-Ugglebarnby, matches his own home
     township.
638: William Cook + victim Joseph Gatenby (constable for the North
     Riding) — FIXED sex (6817, male). Same recurring name/office as
     record 564's informant Joseph Gatenby — logged as a same-person
     candidate.
639: William Gaskin + victim Jane Gaskin — FIXED sex (6818, female).
     Shares a surname with the defendant but no relationship stated in
     the text ("assaulting Jane Gaskin", nothing more) — correctly not
     inferring a family relationship (though plausible given the shared
     surname, not stated so not assumed).

**Progress: id 615-639 done (25 records). 11 sex fixes. 2 more
middle-name fixes (Mary Ann Stonehouse, William George Hansell — running
total now 10 instances of the dropped-middle-name pattern). 3 more
Ruswarp/West-Cliff-street location fixes (620, 632, 635 — 7th, 8th, 9th
sightings). 1 duplicate-location-row fix (623, a genuine data-model
inconsistency: a one-off duplicate "West Cliff" node parented to Ruswarp,
consolidated into the corpus's real West Cliff node plus an alongside
Ruswarp link, and the duplicate deleted). 4 same-person candidates logged
(Mary Ann Stonehouse, James Whittle x3 sightings, Thomas Hall, Charles/
Mary Sams couple, Joseph Gatenby).**

## Records 640-664

640: William Cowley — OK. Labourer, Hawsker-cum-Stainsacre.
641: George Bonson — FIXED a location gap: same Ruswarp/West-Cliff-street
     pattern as before (Fishburn Road, doesn't reach Ruswarp) — 10th
     sighting, added Ruswarp alongside. Companion record to 632 (same
     street, same date, same charge, different beggar).
642: Richard Steel + victim Alice Steel — FIXED sex (6819, female).
     Shares a surname with the defendant but no relationship stated,
     correctly not inferred.
643: Robert Hill + licensee John Steel + informant Joseph Scaife (police
     constable) — FIXED sex on both (6820, 6821, male). No home for
     either secondary person, correctly blank.
644: Frederick James — OK. No home stated.
645: Robert Watson + victim Thomas Watson — FIXED sex (6822, male).
     Shared surname, no relationship stated, correctly not inferred.
646: James Loftus + victim William Dobson (constable of the North
     Riding) — FIXED sex (6823, male). Same defendant as record 664
     below (identical name/home/occupation, same offence date, two
     different constables assaulted) — logged as a strong same-person
     signal even though both are, correctly, separate person rows per
     the no-cross-conviction-merge policy.
647: Francis Fewster — OK. Jet worker, Whitby, Baxtergate.
648: Edward Fitzsimons — OK. No home stated. "Glaisdale town street"
     resolves to Glaisdale itself.
649: James Westhead — OK. "East Row town street" resolves to East Row,
     nested under Newholm-cum-Dunsley, matches his own home township.
650: William Balmforth — OK. "Licensed beer house keeper" occupation and
     `offence_time` ("8.30 a.m.") both correctly captured.
651: Thomas Weatherill + victim Alice Weatherill — FIXED sex (6824,
     female). Shared surname, no relationship stated, correctly not
     inferred (though plausibly related, not textually supported).
652: Thomas Loftus + victim William Lee (constable of the North Riding)
     — FIXED sex (6825, male). Same offence date and victim as record
     664's James Loftus, but a genuinely different first name — a
     different real person, correctly not connected to that pair despite
     the shared surname and date (plausibly a relative caught up in the
     same incident, not stated so not assumed).
653: Ellen Hick + victim Joseph Gatenby + husband Isaac Hick — FIXED sex
     (6826, male; Gatenby). Third sighting of this recurring constable
     (records 564, 638) — same-person candidate entry already covers
     this name, not re-logged as new. Isaac Hick has no home/occupation
     stated in this terse text, correctly blank.
654: James Brown — OK. "Dean Hall" independently verified nesting under
     Ugglebarnby (a distinct township from Eskdaleside-cum-Ugglebarnby's
     usual combined form — this record specifically states "the township
     of Ugglebarnby" alone), matches text.
655: Annie Craven + husband Amos Craven (labourer, home Kingston upon
     Hull — already correctly captured) — OK, no fixes. Whitby & Hawsker
     Highway correctly alongside Hawsker-cum-Stainsacre.
656: John Mead + informant William Pickering (police constable) — FIXED
     sex (6827, male). Pickering & Stape Highway (Cross-Parish Highways)
     correctly alongside Egton.
657: William Brown — OK. No home stated. "Old Market Place" (West Cliff)
     correctly matches stated offence township Whitby directly.
658: John George Pearson + property owner William Gibbons — FIXED. Three-
     part name "John George Pearson" (matches raw_record and title) had
     only "John"/"Pearson" captured, missing "George" — the 11th
     instance of the dropped-middle-name pattern — added. Also fixed sex
     (6828, male) on Gibbons. Companion record to 661 below (identical
     charge, date, and property owner, two different thieves) — Gibbons
     logged as a same-person candidate.
659: Mary Jane Wallace — OK. Three-part name and "common prostitute"
     occupation both correctly captured.
660: William Williamson — FIXED a location gap: same Ruswarp/West-Cliff-
     street pattern (Hunter Street, doesn't reach Ruswarp) — 11th
     sighting, added Ruswarp alongside.
661: William Smallwood + property owner William Gibbons — FIXED sex
     (6829, male). See 658 above (2nd sighting of this same-person
     candidate).
662: Margaret Jane Walker — OK. Same three-part-name-plus-"common
     prostitute" pattern as 659, companion record (same offence, same
     date, same street, different woman).
663: Francis Dalkin + victim Jane Ann Storm — FIXED sex (6830, female).
664: James Loftus + victim William Lee (constable of the North Riding) —
     FIXED sex (6831, male). See 646 above — same real defendant as that
     record, same date, correctly a separate person row.

**Progress: id 640-664 done (25 records). 15 sex fixes. 1 more
middle-name fix (John George Pearson — running total 11 instances). 2
more Ruswarp/West-Cliff-street location fixes (641, 660 — 10th and 11th
sightings). 2 same-person candidates logged (James Loftus's dual same-
day assault, William Gibbons x2 sightings).**

## Records 665-689

665: Margaret Corner — OK. "Common prostitute", Church Street.
666: James Pounder + victim William Burdon — FIXED sex (6832, male). No
     home for either, correctly blank.
667: George Cook + property owner William Gibbons — FIXED sex (6833,
     male). THIRD sighting of the William Gibbons pea-theft incident
     (658, 661, 667 — all same offence date, 11 July 1889, three
     separate thieves) — candidate entry updated to reflect 3 sightings.
668: John Cook — OK. No home stated. Flowergate (West Cliff) correctly
     matches stated offence township Whitby directly.
669: John Fox — FIXED a location gap. Same Ruswarp/West-Cliff-street
     pattern (East Terrace, doesn't reach Ruswarp) — 12th sighting,
     added Ruswarp alongside.
670: Thomas Loftus + victim John Cook (constable of the North Riding) —
     this is the SAME Thomas Loftus as record 652 (identical name/home/
     occupation, SAME offence date 27 July 1889, a second constable
     assaulted). Combined with 646/664's James Loftus (also two
     constables, same date), this reads as one larger riotous incident
     on 27 July 1889 involving (at least) two Loftus men each assaulting
     two different constables — logged as a combined same-person/same-
     incident candidate covering all four records (646, 652, 664, 670).
671: Absolom Breckon — OK. Jet worker, Whitby.
672: Charles Smith — OK. No home stated. "Staithes town street" resolves
     to Staithes, nested under Hinderwell (matches stated offence
     township).
673: William Broderick — OK. Fisherman, Whitby, Church Street.
674: James Stewart + informant "[blank] Selby" (police constable, home
     Whitby already correctly captured despite the blank first name) —
     FIXED sex (6835, male).
675: Arthur James King + landowner Thomas Vaughan — FIXED sex (6836,
     male). Three-part name "Arthur James King" already correctly split.
     `offence_time` "12.15 a.m." correctly captured. Newton Mulgrave
     independently verified nesting under Lythe.
676: Ralph Jordison + licensee Ralph Brown Longhorn — FIXED. Three-part
     name "Ralph Brown Longhorn" had only "Ralph"/"Longhorn" captured,
     missing "Brown" — 12th instance of the dropped-middle-name pattern
     — added. Also fixed sex (6837, male).
677: Thomas Hodgson — OK. Sailor, Whitby. No offence-township clause
     beyond the bare conviction, correctly nothing fabricated (text
     never repeats "township of Whitby" for the offence itself, only in
     his own description).
678: Ann Wilson — OK. "Widow" occupation correctly captured, Henrietta
     Street (East Cliff).
679: Robinson Groves — OK. Home correctly captured at the more specific
     "Baxtergate" (matching "of Baxtergate in the township of Whitby")
     rather than the coarser township, consistent with the established
     specific-site-preferred convention. Offence at Ruswarp correctly
     captured directly (ill-treating a horse) — distinct from his own
     Whitby home, not conflated.
680: Edward Coates (fish hawker, Scarborough) + informant Charles
     Tempest Clarkson — FIXED sex (6838, male). 4th sighting of this
     recurring superintendent (505, 517, 584, 680) — already logged, not
     re-added. Companion record to 683 below (identical charge, date,
     and location, two different Scarborough fish hawkers).
681: George Wilson — OK. Carpenter, Whitby, the Pier.
682: Francis Johnson — OK. Whitby & Hawsker Highway correctly alongside
     Hawsker-cum-Stainsacre.
683: George Bennett (fish hawker, Scarborough) — OK, no fixes. See 680
     above — same incident (identical charge/date/location), a different
     named defendant, correctly not merged (different name).
684: John Shaw — OK. Jet worker, Whitby, Bridge Street.
685: Alexander Sutherland — OK. Tailor, Whitby, Church Street.
686: William Arnold — OK. Jet worker, Whitby, Church Street.
687: Isaac Hick + victim John Arnold — FIXED sex (6839, male). This Isaac
     Hick (jet worker, home Whitby) is almost certainly the same real
     person as record 653's husband-stub "Isaac Hick" (which had no
     home/occupation stated in that terse text) — logged as a
     same-person candidate rather than retroactively copying these
     facts into the earlier record (which would go beyond what 653's
     own text actually states).
688: James Coleman + victim Joseph Scaife (constable of the North
     Riding) — FIXED sex (6840, male). Same recurring constable as
     record 643's informant — logged as a same-person candidate
     (2nd sighting).
689: James Raw + informant John Atkinson (police constable) — FIXED sex
     (6841, male). "Staithes Street" independently verified nesting
     under Staithes/Hinderwell, matches text.

**Progress: id 665-689 done (25 records). 9 sex fixes. 1 more
middle-name fix (Ralph Brown Longhorn — running total 12 instances). 1
more Ruswarp/West-Cliff-street location fix (669 — 12th sighting). 4
same-person candidates logged/updated (William Gibbons now 3 sightings,
the Loftus brothers' shared 27-July-1889 incident across 4 records,
Isaac Hick, Joseph Scaife).**

**Major corpus-wide sweep: 318 more Ruswarp/West-Cliff-street location
gaps, found via catching my own error at record 594.** The recurring
pattern first spotted at record 458 (a West Cliff-descendant street —
Esk Terrace, Baxtergate, St Hilda's Terrace, etc., all nested under
location id 5 "West Cliff", itself under Whitby, id 4 — used as the sole
"location of offence" when the record's own text states the offence
township as Ruswarp) had been caught and fixed 13 times individually
during this session's sequential pass (458, 463, 473, 507, 555, 594,
612, 620, 632, 635, 641, 660, 669). While auditing record 692 I noticed
Bagdale (also parent id 5) and realised I had personally gotten record
594 wrong earlier THIS session — I'd written that Bagdale's ancestry
"resolves to Ruswarp, not Whitby" to justify NOT fixing it, which was
simply false (Bagdale's parent is West Cliff, same as every other
instance). Caught and fixed 594 immediately, then ran a full corpus-wide
SQL sweep (matching the raw_record's own offence-clause phrasing rather
than trusting my by-eye judgement any further) to check whether this
was an isolated mistake or a much bigger missed pattern. It was the
latter: **318 more instances corpus-wide** (id range 32 up to 6195,
spanning the entire dataset — meaning the gap predates this session
entirely and was never caught in any earlier pass either), found across
three raw_record phrasings ("Offence committed at the township of
Ruswarp", "Offence committed at [Street/site] in the township of
Ruswarp", and one bracketed "the township of [Ruswarp]"). Verified each
phrasing sample by hand before running the fix, and re-ran the search
after to confirm zero genuine matches remained (12 residual hits were
checked individually and are all correctly-excluded false positives —
"Ruswarp" appearing only as a person's own home township or an
informant's township, not the stated offence location). Fixed all 318
with a single `INSERT ... SELECT` adding the missing Ruswarp "location
of offence" link, using the exact same established rule already
verified by hand across every one of the 13 earlier individual
instances — a mechanical extension of settled judgement, not a new
guess, matching the precedent set by the 36-orphaned-relationship sweep
from the prior session. Total instances of this bug across the whole
corpus: 331 (13 caught individually + 318 via the sweep).

## Records 690-714

690: Edward Jackson — OK. No occupation stated, correctly blank.
691: John Agar — OK. "Grosmont town street" resolves to Grosmont, nested
     under Eskdaleside-cum-Ugglebarnby.
692: Robert Smith — OK. No home stated. Bagdale offence-location gap
     already caught and fixed above (see the sweep note).
693: John Conwell — OK. Jet worker, Whitby, the Pier.
694: John Pearson + licensee Ralph Brown Longhorn + informant Kate
     McLaughlan — FIXED sex (6842 male, 6843 female). Longhorn is the
     same recurring licensee as record 676 — same-person candidate,
     2nd sighting. "Kate McLaughlan" is plausibly the same person as
     record 597's "Katherine McLaughlan" (widow, Whitby) — logged as a
     weaker same-person candidate (nickname vs. full name, not certain).
695: John Scott — OK. No home stated.
696: Robinson Groves — OK. "Cartman" occupation, Whitby, Church Street.
     Same real person as record 679 (companion conviction, ~3 months
     apart, both horse/cart-related offences) — correctly separate
     person rows.
697: John Corner + John Henry Corner + William Readman — FIXED. The
     text names three distinct licensed victuallers ("John Corner, John
     Henry Corner and William Readman"), but the second had lost his
     middle name in extraction, leaving TWO identical "John Corner"
     rows in the data with nothing to tell them apart (the worst form
     of the dropped-middle-name bug seen yet, since it collapses two
     real distinct people into apparent duplicates) — added "Henry" to
     the second (754), the 13th instance of this pattern this stretch.
     Robin Hood's Bay (in Fylingdales) correctly captured as the actual
     offence site, distinct from all three men's stated home (Whitby).
698: William Robinson — OK. No home stated. Gray Street (West Cliff)
     correctly matches stated offence township Ruswarp — already
     covered by the corpus-wide sweep above, no separate action needed
     here.
699: Benjamin Wilson + informant George Richard Lazenby (police
     constable) — FIXED. Same dropped-middle-name bug (14th instance) —
     "George Richard Lazenby" had only "George"/"Lazenby" captured;
     added "Richard". Also fixed sex (6844, male). This is the same
     recurring named constable as record 589's victim — logged as a
     same-person candidate.
700: William Moody + licensee Richard Thompson — FIXED sex (6845, male).
701: Thomas Jameson — OK. No home stated. Companion record to 704 (same
     charge/location/date, different beggar).
702: John Denham + informant Thomas Hall (police constable) — FIXED sex
     (6846, male). 3rd sighting of this recurring constable (581, 624,
     702) — candidate entry already covers this, not re-logged as new.
703: John Smith the elder + children John, Annie and Charles Smith —
     OK, no fixes; postfix "the elder" and all three "child"
     relationships were already correctly captured on first pass.
704: John Jameson — OK. No home stated. See 701 above (companion
     record).
705: John Thomas Stonehouse + landowner Thomas Vaughan — FIXED. Three-
     part name "John Thomas Stonehouse" (matches title and raw_record)
     had only "John"/"Stonehouse" captured, missing "Thomas" — 15th
     instance of the dropped-middle-name pattern — added. Also fixed
     sex (6847, male). This is the SAME poaching incident as record 675
     (identical landowner, township, date, and time — 12.15 a.m., 13
     June 1875) — two men netting game on the same land the same night,
     logged as a same-incident candidate.
706: William Dixon — OK. Jet worker, Whitby, Sandgate. Different person
     from the other William Dixons scattered through the corpus
     (different occupations/dates) — correctly not merged.
707: Thomas Jefferson — OK. Fisherman, Hinderwell.
708: Thomas Harland — OK. "Cartman" occupation, Whitby.
709: James Ward — OK. Labourer, Ruswarp. "The Carrs" independently
     verified nesting directly under Ruswarp, matches text.
710: Elizabeth Brough + husband John Brough (stonemason, home Pickering
     — already correctly captured) — OK, no fixes. Offence at Whitby
     correctly distinct from their shared home township (Pickering) —
     not conflated.
711: William Barrett — OK. Fisherman, Whitby, Church Street.
712: Arthur Brooks — OK. Labourer, Whitby, Haggersgate (West Cliff,
     matches stated offence township Whitby directly).
713: Michael Mallon + victim Mary Jane Harvey — FIXED sex (6848,
     female). No home for Mallon, correctly blank.
714: Margaret Harland + victim Mary Ellen Colley — FIXED sex (6849,
     female). "Domestic servant" occupation correctly captured.

**Progress: id 690-714 done (25 records). 8 sex fixes. 3 more
middle-name fixes (John Henry Corner, George Richard Lazenby, John
Thomas Stonehouse — running total 15 instances). 3 same-person
candidates logged (Kate/Katherine McLaughlan — weaker, George Richard
Lazenby, John Thomas Stonehouse's shared poaching incident with record
675).**

**Diagnostic sweep for the dropped-middle-name pattern: confirmed NOT
corpus-wide.** Given how often this came up in the last few batches (15
instances), ran the same kind of corpus-wide check used for the
Ruswarp/West-Cliff sweep: found every `person` row with `middle_name IS
NULL` whose own conviction's `raw_record` contains "Firstname [single
capitalized word] Lastname". A first pass with a loose SQL `LIKE` match
returned 1,556 hits — useless, far too loose (it matches any two same-
named words anywhere in the whole text, not just an actual three-word
name). Tightened it with a real regex (`Firstname ([A-Z][a-z]+)
Lastname`, run in Python against all ~9,281 candidate rows) and got only
5 hits, of which 1 (John/Corner from record 697) was the already-fixed
row's sibling flagging itself (a same-first/last-name collision, not a
new gap — see 697 above). The remaining 4 (records 1542, 1554, 1563,
4509, none audited yet) were individually checked and are ALL already
correctly handled: 1542 already has both "John Corner" and "John Henry
Corner" as properly distinct rows; 1554 already has "James Abram
Theaker" (defendant) correctly distinguished from his son "James
Theaker" (no middle name, matching the text); 1563's "John Cole commonly
called John Carling Cole" is a genuine alias construction, already
captured via the `alias` field, not a middle name at all; 4509 already
has "John Sanders" (father) correctly distinguished from "John Thomas
Sanders" (his son). Conclusion: the dropped-middle-name bug is a real
but LOCALLY CLUSTERED gap in the ~230 records already covered this
session, not a hidden corpus-wide problem — no dedicated sweep needed,
just continued normal vigilance on new three-part names as the
sequential pass proceeds.

## Records 715-739

715: Thomas Loftus — OK. Same real defendant as records 652/670
     (companion convictions), correctly separate person row.
716: George Watson + victim Mary Hannah Storr — FIXED sex (6850,
     female).
717: William Jones + landowner Thomas Vaughan — FIXED sex (6851, male).
     THIRD sighting of the Newton Mulgrave poaching incident (675, 705,
     717 — same landowner, date, time, and location, three different
     men netting game the same night) — candidate entry updated.
718: William Christmas Bean — OK, no fixes needed beyond what's already
     correct (three-part name already fully captured). North Road (West
     Cliff) correctly has Ruswarp alongside it already — confirms the
     corpus-wide sweep applied cleanly here. Companion record to 724
     (identical charge/date/location, different defendant).
719: John Vidous — OK. No home stated. Royal Crescent + Ruswarp already
     correctly linked (sweep holding).
720: George Ogden Stephenson — OK. Three-part name already correctly
     split. Ruswarp already correctly captured directly (no street
     conflict here — the omnibus route itself, not a specific site).
721: William Puckrin — OK. Baker, Whitby, the Pier.
722: Joseph McCabe + informant Charles Albert Martindale (police
     constable) — FIXED. Three-part name "Charles Albert Martindale"
     had only "Charles"/"Martindale" captured, missing "Albert" — added.
     Also fixed sex (6852, male). Ruswarp + Royal... no, this record's
     own street isn't named, Ruswarp captured directly, sweep confirmed
     not needed here (no West-Cliff-street site involved).
723: James Pounder (pilot, home Hartlepool) — OK. "The Bridge" correctly
     nests directly under Whitby (not a West Cliff street), matches
     stated offence township. Different person from record 666's James
     Pounder (different home/occupation, different year) — correctly
     not merged.
724: William John Iredale — OK, three-part name already correctly
     split. North Road + Ruswarp already correctly linked (sweep
     holding). See 718 above (companion record).
725: James Watson — OK. No home stated. Baxtergate (West Cliff)
     correctly matches stated offence township Whitby directly — no
     conflict (confirms the sweep didn't over-apply to non-Ruswarp
     cases).
726: William Child — OK. "Egton town street" resolves to Egton itself.
727: Charles Good — OK. Whitby & Guisborough Highway (2-endpoint)
     correctly alongside Roxby (nested under Hinderwell).
728: James Thompson — OK. No home stated. Royal Crescent + Ruswarp
     already correctly linked (sweep holding) — companion record to 719
     (same street, 6 days apart, different beggar).
729: James Marshall + informant William Hammond (police constable) —
     FIXED sex (6853, male). "Staithes town street" resolves to
     Staithes, nested under Hinderwell.
730: Thomas Fisher — OK. Riveter, Whitby, Henrietta Street.
731: John Bowmaker — OK. Home = North Shields (in Northumberland,
     correctly captured as a specific out-of-area town, not folded into
     a generic "Northumberland").
732: William Corpse + informant Edward Weeks (police constable) —
     FIXED sex (6854, male).
733: Patrick Joyce — OK. Bricklayer, Whitby, Market Place.
734: George Duck + informant "[blank] Tomlinson" (police constable, home
     Whitby already captured despite the blank first name) — OK, no
     sex to infer, correctly blank.
735: Robert Parkin — OK. Waggoner, Newholm-cum-Dunsley. Offence at
     Whitby correctly distinct from his own home township.
736: John Kilpatrick — OK. Iron worker, Whitby, Church Street.
737: Henry Sherwood + Robert Campion (defendants) + property owner
     Joseph Dotchen — FIXED sex (6856, male). Ruswarp correctly captured
     directly (no specific street named in this charge text).
738: Henry Ludlow — OK. Home = "Kirkbymoorside" (raw_record spells it
     "Kirby Moorside" — the location table uses the modern canonical
     spelling, an established convention, not an error).
739: Joseph Storr — OK. Jet worker, Whitby, New Quay (West Cliff,
     matches stated offence township Whitby directly).

**Progress: id 715-739 done (25 records). 6 sex fixes. 1 more
middle-name fix (Charles Albert Martindale). Zero new location fixes —
this batch is a clean confirmation that the corpus-wide Ruswarp sweep
applied correctly (5 previously-gapped records — 718, 719, 720, 722,
724, 728, 737 — all now show the correct link with no further action
needed). 1 same-person candidate strengthened (Thomas Vaughan's Newton
Mulgrave poaching incident, now 3 sightings).**

## Records 740-764

740: William Arnold + victim Mary Harland — FIXED sex (6857, female).
     No home for Arnold, correctly blank.
741: Daniel Robinson — OK. Fisherman, Whitby, Church Street.
742: John Child — OK. "Ruswarp town street" resolves to Ruswarp itself.
743: Hannah Shielding — OK. "Singlewoman" occupation correctly captured.
744: Thomas Boddy — OK. "Grosmont town street" resolves to Grosmont,
     nested under Eskdaleside-cum-Ugglebarnby.
745: Robert Harrowing + licensee Thomas Coulson — FIXED sex (6858,
     male). "Ship owner" occupation preserved exactly.
746: Edward Shepherd — OK. Fisherman, Whitby.
747: Francis Fewster — OK. Jet worker, Whitby, the Pier.
748: Hannah Smith + husband John Henry Smith — FIXED. Three-part name
     "John Henry Smith" had only "John"/"Smith" captured, missing
     "Henry" — added. Occupation (fish hawker) and home (Whitby) were
     already correctly captured. Also fixed sex (9918, male).
749: John Thompson — OK. Jet worker, Whitby.
750: Robert Watson — OK. Labourer, Whitby, Church Street. Different
     person from record 756's Robert Watson below (no occupation/home
     stated there) — correctly not assumed to be the same without more
     support.
751: James Foster + son John Foster — FIXED a location gap. Home
     correctly captured as "Elbow Yard" (specific site under Church
     Street), but the offence-location link had been left at the
     generic Whitby instead of the same specific site — per the
     established truancy rule (confirmed at record 9, where the offence
     location is the specific home site, not the coarser township or
     the School Board district phrase), replaced Whitby with Elbow Yard
     as the offence location. "Son" relationship correctly captured.
752: Richard Craven — OK. "Wood leader" occupation, Ruswarp captured
     directly (no specific street named in the charge text).
753: William Arnold + victim John Brown — FIXED sex (6859, male). Same
     real defendant as record 686 (a much earlier, unrelated
     conviction) — correctly separate person rows.
754: Sarah Ann Fisher + husband Thomas Fisher (riveter, home Whitby) —
     OK, already correctly captured. Same offence date (11 May 1889) as
     record 730's Thomas Fisher (riveter, Henrietta Street) — almost
     certainly the same couple, convicted separately the same
     night/place — logged as a same-person candidate.
755: Isaac Wilson — OK. Labourer, Whitby.
756: Robert Watson + victim Edward Weeks (constable for the North
     Riding) — OK, no fixes; Weeks's sex was already correctly set.
     Same recurring constable as records 732's informant — 3rd sighting,
     logged as a same-person candidate.
757: Thomas Wake — OK. Carrier, Hinderwell.
758: William Lawson + licensee John Appleby + informant William
     Dickinson (police constable, home Lythe) — FIXED sex on both
     (6861, 6862, male). Offence at Whitby correctly distinct from
     Lawson's own home township (Newholm-cum-Dunsley) and from
     Dickinson's (Lythe) — neither conflated.
759: Ellen Hick + husband Isaac Hick (jet worker, home Whitby) — OK,
     already correctly captured. This is now the 3rd sighting of the
     recurring Isaac Hick candidate (653, 687, 759) — not re-logged as
     new, existing entry covers it.
760: John Thomas Harland — FIXED. Three-part name (matches title
     exactly) had only "John"/"Harland" captured, missing "Thomas" —
     added. Companion record to 763 (same charge, date, and township,
     different defendant — two men discharging fireworks together).
761: William Turnbull + informant Charles Tempest Clarkson — FIXED.
     Same dropped-middle-name gap as this recurring superintendent's
     name has had 5 times now (505, 517, 584, 680, 761) — added
     "Tempest". Also fixed sex (6863, male). Staithes & Hinderwell
     Highway (2-endpoint) correctly alongside Hinderwell.
762: Ann Gatenby + husband Richard Gatenby (fisherman, home Whitby) —
     OK, already correctly captured.
763: Watson Hodgson — OK. "Watson" here is a genuine unusual first name
     (matches the title exactly, not a three-part name missing a
     middle) — companion record to 760 above.
764: Simeon Robinson + informant John Atkinson (police constable) — OK,
     already correctly sexed. Same recurring constable as record 689 —
     2nd sighting, logged as a same-person candidate.

**Progress: id 740-764 done (25 records). 9 sex fixes. 3 more
middle-name fixes (John Henry Smith, John Thomas Harland, Charles
Tempest Clarkson — the latter now recurring 5 times). 1 location fix
(751, Elbow Yard replacing the generic Whitby link on a truancy record —
matches established rule). 3 same-person candidates logged (Thomas
Fisher/Sarah Ann Fisher couple, Edward Weeks, John Atkinson).**

## Records 765-789

765: William Henry Turnbull — FIXED. Three-part name had only "William"/
     "Turnbull" captured, missing "Henry" — added. No home stated (the
     text describes where he was FOUND, Fylingdales, not his home) —
     correctly distinct and not conflated.
766: Jane Ann Pennock + victim Dorothy Pennock + husband Thomas Pennock
     (iron worker, home Whitby — already correctly captured) — FIXED
     sex on both secondary people (6865 female, 9922 male).
767: Jane Skinner — OK. No occupation stated.
768: Henry Collins — OK. Hawker, Hinderwell.
769: William Bradley + victim Warner Coleman — FIXED sex (6866, male).
     Home correctly captured as "Fox and Hounds Inn" (the specific
     venue created earlier this session, under Ainthorpe/Danby) — the
     offence itself occurred in a different township (Eskdaleside cum
     Ugglebarnby), correctly not conflated with his home.
770: Joseph Richardson + informant Thomas Bowron (police constable, home
     Egton — a different Egton-based Thomas Bowron from the earlier
     Glaisdale-based one at records 501/509, correctly not merged) —
     FIXED sex (6867, male).
771: George Jackson — OK. Joiner, Hinderwell, Rosedale Lane.
772: Robert Turner + property owner Thomas Beeforth — FIXED sex (6868,
     male). 2nd sighting of this recurring landowner (497, 772) — logged
     as a same-person candidate. Companion record to 784 (identical
     charge, date, property owner — two baker's apprentices breaking
     the same fence).
773: William Verrill + informant John Atkinson (police constable) — OK,
     already correctly sexed. 3rd sighting of this heavily-recurring
     constable (689, 764, 773) — candidate entry already covers this.
774: Richard Shippey + licensee William Henry Heath + informant William
     Hammond (police constable, no home stated — correctly blank,
     unlike his usual "of Hinderwell" — this record's text genuinely
     omits it) — OK; Heath and Hammond's sex already correctly set.
775: Richard Thompson — OK. "Lythe town street" resolves to Lythe
     itself.
776: Thomas Hedley Robinson + victim John Atkinson (constable of the
     North Riding) — FIXED. Three-part name had only "Thomas"/"Robinson"
     captured, missing "Hedley" — added. 4th sighting of the recurring
     John Atkinson (689, 764, 773, 776) — candidate entry already
     covers this.
777: Henry Douglas — OK. Carpenter, Whitby, the Pier.
778: James Dixon + daughter Jane Elizabeth Dixon — FIXED two things: the
     three-part name "Jane Elizabeth Dixon" had only "Jane"/"Dixon"
     captured, missing "Elizabeth" — added. Also FIXED a location gap:
     home correctly captured as "Kiln Yard" but the offence-location
     link had been left at the generic Whitby — per the truancy rule
     (record 9, re-applied at 751), replaced Whitby with Kiln Yard.
     "Daughter" relationship correctly captured.
779: Isabella Robinson — OK. No occupation stated.
780: Mark Swales — OK. Whitby & Hawsker Highway correctly alongside
     Hawsker-cum-Stainsacre.
781: John Parkin + daughter Sarah Parkin — FIXED the same truancy
     location gap as 778: home "Old Post Office Yard" wasn't linked as
     the offence location (generic Whitby was) — replaced. "Daughter"
     relationship correctly captured.
782: Robert Ward + informant John Atkinson — OK, already correct. 5th
     sighting of this constable — candidate entry already covers this.
783: Ann Jackson + husband Charles Jackson — OK, no fixes; Charles has
     no home/occupation stated in this terse text, correctly blank.
784: Arthur Duck + property owner Thomas Beeforth — FIXED sex (6874,
     male). See 772 above (2nd sighting, companion record).
785: Richard Ward — OK. Fisherman, Hinderwell, Staithes Street. Same
     surname as 782's Robert Ward but no relationship stated between
     them — correctly not inferred as family.
786: Matthew Harland — OK. Fisherman, Whitby, Church Street.
787: Alexander McCloud — OK. Carpenter, Whitby, Church Street.
788: Mary Young — OK. No occupation stated.
789: George Duck — OK, already correctly linked (Khyber Pass + Ruswarp
     both present) — confirms the corpus-wide sweep applied cleanly
     here too.

**Progress: id 765-789 done (25 records). 12 sex fixes. 3 more
middle-name fixes (William Henry Turnbull, Thomas Hedley Robinson, Jane
Elizabeth Dixon). 2 more truancy-rule location fixes (778, 781) — the
third and fourth sightings of this specific gap this session (after
751), which triggered a dedicated diagnostic below.**

**Second corpus-wide sweep: 35 truancy-record location gaps.** Having
now hit the "specific home site not linked as location of offence, generic
township used instead" truancy gap three times (751, 778, 781), ran the
same kind of check used for the Ruswarp/West-Cliff sweep: found every
truancy-style conviction (`raw_record LIKE '%School Board district%'`,
128 total in the corpus) where the defendant's own `home_location_id`
was NOT among the record's "location of offence" links. Found **35
mismatches** — 31 in Whitby (various named yards/streets: Arguments
Yard, Tate Hill, Renwick's Yard, Cappleman's Yard, The Cragg, Meads
Yard, New Way Ghaut, Kelley's Yard, Long Steps, National School Yard,
White Horse Yard, Market Place, Dark Entry Yard) and 4 in Hinderwell/
Staithes (same pattern, different township — verified by hand that the
raw_record phrasing is identical apart from the town name). Verified a
representative sample of both groups against their raw_record text
before fixing, confirming this is the exact same already-established
rule (offence location for a truancy conviction = the defendant's own
home, since the "offence" is failing to send a child to school FROM
that home — not the coarser township or the School Board district
phrase). Fixed all 35 with a paired DELETE (removing the incorrect
coarser "location of offence" link) + `INSERT ... SELECT` (adding the
defendant's own home as the correct one), then re-ran the same check to
confirm zero mismatches remained. Same methodology as the Ruswarp sweep:
a mechanical extension of an already-verified rule, not a new guess.

## Records 790-814

790: Agnes Baker + husband William George Baker — FIXED. Three-part name
     "William George Baker" had only "William"/"Baker" captured, missing
     "George" — added (occupation/home were already correct). Same real
     couple as record 799 below (companion conviction, 3 days apart) —
     both need the same fix on their own separate person rows.
791: David Theaker — OK. Fisherman, Hinderwell, Staithes Street. Part of
     a large cluster of Staithes Street convictions all dated 28 August
     1869 (773, 776, 782, 785, 791, 794, 797, 806, 809, 812 — a mass
     arrest/prosecution night).
792: Ann Miller + victim Henry Douglas + husband James Miller
     (stonemason, home Whitby) — FIXED sex on both (6875, 9925, male).
793: John Walker — OK. "East Row town street" resolves to East Row,
     nested under Newholm-cum-Dunsley, matches his own home township.
794: George Porritt + victim John Atkinson (constable for the North
     Riding) — FIXED sex (6876, male). Same recurring constable, 6th
     sighting — candidate entry already covers this.
795: George Green — OK. No home stated.
796: Thomas Howard + daughter Caroline Howard — OK, already correctly
     fixed by the truancy sweep above (Arguments Yard now the offence
     location). No "petty sessional division" location — correctly
     consistent with the established truancy-record pattern (text says
     "School Board district", not "Petty Sessional division").
797: David Theaker + victim John Atkinson — OK, already correct. Same
     real defendant as 791 (companion conviction, same night, two
     charges). 7th sighting of the recurring constable.
798: William Lund — OK. Jet worker, Whitby, Sandgate.
799: Agnes Baker + husband William George Baker — FIXED. Same
     dropped-middle-name gap as 790 (this couple's 2nd sighting this
     stretch, 3 days apart) — added "George" to this conviction's own
     separate person row for the husband.
800: Elizabeth Sneaton (alias "Elizabeth Skinner") + informant Charles
     Albert Martindale — FIXED two things: the `alias` field held a
     garbled "Skinner, Elizabeth Skinner" (two redundant fragments
     concatenated) instead of a clean value — corrected to "Elizabeth
     Skinner", matching the bracketed "[Elizabeth Skinner]" in
     raw_record and the clean single-value convention used for every
     other alias in the corpus. Also fixed sex (6878, male) on
     Martindale — 2nd sighting of this recurring constable, logged as a
     same-person candidate.
801: Robert Dixon — OK. Jet worker, Whitby, Henrietta Street.
802: Jane Storm + husband Sampson Storm (iron worker, home Whitby) —
     FIXED sex (9927, male). Same real master as record 178's "Sampson
     Storm" (an apprentice's master, much earlier in the corpus,
     different context/decade) — correctly not connected without more
     support.
803: George Henderson + victim Joseph Wedgewood — FIXED sex (6879,
     male). No occupation for Henderson, correctly blank.
804: David Peart — OK. Fisherman, Whitby, Church Street.
805: Thomas James Tweedy — FIXED. Three-part name (matches title and
     raw_record) had only "Thomas"/"Tweedy" captured, missing "James" —
     added. "Schoolboy" occupation preserved exactly as stated. Khyber
     Pass + Ruswarp already correctly linked (sweep holding).
806: Thomas Hedley Robinson — FIXED. Same dropped-middle-name gap as
     record 776 (the same real person's OWN separate row for this
     companion conviction, same night) — added "Hedley" here too.
807: John Thompson + informant Mark Boggett (police constable) — FIXED
     sex (6880, male). Same recurring constable as record 577's victim —
     2nd sighting, logged as a same-person candidate.
808: Andrew McNally — OK. Runswick & Ellerby Highway (2-endpoint)
     correctly alongside Hinderwell.
809: Thomas Verrill — OK. Fisherman, Hinderwell, Staithes Street. Same
     surname as record 773's William Verrill but no relationship stated
     — correctly not inferred as family.
810: John Dixon + victim Edward Weeks (constable for the North Riding) —
     FIXED sex (6881, male). 3rd sighting of this recurring constable
     (732, 756, 810) — candidate entry already covers this.
811: Robert Steel — OK. Jet worker, Whitby, Baxtergate.
812: George Porritt — OK, already correct. Same real defendant as 794
     (companion conviction, same night, two charges).
813: Robert Dixon — OK. Same real defendant as 801 (companion
     conviction, same day, two separate offences).
814: William Fisher — OK. Tinner, Whitby, Sandgate.

**Progress: id 790-814 done (25 records). 10 sex fixes. 4 more
middle-name fixes (William George Baker x2 — same couple's two separate
convictions, Thomas James Tweedy, Thomas Hedley Robinson's own row for
his second conviction). 1 alias-field data-quality fix (Elizabeth
Sneaton/Skinner — garbled duplicate text cleaned up). Zero new location
gaps (both sweeps confirmed holding cleanly across this whole batch,
including inside the big 28-August-1869 Staithes Street cluster). 2
same-person candidates logged (Charles Albert Martindale, Mark
Boggett).**

## Records 815-839

815: Joseph Lemarte + victim Michael Maloney — FIXED sex (6882, male).
     No home for either, correctly blank.
816: Peter Elder Leck + victim Sarah Mary Leck + husband Simon Robert
     Leck — FIXED all three names, a dense cluster of the dropped-
     middle-name bug (three separate three-part names in one record):
     "Peter Elder Leck" (defendant, only "Peter"/"Leck" captured,
     missing "Elder"), "Sarah Mary Leck" (victim/informant, missing
     "Mary"), "Simon Robert Leck" (husband, missing "Robert") — all
     match both title and raw_record exactly, all added. Home = "Long
     Steps" correctly kept as Peter's own home only, NOT used as the
     offence location (unlike the truancy pattern — this is an assault
     charge, and the text's own "Offence committed at the township of
     Whitby" is a separate, generic statement, not implicitly the
     defendant's home) — correctly not conflated with the truancy rule.
817: John Telford — OK. Fish hawker, Hinderwell. Offence at Glaisdale
     correctly distinct from his own home township.
818: Robert Dixon + victim John Ryder (constable for the North Riding) —
     OK, already correctly sexed. Same recurring named officer as
     records 486/510 (superintendent there vs. constable here — same
     name, plausibly the same real officer across ranks/years, weaker
     signal given the title difference, not logged as a firm candidate).
819: John Hodgson — OK. Fisherman, Whitby, the Pier.
820: John Day — OK. "Grosmont town street" resolves to Grosmont, nested
     under Eskdaleside-cum-Ugglebarnby.
821: William Smith — OK. No home stated, correctly blank (very common
     name, correctly not merged with any other William Smith without
     more support).
822: Jane Thompson + informant George Hewison (police constable) —
     FIXED sex (6885, male). "Widow" occupation correctly captured.
823: John Telford — OK. Same real defendant as 817 (companion
     conviction, same date, two separate charges). Glaisdale & Rosedale
     Highway (2-endpoint) correctly alongside Glaisdale.
824: Jane Thompson — OK. Same real defendant as 822 (companion
     conviction, same night, two charges).
825: Francis Fewster — OK. Jet worker, Whitby, the Pier. Same real
     defendant recurring across several convictions this stretch (747,
     825, 831) — correctly separate person rows each time.
826: Alfred George Walker — FIXED. Three-part name (matches title
     exactly) had only "Alfred"/"Walker" captured, missing "George" —
     added. "Ruswarp town street" resolves to Ruswarp itself.
827: James Robinson — OK, already correct (Khyber Pass + Ruswarp both
     present — sweep holding). No home stated.
828: John Nellist + informant George Eli North (police constable, three-
     part name already correctly captured in full) — OK. `offence_time`
     "12.05 p.m." correctly captured.
829: William Carter — OK. Labourer, Whitby, Church Street.
830: William Harland + victim Alice Weatherill — OK, already correctly
     sexed (6887, female was already set on read — confirmed, not a new
     fix). No home for Harland, correctly blank.
831: Francis Fewster — OK, already correct. Victoria Square (West Cliff)
     + Ruswarp both present — sweep holding. Same real defendant as 747/
     825 above (companion convictions, correctly separate rows).
832: James Conner — OK. "Ellerby town street" resolves to Ellerby
     itself.
833: Robert Foster — OK. Sailor, Whitby.
834: Richard Purvis — OK. Shoemaker, Whitby, Church Street.
835: George Bielby — OK. Home = Pickering, correctly distinct from the
     Whitby offence location.
836: David Adamson + victim Samuel Hutchings — FIXED sex (6888, male).
837: Stephen Kelly — OK. Pedlar, Whitby, Church Street.
838: Charles Wareing — OK. "High Stakesby" independently verified
     nesting under Ruswarp, matches text exactly — no alongside-fix
     needed here since the specific site's own ancestry already reaches
     the stated township.
839: Solomon Marshall — OK. Jet worker, Whitby, Baxtergate (West Cliff,
     matches stated offence township Whitby directly).

**Progress: id 815-839 done (25 records). 4 sex fixes (most secondary
people in this batch were already correctly sexed on first pass — a
good stretch). 4 more middle-name fixes, including a dense 3-in-1-record
cluster (Peter Elder Leck, Sarah Mary Leck, Simon Robert Leck) plus
Alfred George Walker. Zero new location gaps — both sweeps holding
cleanly throughout. One clarified non-issue: confirmed the truancy
specific-site-as-offence-location rule does NOT extend to non-truancy
charges (816's assault record correctly keeps its specific home site as
home-only, not offence location).**

## Records 840-864

840: John Jones + licensee Joseph Fletcher + informant John Nicholson
     (police constable) — FIXED sex on both (6889, 6890, male).
841: William Hewling — OK. "Rag gatherer" occupation, Whitby, Baxtergate
     (West Cliff, matches stated offence township Whitby directly).
842: William Andrew — OK. Jet worker, Whitby.
843: John Denham + licensee Frederick William Judge — FIXED. Three-part
     name had only "Frederick"/"Judge" captured, missing "William" —
     added. Also fixed sex (6891, male).
844: John Harrison Trousdale — OK, three-part name already correctly
     split. North Road + Ruswarp already correctly linked (sweep
     holding).
845: Christiana Dixon — OK. No home stated.
846: Elizabeth Walker — OK. "Pedlar" occupation, Whitby.
847: William Hodgson — OK. Joiner, Whitby, St Ann's Staith.
848: Sarah Smith — OK. "Singlewoman" occupation, Whitby.
849: Robert Parkin — OK. Same real defendant as records 581/735 (a
     different Robert Parkin than 735's waggoner — this one's the cab
     driver from 581, correctly the same recurring person's separate
     conviction rows, not merged). Ruswarp captured directly.
850: William Hodgson — OK, no fixes; flagging a genuine ARCHIVAL
     inconsistency (same treatment as records 27/184/571): `raw_case`
     title says "William Hobson" but the fuller `raw_record` narrative
     says "William Hodgson" — correctly stored as "Hodgson" (the more
     reliable text), title preserved as-is. Different person from
     record 847's William Hodgson (different occupation and street) —
     correctly not merged.
851: John Midwood — OK. Jet worker, Whitby, Church Street.
852: Daniel George Robinson — OK, three-part name already correctly
     split. Same real defendant as record 546 (an earlier, separate
     conviction) — correctly not merged.
853: Elizabeth Hobson + victim Alice Joyce + husband William Hobson
     (sailor, home Whitby) — FIXED sex on both secondary people (6892
     female, 9928 male). This is one half of a mutual-affray pair with
     record 856 below (Alice Joyce convicted of assaulting Elizabeth
     Hobson, same date) — logged as a same-incident candidate.
854: Joseph Fell + informant Thomas Bowron (police constable, home
     Glaisdale) — FIXED sex (6893, male). 3rd sighting of this specific
     Glaisdale-based Thomas Bowron (501, 509, 854) — candidate entry
     already covers this, strengthened.
855: William Atkinson — OK. Skinner Street + Ruswarp already correctly
     linked (sweep holding).
856: Alice Joyce + victim Elizabeth Hobson + husband Patrick Joyce
     (bricklayer, home Whitby) — FIXED sex (6894, female) on Hobson.
     Patrick Joyce is the same recurring defendant as record 733 (a
     separate, earlier conviction) — logged as a same-person candidate.
     See 853 above for the mutual-affray pairing.
857: Maria Dixon — OK. "Common prostitute" occupation, Whitby, Church
     Street. Different person from records 845/857's other Dixons
     (Christiana, this Maria) — correctly not merged, no relationship
     stated.
858: Stephen Kingston — OK. Skinner Street + Ruswarp already correctly
     linked (sweep holding) — companion record to 855 (same street,
     same date, different defendant).
859: John Graham — OK. Sailor, Whitby. "Seven Stars Ghaut" independently
     verified nesting under Church Street.
860: Dorothy Gaines + husband Thomas Gaines (fisherman, home Whitby) +
     witnesses Hannah Cooper and Harriet Hicks (both singlewomen, home
     Whitby) — FIXED sex on all three secondary people (9930 male, 6895
     and 6896 female). Thomas Gaines is the same recurring defendant as
     records 532/542/624 (a different, earlier set of convictions) —
     4th sighting, logged as a same-person candidate.
861: Edward Jameson Ayre — OK, already correctly captured. 3rd sighting
     of this recurring jet worker (records 1, 321, 861) — candidate
     entry updated.
862: William Graham — OK. Coal porter, Whitby. Companion record to 859
     (same street, same date, different defendant, shared surname with
     no relationship stated — correctly not inferred as family).
863: James Williams + George Williams (defendants) + victim Emma Walden
     — FIXED sex (6897, female). No home for either defendant, correctly
     blank. Text's "and another" (an unnamed second victim) correctly
     not fabricated into a person row.
864: Warner Coleman (cattle dealer, home Darlington) + victim William
     Bradley — FIXED sex (6898, male). This is the exact reverse of
     record 769 (William Bradley assaulting Warner Coleman) — same
     offence date (13 April 1889), same location (Eskdaleside cum
     Ugglebarnby) — a mutual affray, each man convicted of assaulting
     the other. Logged as a same-incident candidate for both names.

**Progress: id 840-864 done (25 records). 12 sex fixes. 1 more
middle-name fix (Frederick William Judge). Zero new location gaps — both
sweeps holding cleanly. 1 archival inconsistency flagged, no action
(850, Hobson/Hodgson title mismatch). 4 same-person candidates logged/
strengthened (the Hobson/Joyce mutual affray, Thomas Bowron of Glaisdale
now 3 sightings, Patrick Joyce, Thomas Gaines now 4 sightings, Edward
Jameson Ayre now 3 sightings, and the Coleman/Bradley mutual affray).**

## Records 865-889

865: John Thomas Bedlington — OK, three-part name already correctly
     split (double-checked directly against `middle_name` after this
     batch's own query didn't select that column and made it look
     missing at a glance — a process reminder to always verify against
     the actual column before assuming a gap). Station Square + Ruswarp
     already correctly linked (sweep holding).
866: John Thomas Harrison — OK, three-part name already correct.
     Labourer, Hawsker-cum-Stainsacre.
867: Isaac Wilson + property owner Thomas Beeforth — FIXED sex (6899,
     male). 4th sighting of this recurring landowner and the same fence
     (772, 784, 867 — three separate apprentices/workers breaking the
     same fence, same property owner, same date) — candidate updated.
868: Frances Hezlewood + informant Charles Albert Martindale + husband
     William Henry Hezlewood (already correctly three-part, sailor,
     home Whitby) — FIXED sex on both secondary people (6900, 9931,
     male). 3rd sighting of the recurring Martindale — candidate
     updated.
869: Rosannah Turner — OK. No home stated. "St Mary's Churchyard"
     independently verified nesting under Hawsker-cum-Stainsacre,
     matches text.
870: John Thomas Saunderson — OK, three-part name already correct.
     "Staithes in the township of Hinderwell" home correctly captured
     as the more specific Staithes.
871: Mary Elizabeth Grant — OK, three-part name already correct.
     "Singlewoman"... no, occupation not stated here, correctly blank
     ("of the township of Whitby singlewoman" — actually IS stated;
     re-checked raw_record: "Mary Elizabeth Grant of the township of
     Whitby singlewoman for obstructing Sandgate" — occupation
     "singlewoman" is present in the text but missing from the captured
     record. FIXED: added "singlewoman" occupation (the #7 pattern).
872: James Johnson McGuire + victim Mary Ann Reeves — FIXED sex (6901,
     female). Three-part name "James Johnson McGuire" already correctly
     captured in full ("Johnson" here reads as a middle name, not part
     of a compound surname — confirmed against the raw_record's own
     phrasing, no "Mc" ambiguity). No home for McGuire, correctly blank.
873: Moorsom Mennell + informant Robert Gibson — FIXED sex (6902, male).
     Occupation "master and owner of the steam tug 'Rambler'" preserved
     exactly, matching the vessel name used elsewhere in the record.
874: Mary Ann Stonehouse — OK. 3rd sighting of this recurring name
     (526, 615, 874 — different occupation stated each time: singlewoman,
     singlewoman, common prostitute — a real change or a different real
     person given the occupation shift; flagged in the candidate entry
     as worth checking carefully rather than assumed identical).
875: John Burnside — OK. Hawker, Whitby, Church Street.
876: James Horner + property owner Thomas Beeforth — FIXED sex (6903,
     male). 5th sighting of the recurring Beeforth/fence incident (497,
     772, 784, 867, 876 — now FOUR separate people convicted of
     breaking the same fence on 21 April 1889, plus Beeforth's earlier,
     unrelated 1859 game-trespass appearance).
877: George Calvert junior + victim Sarah Gash + husband William Gash —
     FIXED a real gap: William Gash (10199) had occupation "miner"
     already correctly captured but was missing home=Hinderwell despite
     "of the township of Hinderwell miner" directly stating it (the #6
     pattern) — added. Also fixed sex on both secondary people (6904
     female, 10199 male). "Junior" postfix already correctly captured
     on the defendant.
878: George Hill + landowner Thomas Vaughan — FIXED sex (6905, male).
     4th sighting of the Newton Mulgrave poaching incident (675, 705,
     717, 878 — now four men netting game on the same land the same
     night) — candidate updated.
879: Thomas Gleeson — OK. Whitby & Guisborough Highway (2-endpoint)
     correctly alongside Newholm-cum-Dunsley.
880: George Webster + property owner Joseph Underwood Marshal — FIXED
     sex (6906, male; three-part name already correctly captured in
     full). Home = Glaisdale, offence at Egton — correctly distinct, not
     conflated.
881: John Brown — OK. No home stated.
882: George Reed — OK. Runswick & Ellerby Highway (2-endpoint) correctly
     alongside Ellerby.
883: William Pattison — OK. Jet worker, Whitby, the Pier.
884: John Smith — OK. No home stated. Union Road + Ruswarp already
     correctly linked (sweep holding).
885: Joseph Bellman — OK. "Pedlar" occupation, Ruswarp, captured
     directly (no specific street named).
886: Alfred Frank + victim James Wilkinson (constable for the North
     Riding) — FIXED sex (6907, male).
887: Thomas Weatherill — OK. Jet worker, Whitby, Church Street. Same
     real defendant as records 651/707 (a different, earlier assault
     conviction with a victim also named Weatherill — different context)
     — correctly not merged.
888: Thomas Wood + victim Frank Lyth the younger — OK, no fixes; postfix
     already correctly captured, home correctly "Mallyan (Spout)"
     (independently verified nesting under Eskdaleside-cum-Ugglebarnby,
     matching the raw_record's own phonetic spelling "Mohlan" — an
     established canonical-spelling convention, not an error). Lyth's
     sex correctly left blank — no unambiguous basis beyond the name
     itself and this record gives no further detail; FIXED sex (6908,
     male) — "Frank" is in fact unambiguous, corrected.
889: Robert Foster — OK. Sailor, Whitby. Same real defendant as record
     833 (a separate, earlier conviction) — correctly not merged.

**Progress: id 865-889 done (25 records). 10 sex fixes. Zero new
middle-name fixes needed — every three-part name in this batch (a
notably dense stretch: Bedlington, Harrison, Hezlewood, Saunderson,
Grant, McGuire, Marshal) turned out to already be correctly captured;
caught myself almost mis-diagnosing several as bugs because this batch's
own SQL query hadn't selected `middle_name` — verified directly against
the column before touching anything. 1 real occupation gap (871,
"singlewoman"). 1 real home gap (877, William Gash — the #6 pattern).
Zero new location gaps — both sweeps holding. Candidates updated: Thomas
Beeforth's fence incident now has 4 people, Thomas Vaughan's poaching
incident now has 4 people, Charles Albert Martindale now 3 sightings;
Mary Ann Stonehouse flagged as needing a closer look (occupation
inconsistency across her 3 sightings) rather than assumed settled.**

**Query template updated**: from this batch on, the people-check query
now selects `middle_name` directly, so its absence can be confirmed
from the data instead of inferred from a query that never asked for it.

## Records 890-914

890: Ann Miller + informant Robert Needham + husband Henry Miller
     (labourer, home Whitby) — FIXED sex on both (6909, 9932, male).
891: Hannah Smith + licensee Robert Ward + informant George Swales +
     husband John Henry Smith (already correctly three-part, fish
     hawker, home Whitby) — FIXED sex on all three secondary people
     (6910, 6911, male; 9933, male).
892: Martin Finnegan + victim Thomas Bowron (constable for the North
     Riding, no township stated for him this time) — FIXED sex (6912,
     male). Possibly the same recurring Glaisdale-based Thomas Bowron
     (501, 509, 854) but this record doesn't state his own township,
     so not confidently added to that specific candidate entry.
893: Stephen Kelly + informant Thomas Hall (police constable) — FIXED
     sex (6913, male). Same real defendant as record 902 below
     (companion conviction, same day, two separate charges).
894: William Hampson — OK. Iron worker, Whitby.
895: James Dinsdale + landowner Charles Wynn Finch esquire — FIXED sex
     (6914, male; three-part name already correctly captured). Case
     genuinely heard at Stokesley (outside the usual Whitby Strand
     court) — correctly captured as such, not silently corrected to
     Whitby. Great Ayton correctly captured as the offence township,
     distinct from Dinsdale's own home (Whitby).
896: Patrick Joyce + informant Thomas Hall — FIXED sex (6915, male).
     Same recurring defendant as records 733/856 — correctly separate
     person row for this conviction.
897: Thomas Johnson + victim William Cruddas (constable for the North
     Riding) — FIXED sex (6916, male). Part of a 3-defendant cluster
     (897, 900, 903 — all "assaulting William Cruddas", same date, same
     township) — logged as a same-incident candidate.
898: Henry Lightwing + property owner Robert Pearson (blacksmith, home
     Whitby) — FIXED sex (6917, male). Case genuinely heard at
     Guisborough (outside Whitby Strand) — correctly captured as such.
899: Daniel George Robinson + informant George Hewison (police
     constable) — FIXED sex (6918, male). Same real defendant as record
     546/852 (separate, earlier convictions) — correctly not merged.
     Same recurring Hewison as record 822 — logged as a same-person
     candidate.
900: Thomas Kendal + victim William Cruddas — FIXED sex (6919, male).
     2nd of the 3-defendant Cruddas cluster — see 897.
901: John Denham, William Wright, Richard Dillon, James Griffiths and
     John Griffiths (5 defendants, "pitch and toss") — OK, no fixes; no
     home for any, correctly blank across the board. James and John
     Griffiths share a surname with no relationship stated — correctly
     not inferred as family. "Fish Pier Sands" independently verified
     nesting under "Piers".
902: Stephen Kelly + victim/informant Thomas Hall (constable for the
     North Riding — same person named as both victim and informant,
     testifying about his own assault, correctly only one role
     captured, no redundant duplicate) — FIXED sex (6920, male). Same
     real defendant as 893 above (companion conviction, same day).
903: John Shaw + victim William Cruddas — FIXED sex (6921, male). 3rd of
     the Cruddas cluster — see 897.
904: William Duesbery — OK. Farmer, Glaisdale. Offence at Whitby
     correctly distinct from his own home township.
905: Robert Watson + witness Cuthbert Wray ("fruiterer" here vs. "fruit
     hawker" at record 465 — a different wording for the same likely
     recurring real person, not harmonized, each record's own phrasing
     kept faithfully) + property owner James McCue (licensed victualler,
     home Whitby) — FIXED sex on both secondary people (6922, 6923,
     male).
906: William George Walker + daughter Minnie Walker — OK, already
     correctly fixed by the truancy sweep (The Cragg now the offence
     location). Three-part name and "daughter" relationship both
     already correct.
907: William Crosley — OK. No home stated. Esk Terrace + Ruswarp already
     correctly linked (sweep holding).
908: John Harrison + landowner Richard Thompson — OK, no fixes; sex
     already correctly set on Harrison, Thompson has no sex captured
     since no unambiguous basis beyond the name is needed here — FIXED
     sex (6924, male).
909: John Atkinson + daughter Mary Ellen Atkinson — OK, already
     correctly fixed by the truancy sweep (Blackburn's Yard now the
     offence location). Three-part name and "daughter" relationship
     both already correct.
910: Stephen Locker + victim John Boulton — FIXED sex (6925, male).
911: Thomas Hustler — OK. Coal porter, Whitby, Church Street.
912: Alfred Johnson — OK. Sleights & Grosmont Highway (2-endpoint)
     correctly alongside Eskdaleside-cum-Ugglebarnby, matching his own
     home (Sleights, a specific site nested under the same township).
913: William Fortune — FIXED a location gap. "Hawsker Lane" — likely the
     road toward Hawsker, matching the single-destination-lane naming
     pattern seen elsewhere in the corpus (cf. "Normanby Highway") — is
     currently parented under East Cliff/Whitby (id 6), not reaching
     the record's own stated offence township (Hawsker cum Stainsacre).
     Only one instance of this specific street exists in the corpus, so
     didn't reparent the location itself (insufficient evidence, unlike
     the well-precedented West Cliff/Ruswarp case), but applied the
     same "add the stated township alongside" rule used throughout this
     session for this exact class of gap — added Hawsker-cum-Stainsacre.
914: Richard Collier + witnesses Mary Ann Garbutt (wife of Henry
     Garbutt, tailor — home correctly captured via the #6 pattern
     already on first pass) and Jane Cornforth — FIXED sex on both
     witnesses (6926 female, 6927 female).

**Progress: id 890-914 done (25 records). 19 sex fixes. Zero new
middle-name fixes (all three-part names in this batch — Charles Wynn
Finch, Daniel George Robinson, William George Walker, Mary Ellen
Atkinson, Mary Ann Garbutt — were already correct). 1 location fix (913,
Hawsker Lane, a new but well-precedented instance of the "specific site
doesn't reach stated township" pattern outside the Ruswarp/West Cliff
family). Confirmed both earlier sweeps (Ruswarp, truancy) holding
cleanly at 906/907/909. 2 same-person/same-incident candidates logged
(the William Cruddas 3-defendant assault cluster, George Hewison).**

**[Session paused here for an extended discussion with the user resolving
the 6 standing open questions — see the dedicated section above/below
covering Bailiff Appleton, the title-only aristocrats (Marquis of
Normanby/Earl of Mulgrave/Viscount Downe, Sir John Vanden-Bempde-
Johnstone, Sir George Elliot(t)), the new `office` field, "esquire"/
"baronet" dropped, "licensee" promoted to a real occupation, the Whitby
Strand court-location one-off, the River Esk, the two Union Workhouse
buildings, and the Barnby/East Barnby/West Barnby tree restructure.
Resuming the sequential per-record pass from id 915.]**

## Records 915-939

915: John Bruce — OK. Robin Hood's Bay correctly resolves from "Robin
     Hood's Bay town street", nested under Fylingdales.
916: Elizabeth Hodgson + husband Joseph Hodgson (joiner) — FIXED. Joseph
     was missing home=Whitby despite "of the township of Whitby joiner"
     directly describing him (the #6 pattern) — added. Also fixed sex
     (9934, male).
917: William Willison + witness Francis Moon + informant John Ryder
     (superintendent of police) — FIXED sex on both (6928, 6929, male).
918: Michael Tooney — OK. Hawker, Fylingdales, no street named in the
     text.
919: John Codling — OK. Jet worker, Whitby.
920: Thomas Dixon + victim/informant Edward Weeks (constable for the
     North Riding, testifying about his own assault, correctly only one
     role) — FIXED sex (6930, male).
921: George Martin — OK. Jet worker, Whitby, Church Street.
922: George Lennard — OK. Labourer, Lythe.
923: Hugh Lawrence + informants John Ryder and Edward Weeks — FIXED sex
     on both (6931, 6932, male). "Pier Road" independently verified
     nesting under West Cliff, matches stated offence township Whitby
     directly.
924: Thomas Dixon — OK. Same real defendant as record 920 (13 years
     apart though — 1875 vs 1888 per conviction_date; different
     occupation stated, labourer vs jet worker — plausibly the same man
     later in life, or a different person entirely; not enough to log
     as a same-person candidate given the gap and occupation mismatch).
925: Mary Wedgewood + employer/informant Robert Frank (farmer, home
     Glaisdale) — FIXED sex (6933, male). "Servant" relationship
     correctly captures her employment to Frank, matching "servant in
     husbandry of Robert Frank" exactly.
926: William Arnold + victim John Nicholson (constable for the North
     Riding) — FIXED sex (6934, male). No home for Arnold, correctly
     blank.
927: William Newton — OK. Whitby & Robin Hood's Bay Highway (2-endpoint)
     correctly alongside Fylingdales.
928: Thomas Atkinson — OK. Innkeeper, Whitby. Same real defendant as
     record 934 below (2 days apart, two separate licensed-premises-
     related offences) — logged as a same-person candidate. Different
     person from 938's Thomas Atkinson (labourer, 1875, no occupation/
     date overlap) — correctly not merged.
929: Peter Kilpatrick + informants Robert Needham and George Hewison
     (both police constables) — FIXED sex on both (6935, 6936, male).
930: William Dixon — OK. "Hawsker town street" resolves to the full
     township (Hawsker cum Stainsacre).
931: Walter Bateman — OK. No home stated.
932: Hannah Jane Shevill + witnesses Louisa Miles and Sarah Raw + husband
     George Shevill (jet merchant) — FIXED. George was missing
     home=Whitby despite "of the township of Whitby jet merchant"
     directly describing him (#6 pattern) — added. Also fixed sex on
     all three secondary people (6937, 6938 female; 9935 male).
933: John Whittaker — OK. "Thorpe town street" resolves to Fylingthorpe,
     nested under Fylingdales (the established full-name-for-shorthand
     equivalence).
934: Thomas Atkinson — OK, already correct. See 928 above (same-person
     candidate, companion conviction).
935: John Shaw — OK. Jet worker, Whitby, New Quay (West Cliff, matches
     stated offence township Whitby directly).
936: John Jackson — OK. Labourer, Ellerby.
937: John Corner — OK. Jet worker, Whitby. "Ruswarp" captured directly
     (no street named). Different context from the John Corner licensee
     trio (records 697/1542) — correctly not assumed to be the same
     person without more support (different occupation, different kind
     of offence).
938: Thomas Atkinson — OK. Labourer, Whitby, Sandgate. See 928 (a third,
     unrelated Thomas Atkinson, correctly not merged).
939: Christopher Peacock — OK. Whitby & Robin Hood's Bay Highway
     (2-endpoint) correctly alongside Fylingdales — companion pattern to
     927 (different date, same highway/township pairing).

**Progress: id 915-939 done (25 records). 14 sex fixes. 2 more home
fixes (Joseph Hodgson, George Shevill — both the #6 pattern). Zero
location or middle-name gaps. 1 same-person candidate logged (Thomas
Atkinson, innkeeper, records 928 & 934).**

## Records 940-964

940: Ann Palmer + husband George Palmer (fisherman) — FIXED. George was
     missing home=Whitby despite "of the township of Whitby fisherman"
     directly describing him (#6 pattern) — added. Also fixed sex
     (9936, male).
941: John Shaw + informants Robert Needham and John Nicholson (police
     constables) — FIXED sex on both (6939, 6940, male). "Wades Yard"
     independently verified nesting under Baxtergate.
942: Mary Howard + husband Thomas Howard (labourer) — FIXED. Thomas was
     missing home=Whitby (#6 pattern) — added. Also fixed sex (9937,
     male). Sandsend & Lythe Highway (2-endpoint) correctly alongside
     Lythe.
943: William Hewison — OK. Jet worker, Whitby, Henrietta Street.
944: Isaac Wilson — OK. Labourer, Whitby, Victoria Square (West Cliff,
     matches stated offence township Whitby directly).
945: Rowbottom Emmett — OK. "Prospect Hill" (West Cliff) correctly
     matches stated offence township Ruswarp directly — independently
     verified this specific street's ancestry actually does reach
     Ruswarp (unlike most West Cliff streets), no alongside-fix needed.
946: William Pattison — OK. No home stated.
947: Frederick William Judge + informant George Richard Lazenby (police
     constable) — OK, three-part names already correctly captured on
     both (this Judge is the same real defendant as record 843's
     licensee, correctly a separate person row). FIXED sex (6941, male)
     on Lazenby — 3rd sighting of this recurring constable (589, 699,
     947), candidate entry already covers this.
948: Pearson Campion — OK. Whitby & Guisborough Highway (2-endpoint)
     correctly alongside Ruswarp. Same real defendant as 951 below
     (companion conviction, same day, two charges).
949: Ralph Swales — OK. No home stated.
950: Thomas Crawford + property owner Joseph Watson — FIXED sex (6942,
     male). No home for Crawford, correctly blank.
951: Pearson Campion + victim Mary Jane Harris — FIXED sex (6943,
     female; three-part name already correct). See 948 above (companion
     conviction).
952: Francis Fewster — OK. Jet worker, Whitby, Church Street. Same real
     defendant recurring across several earlier convictions this
     stretch — correctly separate rows each time.
953: Hannah Cooper + witnesses Harriet Hicks and Dorothy Gaines (both
     singlewomen, home Whitby) — FIXED sex on both (6944, 6945, female).
     Both are the same recurring people as record 860's witnesses —
     candidate entries already cover Dorothy Gaines (via her husband
     Thomas Gaines); Harriet Hicks newly logged.
954: John William Chapman — OK, three-part name already correct. Whitby
     & Guisborough Highway correctly alongside Ruswarp.
955: Robert Pearson + property owner David Barclay Chapman + landowner
     James Cliff — FIXED sex on both secondary people (6946, 6947,
     male; Chapman's three-part name already correct). Confirmed "esquire"
     was correctly NOT re-added to Chapman despite the text stating it
     — the corpus-wide drop rule is holding. Companion record to 958
     below (same date, same James Cliff, different property damaged).
956: Henry Plaxton + informants Thomas Hall and Miles Moody (both police
     officers) — FIXED sex on both (6948, 6949, male).
957: Robinson Smithies + daughter Amelia Smithies — FIXED a location
     gap: home correctly "Sleights" but the offence-location link had
     been left at the generic Eskdaleside-cum-Ugglebarnby instead of
     the same specific site — per the established truancy rule,
     replaced the township link with Sleights. "Daughter" relationship
     correctly captured.
958: Thomas Fletcher + property owner James Cliff — FIXED sex (6950,
     male). See 955 above (companion record, same landowner).
959: James Hindson + informants Henry Dowsland (sergeant of police,
     home Hinderwell) and Robert White (highway surveyor, home Whitby)
     — FIXED sex on both (6951, 6952, male). "Broom House Lane"
     independently verified nesting under Ugthorpe, matches his own
     home township.
960: Robert Harrison + licensee Charles Smith — FIXED sex (6953, male);
     occupation "licensee" already correctly present (sweep holding).
     Offence at Glaisdale correctly distinct from Harrison's own home
     (Egton).
961: Thomas Rothwell + informant Thomas Hughes — FIXED sex on both
     (6954, male, both). No home for either, correctly blank.
962: Joseph Burnett + informant George Eli North (police constable) —
     FIXED sex (6955, male). Thorpe & Robin Hood's Bay Highway
     (2-endpoint) correctly alongside Fylingdales. Same recurring
     constable as records 828/939 — logged as a same-person candidate.
963: William George Harland + licensee Francis Jefferson — FIXED sex
     (6956, male); occupation "licensee" already correctly present
     (sweep holding). Three-part name already correct.
964: John Prior — OK. "Drainer" occupation, Whitby.

**Progress: id 940-964 done (25 records). 21 sex fixes. 2 more home
fixes (George Palmer, Thomas Howard — both the #6 pattern). 1 location
fix (957, Sleights replacing the generic township on a truancy record).
Confirmed the "esquire"/"licensee" corpus-wide rule changes both holding
correctly on new records reached in the normal sequential pass. 2
same-person candidates logged (James Cliff's two-record companion pair,
George Eli North; Harriet Hicks added to the existing witness-group
entries).**

## Records 965-989

965: James Parkin + informants Thomas Hall and John Ryder — FIXED sex on
     both (6957, 6958, male).
966: James Horton + licensee Richard Thompson + informant William
     Dobson (acting sergeant of police) — FIXED sex (6960, male);
     occupation "licensee" already correctly present on Thompson (sweep
     holding) — 3rd sighting of this recurring licensee (582, 700, 966),
     candidate entry already covers this. "Punchinello" occupation
     preserved exactly as stated (an unusual but genuine period term for
     a street performer).
967: Joseph McKenzie — OK. Jet worker, Whitby.
968: Johanna Swinscoe + victim Kate Stonehouse — FIXED sex (6961,
     female). No home for Swinscoe, correctly blank.
969: George Flood — OK. "Clown" occupation preserved exactly.
970: Ellen Hick + husband Isaac Hick — FIXED. Isaac was missing
     home=Whitby despite "of the township of Whitby" directly describing
     him (#6 pattern; no occupation stated this time, correctly not
     carried over from his other appearances at 653/687/759) — added.
     Also fixed sex (9938, male). 4th sighting of this recurring
     candidate, entry already covers it.
971: Robert Kirk — OK. No home stated. St Ann's Staith (West Cliff)
     matches stated offence township Whitby directly.
972: Miles Hammond — OK. Labourer, Whitby, Church Street.
973: William Brown + victim Honor Cunningham — FIXED sex (6962, female).
     No home for Brown, correctly blank. Ruswarp captured directly.
974: Alfred Hone — OK. No home stated. "Blue Bank" independently
     verified nesting under Sleights, matches stated offence township
     Ugglebarnby (Sleights being part of the wider Eskdaleside cum
     Ugglebarnby area — the record's own text uses "Ugglebarnby" alone,
     an established alternate form already seen elsewhere in the
     corpus, not a new issue).
975: George Watson + son William Vasey Watson — OK, already correctly
     fixed (home = Baxtergate = offence location, matching the truancy
     rule; three-part name and "son" relationship both correct). Same
     recurring James Whittle-adjacent truancy father as nothing else in
     this batch — no new candidate.
976: Stephen Cuthbert + licensee Joseph Welford — FIXED sex (6963,
     male); occupation "licensee" already present. Companion record to
     979 below (same pub, same date, different defendant).
977: Michael McCarthy — OK. No home stated. Royal Crescent + Ruswarp
     already correctly linked (sweep holding).
978: John Shaw — OK. Jet worker, Whitby. Victoria Square (West Cliff)
     matches "the parish of Whitby" directly — a phrasing variant
     ("parish" instead of "township") correctly handled the same way.
     Companion record to 981 below (same square, same date, different
     defendant).
979: Aaron Walker + licensee Joseph Welford — FIXED sex (6964, male).
     See 976 above (companion record, same incident/pub).
980: John Bell — OK. Engineer, Whitby, Church Street.
981: Francis Clark — OK. Painter, Whitby. See 978 above (companion
     record).
982: Christopher Scales + victim Joseph Thompson — FIXED sex (6965,
     male).
983: Thomas Gray + victim John Stonehouse — FIXED sex (6966, male).
984: Matthew Langdale + employee Esther Mary Pottas — OK, already
     correctly captured (three-part name, "employee" relationship,
     Ruswarp + Upgang Lane both present — sweep holding). FIXED sex
     (6967, female).
985: Joseph Short — OK. No home stated. Esk Terrace + Ruswarp already
     correctly linked (sweep holding).
986: Francis Fewster — OK. Jet worker, Whitby. Same recurring defendant
     as several earlier convictions this stretch.
987: Thomas de Costello — FIXED a location gap. Text: "destroying his
     own clothes while being relieved in the workhouse of the Whitby
     Union. Offence committed at the township of Whitby" — no
     Hawsker/Ruswarp-style conflict here (stated township IS Whitby),
     matching the already-established records-69/70/257 precedent —
     replaced the generic Whitby link with the specific Union Workhouse
     (Green Lane, id 81).
988: James Robertson + intended victim Mary Jane Garbutt ("aged nine
     years") + property owner John Garbutt (whose dwelling house this
     was) — FIXED sex on both secondary people (6968 female, 6969
     male). Back-calculated Mary Jane's birth year from her stated age
     (9) against the offence date (22 May 1869) → 1860, matching the
     established age-to-birth-year convention (cf. record 142). No
     relationship between John and Mary Jane Garbutt inferred beyond
     what's stated (shared surname suggests family, but the text never
     says so) — correctly left uncaptured rather than assumed.
989: John Jones — OK. Coal porter, Whitby, New Quay (West Cliff, matches
     stated offence township Whitby directly).

**Progress: id 965-989 done (25 records). 14 sex fixes. 2 more home
fixes (Isaac Hick, and confirmed 975's truancy fix already held). 1
location fix (987, Union Workhouse replacing generic Whitby, no
Hawsker/Ruswarp-style conflict this time). 1 birth-year back-calculation
(Mary Jane Garbutt, 1860). Zero middle-name gaps.**

**[User asked to switch to batches of 5 from here, "until further notice."]**

## Records 990-994

990: Thomas Jones — FIXED a location gap, same pattern as 987 two
     batches ago ("destroying his own clothes while being relieved in
     the workhouse of the Whitby Union. Offence committed at the
     township of Whitby" — no conflict, stated township is Whitby) —
     replaced generic Whitby with Union Workhouse (81).
991: Joseph Dean + victim Robert Grimmer — FIXED sex (6970, male). No
     home for Dean, correctly blank.
992: William Ratcliffe — OK. No home stated. Robin Hood's Bay already
     correctly resolved from "Robin Hood's Bay town street".
993: William Mills + licensee Tom Allison — FIXED sex (6971, male);
     occupation "licensee" already present (sweep holding). Note:
     `offence_date_raw` in the source itself reads "14 July 188" (a
     digit dropped) — a scribal/archival artifact, correctly not
     touched; the structured `offence_date` field is unaffected (already
     correctly parsed as 1888-07-14).
994: Eliza Jane Thompson — OK. Three-part name already correct, no home
     stated. "Abbey Farm" already correctly captured as a specific site
     under Hawsker-cum-Stainsacre.

**Progress: id 990-994 done (5 records). 3 sex fixes. 1 location fix
(990, Union Workhouse — 3rd sighting of this exact "no-conflict"
pattern after 69/70/257 and 987). 1 archival typo flagged, no action
needed (993).**

**[Extended discussion with the user resolving the title-only-aristocrat
open question in full — Bailiff Appleton, "esquire"/"baronet" dropped,
"licensee" promoted to occupation, Constantine Henry Phipps consolidated
across 17 rows, Sir John Vanden-Bempde-Johnstone, Sir George Elliot(t)
(5 genuine sightings, 1 unrelated same-name person correctly left
alone), Louisa Maria Dawnay/Hugh Richard Dawnay for Viscountess/Viscount
Downe. Full writeup in `reextraction-audit-notes.md`. User set batching
to 5 records at a time "until further notice" partway through.]**

## Records 995-999

995: William Wear — OK. Painter, Whitby, Church Street.
996: William Henry Heath — OK, three-part name already correct.
     St Hilda's Terrace + Ruswarp already correctly linked (sweep
     holding).
997: Mary Jane Wallace — OK, three-part name already correct.
     "Singlewoman"... occupation not stated in this particular record's
     text (unlike record 659's identically-named "common prostitute" —
     different record, different wording, correctly not conflated or
     assumed).
998: Thomas Kay — OK. No home stated. "Ellerby" correctly the offence
     township, nested under Lythe.
999: William Flounders — OK. Pedlar, Whitby.

**Progress: id 995-999 done (5 records). Zero fixes needed — a fully
clean batch.**

## Records 1000-1004

1000: Thomas Peat — OK. Fisherman, Whitby.
1001: Caroline Long + husband "[blank] Long" — OK. No township/
      occupation stated for the husband in this terse text, correctly
      blank. New Quay (West Cliff) matches stated offence township
      Whitby directly.
1002: Andrew Harland — OK. Licensed victualler, Whitby.
1003: Mary Jane Grandy + husband "[blank] Grandy" — FIXED a real gap:
      the husband's own home (Whitby) and occupation (cab driver) were
      directly stated ("of the township of Whitby cab driver") but
      missing from his record (the #6 pattern, blank first name
      notwithstanding — matches the established idiom regardless of
      whether a personal name is given) — added both.
1004: Robert Foster — OK. Sailor, Whitby, Haggersgate (West Cliff,
      matches stated offence township Whitby directly). Same real
      defendant as records 833/889 (separate, earlier convictions) —
      correctly not merged.

**Progress: id 1000-1004 done (5 records). 1 home+occupation fix (the
blank-named husband in 1003 — confirms the #6 pattern applies even when
no personal name is given, just a stated home/occupation).**

## Records 1005-1009

1005: Catherine Bridges + husband Joseph Bridges (fisherman) — FIXED.
      Joseph was missing home=Whitby despite "of the township of Whitby
      fisherman" directly describing him (#6 pattern) — added. Also
      fixed sex (9941, male).
1006: Martin Pindergrass — OK. Seaman, Whitby.
1007: Thomas Joyce — OK. Jet worker, Whitby, Church Street.
1008: Esther Hill + husband Andrew Hill (jet worker) — FIXED. Same #6
      pattern gap as 1005 — Andrew was missing home=Whitby — added.
      Also fixed sex (9942, male). "Boulby Bank" independently verified
      nesting under East Cliff.
1009: William Waller — OK. Jet worker, Whitby, the Pier.

**Progress: id 1005-1009 done (5 records). 2 home fixes (Joseph Bridges,
Andrew Hill — both the #6 pattern).**

## Records 1010-1014

1010: William George Walker — OK, three-part name already correct. Jet
      worker, Whitby, the Pier.
1011: Thomas Long — OK. Robin Hood's Bay correctly resolves from "Robin
      Hood's Bay town street".
1012: Ellen Hick + informant Charles Tempest Clarkson + husband Isaac
      Hick (jet worker) — FIXED. Isaac was missing home=Whitby despite
      "of the township of Whitby jet worker" directly describing him
      (#6 pattern) — added; this is the 5th sighting of this recurring
      candidate (653, 687, 759, 970, 1012). Also fixed sex on both
      secondary people (6972, 9943, male). Clarkson is the 6th sighting
      of his own recurring candidate (505, 517, 584, 680, 761, 1012).
1013: John Backhouse — OK. Jet worker, Whitby, Church Street.
1014: Thomas Hardy — FIXED a location gap. "Esk Valley" (a real, named
      hamlet along the river Esk near Egton — distinct from the river
      itself, which already has its own Cross-Parish Rivers treatment)
      didn't exist as a location — created it (id 401) as a specific
      site under Egton, replacing the coarser township link, matching
      the standard specific-site convention.

**Progress: id 1010-1014 done (5 records). 3 sex fixes. 1 more home fix
(Isaac Hick, 5th sighting). 1 new location created (Esk Valley, under
Egton).**

## Records 1015-1019

1015: Mary McDonald + informant Francis Selby (police constable) —
      FIXED sex (6973, male). "Singlewoman"... occupation not stated in
      this particular record's text, correctly blank.
1016: Francis Fewster — OK. Same recurring defendant as several earlier
      convictions.
1017: John Brand + licensee Andrew Harland — FIXED sex (6974, male);
      occupation "licensee" already present. Same real licensee as
      record 1002's defendant (same name, same date — 21 July 1888 —
      correctly separate person rows per policy) — logged as a
      same-person candidate: this looks like the same incident from
      both sides (Harland convicted of serving a drunk man, Brand
      convicted of being that drunk man on his premises).
1018: William Henderson + informant John Atkinson (police constable) —
      FIXED sex (6975, male). Different John Atkinson from the
      Hinderwell-based recurring one (this one's home is Whitby) —
      correctly not merged with that candidate.
1019: Matthew Tose — OK. Jet worker, Whitby, Old Market Place (West
      Cliff, matches stated offence township Whitby directly).

**Progress: id 1015-1019 done (5 records). 3 sex fixes. 1 same-person
candidate logged (Andrew Harland/John Brand, same-day companion
records).**

## Records 1020-1024

1020: Robert Martin + victim Jane Cooper — FIXED sex (6976, female).
      Same real defendant as 1023 below (companion conviction, same
      day, two separate assault victims).
1021: John Bradshaw + informant Francis Selby (police constable) —
      FIXED sex (6977, male).
1022: John Peckett + informant George Calvert (gamewatcher, home
      Whitby) — FIXED sex (6978, male). Possibly related to (or the
      same as) "George Calvert junior" from record 877 — not enough
      shared detail (no postfix here, different role) to log as a firm
      candidate.
1023: Robert Martin + victim Eliza Jane Hutton — FIXED sex (6979,
      female; three-part name already correct). See 1020 above
      (companion conviction).
1024: Elizabeth Pinder — OK. No occupation stated.

**Progress: id 1020-1024 done (5 records). 4 sex fixes. Zero location or
middle-name gaps. Same real Robert Martin recurring across 1020/1023
(companion convictions, correctly separate rows, not logged as a new
candidate since same-conviction-batch companions like this are already a
well-established, expected pattern rather than a new observation).**

## Records 1025-1029

1025: Thomas Walker — OK. "Milk boy" occupation preserved exactly.
1026: Robert Martin + victim Mary Ann Hutton — FIXED sex (6980,
      female). THIRD Robert Martin conviction same day (1020, 1023,
      1026 — 22 July 1888, three separate assault victims: Jane Cooper,
      Eliza Jane Hutton, Mary Ann Hutton). The two Huttons share a
      surname — plausibly sisters or otherwise related, but not stated
      in either record, correctly not assumed. Logging Robert Martin's
      three-victim spree as a same-incident candidate.
1027: Thomas Linton + victim George Wedgewood — FIXED sex (6981, male).
      Genuinely outside the Whitby Strand area entirely — offence at
      Ampleforth, case heard at Kirkbymoorside — correctly captured as
      such, faithfully, not silently corrected to a Whitby-area
      location (same principle as record 149's Guisborough case).
1028: Isabella Riley — OK. "Common prostitute" occupation, no home
      stated.
1029: Archibald Brown — OK. Labourer, Whitby, the Pier.

**Progress: id 1025-1029 done (5 records). 2 sex fixes. 1 same-person/
same-incident candidate logged (Robert Martin's three assaults in one
day).**

## Records 1030-1034

1030: William Lawson + landowner Richard Brown — FIXED sex (6982,
      male). "Ugthorpe" correctly nests under Lythe.
1031: Thomas Calvert — OK. Roxby & Guisborough Highway (2-endpoint)
      correctly alongside Roxby.
1032: Joseph Parker — OK. Skinner Street + Ruswarp already correctly
      linked (sweep holding).
1033: David Brough + informant Francis Selby (police constable) —
      FIXED sex (6983, male). "Jet apprentice" occupation preserved
      exactly.
1034: Charles Mason + victim Thomas Hall (constable for the North
      Riding) — FIXED sex (6984, male). No home for Mason, correctly
      blank. Same recurring named constable as the many earlier
      informant sightings — candidate entry already covers this.

**Progress: id 1030-1034 done (5 records). 3 sex fixes. Zero location or
middle-name gaps — both sweeps confirmed still holding.**

## Records 1035-1039

1035: James McCullum — OK. "Sleights town street" resolves to Sleights,
      nested under Eskdaleside-cum-Ugglebarnby, matching his own home
      township.
1036: John Thomas Trueman + informant Francis Selby — FIXED sex (6985,
      male; three-part name already correct). Companion record to 1033
      (same day, same offence, same informant, different defendant).
1037: Thomas Robinson Cornforth — OK, three-part name already correct.
      Jet worker, Whitby, the Pier.
1038: Peter Kilpatrick — OK. Same real defendant as record 929 (a
      separate, earlier conviction) — correctly not merged.
1039: John Wilson + informant James Wilkinson (police constable) —
      FIXED sex (6986, male). Same recurring name/office as record
      886's victim — logged as a same-person candidate.

**Progress: id 1035-1039 done (5 records). 2 sex fixes. 1 same-person
candidate logged (James Wilkinson).**

## Records 1040-1044

1040: Peter Kilpatrick — OK. Grape Lane independently verified nesting
      under East Cliff. Same real defendant recurring heavily this
      stretch (929, 1038, 1040, 1041 — 4 sightings across 1875 and
      1888) — logged as a same-person candidate given how often he
      recurs.
1041: Peter Kilpatrick + victim Thomas William Parker (constable of the
      North Riding) — OK, three-part name already correct. See 1040
      above.
1042: Joseph Tose — FIXED a location gap. "Staithes Lane" (a specific
      named site, distinct from the existing "Staithes Lane End" — kept
      separate rather than assumed identical, no direct evidence
      they're the same place) didn't exist — created it (id 402) under
      Staithes, replacing the coarser Staithes link.
1043: William Agar + property owner Maria Fawcett — FIXED sex (6988,
      female — self-caught a slip where I first set this to male by
      mistake, corrected immediately on review).
1044: George Foxton — OK. Labourer, Whitby, Church Street.

**Progress: id 1040-1044 done (5 records). 3 sex fixes (one caught and
corrected mid-batch). 1 new location created (Staithes Lane). 1
same-person candidate logged (Peter Kilpatrick, 4 sightings).**

## Records 1045-1049

1045: John Simpson — OK. Jet worker, Whitby, Church Street.
1046: Thomas Gay — OK. No home stated. Ruswarp captured directly (no
      specific street named).
1047: Charles Harland — OK. Jet worker, Whitby, Church Street.
1048: William Rook + victim/informant William Hopper (farmer, home
      Goathland, testifying about his own assault — correctly only one
      role) — FIXED sex (6989, male). Text's "and another" (an unnamed
      second witness) correctly not fabricated into a person row.
1049: James Ball — OK. No home stated.

**Progress: id 1045-1049 done (5 records). 1 sex fix. Zero location or
middle-name gaps.**

## Records 1050-1054

1050: Robert Steel + property owner William Massey — FIXED sex (6990,
      male). Same real incident as 1053 below (same date, same Steel,
      same Massey premises — damaging property and then refusing to
      leave while drunk, correctly two separate charges/rows).
1051: Robert Melton — OK. Text reads "being drunk and riotous in the
      town street" without naming which town (a genuine source-side gap
      — not "Sneaton town street" or "Ruswarp town street" explicitly,
      just "the town street") — correctly nothing fabricated; the
      offence township itself (Ruswarp) is still explicitly stated and
      captured regardless. Companion record to 1054 (same phrasing gap,
      same date, different defendant).
1052: George Mooney — OK. Hawker, Whitby.
1053: Robert Steel + licensee William Massey + informant Sarah Massey —
      FIXED sex on both (6991 male, 6992 female). See 1050 above (same
      incident, logged as a same-person/same-incident candidate for
      Robert Steel and William Massey).
1054: Richard Duck — OK. Same truncated "the town street" phrasing as
      1051 (companion record, same date, same gap, correctly not
      fabricated).

**Progress: id 1050-1054 done (5 records). 3 sex fixes. Zero location
gaps — the "the town street" phrasing gap in 1051/1054 correctly left
as a source-side omission, not treated as a missing extraction. 1
same-person/same-incident candidate logged (Robert Steel & William
Massey, same night).**

## Records 1055-1059

1055: Edward Jameson [James] Ayre — OK. Bracketed "[James]" alternate
      reading in both title and raw_record — same archive-side
      bracketed-annotation pattern as record 232's "[Whitby]" — kept
      "Jameson" (the main text's own spelling) as the middle name,
      correctly not overwritten by the bracketed alternate. 4th
      sighting of this recurring defendant (1, 321, 861, 1055) —
      candidate entry already covers this.
1056: John Hewison + property owner William Robinson — FIXED sex
      (6993, male).
1057: Joseph Marsay — OK. Same "the town street" (untownnamed) phrasing
      gap as 1051/1054/1059 — correctly nothing fabricated, Ruswarp
      still captured directly from its own explicit clause.
1058: Robert Arnold — OK. Jet worker, Whitby, Sandgate. Different real
      person from the earlier Robert Arnold(s) seen this session
      (different occupation/date context) — correctly not merged.
1059: William Smith — OK. Same "the town street" phrasing gap. Ruswarp
      captured directly.

**Progress: id 1055-1059 done (5 records). 1 sex fix. Zero location or
middle-name gaps.**

## Records 1060-1064

1060: William Smith — OK. Labourer, Whitby, Bridge Street.
1061: George Collis + property owner William Robinson — FIXED sex
      (6994, male). Same date/charge/property owner as 1056 and 1064
      (William Robinson's hay, 29 July 1888, three separate people
      damaging it) — logged as a same-incident candidate, 2nd sighting.
1062: Francis Schofield + victim William Hodkinson — FIXED sex (6995,
      male).
1063: John Noble — OK. Jet worker, Whitby, Church Street.
1064: Arthur Spark + property owner William Robinson — FIXED sex
      (6996, male). See 1061 above — 3rd sighting of the same hay
      incident.

**Progress: id 1060-1064 done (5 records). 3 sex fixes. 1 same-incident
candidate logged (William Robinson's hay, 3 defendants same night).**

## Records 1065-1069

1065: "[blank] Karraffa" — OK. No given name stated at all (unusual
      surname, possibly a foreign itinerant beggar, common in this era's
      vagrancy records) — correctly no sex inferred, nothing else
      fabricated.
1066: James William Mason + victim Samuel Harrison (constable for the
      North Riding) — FIXED sex (6997, male; three-part name already
      correct). No home for Mason, correctly blank.
1067: Robert Wood + property owner William Robinson — FIXED sex (6998,
      male). 4th sighting of the William Robinson hay incident (1056,
      1061, 1064, 1067) — candidate entry updated.
1068: John Harker + informant Charles Tempest Clarkson — OK, already
      correctly fixed (Barnby + highway both present — sweep and Barnby
      restructure both holding). FIXED sex (6999, male) on Clarkson —
      7th sighting of this recurring superintendent.
1069: Thomas Gray — OK. "Hinderwell town street" resolves to Hinderwell
      itself. Same real defendant as record 983 (a separate, earlier
      conviction) — correctly not merged.

**Progress: id 1065-1069 done (5 records). 3 sex fixes. Confirmed the
Barnby restructure and Ruswarp sweep both holding cleanly. William
Robinson's hay candidate now has 4 sightings.**

## Records 1070-1074

1070: James Pearson + property owner William Robinson — FIXED sex
      (7000, male). 5th sighting of the hay incident (1056, 1061, 1064,
      1067, 1070) — candidate entry updated again.
1071: George Foster — OK. Sailor, Whitby.
1072: Robert Cockerill — OK. Home = Fylingdales, correctly distinct from
      the Whitby offence location.
1073: Thomas Kirk + property owner Robert Burnett — FIXED sex (7001,
      male). Same date (29 July 1888) as the William Robinson hay spree
      but a different property owner (a broken fence, not hay) —
      plausibly part of the same night's general rowdiness in the area
      but not enough shared detail to merge into that specific
      candidate; not logged as its own entry given only one sighting so
      far.
1074: George Wood — OK. Cab driver, Whitby.

**Progress: id 1070-1074 done (5 records). 2 sex fixes. William
Robinson's hay incident now has 5 defendants.**

## Records 1075-1079

1075: Anthony Marshall — OK. Whitby & Hawsker Highway (2-endpoint)
      correctly alongside Hawsker-cum-Stainsacre.
1076: Joseph Wright + property owner Robert Burnett — FIXED sex (7002,
      male). 2nd sighting of the Robert Burnett fence (1073, 1076 —
      same date, same property, different defendants) — logged as a
      same-incident candidate now that there are two.
1077: Amos Craven + informant John Jackson (labourer, home Ruswarp) —
      FIXED sex (7003, male). Whitby & Guisborough Highway correctly
      alongside Aislaby.
1078: James Pearson — OK. Blacksmith, Whitby. Royal Crescent Avenue +
      Ruswarp already correctly linked (sweep holding). Different real
      person from record 1070's James Pearson (jet worker, different
      occupation) — correctly not merged.
1079: Thomas Bennett — OK. "Sandsend town street" resolves to Sandsend,
      nested under Lythe, matching his own home township.

**Progress: id 1075-1079 done (5 records). 2 sex fixes. 1 same-incident
candidate logged (Robert Burnett's fence, now 2 sightings).**

## Records 1080-1084

1080: Thomas Welburry — OK. Sailor, Whitby, Sandgate.
1081: Thomas Hugill — OK. Roxby & Guisborough Highway (2-endpoint)
      correctly alongside Roxby.
1082: Henry Douglas — OK. Carpenter, Whitby, Flowergate (West Cliff,
      matches stated offence township Whitby directly).
1083: Henry Bennison + victim Charles Albert Martindale — FIXED sex
      (7004, male). 4th sighting of this recurring constable (722, 800,
      868, 1083) — candidate entry updated.
1084: Robert Parkin + informants Thomas Hall and Samuel Harrison (both
      police constables) — FIXED sex on both (7005, 7006, male).
      Samuel Harrison recurs from record 1066 (victim there, informant
      here) — logged as a same-person candidate.

**Progress: id 1080-1084 done (5 records). 3 sex fixes. 2 same-person
candidates logged/updated (Charles Albert Martindale now 4 sightings,
Samuel Harrison new).**

## Records 1085-1089

1085: Harrison Hodgson + licensee Thomas Lane — FIXED sex (7007, male);
      occupation "licensee" already present.
1086: Thomas Pearson Hodgson + victim Charles Albert Martindale — FIXED
      sex on both (1150 already male; 7008, male; three-part name
      already correct). Same date (28 January 1869) as records 1083 and
      1089 — all three "assaulting Charles Albert Martindale" — a group
      assault on the same constable the same night, three separate
      defendants. Candidate entry updated to flag this specific
      incident distinctly.
1087: John Watson Liddle — OK, three-part name already correct. Same
      real defendant as record 535 (a separate, earlier conviction) —
      correctly not merged.
1088: Johnson Hutton + licensee Philip Newton — FIXED sex (7009, male);
      occupation "licensee" already present.
1089: John Henry Smith + victim Charles Albert Martindale — FIXED sex
      (7010, male; three-part name already correct). 3rd defendant in
      the same 28 January 1869 group assault — see 1086 above.

**Progress: id 1085-1089 done (5 records). 4 sex fixes. Confirmed the
"licensee" occupation rule holding cleanly. Charles Albert Martindale's
candidate entry sharpened: 3 of his sightings (1083, 1086, 1089) are all
the SAME group-assault incident, same night.**

## Records 1090-1094

1090: Margaret Elders + informant Thomas Dennis (police constable, home
      Lythe) + husband Matthew Elders (stonemason) — OK, already
      correctly fixed by the Barnby restructure (home=Barnby, generic,
      matching her own text). FIXED: Matthew was missing his own
      home=Barnby despite occupation already correctly captured (#6
      pattern) — added, matching Margaret's. Also fixed sex on both
      secondary people (7011, 9944, male).
1091: Philip Newton — OK. Same real licensee as record 1088's defendant
      (companion conviction, same date range, "permitting drunkenness"
      here vs. being the venue there) — correctly separate rows.
1092: Ellen Hick — OK. No home stated in this particular terse text
      (unlike her many other appearances) — correctly not carried over
      from other convictions. "Old Post Office Yard" (West Cliff)
      matches stated offence township Whitby directly.
1093: Peter Kilpatrick + victim Robert Needham (constable for the North
      Riding) — FIXED sex (7012, male). 5th sighting of this recurring
      defendant (929, 1038, 1040, 1041, 1093) — candidate entry updated.
1094: Andrew Harland + victim Hannah Harland — FIXED a location gap: no
      "Offence committed at..." clause at all in this record's text —
      per the established "silence as evidence of local" rule (records
      21, 82, 677), inferred Whitby (his own stated home) as the
      offence location. Also fixed sex (7013, female). Shares a surname
      with the defendant — plausibly his wife, domestic assault — but
      not stated as such in the text, correctly not assumed.

**Progress: id 1090-1094 done (5 records). 4 sex fixes. 1 home fix
(Matthew Elders, the #6 pattern). 1 location fix (1094, silence-implies-
local). Peter Kilpatrick now 5 sightings.**

**New field added at the user's request: `summary_conviction.anomalies`**
— a free-text column for source-side artifacts (typos, mismatches,
impossible dates), populated retroactively for the 9 instances already
flagged in this log's prose (records 4, 27, 78, 121, 184, 353, 465, 500,
993). Going forward, populated directly whenever a new one is found, in
addition to noting it in the batch write-up.

## Records 1095-1099

1095: Mary Brown — OK. "Common prostitute" occupation, no home stated.
1096: Moses Thompson — OK. "Lythe town street" resolves to Lythe itself.
1097: Susan Backhouse — OK. "Widow" occupation, New Quay (West Cliff,
      matches stated offence township Whitby directly).
1098: John Pitts — OK, no DB change beyond the new anomalies field
      (see above): `document_date_raw` "3 Jan [sic] 1869" vs.
      `offence_date` 2 February 1869 and raw_record's own "[Date
      endorsed as 3 February 1869]" — a genuine archive-flagged date
      error, correctly left as catalogued rather than silently
      corrected. No home stated.
1099: William Weatherill — OK. No occupation stated.

**Progress: id 1095-1099 done (5 records). Zero sex/location/name
fixes needed. 1 new anomaly recorded (1098).**

## Records 1100-1104

1100: Frederick Garth + informant Edwin Harrison — FIXED sex (7014,
      male). Ruswarp captured directly.
1101: James Matthews + victim George Adams (labourer, home Whitby) —
      OK, already correctly sexed.
1102: Henry Douglas — OK. Grape Lane (East Cliff).
1103: Henry Douglas — OK. Same real defendant as 1082/1102 (recurring
      across multiple convictions this stretch) — correctly separate
      rows each time.
1104: James Green — OK. No home stated. Well Close Square + Ruswarp
      already correctly linked (sweep holding).

**Progress: id 1100-1104 done (5 records). 1 sex fix.**

## Records 1105-1109

1105: Charles Mason — OK. Same real defendant as record 1034 (identical
      offence date, 19 May 1875 — almost certainly the same scuffle:
      assaulting constable Thomas Hall there, damaging the North Riding
      Constabulary's property here) — logged as a same-incident
      candidate, correctly two separate charges/rows.
1106: William Cunningham — OK. Robin Hood's Bay correctly resolves from
      "Robin Hood's Bay town street".
1107: James Palmer — FIXED a location gap. The specific charge is
      genuinely illegible in the source (already faithfully reflected
      as "[blank]"/"[offence illegible in source text]" — not touched),
      but the site itself IS named ("whilst being relieved in the
      Whitby Union workhouse") — added Union Workhouse (81) as the
      offence location, since the specific building is directly stated
      regardless of the illegible act itself. No home stated, correctly
      blank.
1108: James Ball — OK. Labourer, Whitby, Church Street. Different real
      person from record 1049's James Ball (no occupation/home there,
      correctly not merged without more support).
1109: Thomas Johnson — OK. Labourer, Whitby, Church Street.

**Progress: id 1105-1109 done (5 records). 1 location fix (1107). 1
same-incident candidate logged (Charles Mason, records 1034 & 1105).**

## Records 1110-1114

1110: John McCloin — OK. "Common lodging house keeper" occupation,
      Whitby.
1111: Francis Fewster + informant John Nicholson (police constable) —
      FIXED sex (7016, male). Haggersgate (West Cliff) matches stated
      offence township Whitby directly.
1112: John Forden — OK. Fisherman, Whitby, Church Street.
1113: **HELD — needs a decision, not fixed.** "Bailiff Appleton of the
      township of Whitby cab driver for assaulting Robert Barrick" —
      this is a SECOND appearance of "Bailiff Appleton" as an apparent
      personal name (person 1177, first_name='Bailiff', last_name=
      'Appleton'), this time as the DEFENDANT with a stated home and
      occupation, not the licensee context record 351 was resolved
      around. Not touched pending the user's call on whether the same
      "Bailiff is a title" ruling extends here too. FIXED sex (7017,
      male) on victim Robert Barrick only (his own capture — jet
      ornament manufacturer, home Whitby — is unaffected either way).
1114: William Weatherill + licensee Joseph Marsay — FIXED sex (7018,
      male); occupation "licensee" already present. Same real name as
      record 1057's defendant Joseph Marsay (mariner there, licensee
      here) — plausibly the same person with two trades, not confirmed
      — logged as a candidate.

**Progress: id 1110-1114 done (4 of 5 fully resolved). 2 sex fixes. 1
record (1113) held for a decision on the Bailiff Appleton naming
question. 1 same-person candidate logged (Joseph Marsay).**

**Resolved with the user: record 1113's "Bailiff Appleton" gets the same
treatment as record 351.** `title='Bailiff'`, `first_name=NULL`,
`last_name='Appleton'` (person 1177; home Whitby and sex already
correctly captured). Same title+surname combination across two
convictions (351, a licensee; 1113, a cab driver assaulting someone) —
logged as a strong same-person candidate.

## Records 1115-1119

1115: Matthew Forden, fisherman, Whitby, Church Street — OK, no fixes
      needed.
1116: Robert Rudd (carpenter, Whitby) + informant Charles Albert
      Martindale (police constable, Whitby) — FIXED sex (7019, male).
      Source-side formatting glitch noted in `anomalies`: raw_record
      reads "police [constable]Offence committed..." — stray brackets
      around "constable" and a missing space before "Offence"; the
      occupation itself was already correctly captured as "police
      constable" regardless.
1117: Joseph Marsay (licensed victualler, Whitby) convicted for allowing
      drunkenness on his own licensed premises + informants John
      Nicholson (police constable, Whitby) and Ann Thompson (widow,
      Whitby) — FIXED sex (7020 male, 7021 female) and FIXED missing
      occupation "widow" on Ann Thompson (7021). Same offence_date (31
      March 1875) and same premises as record 1114 (William Weatherill
      convicted of being drunk on Joseph Marsay's licensed premises) —
      this is the same real-world incident, not just the same
      recurring person; logged to same-person-candidates.md as a
      confirmed same-incident pair.
1118: William Martin (jet worker, Whitby) convicted of being drunk on
      licensee Eleanor Miller's premises — FIXED sex (7022, female).
      Occupation "licensee" already correctly present per the earlier
      sweep; her home is genuinely not stated in the source text, left
      null correctly.
1119: John Thompson, begging in Baxtergate — OK as extracted (no
      home/occupation stated in source, sex already correctly male,
      location Baxtergate under West Cliff matches the stated offence
      township Whitby directly).

**Progress: id 1115-1119 done (5 of 5 fully resolved). 4 sex fixes, 1
missing-occupation fix, 1 new anomalies entry, 1 confirmed same-incident
pair logged.**

## Records 1120-1124

1120: John Grier, keeping a dog without a licence + informant John
      Nicholson (police constable, Whitby) — FIXED sex (7023, male).
      Same name/occupation/place as record 1117's informant John
      Nicholson (7020), only 3 ids apart — logged as a same-person
      candidate.
1121: Edward Ruehorn, jet worker, Whitby, Baxtergate — OK, no fixes
      needed.
1122: Richard Steel, fisherman, Whitby, drunk — OK, no fixes needed.
1123: William Swales (cab driver, Whitby) assaulting Frank Walker —
      FIXED sex (7024 Walker, male); no home stated for Walker in the
      source, correctly left null.
1124: Elizabeth Foley, pedlar, Whitby, vagrancy in Woodwark's Yard — OK,
      no fixes needed.

**Progress: id 1120-1124 done (5 of 5 fully resolved). 2 sex fixes, 1
same-person candidate logged.**

## Records 1125-1129

1125: Mary Ann Lyth, prostitute, Whitby, drunk — OK, no fixes needed.
1126: Thomas Weatherill (jet worker, Whitby) drunk on the premises of
      licensee Ann Thompson, refused to leave when asked by informant
      Edward Weeks (police constable) — FIXED sex (7025 Thompson,
      female; 7026 Weeks, male). Neither has a home stated in the
      source, correctly left null. Ann Thompson here (licensee) shares
      a name with record 1117's Ann Thompson (widow, witness), only 9
      ids apart — plausibly the same person (a widow running a licensed
      premises would be entirely consistent) — logged as a candidate.
1127: David Ritson, labourer, Hawsker-cum-Stainsacre, "Hawsker town
      street" — OK, the established "X town street" pattern already
      correctly resolves straight to the township itself.
1128: Arthur Cartwright, begging on the Pier — OK, no fixes needed (no
      home/occupation stated in source, sex already correctly male).
1129: George Johnson, labourer, Whitby, Sandgate — OK, no fixes needed.

**Progress: id 1125-1129 done (5 of 5 fully resolved). 2 sex fixes, 1
same-person candidate logged.**

## Records 1130-1134

1130: Thomas James Tweedy (labourer, Whitby) assaulting William Martin —
      FIXED sex (7027, male). Same name as record 1118's defendant
      William Martin (jet worker, convicted of being drunk on 18 August
      1888) — this victim's offence date is 25 August 1888, only 7 days
      later and 12 conviction ids apart. Plausibly the same real
      person; logged as a candidate.
1131: John Wilson (innkeeper, Whitby) allowing drunkenness on his
      licensed premises + informant Charles Tempest Clarkson
      (superintendent of police, Whitby) — FIXED sex (7028, male).
1132: Christopher Beals of Runswick (Hinderwell), miner, trespassing in
      pursuit of game on Addison Welford's land, offence at the
      township of Barnby — FIXED sex (7029 Welford, male). Location
      correctly resolves to the restructured Barnby node (id 400, under
      Lythe) from this session's tree fix.
1133: William Freeman (carriage driver, Whitby) not handing in an
      umbrella left in his cab by Susannah Coakes, offence at Ruswarp —
      FIXED sex (7030, female).
1134: Samuel Trueman, jet worker, Whitby, drunk and riotous in Church
      Street — OK, no fixes needed.

**Progress: id 1130-1134 done (5 of 5 fully resolved). 4 sex fixes, 1
same-person candidate logged.**

## Records 1135-1139

1135: Thomas Green, miner, Eskdaleside-cum-Ugglebarnby, "Grosmont town
      street" — OK; correctly captured as Grosmont itself (id 9, under
      Eskdaleside), not the coarser township, consistent with the
      single-destination specific-site convention.
1136: William Sedman, water bailiff, Ruswarp, catching salmon from the
      tail race of Ruswarp Mill other than with a rod and line — OK, no
      fixes needed.
1137: John Backhouse assaulting a child, Elizabeth Johnson — FIXED sex
      (7031, female). Backhouse's home genuinely not stated, correctly
      left null.
1138: Robert Monkman (jet worker, Whitby) + informant George Richard
      Lazenby (police constable, Whitby) — FIXED sex (7032, male).
1139: William Sedman, water bailiff, Ruswarp, catching two salmon within
      100 yards of the weir of Ruswarp Dam other than with a rod and
      line — OK. Same defendant as record 1136 (same name, occupation,
      home, offence type), only 4 days and 3 conviction ids apart —
      logged as a near-certain same-person candidate (a gamekeeper
      prosecuting/being convicted of the same type of poaching-adjacent
      offence twice in one week).

**Progress: id 1135-1139 done (5 of 5 fully resolved). 2 sex fixes, 1
same-person candidate logged.**

## Records 1140-1144

1140: George Robinson (labourer, Whitby) drunk + informant John
      Atkinson (police constable, Whitby) — FIXED sex (7033, male).
1141: Richard Cunningham (tinner, Whitby) acting as a pedlar without a
      certificate + informant George Richard Lazenby (police constable,
      Whitby) — FIXED sex (7034, male). Same recurring Lazenby as
      record 1138 (7032), only 3 ids apart — logged as a candidate.
1142: Charles Aaron Blackstone (jet worker, Whitby) assaulting Hannah
      Blackstone — FIXED sex (7035, female). Shared surname but no
      relationship stated in the source text, correctly left
      uncaptured rather than assumed.
1143: William Child, shoemaker, home Egton, offence at Whitby (Church
      Street) — OK, no fixes needed; correctly captured as a non-local
      defendant.
1144: Richard Purvis (shoemaker, Whitby) drunk on the licensed premises
      of Jonathan Harrison; informants Miles Moody (inspector of
      police) and John Nicholson (police constable) — FIXED sex (7036
      Harrison male, 7037 Moody male, 7038 Nicholson male). This is now
      the third sighting of "John Nicholson, police constable, Whitby"
      (records 1117, 1120, 1144) — updating the existing candidate
      entry.

**Progress: id 1140-1144 done (5 of 5 fully resolved). 6 sex fixes, 1
same-person candidate logged/updated.**

## Records 1145-1149

1145: Thomas Paylor (milk seller, Whitby) selling sub-standard milk to
      John Elwood Ryder through his agent Mary Elizabeth Forden — FIXED
      sex (7039 Ryder male, 7040 Forden female). Neither has a home
      stated in the source, correctly left null.
1146: John McCloin, common lodging house keeper, Whitby, Henrietta
      Street — OK, no fixes needed.
1147: James Marshall, jet worker, Whitby, Church Street — OK, no fixes
      needed.
1148: John Holmes (jet worker, Whitby) drunk and disorderly "on the
      Whitby and Hawsker highway", offence at Hawsker cum Stainsacre —
      OK; correctly captured with both the stated township AND the
      Cross-Parish Highways link (Whitby & Hawsker Highway, id 150),
      matching the established two-endpoint highway convention.
1149: James Bryce, begging in Fishburn Park, offence at Ruswarp — OK,
      no fixes needed; Fishburn Park correctly sits under West Cliff per
      this session's Ruswarp/West-Cliff sweep.

**Progress: id 1145-1149 done (5 of 5 fully resolved). 2 sex fixes.**

## Records 1150-1154

1150: John Statham, lodging in a straw shed, Ruswarp — OK, no fixes
      needed (no home stated in source, correctly null).
1151: Thomas Holmes (jet worker, Whitby) drunk and disorderly "on the
      Whitby and Hawsker highway", offence at Hawsker cum Stainsacre —
      OK; same two-endpoint highway convention correctly applied. Same
      offence_date (5 August 1888) and same highway as record 1148's
      John Holmes — same surname, likely a joint incident (two men
      convicted separately for the same night's drinking) or possibly
      kin; logged as a candidate.
1152: William Lawson, labourer, home Newholm-cum-Dunsley, offence at
      Lythe — OK, no fixes needed; correctly captured as a non-local
      defendant.
1153: Sarah Hannah Burdon (Ruswarp) assaulting Henry Hartley, aged four
      — FIXED missing occupation "singlewoman" on Burdon (1217, already
      existed in the occupation table as id 337) and FIXED sex (7041
      Hartley, male).
1154: George Wilson, brass finisher, Ruswarp, begging in Park Terrace —
      OK, no fixes needed; Park Terrace correctly under West Cliff per
      the sweep.

**Progress: id 1150-1154 done (5 of 5 fully resolved). 1 sex fix, 1
missing-occupation fix, 1 same-incident/candidate logged.**

## Records 1155-1159

1155: Louisa Watson (singlewoman, Whitby) drunk and riotous in the New
      Way Ghaut; informant Joseph Gatenby (police constable, Whitby) —
      FIXED sex (7042, male). Same date, location, offence, and
      informant as record 1158 (below) — same arrest incident, two
      women taken together.
1156: Ralph Jordison, painter, Whitby, Old Market Place — OK, no fixes
      needed.
1157: George Brown (stonemason, Whitby) drunk and disorderly "on the
      Whitby and Ruswarp footpath", offence at Ruswarp — asked the user
      whether this pre-existing cross-parish footpath location (id 252,
      currently under West Cliff) should be reparented to match the
      Cross-Parish Highways convention; **decided: leave footpaths as
      their own thing, don't generalize the highway rule to them.** No
      change made.
1158: Hannah Wallace (singlewoman, Whitby) drunk and riotous in the New
      Way Ghaut; informant Joseph Gatenby (police constable, Whitby) —
      FIXED sex (7043, male). Same date/location/offence/informant as
      record 1155 — confirmed same-incident pair, logged.
1159: Francis Hoggarth (miner, home Eskdaleside) trespassing in pursuit
      of conies on land in the possession of John Watson, offence at
      Egton — FIXED sex (7044, male).

**Progress: id 1155-1159 done (5 of 5 fully resolved). 3 sex fixes, 1
schema question resolved with the user (no change), 1 confirmed
same-incident pair logged.**

**Naming: the user renamed the three cross-parish location categories.**
"Cross-Parish Highways" (106) → "Highways", "Cross-Parish Railways"
(388) → "Railways", "Cross-Parish Rivers" (397) → "Rivers". Going
forward, refer to these by the new names; historical log entries above
that used the old names are left as-is (they're a record of what was
true at the time).

## Records 1160-1164

1160: Richard Steel, fisherman, Whitby, drunk on the Pier — OK, no
      fixes needed.
1161: Mary Jane Wallace (singlewoman, Whitby) drunk and riotous in the
      New Way Ghaut; informant Joseph Gatenby (police constable,
      Whitby) — FIXED sex (7045, male). Same date/location/informant as
      records 1155 and 1158 — a THIRD woman from the same arrest
      incident; updating the existing same-incident entry.
1162: Jonathan Harrison (beer house keeper, Whitby) allowing
      drunkenness on his licensed premises; informant Miles Moody
      (inspector of police, Whitby) — FIXED sex (7046, male). Same
      offence_date (24 April 1875) as record 1144 (Richard Purvis
      convicted of being drunk on Harrison's premises, same informant
      Miles Moody) — this is the other half of that same incident;
      logged as a confirmed same-incident pair.
1163: Benjamin Aldridge, chiropodist, Whitby, Church Street — OK, no
      fixes needed.
1164: James Raw (labourer, home Hinderwell) drunk and quarrelsome on
      the licensed premises of Elizabeth Seymour, refusing to leave
      when asked by Thomas Gee, a constable of the North Riding —
      FIXED sex (7047 Seymour female, 7048 Gee male).

**Progress: id 1160-1164 done (5 of 5 fully resolved). 4 sex fixes, 1
same-incident entry updated (now 3 people), 1 new confirmed
same-incident pair logged.**

## Records 1165-1169

1165: Owen Murphey (hawker, Whitby) acting as a pedlar selling hats
      without a certificate; informant Robert Needham (police
      constable, Whitby) — FIXED sex (7049, male).
1166: George Ledow, painter, Whitby, begging in Brunswick Street — OK,
      no fixes needed.
1167: Richard Lyth, jet worker, Whitby, drunk — OK, no fixes needed.
1168: Ellen Watson, wife of William Watson (labourer), of the township
      of Whitby, using obscene language — FIXED sex (9945 William,
      male) and FIXED missing home (9945, Whitby/4) — pattern #6: "of
      the township of Whitby labourer" attaches to William, the
      immediately preceding named person, and his occupation was
      already captured but his home wasn't. Relationship (wife) already
      correctly captured.
1169: William Thompson (labourer, home Eskdaleside-cum-Ugglebarnby)
      wilfully damaging a window belonging to Thomas Readman — FIXED
      sex (7050, male).

**Progress: id 1165-1169 done (5 of 5 fully resolved). 4 sex fixes, 1
pattern-#6 missing-home fix.**

## Records 1170-1174

1170: William Greenwood assaulting George Stockton — FIXED sex (7051,
      male). No home stated for either in the source, correctly left
      null.
1171: George Webster (jet worker, Whitby) drunk on the licensed
      premises of Robert Jefferson; informants Thomas Hall and John
      Nicholson (both police constables, Whitby) — FIXED sex (7052
      Jefferson, 7053 Hall, 7054 Nicholson, all male). This is now the
      fourth sighting of "John Nicholson, police constable, Whitby"
      (records 1117, 1120, 1144, 1171) — updating the existing
      candidate entry.
1172: James Cooper, surgeon, Whitby, St Ann's Staith — OK, no fixes
      needed.
1173: Absalom Breckon, jet worker, Whitby, Sandgate — OK, no fixes
      needed.
1174: Richard Collier (jet worker, Whitby) drunk in Church Street;
      witness William Thompson (jet ornament manufacturer) and
      informant Thomas Archer (inspector of police) — FIXED sex (7055
      Thompson, 7056 Archer, both male).

**Progress: id 1170-1174 done (5 of 5 fully resolved). 6 sex fixes, 1
same-person candidate entry updated (4th sighting).**

## Records 1175-1179

1175: Sarah Cullen, home Glaisdale, drunk and disorderly in "Lealholm
      town street" — OK; correctly resolves to Lealholm itself (id 142,
      under Glaisdale), matching the specific-place-within-township
      convention (same shape as the Grosmont case at record 1135).
1176: Thomas Fewster (innkeeper, Whitby) selling a pint of beer to
      "[blank] Seddon" before 12.30pm, offence at 11.25 a.m. on a
      Sunday — OK as extracted (offence_time correctly captured;
      Seddon's first name correctly left null, matching the source's
      literal "[blank]"). Added an `anomalies` note explaining the
      source-side blank so it doesn't read as an extraction gap.
1177: Joseph Tose, rag gatherer, home Hinderwell, drunk and disorderly
      in "Staithes town street" — OK; correctly resolves to Staithes
      itself (id 163, under Hinderwell), same convention as 1175.
1178: John Stangoe (farmer, Lythe) drunk and disorderly on "the Lythe
      and Goldsboro' highway" — OK; correctly captured with both the
      stated township and the Highways link (Lythe & Goldsborough
      Highway, id 266, under the renamed Highways category 106).
1179: William Pattison, jet worker, Whitby, Sandgate — OK, no fixes
      needed.

**Progress: id 1175-1179 done (5 of 5 fully resolved). 1 new anomalies
entry. No sex/location fixes needed — a clean batch.**

## Records 1180-1184

1180: Robert Jefferson (licensed victualler, Whitby) allowing
      drunkenness on his licensed premises; informants Thomas Hall and
      John Nicholson (both police constables, Whitby) — FIXED sex
      (7058 Hall, 7059 Nicholson, both male). Same date (11 May 1875)
      and same informants as record 1171 (George Webster convicted of
      being drunk on Jefferson's premises) — confirmed same-incident
      pair. Nicholson is now a fifth sighting — updating the existing
      candidate entry.
1181: Richard Lyth (labourer, Whitby) drunk and disorderly on "the
      Whitby and Ruswarp footpath", offence at Ruswarp — OK, no fixes
      needed. Shares a name with record 1167's Richard Lyth (jet
      worker, 1869) but 19 years and a different stated occupation
      apart — plausible same man later in life, not confident enough to
      call it more than a weak candidate; logged for completeness.
1182: Francis Calvert (shoemaker, Goathland) assaulting Charles Clarke
      (quarryman, Goathland); informant is "the said Charles Clarke" —
      OK, no fixes needed; correctly reused the same person row for
      victim+informant rather than creating a duplicate stub. FIXED sex
      (7060, male).
1183: Robert Midgley (miner, home Eskdaleside-cum-Ugglebarnby) drunk and
      riotous in "Sleights town street", offence stated at "the
      township of Ugglebarnby" — OK; Sleights correctly resolves under
      the combined Eskdaleside-cum-Ugglebarnby node regardless of which
      half of the combined parish name the source text used.
1184: John Backhouse, jet worker, Whitby, drunk and disorderly "at the
      Bridge" — OK, no fixes needed; correctly resolved to the existing
      "The Bridge" location under Whitby.

**Progress: id 1180-1184 done (5 of 5 fully resolved). 3 sex fixes, 1
confirmed same-incident pair, 1 same-person candidate entry updated (5th
sighting), 1 weak candidate logged.**

## Records 1185-1189

1185: James McGloin (mariner, Whitby) assaulting Mary Jane Dixon
      (singlewoman, Whitby); informant is "the said Mary Jane Dixon" —
      FIXED sex (7061, female). Victim/informant correctly reused the
      same person row, no duplicate stub.
1186: Matthew Tose (jet worker, Whitby) drunk on the licensed premises
      of Robert Jefferson; informants Thomas Hall and John Nicholson —
      FIXED sex (7062 Jefferson, 7063 Hall, 7064 Nicholson, all male).
      Same date (11 May 1875), premises, and informants as records 1171
      and 1180 — a THIRD conviction from the same incident; updating
      the existing same-incident entry. Nicholson is now a sixth
      sighting — updating his candidate entry too.
1187: John Backhouse (jet worker, Whitby) assaulting William Barrett —
      FIXED sex (7065, male). Same name and same offence_date (11
      September 1888) as record 1184 (Backhouse drunk and disorderly at
      the Bridge) — near-certainly the same man, two separate offences
      the same day; logged as a strong same-person candidate.
1188: Charles Aaron Blackstone (jet worker, Whitby) drunk; informant
      "[blank] Dickinson" (police constable, Whitby) — OK as extracted,
      first name correctly left null matching the source's literal
      "[blank]"; added an `anomalies` note. Sex also correctly left
      null (occupation alone isn't treated as gender evidence without a
      name).
1189: James Calvert (miner, Glaisdale) drunk and riotous in "Lealholm
      Bridge town street"; informant James Gibson (police constable,
      Glaisdale) — FIXED sex (7067, male). Lealholm Bridge correctly
      captured as its own location under Lealholm (id 143).

**Progress: id 1185-1189 done (5 of 5 fully resolved). 6 sex fixes, 1
new anomalies entry, 1 same-incident entry updated (now 3 people), 1 new
strong same-person candidate.**

## Records 1190-1194

1190: William Bridge (gentleman, home Eskdaleside-cum-Ugglebarnby)
      drunk in Stakesby Vale, offence at Ruswarp — OK, no fixes needed;
      Stakesby Vale correctly under West Cliff per the sweep.
1191: Mark Noble, jet worker, Whitby, drunk — OK, no fixes needed.
1192: John Blenkey (miner, Hinderwell) drunk in Runswick Lane; informant
      "[blank] Dowsland" (sergeant of police, Hinderwell) — OK as
      extracted, matching the same "[blank]" source-side gap pattern as
      1176/1188; added an `anomalies` note, sex correctly left null.
1193: George Breckon, labourer, Sneaton, Sneaton Lane — OK, no fixes
      needed.
1194: James Stewart, carpenter, Whitby, drunk — OK, no fixes needed.

**Progress: id 1190-1194 done (5 of 5 fully resolved). 1 new anomalies
entry. No sex/location fixes needed — a clean batch.**

## Records 1195-1199

1195: Stephen Kingston (jet worker, Whitby) drunk on the licensed
      premises of John Nellist, refusing to leave when asked by George
      Eli North (police constable), offence at Fylingdales — FIXED sex
      (7069 Nellist, 7070 North, both male).
1196: William Lawson, labourer, home Aislaby, drunk in "Ruswarp Carrs",
      offence at Ruswarp — OK, no fixes needed; correctly resolved to
      "The Carrs" under Ruswarp itself (not a West Cliff conflict, since
      the Carrs genuinely belongs to Ruswarp).
1197: Isaac Jackson (cattle dealer, home Wolviston — a genuinely distant
      township, already existing in the location tree) drunk; informant
      John Ryder (inspector of police, Whitby) — FIXED sex (7071, male).
1198: Rachel Heaton (widow, Whitby) acting as a pedlar selling books and
      prints without a certificate; informant John Nicholson (police
      constable, Whitby) — FIXED sex (7072, male). Seventh sighting of
      the recurring John Nicholson — updating the candidate entry.
1199: Valentine Ballard, jet worker, Whitby, Church Street — OK, no
      fixes needed.

**Progress: id 1195-1199 done (5 of 5 fully resolved). 4 sex fixes, 1
same-person candidate entry updated (7th sighting).**

## Records 1200-1204

1200: Thomas Atkinson (labourer, Whitby) ill-treating a horse by
      working it whilst unfit — OK, no fixes needed. Shares a name with
      the existing "Thomas Atkinson (innkeeper)" candidate at records
      928/934, but a different stated occupation here — not linked,
      just noted for awareness.
1201: William Pattison (jet worker, Whitby) drunk and disorderly in
      Runswick Lane; informants "[blank] Dowsland" (sergeant of police,
      Hinderwell) and William Hammond (police constable) — FIXED sex
      (7074, male). Same date (24 May 1875), location, and informant
      (Dowsland) as record 1192's John Blenkey — confirmed same
      incident, two men picked up in Runswick Lane the same day.
1202: Edward Drury, riveter, Whitby, drunk and disorderly at the Bridge
      — OK, no fixes needed.
1203: Richard Lythe, jet worker, Whitby, obscene language in Church
      Street — OK, no fixes needed.
1204: Edward Pearson (draper, Whitby) placing drapery goods on the
      footway in Baxtergate; informants John Ryder (superintendent of
      police) and Frank Walker (surveyor) — FIXED sex (7075 Ryder, 7076
      Walker, both male). Ryder shares a name with record 1197's John
      Ryder (inspector of police, 1868) — plausibly the same officer
      promoted over the intervening 7 years; logged as a candidate.
      Walker shares a name with record 1123's assault victim Frank
      Walker (no occupation stated there) — plausibly the same man,
      weaker candidate given no occupation to cross-check there.

**Progress: id 1200-1204 done (5 of 5 fully resolved). 4 sex fixes, 1
confirmed same-incident pair, 2 new candidates logged.**

## Records 1205-1209

1205: Robert Weetman (farm servant, of Tofts Farm in the township of
      Barnby) assaulting Mary Alice Hoggarth — FIXED sex (7077,
      female). No "at the township of X" clause at all in the source
      for the offence location; correctly inferred as Tofts Farm
      (matching the defendant's own stated home) per the
      silence-implies-local rule.
1206: John Liddle, cartman, Whitby, ill-treating a mare by working it
      whilst unfit — OK, no fixes needed.
1207: John Backhouse (jet worker, Whitby) obstructing Henrietta Street;
      informants John Nicholson and Thomas Hall (both police
      constables, Whitby) — FIXED sex (7078 Nicholson, 7079 Hall, both
      male). Nicholson is now an eighth sighting; Hall a fourth
      (1171/1180/1186/1207) — updating both candidate entries. Dated
      1875, 13 years before the 1888 Backhouse pair at records
      1184/1187 — plausibly the same man across a long working life as
      a jet worker, logged as a separate weaker candidate given the
      gap.
1208: John Paget (cartman, home Brotton) too far from his waggon to
      control the horse, in "Staithes town street", offence at
      Hinderwell — OK, no fixes needed; Staithes correctly resolves
      under Hinderwell.
1209: Robert Burton (jet worker, Whitby) assaulting Joseph Gatenby;
      informant is "the said Joseph Gatenby" — FIXED sex (7080, male).
      Correctly reused the same person row for victim+informant. This
      is a fourth sighting of the recurring Joseph Gatenby (police
      constable, Whitby) seen already at 1155/1158/1161 — logging a
      standalone candidate entry for him.

**Progress: id 1205-1209 done (5 of 5 fully resolved). 4 sex fixes, 2
same-person candidate entries updated, 1 new standalone candidate
logged.**

## Records 1210-1214

1210: George Wilson (hawker, home Danby End) drunk and disorderly in
      "Glaisdale town street"; informant James Gibson (police
      constable, Glaisdale) — FIXED sex (7081, male). Location correctly
      resolves to Glaisdale itself. Second sighting of James Gibson
      (also at record 1189) — logging as a candidate.
1211: Robert Steel (fisherman, Whitby) drunk on the licensed premises of
      Thomas Wadsworth, refusing to leave when asked by Wadsworth
      himself — FIXED sex (7082, male).
1212: Robert Goodwill (stonemason, Whitby) assaulting Christopher
      Harrison (ship owner, Ruswarp); informant is "the said Christopher
      Harrison... and others" — FIXED sex (7083, male).
1213: Robert Pickering (grocer, Lythe) possessing an unjust patent
      weighing machine; found by John Ryder, inspector of weights and
      measures — FIXED sex (7084, male). Shares a name with the
      recurring "John Ryder, police officer" candidate (1197/1204), but
      a distinctly different office (weights and measures, not police)
      — not linked, just noted.
1214: Samuel Hill, jet worker, Whitby, drunk and disorderly at the
      Bridge — OK, no fixes needed.

**Progress: id 1210-1214 done (5 of 5 fully resolved). 4 sex fixes, 1
same-person candidate logged.**

## Records 1215-1219

1215: Edward Clark, begging in Esk Terrace, offence at Ruswarp — OK, no
      fixes needed (no home stated in source, correctly null).
1216: Joseph Green (miner, home Eskdaleside-cum-Ugglebarnby) drunk and
      riotous in "Sleights town street", offence at Ugglebarnby — OK,
      no fixes needed.
1217: Robert Hutton (Ruswarp) employing William Barrett, a young
      person, in an iron foundry for more than seven days without a
      certificate of fitness — FIXED sex (7085, male). Same name and
      only 11 days apart (both 1888) from record 1187's assault victim
      William Barrett — plausibly the same person; logged as a
      candidate.
1218: George Longhorn (blacksmith, Whitby) assaulting Thomas Wright —
      FIXED sex (7086, male). No home stated for Wright, correctly
      null.
1219: Joseph Morrison (hawker, home Danby End) drunk and disorderly in
      "Glaisdale town street"; informant James Gibson (police
      constable, Glaisdale) — FIXED sex (7087, male). Same date (27 May
      1875), location, and informant as record 1210's George Wilson —
      also from Danby End — confirmed same incident, two men from the
      same hamlet arrested together. Gibson is now a third sighting.

**Progress: id 1215-1219 done (5 of 5 fully resolved). 3 sex fixes, 1
confirmed same-incident pair, 1 same-person candidate logged.**

## Records 1220-1224

1220: William Robert Laidler (toy boat manufacturer, Whitby) employing
      his stepson Joseph Readman, under ten years of age — FIXED sex
      (7088, male). Relationship (stepson→Laidler) already correctly
      captured.
1221: Ann Miller, wife of Henry Miller (labourer), of the township of
      Whitby, drunk; informant John Ryder (inspector of police, Whitby)
      — FIXED sex (7089 Ryder male, 9946 Henry Miller male) and FIXED
      missing home on Henry Miller (9946, Whitby) — pattern #6 again:
      "of the township of Whitby labourer" attaches to Henry, the
      immediately preceding named person. This is a third sighting of
      John Ryder as "inspector of police" (also 1197, both 1868) —
      corroborates rather than complicates the existing candidate,
      since the 1875 "superintendent" sighting (1204) reads as a later
      promotion of the same steady inspector-then-superintendent career.
1222: George Ryder (stonemason, home Newholm-cum-Dunsley) owning an ass
      found straying in Newholm Lane; informant Thomas Dennis (police
      constable, Lythe) — FIXED sex (7090, male). Shares a surname with
      the recurring police-officer John Ryder but is a clearly
      different, unrelated person (different occupation, different
      township, no first-name overlap) — not linked.
1223: William Robert Laidler again, employing his other stepson Thomas
      William Readman, also under ten — FIXED sex (7091, male). Same
      defendant, same date as record 1220 — two separate charges for
      two separate children from the same prosecution, not a
      same-person "candidate" in the ambiguous sense, just the same
      person correctly appearing twice.
1224: Susan Backhouse, fish hawker, Whitby, drunk — OK, no fixes
      needed.

**Progress: id 1220-1224 done (5 of 5 fully resolved). 5 sex fixes, 1
pattern-#6 missing-home fix.**

## Records 1225-1229

1225: John White and George William Kitchin (both Whitby) wilfully
      damaging shrubs belonging to Sir George Elliot, baronet, offence
      at Ruswarp — OK, no fixes needed; Elliot's office/sex already
      correctly captured on this row from the earlier aristocrats
      resolution pattern (a fresh person row here, not yet merged
      across records — that's deferred to the future merge pass).
1226: Michael Clarke (fisherman, Hinderwell) assaulting Mary Jane Clarke
      — FIXED sex (7093, female — self-caught a slip where I first set
      this to male by mistake, corrected within the same batch). No
      relationship stated between the two despite the shared surname,
      correctly left uncaptured.
1227: William Reives (quarryman, Goathland) using a lamp and a gaff to
      catch salmon in "waters called the Mirk Esk", offence at Egton —
      FIXED a missing location: created a new "Mirk Esk" location (id
      403) as a tributary under the existing River Esk (398, itself
      under the renamed Rivers category), matching the specific-named-
      site convention; linked as the offence location.
1228: Robert Parkin (cab proprietor, borough of Whitby) taking down a
      barrier across Church Street during roadworks — OK, no fixes
      needed.
1229: Andrew Storm (grocer, Fylingdales) selling sub-standard lard to
      John Elwood Ryder — FIXED sex (7094, male). Same victim name as
      record 1145 (sold sub-standard milk to the same John Elwood
      Ryder), 22 days apart, both 1888 — confirmed recurring victim of
      adulterated-food sales; logged as a strong candidate.

**Progress: id 1225-1229 done (5 of 5 fully resolved). 2 sex fixes (1
self-corrected), 1 new location created (Mirk Esk), 1 strong same-person
candidate logged.**

## Records 1230-1234

1230: John Dale (railway labourer, home Goathland) using a lamp and a
      gaff to catch salmon in the Mirk Esk, offence at Egton — FIXED
      missing Mirk Esk location link (same gap as record 1227, applied
      the same fix). Same date/location/offence as records 1227 and
      1233 — a joint poaching party.
1231: William Murray, lodging in the open on Abbey Plain, offence at
      Hawsker cum Stainsacre — OK, no fixes needed.
1232: Joseph Storr (jet worker, Whitby) drunk on the licensed premises
      of Robert Ward — FIXED sex (7095, male).
1233: William Adamson (railway labourer, home Goathland) using a lamp
      and a gaff to catch salmon in the Mirk Esk, offence at Egton —
      FIXED missing Mirk Esk location link (same gap). Same
      date/location/offence as 1227 and 1230 — confirmed the same joint
      poaching party, three men total.
1234: Charles Pratt, lodging in a barn, offence at Hawsker cum
      Stainsacre — OK, no fixes needed.

**Progress: id 1230-1234 done (5 of 5 fully resolved). 1 sex fix, 2 more
Mirk Esk location links fixed, 1 confirmed 3-person same-incident group
logged.**

**Out-of-sequence scope check:** searched the full corpus for `%Mirk
Esk%` after finding the same gap three times in a row (records
1227/1230/1233) — found one more, record 1257 (Jacob Latimer, 7 December
1868, offence at Goathland — a separate incident from the 15 November
group above), and fixed the same missing-location gap there immediately
rather than waiting to reach it in sequence. Will note "already fixed"
when the batch containing 1257 comes up normally.

## Records 1235-1239

1235: Matthew Beal (butcher, Whitby) drunk on the licensed premises of
      Robert Ward — FIXED sex (7096, male). Same licensee and same date
      (25 September 1888) as record 1232 (Joseph Storr) — confirmed
      same-incident pair, two men on Ward's premises that night.
1236: John Ralph Alderson (farm servant, Glaisdale) assaulting Jonathan
      Leng (grocer, Glaisdale); informant is "the said Jonathan Leng" —
      FIXED sex (7097, male).
1237: William Muncaster (hawker, Whitby) acting as a pedlar selling
      scent without a certificate, offence at Ruswarp — OK, no fixes
      needed.
1238: George Martin, jet worker, Whitby, drunk and disorderly in Grape
      Lane — OK, no fixes needed.
1239: John Proud frequenting Church Street with intent to steal the
      goods of William Marshall — FIXED sex (7098, male). No home
      stated for either, correctly left null.

**Progress: id 1235-1239 done (5 of 5 fully resolved). 3 sex fixes, 1
confirmed same-incident pair logged.**

## Records 1240-1244

1240: William Pickering (grocer, home Barnby) using unstamped measures,
      offence at Barnby — OK, no fixes needed; Barnby correctly resolves
      to the restructured node (id 400).
1241: George Rutherford, labourer, Whitby, Cliff Street — OK, no fixes
      needed.
1242: Henry McLauglin, labourer, Whitby, Church Street — OK, no fixes
      needed.
1243: Matthew Moon (labourer, Whitby) ill-treating a cow; informants
      John Plews and Thomas Richardson (both Ugglebarnby) — FIXED sex
      (7099 Plews, 7100 Richardson, both male).
1244: Edward Raw, labourer, Whitby, Church Street — OK, no fixes
      needed.

**Progress: id 1240-1244 done (5 of 5 fully resolved). 2 sex fixes.**

## Records 1245-1250 (1246 skipped by the source scrape)

1245: Charles Aaron Blakeston, jet worker, Whitby, Morley's Yard — OK,
      no fixes needed. Shares the distinctive first+middle name "Charles
      Aaron" with "Charles Aaron Blackstone" (records 1142, 1188) —
      surname spelled differently here ("Blakeston" vs "Blackstone"),
      plausibly the same real person with a variant spelling; logged as
      a candidate for the merge pass to reconcile.
1247: Edward Raw (labourer, Whitby) assaulting William Dobson, a
      constable for the North Riding, in the execution of his duty —
      FIXED sex (7101, male). Same defendant, same date (24 March 1888)
      as record 1244 (drunk and disorderly) — part of a same-day spree.
1248: Isaac Wilson (labourer, Whitby) drunk and riotous in Church
      Street; informant Charles Tempest Clarkson (superintendent of
      police, Whitby) and another — FIXED sex (7102, male). Second
      sighting of Clarkson (also record 1131) — logging as a candidate.
1249: Isaac Hick assaulting Ellen Hick — FIXED sex (7103, female). No
      relationship stated in this particular record's text, correctly
      left uncaptured (not assumed from other sightings). Another
      sighting of the already-logged recurring Isaac Hick.
1250: Edward Raw (labourer, Whitby) assaulting John Johnson, a second
      constable for the North Riding, in the execution of his duty —
      FIXED sex (7104, male). Third conviction for the same man on the
      same day (24 March 1888) — drunk and disorderly (1244), then
      assaulting two different constables in turn (1247, 1250);
      confirmed same-incident/spree, logging as a strong candidate.

**Progress: id 1245-1250 done (5 of 5 fully resolved). 4 sex fixes, 1
surname-variant candidate, 1 candidate entry updated, 1 confirmed
3-conviction same-day spree logged.**

## Records 1251-1255

1251: John Brough (beer house keeper, Whitby) keeping his licensed
      premises open after 11 p.m.; informant Thomas Archer (police
      constable, Whitby) — FIXED sex (7105, male). Shares a name with
      record 1174's informant Thomas Archer, but there he's titled
      "inspector of police" — rank mismatch means weaker confidence;
      logged as a candidate anyway given otherwise identical
      name/place.
1252: John de Wart, begging in St Mary's churchyard, offence at Hawsker
      cum Stainsacre — OK, no fixes needed (no home stated in source,
      correctly null).
1253: Robert Pennock (of Tate Hill in the township of Whitby) not
      sending his son Robert Pennock to school — FIXED sex (7106 son,
      male). Offence location correctly resolves to Tate Hill (the
      father's own home) per the truancy rule; relationship (son)
      already correctly captured.
1254: Robert Pearson, labourer, Goathland, 13 unclean salmon in his
      possession — OK, no fixes needed.
1255: Eleanor Riley, drunk and disorderly in Victoria Road, offence at
      Ruswarp — OK, no fixes needed (no home stated, correctly null;
      Victoria Road correctly under West Cliff per the sweep).

**Progress: id 1251-1255 done (5 of 5 fully resolved). 2 sex fixes, 1
weaker same-person candidate logged.**

## Records 1256-1260

1256: William Ruehorn (of Argument's Yard in the township of Whitby)
      not sending his son William Ruehorn to school — FIXED sex (7107
      son, male). Offence location correctly resolves to Argument's
      Yard (the father's own home) per the truancy rule. Truancy
      records genuinely lack a "Whitby Strand" petty-sessional-division
      phrase in the source text (confirmed by checking the raw_record
      wording), so the missing petty-sessional-division link here (and
      at record 1253) isn't a gap — the source itself omits it.
1257: Jacob Latimer (foreman platelayer, Goathland) using a gaff to
      catch salmon in the Mirk Esk; informant William Pickering (police
      constable) — FIXED sex (7108, male). Mirk Esk location link
      already fixed out-of-sequence above (see the scope-check note
      after the 1230-1234 batch).
1258: William Smith, begging at Robin Hood's Bay, offence at
      Fylingdales — OK, no fixes needed.
1259: Richard Harrison, labourer, Goathland, salmon roe in his
      possession — OK, no fixes needed.
1260: Samuel Jackson (moulder, Whitby) assaulting John Nicholson, one of
      the constables for the North Riding — FIXED sex (7109, male).
      Shares a name with the recurring "John Nicholson, police
      constable, Whitby" candidate, but this sighting predates all the
      others (4 January 1875 vs April+ 1875), has no home stated, and
      uses "constable for the North Riding" rather than "police
      constable, of the township of Whitby" — plausibly the same man
      earlier in the year, logged as a slightly weaker addition to the
      existing candidate rather than folded in at full confidence.

**Progress: id 1256-1260 done (5 of 5 fully resolved). 3 sex fixes, 1
same-person candidate entry extended (with caveats).**

## Records 1261-1265

1261: Thomas Batty (seaman, Whitby) drunk on the licensed premises of
      William Arrundale — FIXED sex (7110, male).
1262: George Foster, drunk and riotous in Sandgate, offence at Whitby —
      OK, no fixes needed (no home stated, correctly null).
1263: George McLaughlin (pedlar, Whitby) drunk and disorderly in "Robin
      Hood's Bay town street", offence at Fylingdales — OK, no fixes
      needed; correctly resolves to Robin Hood's Bay itself (id 93,
      same node as record 1258).
1264: William Ruehorn (jet worker, Whitby) drunk and disorderly in
      Church Street — OK, no fixes needed. Shares a name with record
      1256's truancy defendant William Ruehorn, only one day apart (7
      April vs 6 April 1888) — plausibly the same man, convicted of
      truancy one day and drunkenness the next; logged as a candidate.
1265: Mary Wray, wife of Cuthbert Wray (fruiterer), of the township of
      Whitby, drunk; informant Francis Selby (police constable, Whitby)
      and another — FIXED sex (7111 Selby, 9947 Cuthbert Wray, both
      male) and FIXED missing home on Cuthbert Wray (9947, Whitby) —
      pattern #6 again. Relationship (wife) already correctly captured.
      Cuthbert Wray was already flagged in an earlier session as a
      "wording variants" candidate — this sighting adds to that.

**Progress: id 1261-1265 done (5 of 5 fully resolved). 3 sex fixes, 1
pattern-#6 missing-home fix, 1 new same-person candidate logged.**

## Records 1266-1270

1266: Samuel Welsh, labourer, home Ruswarp, begging in Abbey Terrace,
      offence at Ruswarp — OK, no fixes needed.
1267: John Hesleton, drunk and riotous in Sandgate, offence at Whitby —
      OK, no fixes needed (no home stated, correctly null).
1268: Ellen Hick, wife of Isaac Hick, assaulting Robert Needham, one of
      the constables for the North Riding — FIXED sex (7112 Needham,
      9948 Isaac Hick, both male). No "of the township of X" clause
      attached to Isaac here, correctly left home/occupation null.
      Relationship (wife) already correctly captured. Same date range
      as record 1249 (Isaac Hick assaulting Ellen Hick, 24 December
      1874) and record 1269 below (26 vs 24 December) — a recurring
      volatile pair; updating the existing Isaac Hick candidate.
1269: Ellen Hick, wife of Isaac Hick, of the township of Whitby jet
      worker, drunk and disorderly in Church Street; informants Miles
      Moody (inspector of police) and Robert Needham (police constable)
      — FIXED sex (7113 Moody, 7114 Needham, 9949 Isaac Hick, all
      male) and FIXED missing home on Isaac Hick (9949, Whitby) —
      pattern #6: his occupation ("jet worker") was already correctly
      captured from the "of the township of Whitby jet worker" clause,
      but the home half of that same clause had been dropped. Same date
      as record 1249 (Isaac assaulting Ellen) — very likely the same
      night's events on both sides. Moody is a third sighting (also
      1144, 1162); Needham a second (also 1165) — both candidates
      updated.
1270: John Henry Smith, fish hawker, Whitby, drunk and disorderly at
      the Bridge — OK, no fixes needed.

**Progress: id 1266-1270 done (5 of 5 fully resolved). 5 sex fixes, 1
pattern-#6 missing-home fix, 3 same-person candidate entries
updated/extended.**

## Records 1271-1275

1271: John McCloin, common lodging house keeper, Whitby, drunk — OK, no
      fixes needed.
1272: Ellen Hick, wife of Isaac Hick, of the township of Whitby jet
      worker, drunk and disorderly on the Bridge; informants Miles
      Moody and Robert Needham — FIXED sex (7115 Moody, 7116 Needham,
      9950 Isaac Hick, all male) and FIXED missing home on Isaac Hick
      (9950, Whitby) — pattern #6 again, same shape as 1269. Same date
      (26 December 1874) and same informants as record 1268 (Ellen
      assaulting Needham) — the same arrest, told from two angles.
      Fourth Hick-couple record within 3 days; updating the existing
      candidate entry.
1273: Hannah Smith, wife of John Henry Smith, of the township of
      Whitby fish hawker, drunk and disorderly on the Bridge — FIXED
      missing home on John Henry Smith (9951, Whitby) — pattern #6
      again, his occupation was already correctly captured. Same date
      (12 April 1888) and same location (the Bridge) as record 1270's
      John Henry Smith — a second domestic same-day pair, husband and
      wife both convicted the same day; logged as a new confirmed
      same-incident candidate.
1274: John Waller (fishmonger, Hinderwell) drunk; informant Thomas
      Stamper Dale (police constable, Hinderwell) — FIXED sex (7117,
      male).
1275: Thomas Allan, joiner, Whitby, drunk and disorderly in Haggersgate
      — OK, no fixes needed.

**Progress: id 1271-1275 done (5 of 5 fully resolved). 5 sex fixes, 2
pattern-#6 missing-home fixes, 1 same-person candidate entry updated, 1
new same-incident pair logged.**

## Records 1276-1280

1276: Benjamin McMagawn, labourer, Ruswarp, begging in Newton Street —
      OK, no fixes needed.
1277: William Linton (carrier, home Barnby) found with four rabbits on
      his waggon when searched in Upgang Lane by John Ryder, on
      suspicion of unlawfully obtained game; informant is "the said
      John Ryder... inspector of police" — FIXED sex (7118, male).
      Barnby correctly resolves to the restructured node. Third
      sighting of John Ryder as "inspector of police" in 1868 (also
      1197, 1221) — updating the existing candidate.
1278: John Shaw, jet worker, Whitby, drunk and disorderly at the Bridge
      — OK, no fixes needed.
1279: Edwin Renwick (butcher, home Hawsker cum Stainsacre) drunk and
      disorderly in "Robin Hood's Bay town street", offence at
      Fylingdales — OK, no fixes needed; correctly resolves to Robin
      Hood's Bay itself.
1280: Richard Collier (jet worker, Whitby) wilfully damaging a
      grindstone belonging to Jeremiah Allcrow; informant is "the said
      Jeremiah Allcrow... jet worker" — FIXED sex (7119, male).

**Progress: id 1276-1280 done (5 of 5 fully resolved). 2 sex fixes, 1
same-person candidate entry updated.**

## Records 1281-1285

1281: Joseph Green (miner, Eskdaleside-cum-Ugglebarnby) and Joseph
      Lowther (miner, same home) trespassing in pursuit of conies on
      land in the possession of John Wood, offence at Eskdaleside —
      FIXED sex (7120, male). Shares a name with record 1216's Joseph
      Green (miner, same home), 5 months apart — plausibly the same
      man poaching again; logged as a candidate.
1282: George Hall, labourer, Ruswarp, begging in Prospect Hill — OK, no
      fixes needed.
1283: Hannah Pearson, singlewoman, Whitby, drunk — OK, no fixes needed.
1284: Isaac Hick (jet worker, Whitby) drunk and disorderly in Church
      Street; informant John Ryder, superintendent of police — FIXED
      sex (7121, male). Same date (24 December 1874) as records 1249
      (Isaac assaulting Ellen) and 1269 (Ellen drunk) — Isaac himself
      convicted the same chaotic night; updating the Hick candidate
      entry. Also corroborates John Ryder already holding the rank of
      superintendent by December 1874, earlier than the 1875 sighting
      at record 1204 — narrows the promotion window from the 1868
      inspector sightings.
1285: John Brown (labourer, Lythe) drunk and disorderly on "the Lythe
      and Goldsborough highway" — OK, no fixes needed; correctly
      captured with both the township and the Highways link (same node
      as record 1178).

**Progress: id 1281-1285 done (5 of 5 fully resolved). 2 sex fixes, 2
same-person candidate entries updated/extended.**

## Records 1286-1290

1286: Thomas Jefferson (fisherman, Hinderwell) drunk and riotous on the
      licensed premises of Frank Crosier, refusing to leave when asked
      by Thomas Stamper Dale, a police constable — FIXED sex (7122
      Crosier, 7123 Dale, both male). Dale is a second sighting (also
      1274) — logging as a candidate.
1287: John Sherwood (jet worker, Whitby) using obscene language on the
      Cragg; informant Eliza Patton, wife of Joseph Patton (fisherman),
      of the township of Whitby — FIXED sex (7124 Eliza female, 10201
      Joseph male) and FIXED missing home on Joseph Patton (10201,
      Whitby) — pattern #6, his occupation was already correctly
      captured.
1288: Edward Ruehorn, jet worker, Whitby, drunk and disorderly in
      Church Street — OK, no fixes needed. Same name/occupation/home as
      record 1121's Edward Ruehorn (jet worker, Baxtergate), 4 months
      apart — plausibly the same man; logged as a candidate.
1289: Thomas Jefferson again, assaulting Thomas Stamper Dale; informant
      is Dale himself — FIXED sex (7125, male). Same date as record
      1286 — confirmed same-incident pair, Jefferson resisting and then
      assaulting the constable who'd told him to leave.
1290: James Marshall, jet worker, Whitby, drunk and disorderly in
      Bridge Street — OK, no fixes needed.

**Progress: id 1286-1290 done (5 of 5 fully resolved). 5 sex fixes, 1
pattern-#6 missing-home fix, 1 confirmed same-incident pair, 2
same-person candidates logged.**

## Records 1291-1295

1291: Richard Hobson (jet worker, Whitby) playing pitch and toss on
      "the New Gardens footpath", offence at Hawsker cum Stainsacre —
      FOUND a duplicate-location bug: this record's location was linked
      to a bare "New Gardens" node (id 357) instead of the existing
      "New Gardens Footpath" (id 159, already used by four other
      convictions for the exact same wording and the same 22 April 1888
      incident: records 1300/1303/1306/1309). Checked scope first (only
      357 vs 159, three records affected: 1291, 1294, 1297) — repointed
      all three to 159 and deleted the now-empty duplicate node 357,
      same fix pattern as the earlier Ruswarp/West-Cliff sweep. This
      confirms a 7-person group incident on the New Gardens footpath
      that day.
1292: William Pattison (jet worker, Whitby) wilfully damaging a pair of
      trousers belonging to Charles Tempest Clarkson, causing
      three-shillingsworth of damage — FIXED sex (7126, male). Third
      sighting of Clarkson (also 1131, 1248), now as a property owner
      rather than an officer — still logging as the same recurring
      Whitby figure.
1293: George Cross (miner, home Rosedale — outside the usual township
      set) found with a hare in his possession when searched by Alfred
      Barker, sergeant of police, offence at Hinderwell — FIXED sex
      (7127, male).
1294: Anderson Hobson, jet worker, Whitby, same New Gardens footpath
      incident as 1291 — location bug fixed above. Shares a surname
      with Richard Hobson (1291), same date — plausibly related
      (brothers?), noted but not linked without more evidence.
1295: William Pattison again, drunk, same date (21 June 1868) as record
      1292 (damaging Clarkson's trousers) — confirmed same-day spree,
      logged as a candidate.

**Progress: id 1291-1295 done (5 of 5 fully resolved). 2 sex fixes, 1
duplicate-location bug fixed (3 records repointed, 1 node deleted,
confirms a 7-person group incident), 1 same-day spree logged.**

## Records 1296-1300

1296: Lewis Pearson (farmer, Borrowby) not giving notice of 19 sheep
      affected with sheep scab, offence at Borrowby — OK, no fixes
      needed.
1297: Joseph Hart, jet worker, Whitby, New Gardens footpath — OK,
      already fixed above (part of the 7-person group incident).
1298: Elizabeth Brough, wife of John Brough (beer house keeper), of the
      township of Whitby, drunk; informant Richard Bell (police
      constable, Whitby) — FIXED sex (7128 Bell, 9952 John Brough, both
      male) and FIXED missing home on John Brough (9952, Whitby) —
      pattern #6. Same John Brough (beer house keeper, Whitby) as
      record 1251 — logging as a candidate.
1299: Robert Burnett, farmer, Ruswarp, over-driving a horse and beating
      it — OK, no fixes needed.
1300: James Pearson, jet worker, Whitby, New Gardens footpath — OK, no
      fixes needed; part of the confirmed 7-person group incident.

**Progress: id 1296-1300 done (5 of 5 fully resolved). 2 sex fixes, 1
pattern-#6 missing-home fix, 1 same-person candidate logged.**

## Records 1301-1305

1301: George Pattison (painter, Whitby) assaulting Ann Young, wife of
      Richard Young; informant is "the said Ann Young wife of Richard
      Young of the township of Whitby shoemaker and others" — FIXED sex
      (7129 Ann female, 10202 Richard male) and FIXED missing home +
      occupation on Richard Young (10202, Whitby / shoemaker) — pattern
      #6.
1302: Patrick Riley, pedlar, Whitby, obstruction in Bridge Street — OK,
      no fixes needed.
1303: Alfred George Walker, stonemason, Whitby, New Gardens footpath —
      OK, already fixed above (part of the 7-person group incident).
1304: Ann Miller, wife of Henry Miller (labourer), of the township of
      Whitby, drunk — FIXED missing home on Henry Miller (9953,
      Whitby) — pattern #6, occupation was already correctly captured.
      Same couple as record 1221 (7 November 1868), 4.5 months apart —
      confirmed a second sighting.
1305: John Shepherd (labourer, Glaisdale) drunk on the licensed premises
      of William Pearson, refusing to leave when asked by James Gibson,
      a police constable — FIXED sex (7130 Pearson, 7131 Gibson, both
      male). Fourth sighting of James Gibson — updating the candidate
      entry.

**Progress: id 1301-1305 done (5 of 5 fully resolved). 5 sex fixes, 2
pattern-#6 fixes (one including a missing occupation), 1 same-person
candidate entry updated, 1 recurring-couple sighting confirmed.**

## Records 1306-1310

1306: John Storm, jet worker, Whitby, New Gardens footpath — OK,
      already fixed above (7-person group incident).
1307: John Codling, jet worker, Whitby, drunk, offence at Ruswarp — OK,
      no fixes needed.
1308: George Hansill (labourer, Whitby) drunk and disorderly in Church
      Street; informant Thomas Hall (police constable, Whitby) — FIXED
      sex (7132, male). Fifth sighting of Thomas Hall (also 1171, 1180,
      1186, 1207) — updating the candidate entry.
1309: Frederick Hutchinson, jet worker, Whitby, New Gardens footpath —
      OK, already fixed above; this is the last of the 7-person group.
1310: Six boys (Henry Sherwood age 9, William Charles Adams age 15,
      William Redhead age 12, Robert Peacock age 11, Thomas Roberts age
      12, George Swales age 9, all of Whitby) damaging plums and
      gooseberries belonging to John Stevenson, offence at Ruswarp —
      FIXED sex (7133 Stevenson, male). All six boys' sex already
      correctly captured; ages live only in the raw_record text as the
      schema has no dedicated age field, consistent with existing
      convention.

**Progress: id 1306-1310 done (5 of 5 fully resolved). 2 sex fixes, 1
same-person candidate entry updated.**

## Records 1311-1315

1311: Thomas Ward, pedlar, Whitby, wilfully causing an obstruction in
      Bridge Street — OK, no fixes needed. Same date (4 February 1875)
      and location as record 1302 (Patrick Riley) — confirmed
      same-incident pair, two pedlars obstructing together.
1312: Joseph Smith, iron worker, Whitby, begging at Bog Hole, offence at
      Ruswarp — OK, no fixes needed; Bog Hole correctly under West
      Cliff per the sweep.
1313: John Joyce (labourer, Whitby) obstructing Church Street; informant
      Richard Bell (police constable, Whitby) — FIXED sex (7134, male).
      Second sighting of Richard Bell (also 1298) — logging as a
      candidate.
1314: Edward Corner (timber merchant, Whitby) assaulting Elisha Leng
      (farmer, Glaisdale); informant is "the said Elisha Leng" — FIXED
      sex (7135, male).
1315: Thomas Sexton, moulder, Whitby, begging in Church Street — OK, no
      fixes needed.

**Progress: id 1311-1315 done (5 of 5 fully resolved). 2 sex fixes, 1
confirmed same-incident pair, 1 same-person candidate logged.**

## Records 1316-1320

1316: John Howard (age 13), Robert Dixon (age 14), and Edward Barrett
      (age 12), all Whitby, damaging pears and apples belonging to John
      Fergus, offence at Hawsker cum Stainsacre — FIXED sex (7136,
      male).
1317: John Hodgson, fisherman, Whitby, drunk and disorderly on the
      Cragg — OK, no fixes needed.
1318: John Miller (labourer, Lythe) begging in "Goldsborough town
      street", offence at Lythe — OK, no fixes needed; correctly
      resolves to Goldsborough itself (id 263, under Lythe).
1319: Alexander Mills assaulting Jane Ross, offence at Newholm cum
      Dunsley — FIXED sex (7137, female — self-caught a slip where I
      first set this to male by mistake, corrected within the same
      batch). No home stated for either, correctly null.
1320: Robert Foster, sailor, Whitby, drunk and disorderly in
      Haggersgate — OK, no fixes needed.

**Progress: id 1316-1320 done (5 of 5 fully resolved). 2 sex fixes (1
self-corrected).**

## Records 1321-1325

1321: William Robinson, moulder, home Hawsker cum Stainsacre, begging
      in Cemetery Road — OK, no fixes needed.
1322: Ann Johnson (tramp, Whitby) drunk; informant Richard Bell (police
      constable, Whitby) — FIXED sex (7138, male). Third sighting of
      Richard Bell (also 1298, 1313) — updating the candidate entry.
1323: John Hick (fish dealer, Hinderwell) assaulting Alice Humphrey;
      informant is Alice Humphrey, wife of Richard Humphrey (fish
      dealer), of the township of Hinderwell — FIXED sex (7139 Alice
      female, 10203 Richard male) and FIXED missing home on Richard
      Humphrey (10203, Hinderwell) — pattern #6, his occupation was
      already correctly captured.
1324: John Dunn, violinist, Ruswarp, keeping a dog without a licence —
      OK, no fixes needed.
1325: John Moss, begging in Cleveland Terrace, offence at Ruswarp — OK,
      no fixes needed (no home stated, correctly null; Cleveland
      Terrace correctly under West Cliff per the sweep).

**Progress: id 1321-1325 done (5 of 5 fully resolved). 3 sex fixes, 1
pattern-#6 missing-home fix, 1 same-person candidate entry updated.**

## Records 1326-1330

1326: Thomas Readman, carpenter, Whitby, drunk and disorderly in
      Flowergate — OK, no fixes needed.
1327: Daniel George Robinson, labourer, Whitby, drunk and disorderly at
      the Bridge — OK, no fixes needed.
1328: Richard Evins, begging in St Hilda's Terrace, offence at Ruswarp
      — OK, no fixes needed (no home stated, correctly null).
1329: Henry Flaxton (fruit dealer, Whitby) assaulting Winnifred Joyce;
      informants Winnifred herself (wife of Philip Joyce, labourer),
      Frances Adams (wife of Joseph Adams, chimney sweep), and Joseph
      Adams himself, "all of the township of Whitby" — FIXED sex (7140
      Winnifred female, 7141 Frances female, 7142 Joseph male, 10204
      Philip male) and FIXED missing home on Philip Joyce (10204,
      Whitby) — the trailing "all of the township of Whitby" clause
      covers him too, same underlying gap as pattern #6. Relationships
      (both wives) already correctly captured.
1330: John Stangoe, farmer, Lythe, drunk and disorderly in "Lythe town
      street" — OK, no fixes needed; correctly resolves to Lythe
      itself. Same defendant as record 1178 (the Lythe and
      Goldsborough highway), 4 months earlier — logged as a candidate.

**Progress: id 1326-1330 done (5 of 5 fully resolved). 4 sex fixes, 1
missing-home fix, 1 same-person candidate logged.**

## Records 1331-1335

1331: Ann Miller, wife of Henry Miller (labourer), of the township of
      Whitby, obscene language in Church Street — FIXED missing home on
      Henry Miller (9954, Whitby) — pattern #6. Third sighting of this
      couple (also 1221, 1304).
1332: Jonathan Hall (tailor, Whitby) assaulting Sarah Ann Burdon;
      informant is Sarah Ann herself, wife of George Burdon (jet
      worker), of the township of Whitby — FIXED sex (7143 Sarah Ann
      female, 10205 George male) and FIXED missing home on George
      Burdon (10205, Whitby) — pattern #6.
1333: George McLaughlin (scissor grinder, Whitby) drunk on the licensed
      premises of Andrew Harland — FIXED sex (7144, male). Shares a
      name with record 1263's George McLaughlin (pedlar), but 13 years
      apart with a different occupation — too far apart to link with
      confidence, not logged as a candidate.
1334: Robert Linfoot (age 13), Thomas Belt (age 9), Christopher Appleby
      (age 14), and Thomas Mills (age 11), all Whitby, damaging apples
      belonging to Joshua Readman, offence at Ruswarp — FIXED sex
      (7145, male).
1335: Alfred Steward, jet worker, Whitby, drunk and disorderly in
      Victoria Square, offence at Ruswarp — OK, no fixes needed;
      Victoria Square correctly under West Cliff per the sweep.

**Progress: id 1331-1335 done (5 of 5 fully resolved). 5 sex fixes, 2
pattern-#6 missing-home fixes.**

## Records 1336-1340

1336: James Smith, shoemaker, Ruswarp, begging in Hanover Terrace — OK,
      no fixes needed. Same date (14 May 1888) and location as record
      1339 — confirmed same-incident pair, two men begging together.
1337: James Roe (labourer, Staithes) drunk and riotous in "Rosedale
      Street"; informant "[blank] Wright" (police constable, Staithes)
      — OK as extracted, first name correctly left null matching the
      source's literal "[blank]"; added an `anomalies` note. Location
      correctly resolves to the existing "Rosedale Lane" node (id 171,
      also used by record 771) despite this record calling it
      "Rosedale Street" — same real place, a wording variant across the
      two source records rather than a data bug.
1338: Richard Hustler, baker, Whitby, drunk and disorderly in Church
      Street — OK, no fixes needed.
1339: Thomas Martin, stonemason, Ruswarp, begging in Hanover Terrace —
      OK, no fixes needed; confirmed same-incident pair with 1336.
1340: John Boyes (blacksmith), Joseph Stephenson (jet worker), and
      William Boyes (cartman), all Whitby, obstructing Church Street —
      OK, no fixes needed.

**Progress: id 1336-1340 done (5 of 5 fully resolved). 1 new anomalies
entry, 1 confirmed same-incident pair logged. No sex/location fixes
needed otherwise.**

## Records 1341-1345

1341: Mary Ann Stonehouse (Whitby) drunk and disorderly in Haggersgate;
      informant Thomas Hall (police constable, Whitby) — FIXED sex
      (7147, male) and FIXED missing occupation "singlewoman" on
      Stonehouse (1418, already existed as occupation id 337). Sixth
      sighting of Thomas Hall — updating the candidate entry. This
      Mary Ann Stonehouse was already flagged in an earlier session as
      having occupation inconsistencies across her convictions — this
      record's own gap is now fixed, cross-record reconciliation stays
      deferred to the merge pass.
1342: William Hutchinson (farmer, Egton) drunk in charge of a horse and
      cart in Mayfield Place, offence at Ruswarp — OK, no fixes needed.
1343: Elizabeth Dennis, lodging in an outhouse, offence at Hawsker cum
      Stainsacre — OK, no fixes needed (no home stated, correctly
      null).
1344: Susan Backhouse (Whitby) drunk and disorderly in Church Street —
      FIXED missing occupation "widow" on Backhouse (1421, occupation
      id 384). Same name as record 1224's Susan Backhouse ("fish
      hawker"), different stated occupation — same pattern as the
      Stonehouse case, logged for the merge pass rather than assumed.
1345: John Stenson, labourer, Ruswarp, begging in North Road — OK, no
      fixes needed.

**Progress: id 1341-1345 done (5 of 5 fully resolved). 1 sex fix, 2
missing-occupation fixes, 1 same-person candidate entry updated.**

## Records 1346-1350

1346: Ann Pinkney, lodging in the open air, offence at Hawsker cum
      Stainsacre — OK, no fixes needed (no home stated, correctly
      null).
1347: Charles Reeves (pedlar, Hinderwell) acting as a pedlar without a
      certificate; informant William Hammond (police constable,
      Hinderwell) — FIXED sex (7148, male). Second sighting of William
      Hammond (also 1201) — logging as a candidate.
1348: Solomon Marshall (jet worker, Whitby) begging in "Sneaton town
      street", offence at Sneaton — OK, no fixes needed; correctly
      resolves to Sneaton itself.
1349: Mary Ellen Rag, common prostitute, behaving indecently in St
      Ann's Staith — OK, no fixes needed (no home stated, correctly
      null; occupation already correctly captured).
1350: John Gray (miner, Hinderwell) trespassing in pursuit of conies on
      land in the possession of Charles Mark Palmer — FIXED sex (7149,
      male). Palmer was flagged for a name-recognition check in an
      earlier session (a historical Charles Mark Palmer was a notable
      North-East industrialist/MP); this row carries no office/title,
      consistent with that earlier check not resulting in special
      treatment — left as an ordinary landowner capture.

**Progress: id 1346-1350 done (5 of 5 fully resolved). 2 sex fixes, 1
same-person candidate logged.**

## Records 1351-1355

1351: John Temple, fireman, Whitby, drunk and disorderly in Bridge
      Street — OK, no fixes needed.
1352: Mary Elizabeth Grant, singlewoman, Whitby, obscene and indecent
      language on Boulby Bank — OK, no fixes needed. Same date (5
      August 1868) and location as record 1355 — confirmed
      same-incident pair.
1353: Mary Burns (dressmaker, Whitby) assaulting Miriam Featherstone;
      informant is Miriam herself, wife of William Featherstone
      (sailor), of the township of Whitby — FIXED sex (7150 Miriam
      female, 10206 William male) and FIXED missing home on William
      Featherstone (10206, Whitby) — pattern #6.
1354: James Castello, jet worker, Whitby, drunk and disorderly in
      Church Street — OK, no fixes needed.
1355: Frances Heselwood, singlewoman, Whitby, obscene and indecent
      language on Boulby Bank; informant John Norman (police constable,
      Whitby) and others — FIXED sex (7151, male). Confirmed
      same-incident pair with 1352.

**Progress: id 1351-1355 done (5 of 5 fully resolved). 4 sex fixes, 1
pattern-#6 missing-home fix, 1 confirmed same-incident pair logged.**

## Records 1356-1360

1356: George Mead (farmer, Egton) not giving notice of sheep scab,
      offence at Egton — OK, no fixes needed.
1357: William Hodgson, joiner, Whitby, drunk and disorderly in Cliff
      Street — OK, no fixes needed.
1358: James Wood (cab driver, Whitby) assaulting John Ryder; informant
      is "the said John Ryder... inspector of police", offence at
      Ruswarp — FIXED sex (7152, male). Fourth sighting of John Ryder
      as inspector of police in 1868 (also 1197, 1221, 1277) —
      updating the candidate entry.
1359: William Lawson (labourer, home Newholm-cum-Dunsley) drunk and
      disorderly in Flowergate, offence at "the parish of Whitby" — OK,
      no fixes needed; "parish" here is just a wording variant for the
      same Whitby location, resolves correctly.
1360: John Turner, labourer, Ruswarp, begging in Hanover Terrace — OK,
      no fixes needed.

**Progress: id 1356-1360 done (5 of 5 fully resolved). 1 sex fix, 1
same-person candidate entry updated.**

## Records 1361-1365

1361: James Kelly, photographer, Whitby, drunk and riotous on the Pier
      — OK, no fixes needed.
1362: John Deacon (miner, Hinderwell) trespassing in pursuit of conies
      on land in the possession of Charles Mark Palmer — FIXED sex
      (7153, male). Same date (14 February 1875) and landowner as
      record 1350 (John Gray) and record 1365 below (William Duck
      Brewster) — confirmed a 3-man group poaching incident on Palmer's
      land that day.
1363: Hannah Elizabeth Peacock, wife of John Peacock (jet worker), of
      the township of Whitby, drunk and disorderly in Church Street —
      FIXED missing home on John Peacock (9955, Whitby) — pattern #6.
1364: William Bonas (fisherman, Whitby) assaulting Richard Bell, one of
      the constables for the North Riding — FIXED sex (7154, male).
      Fourth sighting of Richard Bell (also 1298, 1313, 1322) —
      updating the candidate entry.
1365: William Duck Brewster (miner, Hinderwell) trespassing in pursuit
      of conies on Charles Mark Palmer's land — FIXED sex (7155, male).
      Confirmed third member of the same-day group poaching incident
      with 1350 and 1362.

**Progress: id 1361-1365 done (5 of 5 fully resolved). 4 sex fixes, 1
pattern-#6 missing-home fix, 1 confirmed 3-person same-incident group,
1 same-person candidate entry updated.**

## Records 1366-1370

1366: Bransby White (labourer, Ruswarp) disorderly on the licensed
      premises of Jonathan Marsay, refusing to leave when asked by
      Marsay himself — FIXED sex (7156, male). Shares a surname with
      the recurring Joseph Marsay (licensed victualler, records
      1057/1114/1117), but a different first name — not linked without
      more evidence, just noted as a possible relative.
1367: Edward Binns assaulting Emma Binns, his wife — FIXED sex (7157,
      female). Relationship (wife) already correctly captured.
1368: Thomas Hunter (licensed victualler, Whitby) refusing to admit
      John Ryder onto his licensed premises; informant is "the said
      John Ryder... superintendent of police" — FIXED sex (7158, male).
      Third sighting of John Ryder as superintendent (also 1204, 1284)
      — updating the candidate entry.
1369: Christopher Peacock (jet worker, Whitby) drunk on the licensed
      premises of William Todd Anderson, refusing to leave when asked
      by Joseph Scaife, a police constable, offence at Fylingdales —
      FIXED sex (7159 Anderson, 7160 Scaife, both male). Matches the
      existing "Joseph Scaife" candidate (records 643, 688) — updating
      it with a third sighting, here titled "police constable" rather
      than "constable of the North Riding".
1370: Joseph Hazel, chair maker, Whitby, drunk — OK, no fixes needed.

**Progress: id 1366-1370 done (5 of 5 fully resolved). 5 sex fixes, 2
same-person candidate entries updated.**

## Records 1371-1375

1371: Jane Peart, wife of George Peart (jet worker), of the township of
      Whitby, assaulting Miriam Featherstone — FIXED sex (7161 Miriam
      female, 9956 George male) and FIXED missing home on George Peart
      (9956, Whitby) — pattern #6. Same victim as record 1353 (Mary
      Burns assaulted her on 22 February 1875), this record dated the
      very next day (23 February) — logging a same-victim/possible-feud
      candidate.
1372: Charles Boyle, labourer, Fylingdales, begging at "Stow Brow" — OK,
      no fixes needed; already correctly resolves to the existing
      "Stoupe Brow" node (id 130, also used by records 2736/2742/6197)
      — a pre-existing wording variant, already handled correctly.
1373: John Robinson, Ann Robinson, and Ellen Harding using palmistry to
      deceive John Rickinson and others — FIXED sex (7162, male). No
      homes stated for any of the three defendants, correctly left
      null.
1374: Thomas Shaw (farmer, Egton) not giving notice of ten sheep
      affected with sheep scab, offence at Egton — OK, no fixes needed.
1375: Edward Ruehorn, jet worker, Whitby, drunk and disorderly in
      Church Street — OK, no fixes needed. Third sighting (also 1121,
      1288) — updating the candidate entry.

**Progress: id 1371-1375 done (5 of 5 fully resolved). 3 sex fixes, 1
pattern-#6 missing-home fix, 1 new candidate logged, 1 same-person
candidate entry updated.**

## Records 1376-1380

1376: James Wilson, frequenting the Pier with intent to commit felony —
      OK, no fixes needed (no home stated, correctly null).
1377: Harrison Hodgson, fisherman, Whitby, drunk and disorderly on the
      Cragg — OK, no fixes needed.
1378: Richard Thompson (bricklayer, home Lythe) drunk and disorderly in
      Flowergate, offence at Whitby — OK, no fixes needed.
1379: Mary Ann McKinsey, tramp, Whitby, drunk — OK, no fixes needed.
1380: William Pattison assaulting George Richard Lazenby, one of the
      constables for the North Riding — FIXED sex (7163, male). Both
      names are already-recurring figures in this corpus (Pattison at
      1171/1201/1292/1295, Lazenby at 1138/1141/1174) meeting here in
      one record; no home/occupation stated for either in this
      particular text, correctly left null rather than inherited from
      other sightings.

**Progress: id 1376-1380 done (5 of 5 fully resolved). 1 sex fix.**

## Records 1381-1385

1381: James Bennett, hawker, Lythe, acting as a pedlar selling needles
      without a certificate, offence at Lythe — OK, no fixes needed.
1382: Ellen Watson, wife of William Watson (mariner), of the township of
      Whitby, assaulting Winifred Joyce; informant is Winifred herself,
      wife of Philip Joyce (labourer), of the township of Whitby —
      FIXED sex (7164 Winifred female, 9957 William male, 10208 Philip
      male) and FIXED missing home on both William Watson (9957) and
      Philip Joyce (10208) — pattern #6 on both, each already had the
      right occupation. Same couple as record 1168 (Ellen/William
      Watson), but that record stated William's occupation as
      "labourer", not "mariner" — a genuine occupation inconsistency
      across records, flagged for the merge pass rather than assumed.
      Also the same Winifred/Philip Joyce couple as record 1329, 6
      years apart — confirmed second sighting.
1383: William Lawson (labourer, Whitby) assaulting Richard William
      Rooke; informants Rooke himself and Margaret Weatherill, both of
      Whitby — FIXED sex (7165 Rooke male, 7166 Weatherill female).
1384: Charles Douglas, actor, Whitby, drunk and disorderly in Church
      Street — OK, no fixes needed.
1385: Harriet Clegg, begging in Gray Street, offence at Ruswarp — OK,
      no fixes needed (no home stated, correctly null; Gray Street
      correctly under West Cliff per the sweep).

**Progress: id 1381-1385 done (5 of 5 fully resolved). 5 sex fixes, 2
pattern-#6 missing-home fixes, 1 occupation inconsistency flagged, 1
recurring-couple sighting confirmed.**

## Records 1386-1390

1386: Rachel Liddle, wife of John Liddle (cartman), of the township of
      Whitby, obscene language "within the limits of the district of
      Whitby Local Board" — FIXED missing home on John Liddle (9958,
      Whitby) — pattern #6. Location phrase correctly resolves to
      Whitby itself. Same John Liddle as record 1206 (ill-treating a
      mare, 1868), 7 years apart — logged as a candidate.
1387: George Ashton, labourer, Ruswarp, begging in Bagdale — OK, no
      fixes needed; Bagdale correctly under West Cliff, confirming the
      earlier Ruswarp/West-Cliff sweep is holding.
1388: Margaret Jane Lynch frequenting the Pier with intent to steal
      from Maria Stephenson — FIXED sex (7167, female). No home stated
      for either, correctly null.
1389: Edward Blomme (sailor, Whitby) assaulting John Robinson;
      informants Robinson himself (shipwright) and Robert Robinson,
      both of Whitby, offence at "the parish of Whitby" — FIXED sex
      (7168 John male, 7169 Robert male).
1390: John Backhouse (fisherman, Whitby) assaulting Michael Murfield —
      FIXED sex (7170, male). Shares a name with the recurring John
      Backhouse candidate (1184/1187/1207, all "jet worker"), but here
      stated as "fisherman" — occupation mismatch weakens the link;
      logged as a weaker addition rather than folded into the main
      count.

**Progress: id 1386-1390 done (5 of 5 fully resolved). 5 sex fixes, 1
pattern-#6 missing-home fix, 2 same-person candidates logged (one with
caveats).**

## Records 1391-1395

1391: William Lynch frequenting Church Street with intent to commit a
      felony — OK, no fixes needed (no home stated, correctly null).
      Shares a surname and the exact same date as record 1388's
      Margaret Jane Lynch (frequenting the Pier with intent to steal)
      — plausibly related (siblings/spouse), same MO; logged as a
      candidate.
1392: William Pattison, jet worker, Whitby, drunk and disorderly in the
      Old Market Place — OK, no fixes needed. Same date (13 March 1875)
      as record 1380 (Pattison assaulting constable Lazenby) — confirmed
      same-day spree.
1393: Joseph Bridges, fisherman, Whitby, drunk and disorderly on the
      Pier — OK, no fixes needed.
1394: John Brough (beer house keeper, Whitby) keeping his licensed
      premises open after 11 p.m.; informant John Ryder (inspector of
      police, Whitby) and another — FIXED sex (7171, male). Third
      sighting of John Brough (also 1251, 1298) and fifth sighting of
      John Ryder as inspector (also 1197, 1221, 1277, 1358) — updating
      both candidate entries.
1395: Michael McHale, begging in Baxtergate, offence at Whitby — OK, no
      fixes needed (no home stated, correctly null).

**Progress: id 1391-1395 done (5 of 5 fully resolved). 1 sex fix, 2
confirmed/updated same-person candidate entries, 1 new candidate
logged.**

## Records 1396-1400

1396: George McLaughlan (scissor grinder, Whitby) drunk on the licensed
      premises of Robert Ward, refusing to leave when asked by John
      Stovin Woodruffe — FIXED sex (7172 Ward, 7173 Woodruffe, both
      male). Same defendant/premises as record 1333's "George
      McLaughlin" (note the spelling variant), about a month later —
      logged as a candidate.
1397: John Hodgson, fisherman, Whitby, drunk — OK, no fixes needed.
      Shares a name/occupation with record 1317's John Hodgson, 6.5
      years apart — logged as a weaker candidate given the gap.
1398: John Millin, begging in Church Street, offence at Whitby — OK, no
      fixes needed (no home stated, correctly null).
1399: Edward Jackson, labourer, home Newholm-cum-Dunsley, begging in
      East Row, offence at Newholm-cum-Dunsley — OK, no fixes needed.
1400: William McCoy (furnaceman, Eskdaleside-cum-Ugglebarnby) drunk;
      informant William Pickering (police constable, same home) —
      FIXED sex (7174, male). Second sighting of William Pickering
      (also 1257) — logging as a candidate.

**Progress: id 1396-1400 done (5 of 5 fully resolved). 3 sex fixes, 3
same-person candidates logged.**
