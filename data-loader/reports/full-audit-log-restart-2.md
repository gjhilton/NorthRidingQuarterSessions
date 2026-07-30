# Full re-extraction audit — RESTART #2 (records 1+)

Started fresh after discovering the prior restart pass's checklist was
incomplete (the `related_conviction` same-incident cross-check wasn't
being performed at all). See `audit-rulebook.md` for the full, agreed
process and checklist this pass follows. That file is the definitive
spec; this log is the per-record record of what was checked and found.

Format per record: raw_record text considered (summarized where
unchanged from prior passes), current DB state read, decision, any SQL
fix, verification. OK = checked, nothing wrong. FIXED = corrected.

## Record 1

Text: "Summary conviction of Edward Jameson Ayre of the township of
Whitby jet worker for being drunk and disorderly in Grape Lane. Offence
committed at the township of Whitby on 29 September 1888. Whitby Strand
Petty Sessional division - case heard at Whitby"

Checked: name/home/occupation/sex all match. Grape Lane nests under
East Cliff (6) -> Whitby (4), single-destination rule correctly applied
(replaces coarser township link). Court/petty sessional division match.
Crime type "drunk and disorderly" matches. No related_conviction exists
and none warranted (checked: no other record shares this defendant name
+ offence date). Single person, no person_relationship to check.

**OK — no changes.**

## Record 2

Text: "Summary conviction of William Tooley of Liverton Mines miner for
trespassing in the daytime in search of conies on a piece of land in
the possession and occupation of Sir Charles Mark Palmer. Offence
committed at the township of Roxby on 26 September 1888. Whitby Strand
Petty Sessional division - case heard at Whitby"

Tooley: home=Liverton Mines (335, child of Liverton 334) matches;
occupation=miner matches; sex=male unambiguous. Palmer: title="Sir"
already established precedent (own person row per conviction, no
cross-conviction merge). Location of offence=Roxby matches stated
township. Court=Whitby. Crime type=poaching matches "trespassing...in
search of conies". related_conviction: links to 3 and 4 already present
("Same landowner (Sir Charles Mark Palmer), same offence, same date --
likely one incident, three men prosecuted separately") -- correct, this
is the Palmer trespassing trio.

**OK — no changes.**

## Record 3

Text: "Summary conviction of Jonathan Agar of Liverton Mines miner for
trespassing in the daytime in search of conies on a piece of land in
the possession and occupation of Sir Charles Mark Palmer. Offence
committed at the township of Roxby on 26 September 1888. Whitby Strand
Petty Sessional division - case heard at Whitby"

Same companion-record pattern as 2, own Palmer person row (6484, no
cross-merge). Home/occupation/sex/location/court/crime type all match.
related_conviction link to 2 already present and correct.

**OK — no changes.**

## Record 4

Text: "Summary conviction of John Marley of Liverton Mines miner for
trespassing in the daytime in search of conies on a piece of land in
the possession and occupation of Sir Charles Mark Palmer. Offence
committed at on township of Roxby on 26 September 1888. Whitby Strand
Petty Sessional division - case heard at Whitby"

Same companion-record pattern as 2/3. Raw text has a scribal typo
("committed at on township of Roxby") -- already correctly captured in
`anomalies`: "Scribal typo in source text: 'committed at on township of
Roxby' (extra 'on')." Home/occupation/sex/location/court/crime type all
match. related_conviction link to 2 already present and correct.

**OK — no changes.**

## Record 5

Text: "Summary conviction of Robert Tinley of the township of Whitby
carpenter for being drunk and disorderly in St Ann's Staith. Offence
committed at the township of Whitby on 8 September 1888. Whitby Strand
Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=carpenter, sex=male all match. St Ann's Staith
nests under West Cliff (5) -> Whitby (4), single-destination rule
correctly applied. Court/petty sessional division match. Crime type
"drunk and disorderly" matches. No related_conviction warranted (no
other record shares this defendant + offence date).

**OK — no changes.**

## Record 6

Text: "Summary conviction of William Holmes of the township of Whitby
jet worker for being drunk and disorderly on the Whitby and Ruswarp
highway. Offence committed at the township of Hawsker cum Stainsacre on
7 October 1888. Whitby Strand Petty Sessional division - case heard at
Whitby"

Home=Whitby, occupation=jet worker, sex=male all match. Two-endpoint
"Whitby and Ruswarp highway" correctly resolves to the Cross-Parish
Highways node (106), added alongside the stated township
Hawsker-cum-Stainsacre (not replacing it). Court/petty sessional
division match. Crime type "drunk and disorderly" matches. Checked
same-date records: id 8 (Edward Watson, licensing offence) shares the
offence date but different defendant/charge/no shared named party --
correctly no related_conviction link.

**OK — no changes.**

## Record 7

Text: "Summary conviction of Robert Ross of the township of Whitby fish
packer for being drunk on the licensed premises of Thomas Wadsworth and
refusing to leave when asked by William Dobson acting sergeant of
police Offence committed at the township of Whitby on 6 October 1888.
Whitby Strand Petty Sessional division - case heard at Whitby"

Ross: home=Whitby, occupation=fish packer, sex=male match. Wadsworth
(premises owner) and Dobson (police, occupation="acting sergeant of
police") -- neither has a home stated in the text, correctly left
blank. [Corrected 2026-07-30: originally miswritten as "office" here --
verified against the DB, this was always correctly stored as
occupation; office is reserved for aristocratic/peerage pedigree only,
per the rule clarified at record 191.] Location of offence=Whitby, court=Whitby, petty sessional
division match. Crime types: drunkenness, refusal to quit licensed
premises -- both match the charge description.

**OK — no changes.**

## Record 8

Text: "Summary conviction of Edward Joseph Watson of the township of
Whitby licensed victualler for opening his premises out of licensing
hours. Offence committed at the township of Whitby on 7 October 1888.
Whitby Strand Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=licensed victualler, sex=male all match.
Location of offence=Whitby, court=Whitby, petty sessional division
match. Crime type=licensing offence matches. related_conviction: none
present, none warranted -- already cross-checked against record 6
(shares offence date 1888-10-07 but different defendant/charge/no
shared named party) when record 6 was processed.

**OK — no changes.**

---

## Record 9

Text: "Summary conviction of John Parkin of the Old Post Office Yard in
the township of Whitby for not sending his son George Parkin to school.
Offence committed in the Whitby Strand School Board district on 5
October 1888. Case heard at Whitby"

Home=Old Post Office Yard (67, specific site) matches text exactly.
Truancy rule correctly applied: location of offence=Old Post Office
Yard (the home), NOT the stated School Board district phrase.
person_relationship: George Parkin (child, 6488) -> "son" -> John
Parkin (9), correct direction, matches "his son George Parkin". Crime
type=school non-attendance matches. Petty sessional division correctly
absent from summary_conviction_location -- the text states a School
Board district here, not a Petty Sessional division phrase, unlike most
other records. No related_conviction warranted (no other record shares
this offence date).

**OK — no changes.**

---

## Record 10

Text: "Summary conviction of Robert Harker of the township of Mickleby
carrier for obstructing Lythe town street by leaving his horse and cart
there for one hour and twenty minutes. Offence committed at the
township of Lythe on 6 October 1888. Whitby Strand Petty Sessional
division - case heard at Whitby"

Home=Mickleby, occupation=carrier, sex=male all match. "Lythe town
street" correctly resolves to Lythe itself (107), matching the stated
township, no fabricated place. Court=Whitby, petty sessional
division=whitby strand match. Crime type=obstructing the highway
matches. Checked same-date record 7 (Ross/Wadsworth/Dobson,
drunkenness) -- different defendant, different charge, no shared party,
correctly unrelated.

**OK — no changes.**

---

## Record 11

Text: "Summary conviction of Stephen George Mills of the township of
Fylingdales labourer for begging on the Whitby and Robin Hood's Bay
highway. Offence committed at the township of Fylingdales on 11 October
1888. Whitby Strand Petty Sessional division - case heard at Whitby"

Home=Fylingdales, occupation=labourer, sex=male all match. Two-endpoint
"Whitby and Robin Hood's Bay highway" correctly resolves to Cross-Parish
Highways (106), alongside stated township Fylingdales. Court/petty
sessional division match. Crime type=begging matches. related_conviction
link to 12 present: "Same offence date, road, and township, different
defendants -- likely one begging incident, two men prosecuted
separately." -- correct pattern-2 style link.

**OK — no changes.**

---

## Record 12

Text: "Summary conviction of John Quinney of the township of Fylingdales
labourer for begging on the Whitby and Robin Hood's Bay highway. Offence
committed at the township of Fylingdales on 11 October 1888 Whitby
Strand Petty Sessional division - case heard at Whitby"

Same companion-record pattern as 11. Home=Fylingdales, occupation=
labourer, sex=male match. Cross-parish highway alongside Fylingdales
matches. Court/petty sessional division match. Crime type=begging
matches. related_conviction link to 11 already confirmed present.
(Text is missing a period after "1888" before "Whitby Strand" -- a
trivial punctuation artifact, not a meaning-affecting scribal error, no
anomalies note needed.)

**OK — no changes.**

---

## Record 13

Text: "Summary conviction of John Kelley of the township of Hinderwell
labourer for begging at Staithes Lane End. Offence committed at the
township of Hinderwell on 11 October 1888. Whitby Strand Petty
Sessional division - case heard at Whitby"

Home=Hinderwell, occupation=labourer, sex=male match. Staithes Lane End
(378) -> Staithes (163) -> Hinderwell (88), reaching the stated
township -- single-destination rule correctly applied, replacing the
coarser link. Court/petty sessional division match. Crime type=begging
matches. No related_conviction present or warranted.

**OK — no changes.**

---

## Record 14

Text: "Summary conviction of William Herbert of the township of Whitby
butcher for being drunk and disorderly in Baxtergate. Offence committed
at the township of Whitby on 13 October 1888. Whitby Strand Petty
Sessional division - case heard at Whitby"

Home=Whitby, occupation=butcher, sex=male match. Baxtergate (22) ->
West Cliff (5) -> Whitby (4), reaching stated township, single-
destination rule correctly applied. Court/petty sessional division
match. Crime type=drunk and disorderly matches. Checked same-date
record 15 (James Bonas, drunk and disorderly in Church Street) --
different street, different defendant, no shared party -- correctly
treated as a separate incident, not linked.

**OK — no changes.**

---

## Record 15

Text: "Summary conviction of James Bonas of the township of Whitby
bricklayer for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 13 October 1888 Whitby Strand
Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=bricklayer, sex=male match. Church Street (26)
-> East Cliff (6) -> Whitby (4), reaching stated township. Court/petty
sessional division match. Crime type=drunk and disorderly matches.
Already cross-checked against record 14 when it was processed --
correctly unrelated (different street/defendant, no shared party).

**OK — no changes.**

---

## Record 16

Text: "Summary conviction of George Smith of the township of Mickleby
labourer for begging in Mickleby town street. Offence committed at the
township of Mickleby on 15 October 1888. Whitby Strand Petty Sessional
division - case heard at Whitby"

Home=Mickleby, occupation=labourer, sex=male match. "Mickleby town
street" correctly resolves to Mickleby itself (175), no fabricated
place -- Mickleby's parent is Lythe (107) in the tree, consistent with
Mickleby's real historical status as a township within Lythe parish,
not an error. Court/petty sessional division match. Crime type=begging
matches. No same-date records exist, no related_conviction warranted.

**OK — no changes.**

---

## Record 17

Text: "Summary conviction of Robert Harker of the township of Mickleby
carrier for being drunk in charge of a horse and cart on the Hinderwell
and Ellerby highway. Offence committed at the township of Hinderwell on
19 October 1888. Whitby Strand Petty Sessional division - case heard at
Whitby"

Home=Mickleby, occupation=carrier, sex=male match -- same real-world
name/occupation/home as record 10's Robert Harker but a genuinely
separate conviction, correctly NOT merged (own person row, id 17,
per the no-cross-conviction-merge design). Two-endpoint "Hinderwell and
Ellerby highway" correctly resolves to Cross-Parish Highways (106)
alongside stated township Hinderwell. Court/petty sessional division
match. Crime type=drunkenness matches. Checked same-date record 19
(Isaac Duell, bullocks/heifer straying on same highway) -- different
defendant, completely different fact pattern, no shared party --
correctly treated as unrelated, not one incident.

**OK — no changes.**

---

## Record 18

Text: "Summary conviction of Joseph Henry Tyerman of the township of
Hinderwell farmer for being the owner of five bullocks found straying
on the Hinderwell and Ellerby highway. Offence committed at the
township of Ellerby on 18 October 1888. Whitby Strand Petty Sessional
division - case heard at Whitby"

Home=Hinderwell, occupation=farmer, sex=male match. Location of
offence=Ellerby (stated township) plus Hinderwell & Ellerby Highway
(cross-parish, 106) alongside -- matches. Court/petty sessional
division match. Crime type=straying animals matches. No
related_conviction present -- checked against record 19 (also bullocks
straying on same highway) but offence dates differ (18th vs 19th
October), genuinely separate incidents a day apart despite similar
facts, correctly unlinked.

**OK — no changes.**

---

## Record 19

Text: "Summary conviction of Isaac Duell of the township of Ellerby
farmer for being the owner of seven bullocks and one heifer found
straying on the Hinderwell and Ellerby highway. Offence committed at
the township of Ellerby on 19 October 1888. Whitby Strand Petty
Sessional division - case heard at Whitby"

Home=Ellerby, occupation=farmer, sex=male match. Location of
offence=Ellerby (stated township) plus Hinderwell & Ellerby Highway
alongside -- matches. Court/petty sessional division match. Crime
type=straying animals matches. Already cross-checked against records 17
(different date, different facts) and 18 (different date) when those
were processed -- correctly unrelated to both, no related_conviction
warranted.

**OK — no changes.**

---

## Record 20

Text: "Summary conviction of Francis Jefferson of the township of
Whitby licensed victualler for being the owner of a mare and foal found
straying on a highway called Stakesby Vale. Offence committed at the
township of Ruswarp on 23 October 1888. Whitby Strand Petty Sessional
division - case heard at Whitby"

Home=Whitby, occupation=licensed victualler, sex=male ("Francis"
spelling, male form) match. Location of offence=Ruswarp (stated
township) plus Stakesby Vale (233, nests under West Cliff/Whitby, 5) --
initially looked like a possible mis-parenting since Stakesby Vale
doesn't descend from Ruswarp, but this is the established Whitby/
Ruswarp cliff-boundary case (see `explorer/src/content/about/
geography.md` and new memory note): the cliff-edge parish boundary
means a West-Cliff-nested site can genuinely be historically
Ruswarp-side even though the modern-map tree nests it under Whitby.
Current placement (alongside Ruswarp, not replacing) is correct per the
existing specific-site rule, not a bug. Court/petty sessional division
match. Crime type=straying animals matches. No related_conviction
warranted (no other record shares this date).

**OK — no changes.**

---

**Progress: records 1-20 done (restart #2).**

## Record 21

Text: "Summary conviction of James Greenwood of the township of Hawsker
cum Stainsacre labourer for begging in Hawsker town street. Offence
committed on 23 October 1888. Whitby Strand Petty Sessional division -
case heard at Whitby"

Home=Hawsker-cum-Stainsacre, occupation=labourer, sex=male match.
"Hawsker town street" correctly resolves to Hawsker-cum-Stainsacre
itself (87), matching the stated home township -- no separate offence-
township phrase in this text beyond "in Hawsker", consistent with a
single place being meant. Court/petty sessional division match. Crime
type=begging matches. Checked same-date record 20 (Jefferson, straying
animals) -- different defendant/charge, no shared party, correctly
unrelated.

**OK — no changes.**

---

**Progress: records 1-21 done (restart #2).**

## Record 22

Text: "Summary conviction of Joseph Storr of the township of Whitby jet
worker for being drunk and disorderly in Sandgate. Offence committed at
the township of Whitby on 27 October 1888. Whitby Strand Petty
Sessional division - case heard at Whitby"

Home=Whitby, occupation=jet worker, sex=male match. Sandgate (34) ->
East Cliff (6) -> Whitby (4), reaching stated township. Court/petty
sessional division match. Crime type=drunk and disorderly matches. No
related_conviction, no same-date records exist.

**OK — no changes.**

---

**Progress: records 1-22 done (restart #2).**

## Record 23

Text: "Summary conviction of Charles Allison of Clark's Yard in the
township of Whitby for not sending his son George Allison to school.
Offence committed in the Whitby Strand School Board district on 26
October 1888. Case heard at Whitby"

Home=Clark's Yard (44) matches. Truancy rule correctly applied:
location of offence=Clark's Yard (the home), not the School Board
district phrase. person_relationship: George Allison (child, 6489) ->
"son" -> Charles Allison (23), correct direction. Crime type=school
non-attendance matches. Petty sessional division correctly absent
(School Board district stated, not Petty Sessional division). Checked
same-date record 24 (Martha/Miles Arnold, also truancy) -- different
family, no shared party, correctly unrelated (not one shared incident).

**OK — no changes.**

---

**Progress: records 1-23 done (restart #2).**

## Record 24

Text: "Summary conviction of Martha Arnold of Renwick's Yard in the
township of Whitby for not sending her son Miles Arnold to school.
Offence committed in the Whitby Strand School Board district on 26
October 1888. Case heard at Whitby"

Home=Renwick's Yard (58) matches. Sex: Martha=female (matches "her
son"), Miles=male (unambiguous historical given name). Truancy rule
correctly applied: location of offence=Renwick's Yard (the home).
person_relationship: Miles Arnold (child, 6490) -> "son" -> Martha
Arnold (24), correct direction. Crime type=school non-attendance
matches. Already cross-checked against record 23 when it was processed
-- correctly unrelated.

**OK — no changes.**

---

**Progress: records 1-24 done (restart #2).**

## Record 25

Text: "Summary conviction of John Jones of the township of Fylingdales
labourer for begging in Normanby highway. Offence committed at the
township of Fylingdales on 9 November 1888. Whitby Strand Petty
Sessional division - case heard at Whitby"

Home=Fylingdales, occupation=labourer, sex=male match. Single-
destination "Normanby highway" (380) nests directly under Fylingdales
(126), reaching the stated township -- replaces the coarser link
correctly (only one location-of-offence row). Court/petty sessional
division match. Crime type=begging matches. Checked same-date records
26 (Edward Brown, begging in Sleights) and 27 (Edward Cargill, drunk
and disorderly) -- different defendants/locations/charges, no shared
party, correctly unrelated to both.

**OK — no changes.**

---

**Progress: records 1-25 done (restart #2).**

## Record 26

Text: "Summary conviction of Edward Brown of the township of
Eskdaleside cum Ugglebarnby labourer for begging in Sleights town
street. Offence committed at the township of Eskdaleside cum
Ugglebarnby on 9 November 1888. Whitby Strand Petty Sessional division
- case heard at Whitby"

Home=Eskdaleside-cum-Ugglebarnby, occupation=labourer, sex=male match.
"Sleights town street" (11) correctly resolves to Sleights itself,
whose parent (8) is Eskdaleside-cum-Ugglebarnby, matching the stated
township. Court/petty sessional division match. Crime type=begging
matches. Already cross-checked against record 25 -- correctly
unrelated.

**OK — no changes.**

---

**Progress: records 1-26 done (restart #2).**

## Record 27

Text: "Summary conviction of Edward Cargill of the township of Whitby
labourer for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 9 November 1888. Whitby Strand
Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=labourer, sex=male match. Church Street ->
East Cliff -> Whitby reaches stated township. Court/petty sessional
division match. Crime type=drunk and disorderly matches. Verified the
existing anomalies note directly against raw_case: title really does
say "Robert Cargill" (raw_case.id 27, reference QSB 1889 1/10/10/27)
while the record text says Edward throughout -- note is accurate,
Edward correctly stored as the fuller/more reliable text. Already
cross-checked against record 25, no related_conviction.

**OK — no changes.**

---

**Progress: records 1-27 done (restart #2).**

## Record 28

Text: "Summary conviction of Maria Castello wife of Thomas Castello of
the township of Whitby jet worker for assaulting Mary Howard. Offence
committed at the township of Whitby on 8 November 1888. Whitby Strand
Petty Sessional division - case heard at Whitby"

Maria: defendant, female, home=Whitby, no occupation of her own (jet
worker belongs to the husband per the sentence structure -- "wife of
Thomas Castello ... jet worker" modifies Thomas, not Maria). Thomas:
own person row (6492), role "husband of defendant", home=Whitby,
occupation=jet worker -- correctly NOT misattached to Maria. Mary
Howard: separate person row, role=victim. person_relationship: Maria
"wife" -> Thomas (6492), correct direction matching the established
wife-points-to-husband convention. Crime type=assault matches.
Locations all Whitby, matching text. No same-date records, no
related_conviction.

**OK — no changes.**

---

**Progress: records 1-28 done (restart #2).**

## Record 29

Text: "Summary conviction of William Blooman of the township of Ruswarp
farmer for being the owner of two horses found straying on the Whitby
and Aislaby highway. Offence committed at the township of Ruswarp on 10
November 1888. Whitby Strand Petty Sessional division - case heard at
Whitby"

Home=Ruswarp, occupation=farmer, sex=male match. Two-endpoint "Whitby
and Aislaby highway" correctly resolves to Cross-Parish Highways (106),
alongside stated township Ruswarp. Court/petty sessional division
match. Crime type=straying animals matches. Checked same-date records:
30/31 (Alfred Ford, already linked to each other via existing
related_conviction "same defendant and same offence date" entry) and 32
(William Leigh, begging) -- none share a party/charge with 29,
correctly unrelated.

**OK — no changes.**

---

**Progress: records 1-29 done (restart #2).**

## Record 30

Text: "Summary conviction of Alfred Ford of the township of Whitby
caulker for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 10 November 1888. Whitby Strand
Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=caulker, sex=male match. Church Street -> East
Cliff -> Whitby reaches stated township. Court/petty sessional division
match. Crime type=drunk and disorderly matches. related_conviction link
to 31 present and correct: "Same defendant and same offence date --
likely multiple charges from one arrest."

**OK — no changes.**

---

**Progress: records 1-30 done (restart #2).**

## Record 31

Text: "Summary conviction of Alfred Ford of the township of Whitby
caulker for assaulting John Carpenter one of the constables of the
North Riding in the execution of his duty. Offence committed at the
township of Whitby on 10 November 1888. Whitby Strand Petty Sessional
division - case heard at Whitby"

Alfred Ford: own person row (31), separate from record 30's (30) --
correct, no cross-conviction merge. Home=Whitby, occupation=caulker,
sex=male match. John Carpenter: victim, occupation="constable of the
North Riding" matches "one of the constables of the North Riding".
Location of offence=Whitby, court=Whitby, petty sessional division
match. Crime type=assaulting a police officer matches.
related_conviction link to 30 already confirmed present.

**OK — no changes.**

---

**Progress: records 1-31 done (restart #2).**

## Record 32

Text: "Summary conviction of William Leigh of the township of Ruswarp
dentist for begging in St Hilda's Terrace. Offence committed at the
township of Ruswarp on 10 November 1888. Whitby Strand Petty Sessional
division - case heard at Whitby"

Home=Ruswarp, occupation=dentist (unusual but stated as-is in the
text, captured without embellishment), sex=male match. St Hilda's
Terrace (232) nests under West Cliff/Whitby (5), not descending from
Ruswarp -- same Whitby/Ruswarp cliff-boundary shape as record 20,
correctly added alongside rather than replacing. Court/petty sessional
division match. Crime type=begging matches. Already cross-checked
against record 29, no related_conviction.

**OK — no changes.**

---

**Progress: records 1-32 done (restart #2).**

## Record 33

Text: "Summary conviction of Daniel Blake of the township of Ruswarp
labourer for begging in Hanover Terrace. Offence committed at the
township of Ruswarp on 11 November 1888. Whitby Strand Petty Sessional
division - case heard at Whitby"

Home=Ruswarp, occupation=labourer, sex=male match. Hanover Terrace (86)
nests under West Cliff (5), same cliff-boundary shape as records 20/32,
correctly added alongside Ruswarp. Court/petty sessional division
match. Crime type=begging matches. Checked same-date records 34/35
(Thomas Humphrey, Robert Cummins -- both "attempting to catch salmon in
Staithes Beck in the close season") -- no overlap with Blake, correctly
unrelated to 33. NOTE: 34 and 35 share the same charge text and date
with each other (different defendants) -- flagged to check for a
possible pattern-2 related_conviction link between them when reaching
those records.

**OK — no changes.**

---

**Progress: records 1-33 done (restart #2).**

## Record 34

Text: "Summary conviction of Thomas Humphrey of the township of
Hinderwell fish hawker for attempting to catch salmon in Staithes Beck
in the close season. Offence committed at the township of Hinderwell on
11 November 1888. Whitby Strand Petty Sessional division - case heard
at Whitby"

Home=Hinderwell, occupation=fish hawker, sex=male match. Staithes Beck
(382) -> Staithes (163) -> Hinderwell (88), reaching stated township,
single-destination rule correctly applied. Court/petty sessional
division match. Crime type=poaching matches (salmon in close season).
related_conviction link to 35 present and correct: "Same offence date,
beck, and township, different defendants -- likely one poaching
incident, two men prosecuted separately." Confirms the flag raised at
record 33.

**OK — no changes.**

---

**Progress: records 1-34 done (restart #2).**

## Record 35

Text: "Summary conviction of Robert Cummins of the township of
Hinderwell fisherman for attempting to catch salmon in Staithes Beck in
the close season. Offence committed at the township of Hinderwell on
11 November 1888. Whitby Strand Petty Sessional division - case heard
at Whitby"

Home=Hinderwell, occupation=fisherman, sex=male match. Same
Staithes Beck -> Staithes -> Hinderwell resolution as 34. Court/petty
sessional division match. Crime type=poaching matches.
related_conviction link to 34 already confirmed present.

**OK — no changes.**

---

**Progress: records 1-35 done (restart #2).**

## Record 36

Text: "Summary conviction of Jonathan Howard of the township of Newholm
cum Dunsley labourer for begging in East Row. Offence committed at the
township of Newholm cum Dunsley on 17 November 1888. Whitby Strand
Petty Sessional division - case heard at Whitby"

Home=Newholm-cum-Dunsley, occupation=labourer, sex=male match. East Row
(178) nests directly under Newholm-cum-Dunsley (7), matching stated
township. Court/petty sessional division match. Crime type=begging
matches. No same-date records, no related_conviction.

**OK — no changes.**

---

**Progress: records 1-36 done (restart #2).**

## Record 37

Text: "Summary conviction of Henry Grant of the township of Newholm cum
Dunsley herdsman for begging in East Row town street. Offence committed
at the township of Newholm cum Dunsley on 19 November 1888. Whitby
Strand Petty Sessional division - case heard at Whitby"

Home=Newholm-cum-Dunsley, occupation=herdsman, sex=male match. "East
Row town street" correctly resolves to East Row itself (178, same node
as record 36) -- confirms the "X town street" rule applies even when X
is a specific site name, not just the township name, no fabricated new
place. Court/petty sessional division match. Crime type=begging
matches. No related_conviction, no same-date records.

**OK — no changes.**

---

**Progress: records 1-37 done (restart #2).**

## Record 38

Text: "Summary conviction of John Brand of the township of Whitby
labourer for being drunk and disorderly in Wellington Road. Offence
committed at the township of Whitby on 24 November 1888. Whitby Strand
Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=labourer, sex=male match. Wellington Road (82)
-> West Cliff (5) -> Whitby (4), reaching stated township. Court/petty
sessional division match. Crime type=drunk and disorderly matches.
Checked same-date records 41/42 (Joseph Harrison, William Wren -- both
"killing one salmon in Stonegate Beck in the close season") -- no
overlap with Brand, correctly unrelated to 38. NOTE: 41/42 look like a
likely pattern-2 companion pair, to verify when reaching those records.

**OK — no changes.**

---

**Progress: records 1-38 done (restart #2).**

## Record 39

Text: "Summary conviction of James Holden of the township of Whitby
botanist for being drunk on the licensed premises of William Willison
and refusing to leave when asked by William Dobson acting sergeant of
police. Offence committed at the township of Whitby on 26 November
1888. Whitby Strand Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=botanist (unusual but stated as-is), sex=male
match. Willison: role=licensee, occupation=licensee, matches. Dobson:
own person row (6495), separate from record 7's Dobson (6487) --
correct, no cross-conviction merge. Location of offence/court=Whitby,
petty sessional division match. Crime types=drunkenness, refusal to
quit licensed premises both match. No related_conviction, no same-date
records.

**OK — no changes.**

---

**Progress: records 1-39 done (restart #2).**

## Record 40

Text: "Summary conviction of John Poole of the township of Fylingdales
labourer for begging in Raw town street. Offence committed at the
township of Fylingdales on 25 November 1888. Whitby Strand Petty
Sessional division - case heard at Whitby"

Home=Fylingdales, occupation=labourer, sex=male match. "Raw town
street" correctly resolves to Raw itself (128), nested under
Fylingdales (126), matching stated township. Court/petty sessional
division match. Crime type=begging matches. No related_conviction, no
same-date records.

**OK — no changes.**

---

**Progress: records 1-40 done (restart #2).**

## Record 41

Text: "Summary conviction of Joseph Harrison of the Tiger Inn in the
township of Easington innkeeper and farmer for killing one salmon in
Stonegate Beck in the close season. Offence committed at the township
of Glaisdale on 24 November 1888. Whitby Strand Petty Sessional
division - case heard at Whitby"

Home=Tiger Inn (385) -> Easington (272), matching stated home
township. Occupation="innkeeper and farmer" (194) -- precedent check
run: extensive existing precedent for compound "X and Y" occupation
phrases kept as one string (ale and porter dealer, butter and bacon
seller, hawker and pedlar, labourer and hawker, plumber and glazier,
etc.) -- consistent, not a gap needing to be split. Location of
offence=Stonegate Beck (383) -> Glaisdale (138), matching stated
offence township. Court/petty sessional division match. Crime
type=poaching matches. related_conviction link to 42 present and
correct: "Same offence date, beck, and township, different defendants
-- likely one poaching incident, two men prosecuted separately."
Confirms the flag raised at record 38.

**OK — no changes.**

---

**Progress: records 1-41 done (restart #2).**

## Record 42

Text: "Summary conviction of William Wren of Lealholm Hall in the
township of Glaisdale farm labourer for killing one salmon in Stonegate
Beck in the close season. Offence committed at the township of
Glaisdale on 24 November 1888 Whitby Strand Petty Sessional division -
case heard at Whitby"

Home=Lealholm Hall (386) -> Glaisdale (138), matching stated home
township. Occupation=farm labourer, sex=male match. Location of
offence=Stonegate Beck -> Glaisdale, matching. Court/petty sessional
division match. Crime type=poaching matches. related_conviction link to
41 already confirmed present.

**OK — no changes.**

---

**Progress: records 1-42 done (restart #2).**

## Record 43

Text: "Summary conviction of John Summerson of the parish of Danby
farmer for using a lantern and a gaff to catch salmon in Fryup Beck.
Offence committed at the parish of Danby on 28 November 1888. Whitby
Strand Petty Sessional division - case heard at Whitby"

Home=Danby, occupation=farmer, sex=male match. Fryup Beck (384) ->
Danby (270), matching stated parish. Court/petty sessional division
match. Crime type=poaching matches. related_conviction link to 44
present and correct: "Same defendant and same offence date -- likely
multiple charges from one arrest" (pattern 1 -- same person, second
charge same day).

**OK — no changes.**

---

**Progress: records 1-43 done (restart #2).**

## Record 44

Text: "Summary conviction of John Summerson of the parish of Danby farm
labourer for using a lantern and gaff to catch salmon in Fryup Beck.
Offence committed at the parish of Danby on 28 November 1888. Whitby
Strand Petty Sessional division - case heard at Whitby"

Home=Danby, occupation=farm labourer, sex=male match this record's own
text -- note this differs from record 43's "farmer" for the same real
person, but each companion record faithfully reflects its own
document's wording (separate person rows, no cross-merge), not a data
error. Fryup Beck -> Danby matches. Court/petty sessional division
match. Crime type=poaching matches. related_conviction link to 43
already confirmed present.

**OK — no changes.**

---

**Progress: records 1-44 done (restart #2).**

## Record 45

Text: "Summary conviction of Kate Griffin of the township of Whitby
widow for being drunk and disorderly in Church Street Offence committed
at the township of Whitby on 3 December 1888. Whitby Strand Petty
Sessional division - case heard at Whitby"

Home=Whitby, occupation=widow (established marital-status-as-occupation
convention, same precedent as singlewoman/spinster elsewhere),
sex=female match. Church Street -> East Cliff -> Whitby reaches stated
township. Court/petty sessional division match. Crime type=drunk and
disorderly matches. No related_conviction, no same-date records.

**OK — no changes.**

---

**Progress: records 1-45 done (restart #2).**

## Record 46

Text: "Summary conviction of William Lawson of the township of Aislaby
labourer for being drunk and disorderly on the Whitby and Ruswarp
footpath. Offence committed at the township of Ruswarp on 2 December
1888. Whitby Strand Petty Sessional division - case heard at Whitby"

Home=Aislaby, occupation=labourer, sex=male match. Raised and resolved
with the user: unlike two-endpoint highways (bucketed under Cross-
Parish Highways, 106), "Whitby and Ruswarp Footpath" (252) has its own
individual node under West Cliff/Whitby -- confirmed deliberate
(footpaths are treated as specific sites/streets, not roads), now
documented in the rule book. Since its parent doesn't reach Ruswarp, it
is correctly added alongside the stated township (cliff-boundary
logic), not replacing it. Court/petty sessional division match. Crime
type=drunk and disorderly matches. No related_conviction, no same-date
records.

**OK — no changes.**

---

**Progress: records 1-46 done (restart #2).**

## Record 47

Text: "Summary conviction of John Holmes of the township of Whitby jet
worker for being drunk on the licensed premises of Colin Cowan. Offence
committed at the township of Hawsker cum Stainsacre on 23 December
1888. Whitby Strand Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=jet worker, sex=male match. Cowan: role=
licensee of premises, matches. Location of offence=Hawsker-cum-
Stainsacre matches. Court/petty sessional division match. Crime
type=drunkenness matches. related_conviction link to 48 present with a
carefully-worded note: "...different defendants (John Holmes vs William
Holmes, same surname but not stated as kin) -- likely one incident, two
men prosecuted separately" -- correctly avoids assuming kinship without
textual evidence. Same-date record 51 (Kilpatrick) shares no party,
correctly unrelated.

**OK — no changes.**

---

**Progress: records 1-47 done (restart #2).**

## Record 48

Text: "Summary conviction of William Holmes of the township of Whitby
jet worker for being drunk on the licensed premises of Colin Cowan.
Offence committed at the township of Hawsker cum Stainsacre on 23
December 1888. Whitby Strand Petty Sessional division - case heard at
Whitby"

Home=Whitby, occupation=jet worker, sex=male match. Own person row
(48), separate from record 6's William Holmes (id 6, also Whitby/jet
worker/Hawsker-cum-Stainsacre offence, different date) -- correct, no
cross-conviction merge, even though plausibly the same real individual.
Cowan: own person row (6497), separate from record 47's (6496) --
correct. Location/court/petty sessional division match. Crime
type=drunkenness matches. related_conviction link to 47 already
confirmed present.

**OK — no changes.**

---

**Progress: records 1-48 done (restart #2).**

## Record 49

Text: "Summary conviction of Robert Steel of the township of Whitby
fisherman for being drunk on the licensed premises of William Massey
and refusing to leave when asked by the said William Massey. Offence
committed at the township of Whitby on 26 December 1888. Whitby Strand
Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=fisherman, sex=male match. Massey: role=
licensee, matches (same person addressed twice in the text, licensee
role captures both mentions). Location/court=Whitby, petty sessional
division match. Crime types=drunkenness, refusal to quit licensed
premises both match. No related_conviction, no same-date records --
correctly stands alone (confirmed this doesn't apply to the two crime
types within this one record, which aren't separate summary_conviction
rows).

**OK — no changes.**

---

**Progress: records 1-49 done (restart #2).**

## Record 50

Text: "Summary conviction of Francis Fewster of the township of Whitby
jet worker for being drunk on the licensed premises of Joseph Shaw and
refusing to leave when asked by the said Joseph Shaw Offence committed
at the township of Whitby on 27 December 1888. Whitby Strand Petty
Sessional division - case heard at Whitby"

Home=Whitby, occupation=jet worker, sex=male ("Francis" spelling, male
form) match. Shaw: role=licensee, matches. Location/court=Whitby, petty
sessional division match. Crime types=drunkenness, refusal to quit
licensed premises both match. No related_conviction, no same-date
records.

**OK — no changes.**

---

**Progress: records 1-50 done (restart #2).**

## Record 51

Text: "Summary conviction of Peter Kilpatrick of the township of Whitby
iron worker for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 23 December 1888. Whitby Strand
Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=iron worker, sex=male match. Church Street ->
East Cliff -> Whitby reaches stated township. Court/petty sessional
division match. Crime type=drunk and disorderly matches. Already
cross-checked against record 47 -- correctly unrelated.

**OK — no changes.**

---

**Progress: records 1-51 done (restart #2).**

## Record 52

Text: "Summary conviction of Esther Hill wife of Andrew Hill of the
township of Whitby jet worker for being drunk and disorderly in Church
Street. Offence committed at the township of Whitby on 22 December
1888. Whitby Strand Petty Sessional division - case heard at Whitby"

Esther: defendant, female, home=Whitby, no occupation of her own (jet
worker modifies husband Andrew per sentence structure). Andrew: own
person row (6500), role="husband", home=Whitby, occupation=jet worker
-- correctly not misattached to Esther. person_relationship: Esther
"wife" -> Andrew, correct direction. Church Street -> East Cliff ->
Whitby reaches stated township. Court/petty sessional division match.
Crime type=drunk and disorderly matches. Checked directly: no
same-date records exist, no related_conviction.

**OK — no changes.**

---

**Progress: records 1-52 done (restart #2).**

## Record 53

Text: "Summary conviction of James Welsh of the township of Ruswarp
pedlar for begging in St Hilda's Terrace. Offence committed at the
township of Ruswarp on 25 December 1888. Whitby Strand Petty Sessional
division - case heard at Whitby"

Home=Ruswarp, occupation=pedlar, sex=male match. St Hilda's Terrace
(232) nests under West Cliff, same cliff-boundary shape as record 32,
correctly added alongside Ruswarp. Court/petty sessional division
match. Crime type=begging matches. No related_conviction, no same-date
records.

**OK — no changes.**

---

**Progress: records 1-53 done (restart #2).**

## Record 54

Text: "Summary conviction of William Mills of Hawsker cum Stainsacre
master mariner for being drunk in Thorpe town street Offence committed
at the township of Fylingdales on 2 January 1889 Whitby Strand Petty
Sessional division - case heard at Whitby"

Home=Hawsker-cum-Stainsacre, occupation=master mariner, sex=male match.
"Thorpe town street" correctly resolves to Fylingthorpe (127) -- a
genuine hamlet within Fylingdales parish, not a fabricated place --
nested under Fylingdales (126), matching the stated offence township.
Court/petty sessional division match. Crime type=drunkenness matches
("being drunk"). No related_conviction, no same-date records.

**OK — no changes.**

---

**Progress: records 1-54 done (restart #2).**

## Record 55

Text: "Summary conviction of Robert Tinley of the township of Whitby
joiner for assaulting Hannah Tinley. Offence committed at the township
of Ruswarp on 6 January 1889 Whitby Strand Petty Sessional division -
case heard at Whitby"

Home=Whitby, occupation=joiner, sex=male match (own person row,
separate from record 5's Robert Tinley -- different occupation stated,
carpenter vs joiner, no cross-conviction merge either way). Hannah
Tinley: victim, female, no occupation stated in text, correctly left
blank. Shared surname with defendant but no relationship stated in the
text -- correctly NOT assumed kin, same principle as the Holmes pair
(47/48). Location of offence=Ruswarp (differs from home township
Whitby, as explicitly stated). Court=Whitby, petty sessional division
match. Crime type=assault matches. related_conviction link to 56
present: "Same defendant and same offence date -- likely multiple
charges from one arrest."

**OK — no changes.**

---

**Progress: records 1-55 done (restart #2).**

## Record 56

Text: "Summary conviction of Robert Tinley of the township of Whitby
joiner for assaulting John O'Conner. Offence committed at the township
of Whitby on 6 January 1889 Whitby Strand Petty Sessional division -
case heard at Whitby"

Home=Whitby, occupation=joiner, sex=male match. John O'Conner: victim,
correctly captured. Location/court=Whitby, petty sessional division
match. Crime type=assault matches. related_conviction link to 55
already confirmed present.

**OK — no changes.**

---

**Progress: records 1-56 done (restart #2).**

## Record 57

Text: "Summary conviction of John Fawcett of the township of Hinderwell
labourer for lodging in an outhouse without any visible means of
subsistence and not giving a good account of himself. Offence committed
at the township of Hinderwell on 10 January 1889 Whitby Strand Petty
Sessional division - case heard at Whitby"

Home=Hinderwell, occupation=labourer, sex=male match. Location of
offence=Hinderwell matches. Court/petty sessional division match. Crime
type=vagrancy correctly captures "lodging in an outhouse...not giving a
good account of himself" (classic vagrancy-act phrasing). No
related_conviction, no same-date records.

**OK — no changes.**

---

**Progress: records 1-57 done (restart #2).**

## Record 58

Text: "Summary conviction of George Oakley of the township of Whitby
iron worker for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 12 January 1889 Whitby Strand
Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=iron worker, sex=male match. Church Street ->
East Cliff -> Whitby reaches stated township. Court/petty sessional
division match. Crime type=drunk and disorderly matches.
related_conviction link to 59 present: "Same offence date, street, and
charge wording, different defendants -- likely several convictions from
one recorded incident."

**OK — no changes.**

---

**Progress: records 1-58 done (restart #2).**

## Record 59

Text: "Summary conviction of John Dixon of the township of Whitby jet
worker for being drunk and disorderly in Church Street Offence
committed at the township of Whitby on 12 January 1889 Whitby Strand
Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=jet worker, sex=male match. Same Church
Street/East Cliff/Whitby resolution as 58. Court/petty sessional
division match. Crime type=drunk and disorderly matches.
related_conviction link to 58 already confirmed present.

**OK — no changes.**

---

**Progress: records 1-59 done (restart #2).**

## Record 60

Text: "Summary conviction of Pearson Campion of the township of Whitby
jet worker for being drunk and disorderly in Skinner Street. Offence
committed at the township of Ruswarp on 14 January 1889 Whitby Strand
Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=jet worker, sex=male match. Skinner Street
(254) nests under West Cliff (5), same cliff-boundary shape as prior
records, correctly added alongside stated Ruswarp. Court/petty
sessional division match. Crime type=drunk and disorderly matches. No
related_conviction, no same-date records.

**OK — no changes.**

---

**Progress: records 1-60 done (restart #2).**

## Record 61

Text: "Summary conviction of Thomas Brown of the township of Whitby
labourer for begging in Church Street Offence committed at the
township of Whitby on 17 January 1889 Whitby Strand Petty Sessional
division - case heard at Whitby"

Home=Whitby, occupation=labourer, sex=male match. Church Street -> East
Cliff -> Whitby reaches stated township. Court/petty sessional division
match. Crime type=begging matches. No related_conviction, no same-date
records.

**OK — no changes.**

---

**Progress: records 1-61 done (restart #2).**

## Record 62

Text: "Summary conviction of Thomas Wilson of the township of Ruswarp
photographer for wantonly firing a gun within 50 feet of a public
cartway called Newholm Lane. Offence committed at the township of
Newholm cum Dunsley on 19 January 1889 Whitby Strand Petty Sessional
division - case heard at Whitby"

Home=Ruswarp, occupation=photographer, sex=male match. Newholm Lane
(179) nests directly under Newholm-cum-Dunsley (7), matching stated
offence township. Court/petty sessional division match. Crime
type=firearms offence matches "wantonly firing a gun". Same-date record
65 (Robert Cargell, Church Street) shares no party/charge -- correctly
unrelated.

**OK — no changes.**

---

**Progress: records 1-62 done (restart #2).**

## Record 63

Text: "Summary conviction of Richard Holmes of the township of Whitby
jet worker for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 20 January 1889. Whitby Strand
Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=jet worker, sex=male match. Church Street ->
East Cliff -> Whitby reaches stated township. Court/petty sessional
division match. Crime type=drunk and disorderly matches. Same-date
record 64 (George Wardell, drunk and disorderly in Ruswarp) -- different
location/defendant, correctly unrelated. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-63 done (restart #2).**

## Record 64

Text: "Summary conviction of George Wardell of the township of Whitby
jet worker for being drunk and disorderly in Ruswarp town street.
Offence committed at the township of Ruswarp on 20 January 1889. Whitby
Strand Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=jet worker, sex=male match. "Ruswarp town
street" correctly resolves to Ruswarp itself (94), matching stated
offence township. Court/petty sessional division match. Crime
type=drunk and disorderly matches. Already cross-checked against record
63 -- correctly unrelated.

**OK — no changes.**

---

**Progress: records 1-64 done (restart #2).**

## Record 65

Text: "Summary conviction of Robert Heaton Cargell of the township of
Whitby iron worker for being drunk and disorderly in Church Street
Offence committed at the township of Whitby on 19 January 1889. Whitby
Strand Petty Sessional division - case heard at Whitby"

Home=Whitby, middle name=Heaton correctly captured, occupation=iron
worker, sex=male match. Church Street -> East Cliff -> Whitby reaches
stated township. Court/petty sessional division match. Crime
type=drunk and disorderly matches. Already cross-checked against record
62 -- correctly unrelated.

**OK — no changes.**

---

**Progress: records 1-65 done (restart #2).**

## Record 66

Text: "Summary conviction of John Langan of the township of Ruswarp
miner for begging in Hanover Terrace Offence committed at the township
of Ruswarp on 25 January 1889. Whitby Strand Petty Sessional division -
case heard at Whitby"

Home=Ruswarp, occupation=miner, sex=male match. Hanover Terrace (86)
nests under West Cliff (5), same cliff-boundary shape as record 33,
correctly alongside Ruswarp. Court/petty sessional division match.
Crime type=begging matches. No related_conviction, no same-date
records.

**OK — no changes.**

---

**Progress: records 1-66 done (restart #2).**

## Record 67

Text: "Summary conviction of Margaret Sparks of Baxtergate in the
township of Whitby for not sending her son Harry Readman Sparks to
school Offence committed in the Whitby Strand School Board district on
18 January 1889. Case heard at Whitby"

Home=Baxtergate (22) matches. Truancy rule correctly applied: location
of offence=Baxtergate (the home), not the School Board district
phrase. Harry Readman Sparks: middle name Readman correctly captured,
role="child not sent to school". person_relationship: "son" -> Margaret,
correct direction. Crime type=school non-attendance matches. Petty
sessional division correctly absent (School Board district stated).
Checked same-date record 68 (Robert Page family, also truancy) --
different family, no shared party, correctly unrelated, no
related_conviction.

**OK — no changes.**

---

**Progress: records 1-67 done (restart #2).**

## Record 68

Text: "Summary conviction of Robert Page of Hospital Yard in the
township of Whitby for not sending his son William Robert Page to
school Offence committed in the Whitby Strand School Board district on
18 January 1889. Case heard at Whitby"

Home=Hospital Yard (53) matches. Truancy rule correctly applied:
location of offence=Hospital Yard (the home). William Robert Page:
middle name Robert correctly captured, role="child not sent to school".
person_relationship: "son" -> Robert Page, correct direction. Crime
type=school non-attendance matches. Petty sessional division correctly
absent. Already cross-checked against record 67 -- correctly unrelated.

**OK — no changes.**

---

**Progress: records 1-68 done (restart #2).**

## Record 69

Text: "Summary conviction of John McMaloy of the township of Whitby
labourer for destroying his own clothes whilst being relieved in Whitby
Union workhouse Offence committed at the township of Whitby on 3
February 1889. Whitby Strand Petty Sessional division - case heard at
Whitby"

Home=Whitby, occupation=labourer, sex=male match. Union Workhouse (81,
Green Lane) matches -- text doesn't mention Ruswarp/Stakesby, so
correctly the main node, not the Stakesby Road node (399), per the
established disambiguation rule. Court/petty sessional division match.
Crime type=workhouse offence matches. FLAGGED (not yet resolved): same-
date record 70 has identical charge wording ("destroying his own
clothes whilst being relieved in Whitby Union workhouse"), different
defendant (James Carney) -- likely pattern-2 same-incident candidate,
no related_conviction link exists yet. To confirm/fix when reaching 70.

**OK — no changes (pending same-incident check at record 70).**

---

**Progress: records 1-69 done (restart #2).**

## Record 70

Text: "Summary conviction of James Carney of the township of Whitby
labourer for destroying his own clothes whilst being relieved in Whitby
Union workhouse Offence committed at the township of Whitby on 3
February 1889. Whitby Strand Petty Sessional division - case heard at
Whitby"

Home=Whitby, occupation=labourer, sex=male match. Union Workhouse (81)
matches. Court/petty sessional division match. Crime type=workhouse
offence matches. RESOLVES the flag from record 69: despite identical
charge wording and same date, there is no shared party (no common
victim/landowner/premises owner) between 69 and 70 -- just two inmates
independently destroying their own clothes at the same institution the
same day. This is the same shape as the truancy same-date coincidences
(23/24), not a connected shared incident like the Palmer trespass or
salmon-poaching pairs. Correctly NOT linked via related_conviction.

**OK — no changes.**

---

**Progress: records 1-70 done (restart #2).**

## Record 71

Text: "Summary conviction of Thomas Paylor of the township of Whitby
butcher and milk seller for using a building on the East Cliff near the
Abbey Farm as a slaughter house without a licence Offence committed at
the township of Whitby on 16 January 1889. Whitby Strand Petty
Sessional division - case heard at Whitby"

Home=Whitby, occupation="butcher and milk seller" (matches existing
compound-occupation precedent), sex=male match. Abbey Farm (77) nests
under East Cliff (6) -> Whitby (4), matching "on the East Cliff near
the Abbey Farm" and reaching stated township. Court/petty sessional
division match. Crime type=licensing offence matches "without a
licence". No related_conviction, no same-date records.

**OK — no changes.**

---

**Progress: records 1-71 done (restart #2).**

## Record 72

Text: "Summary conviction of Robert Foster of the township of Whitby
coal porter for being drunk and disorderly in St Ann's Staith. Offence
committed at the township of Whitby on 16 February 1889. Whitby Strand
Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=coal porter, sex=male match. St Ann's Staith ->
West Cliff -> Whitby reaches stated township. Court/petty sessional
division match. Crime type=drunk and disorderly matches. Same-date
records 73 (begging) and 74 (obstruction) share no party/charge --
correctly unrelated.

**OK — no changes.**

---

**Progress: records 1-72 done (restart #2).**

## Record 73

Text: "Summary conviction of Alfred Reynolds of the township of Whitby
labourer for begging in Bridge Street Offence committed at the
township of Whitby on 16 February 1889. Whitby Strand Petty Sessional
division - case heard at Whitby"

Home=Whitby, occupation=labourer, sex=male match. Bridge Street (25) ->
Seafront (104) -> Whitby (4), reaching stated township. Court/petty
sessional division match. Crime type=begging matches. Already
cross-checked against record 72 -- correctly unrelated.

**OK — no changes.**

---

**Progress: records 1-73 done (restart #2).**

## Record 74

Text: "Summary conviction of Robert Jackson of Carlin How ale and porter
dealer for leaving a cart on Staithes town street for 30 minutes so
causing an obstruction Offence committed at the township of Hinderwell
on 16 February 1889. Whitby Strand Petty Sessional division - case
heard at Whitby"

Home=Carlin How, occupation="ale and porter dealer" (matches existing
compound-occupation precedent), sex=male match. "Staithes town street"
correctly resolves to Staithes itself (163), parent Hinderwell (88),
matching stated township. Court/petty sessional division match. Crime
type=obstructing the highway matches. Already cross-checked against
record 72 -- correctly unrelated.

**OK — no changes.**

---

**Progress: records 1-74 done (restart #2).**

## Record 75

Text: "Summary conviction of James Duell of the township of Roxby
farmer for keeping a dog without a licence Offence committed at the
township of Roxby on 18 February 1889. Whitby Strand Petty Sessional
division - case heard at Whitby"

Home=Roxby (161, parent Hinderwell 88), occupation=farmer, sex=male
match. Court/petty sessional division match. Crime type=dog licence
offence matches. Verified against a momentary recall doubt: confirmed
directly against record 2's actual stored data that Roxby is a single
consistent node (161) used the same way there -- no duplicate-location
bug, prior recollection was simply mistaken and has been corrected by
re-checking the source of truth rather than trusted from memory. No
related_conviction, no same-date records.

**OK — no changes.**

---

**Progress: records 1-75 done (restart #2).**

## Record 76

Text: "Summary conviction of James Reeves of the township of Whitby
iron worker for being drunk and disorderly in Church Street Offence
committed at the township of Whitby on 21 February 1889. Whitby Strand
Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=iron worker, sex=male match. Church Street ->
East Cliff -> Whitby reaches stated township. Court/petty sessional
division match. Crime type=drunk and disorderly matches. No
related_conviction, no same-date records.

**OK — no changes.**

---

**Progress: records 1-76 done (restart #2).**

## Record 77

Text: "Summary conviction of George Duncanson of Timber Hill in the
township of Hawsker cum Stainsacre for not sending his daughter
Elizabeth Duncanson to school Offence committed in the Whitby Strand
School Board district on 8 February 1889. Case heard at Whitby"

Home=Timber Hill (149) -> Hawsker-cum-Stainsacre (87), matches. Truancy
rule correctly applied: location of offence=Timber Hill (the home).
Elizabeth Duncanson (6505): sex=female -- this is the fix from the
prior pass, independently re-verified here as still correctly
persisted (matches the direct DB check done at the very start of this
conversation). person_relationship: "daughter" -> George, correct
direction. Crime type=school non-attendance matches. Petty sessional
division correctly absent.

**OK — no changes.**

---

**Progress: records 1-77 done (restart #2).**

## Record 78

Text: "Summary conviction of John Maddon of the township of Lythe
labourer for begging inn Sandsend town street Offence committed at the
township of Lythe on 26 February 1889. Whitby Strand Petty Sessional
division - case heard at Whitby"

Home=Lythe, occupation=labourer, sex=male match. "Sandsend town street"
correctly resolves to Sandsend (176), nested under Lythe (107),
matching stated township. Existing anomalies note ("begging inn
Sandsend", extra "n") verified accurate against the raw text.
Court/petty sessional division match. Crime type=begging matches. No
related_conviction, no same-date records.

**OK — no changes.**

---

**Progress: records 1-78 done (restart #2).**

## Record 79

Text: "Summary conviction of Ransome Corser of Timber Hill in the
township of Hawsker cum Stainsacre for not sending his daughter Mary
Ann Corser to school Offence committed in the Whitby Strand School
Board district on 19 February 1889. Case heard at Whitby"

Home=Timber Hill (149) -> Hawsker-cum-Stainsacre (87), matches. Same
Timber Hill address as record 77 (George Duncanson) but different
surname -- correctly two separate families at the same address, not
merged. Truancy rule correctly applied. Mary Ann Corser (6506): sex=
female -- fix from the prior pass, re-verified as still correctly
persisted. person_relationship: "daughter" -> Ransome, correct
direction. Crime type=school non-attendance matches. No related_
conviction, no same-date records.

**OK — no changes.**

---

**Progress: records 1-79 done (restart #2).**

## Record 80

Text: "Summary conviction of John Smith of the township of Hawsker cum
Stainsacre labourer for begging in Hawsker town street. Offence
committed at the township of Hawsker cum Stainsacre on 8 March 1889.
Whitby Strand Petty Sessional division - case heard at Whitby"

Home=Hawsker-cum-Stainsacre, occupation=labourer, sex=male match.
"Hawsker town street" correctly resolves to Hawsker-cum-Stainsacre
itself (87). Court/petty sessional division match. Crime type=begging
matches. Same-date record 82 (William Benson, Fylingdales, different
highway) shares no party -- correctly unrelated.

**OK — no changes.**

---

**Progress: records 1-80 done (restart #2).**

## Record 81

Text: "Summary conviction of Emmeline Annie Brazier of the township of
Ruswarp singlewoman for begging in Bagdale Offence committed at the
township of Ruswarp on 4 March 1889. Whitby Strand Petty Sessional
division - case heard at Whitby"

Home=Ruswarp, occupation=singlewoman (established marital-status
precedent, same family as widow/spinster), sex=female match. Bagdale
(192) nests under West Cliff (5), same cliff-boundary shape as records
20/32/53/66, correctly added alongside Ruswarp -- matches the original
spot-check from the very start of this conversation. Court/petty
sessional division match. Crime type=begging matches. No related_
conviction, no same-date records.

**OK — no changes.**

---

**Progress: records 1-81 done (restart #2).**

## Record 82

Text: "Summary conviction of William Benson of the township of
Fylingdales labourer for begging on the Whitby and Robin Hood's Bay
highway. Offence committed on 8 March 1889. Whitby Strand Petty
Sessional division - case heard at Whitby"

Home=Fylingdales, occupation=labourer, sex=male match. Cross-parish
highway alongside Fylingdales, matches this conversation's very first
check. Court/petty sessional division match. Crime type=begging
matches. Already cross-checked against record 80 -- correctly
unrelated, no related_conviction.

**OK — no changes.**

---

**Progress: records 1-82 done (restart #2).**

## Record 83

Text: "Summary conviction of William Reeves of the township of Whitby
licensed victualler for opening his premises outside licensing hours
Offence committed at the township of Whitby on 10 March 1889. Whitby
Strand Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=licensed victualler, sex=male match.
Location/court=Whitby, petty sessional division match. Crime
type=licensing offence matches. Same-date record 84 (William Smith,
Upgang Lane) shares no party -- correctly unrelated.

**OK — no changes.**

---

**Progress: records 1-83 done (restart #2).**

## Record 84

Text: "Summary conviction of William Smith of the township of Ruswarp
labourer for begging in Upgang Lane. Offence committed at the township
of Ruswarp on 10 March 1889. Whitby Strand Petty Sessional division -
case heard at Whitby"

Home=Ruswarp, occupation=labourer, sex=male match. Upgang Lane (239)
nests under West Cliff (5), same cliff-boundary shape as prior records,
correctly alongside Ruswarp -- matches this conversation's original
spot-check. Court/petty sessional division match. Crime type=begging
matches. Already cross-checked against record 83.

**OK — no changes.**

---

**Progress: records 1-84 done (restart #2).**

## Record 85

Text: "Summary conviction of William Cooper Bridge of the township of
Whitby gentleman for being drunk in Church Street. Offence committed at
the township of Whitby on 12 March 1889. Whitby Strand Petty Sessional
division - case heard at Whitby"

Home=Whitby, middle name=Cooper, occupation=gentleman, sex=male match.
Church Street -> East Cliff -> Whitby reaches stated township.
Court/petty sessional division match. Crime type=drunkenness matches.
No related_conviction, no same-date records.

**OK — no changes.**

---

**Progress: records 1-85 done (restart #2).**

## Record 86

Text: "Summary conviction of Walter Draper of Aislaby labourer for
begging in Woodlands. Offence committed at the township of Aislaby on
16 March 1889. Whitby Strand Petty Sessional division - case heard at
Whitby"

Home=Aislaby, occupation=labourer, sex=male match. Woodlands (2) nests
directly under Aislaby (1), matching stated township -- confirms this
conversation's original spot-check. Court/petty sessional division
match. Crime type=begging matches. No related_conviction, no same-date
records.

**OK — no changes.**

---

**Progress: records 1-86 done (restart #2).**

(Records 87-88 confirmed blacklisted per data/id_blacklist.txt, established
earlier in this session -- 26 total blacklisted ids across the corpus,
gap is expected, not a gap needing investigation.)

## Record 89

Text: "Summary conviction of Richard Bulmer of Whitby butcher for having
in his possession one fourteen-pound weight which was short by two
ounces and four drams, and one seven-pound weight which was short by
two ounces. Offence committed at Whitby on 14 December 1808. Whitby
Strand Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=butcher, sex=male match. Location/court=Whitby,
petty sessional division match. Crime type=false weights or measures
matches. Large same-date batch (14 Dec 1808, ~10+ records: 90-94, 110-
115 among others) -- each defendant is an independent market trader
caught with deficient weights, no shared victim/landowner/incident
connecting them, same pattern as the truancy/workhouse same-date
coincidences (one inspection sweep catching many separate people, not
one shared event). Correctly no related_conviction links among any of
them.

**OK — no changes.**

---

**Progress: records 1-89 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 90

Text: "Summary conviction of Mary Pattinson of Whitby meal seller for
having in her possession one fourteen-pound weight which was short by
12 drams. Offence committed at Whitby on 14 December 1808. Whitby
Strand Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=meal seller, sex=female match. Location/court=
Whitby, petty sessional division match. Crime type=false weights or
measures matches. Part of the 14 Dec 1808 same-date batch already
resolved at record 89 -- correctly no related_conviction.

**OK — no changes.**

---

**Progress: records 1-90 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 91

Text: "Summary conviction of Ralph Speedy of Whitby baker for having in
his possession one seven-pound weight which was short by 14 drams and
one three-pound eight-ounce weight which was short by 11 drams. Offence
committed at Whitby on 14 December 1808. Whitby Strand Petty Sessional
division - case heard at Whitby"

Home=Whitby, occupation=baker, sex=male match. Location/court=Whitby,
petty sessional division match. Crime type=false weights or measures
matches. Part of the 14 Dec 1808 same-date batch, already resolved.

**OK — no changes.**

---

**Progress: records 1-91 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 92

Text: "Summary conviction of Robert Cowlson of Whitby meal seller for
having in his possession one fourteen-pound weight which was short by
14 drams, one fourteen-pound weight which was short by eight drams and
one seven-pound weight which was short by four drams. Offence committed
at Whitby on 14 December 1808. Whitby Strand Petty Sessional division -
case heard at Whitby"

Home=Whitby, occupation=meal seller, sex=male match. Location/court=
Whitby, petty sessional division match. Crime type=false weights or
measures matches. Part of the 14 Dec 1808 same-date batch, already
resolved.

**OK — no changes.**

---

**Progress: records 1-92 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 93

Text: "Summary conviction of Edward Carving of Whitby smith for having
in his possession one seven-pound weight which was short by 13 drams.
Offence committed at Whitby on 14 December 1808. Whitby Strand Petty
Sessional division - case heard at Whitby"

Home=Whitby, occupation=smith, sex=male match. Location/court=Whitby,
petty sessional division match. Crime type=false weights or measures
matches. Part of the 14 Dec 1808 same-date batch, already resolved.

**OK — no changes.**

---

**Progress: records 1-93 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 94

Text: "Summary conviction of Robert Dickinson of Whitby grocer for
having in his possession one twenty-eight pound weight which was short
by 14 drams. Offence committed at Whitby on 14 December 1808. Whitby
Strand Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=grocer, sex=male match. Location/court=Whitby,
petty sessional division match. Crime type=false weights or measures
matches. Part of the 14 Dec 1808 same-date batch, already resolved.

**OK — no changes.**

---

**Progress: records 1-94 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 95

Text: "Summary conviction of Thomas Dale of Whitby grocer for having in
his possession one twenty-pound weight which was short by three ounces
and two drams, one fourteen-pound weight which was short by one ounce
and five drams, one fourteen-pound weight which was short by 11 drams
and a two-pound weight which was short by six drams. Offence committed
at Whitby on 21 December 1808. Whitby Strand Petty Sessional division -
case heard at Whitby"

Home=Whitby, occupation=grocer, sex=male match. Location/court=Whitby,
petty sessional division match. Crime type=false weights or measures
matches. New same-date batch (21 Dec 1808: 96 Thomas Tate, 97 George
Robinson) -- same market-inspection pattern as the 14 Dec batch,
independent traders, no shared incident, correctly no related_
conviction links.

**OK — no changes.**

---

**Progress: records 1-95 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 96

Text: "Summary conviction of Thomas Tate of Whitby butter and bacon
seller for having in his possession one fourteen-pound weight which was
short by ten drams. Offence committed at Whitby on 21 December 1808.
Whitby Strand Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=butter and bacon seller, sex=male match.
Location/court=Whitby, petty sessional division match. Crime
type=false weights or measures matches. Part of the 21 Dec 1808
same-date batch, already resolved.

**OK — no changes.**

---

**Progress: records 1-96 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 97

Text: "Summary conviction of George Robinson of Whitby meal seller for
having in his possession one fourteen-pound weight which was short by
one ounce and three drams. Offence committed at Whitby on 21 December
1808. Whitby Strand Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=meal seller, sex=male match. Location/court=
Whitby, petty sessional division match. Crime type=false weights or
measures matches. Part of the 21 Dec 1808 same-date batch, already
resolved.

**OK — no changes.**

---

**Progress: records 1-97 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 98

Text: "Summary conviction of William Prodham of the parish of Danby
butcher for having in his possession one pair of steelyards deficient
in weight. Offence committed at Whitby on 17 December 1808. Whitby
Strand Petty Sessional division - case heard at Whitby"

Home=Danby, occupation=butcher, sex=male match. Location/court=Whitby,
petty sessional division match. Crime type=false weights or measures
matches. New same-date batch (17 Dec 1808: 99-105, 120-121) -- same
market-inspection pattern, independent traders, no shared incident,
correctly no related_conviction links.

**OK — no changes.**

---

**Progress: records 1-98 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 99

Text: "Summary conviction of Thomas Wright of the parish of Pickering
butcher for having in his possession one pair of steelyards deficient
in weight. Offence committed at Whitby on 17 December 1808. Whitby
Strand Petty Sessional division - case heard at Whitby"

Home=Pickering, occupation=butcher, sex=male match. Location/court=
Whitby, petty sessional division match. Crime type=false weights or
measures matches. Part of the 17 Dec 1808 same-date batch, already
resolved.

**OK — no changes.**

---

**Progress: records 1-99 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 100

Text: "Summary conviction of Francis Laverack of Lythe butcher for
having in his possession one pair of steelyards deficient in weight.
Offence committed at Whitby on 17 December 1808. Whitby Strand Petty
Sessional division - case heard at Whitby"

Home=Lythe, occupation=butcher, sex=male ("Francis" spelling, male
form) match. Location/court=Whitby, petty sessional division match.
Crime type=false weights or measures matches. Part of the 17 Dec 1808
same-date batch, already resolved.

**OK — no changes.**

---

**Progress: records 1-100 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 101

Text: "Summary conviction of John Fenwick of the parish of Whitby
butcher for having in his possession one pair of steelyards deficient
in weight. Offence committed at Whitby on 17 December 1808. Whitby
Strand Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=butcher, sex=male match. Location/court=Whitby,
petty sessional division match. Crime type=false weights or measures
matches. Part of the 17 Dec 1808 same-date batch, already resolved.

**OK — no changes.**

---

**Progress: records 1-101 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 102

Text: "Summary conviction of John Knaggs of the parish of Whitby
butcher for having in his possession one pair of steelyards deficient
in weight. Offence committed at Whitby on 17 December 1808. Whitby
Strand Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=butcher, sex=male match. Location/court=Whitby,
petty sessional division match. Crime type=false weights or measures
matches. Part of the 17 Dec 1808 same-date batch, already resolved.

**OK — no changes.**

---

**Progress: records 1-102 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 103

Text: "Summary conviction of John Robinson of the parish of Whitby for
having in his possession one pair of steelyards deficient in weight.
Offence committed at Whitby on 17 December 1808. Whitby Strand Petty
Sessional division - case heard at Whitby"

Home=Whitby, sex=male match. No occupation stated in text -- correctly
blank in DB, not a gap. Location/court=Whitby, petty sessional division
match. Crime type=false weights or measures matches. Part of the 17 Dec
1808 same-date batch, already resolved.

**OK — no changes.**

---

**Progress: records 1-103 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 104

Text: "Summary conviction of Richard Harding butcher for having in his
possession a pair of steelyards deficient in weight. Offence committed
at Whitby on 17 December 1808. Whitby Strand Petty Sessional division -
case heard at Whitby"

No "of X" phrase at all for home -- Whitby is a context-supported
inference (local butcher, same batch as other Whitby-based traders),
consistent with the unstated-home-town rule, not a fabrication.
Occupation=butcher, sex=male match. Location/court=Whitby, petty
sessional division match. Crime type=false weights or measures matches.
Part of the 17 Dec 1808 same-date batch, already resolved.

**OK — no changes.**

---

**Progress: records 1-104 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 105

Text: "Summary conviction of James Cauwood of Whitby butcher for having
in his possession one pair of steelyards deficient in weight. Offence
committed at Whitby on 17 December 1808. Whitby Strand Petty Sessional
division - case heard at Whitby"

Home=Whitby, occupation=butcher, sex=male match. Location/court=Whitby,
petty sessional division match. Crime type=false weights or measures
matches. Part of the 17 Dec 1808 same-date batch, already resolved.

**OK — no changes.**

---

**Progress: records 1-105 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 106

Text: "Summary conviction of Thomas Marwood of Whitby butter seller for
having in his possession one seven-pound weight which was short by one
dram and eight ounces, one four-pound weight which was short by one
ounce, another four--pound weight which was short by six drams, and one
two--pound weight which was short by ten drams. Offence committed at
Whitby on the 20 December 1808. Whitby Strand Petty Sessional division -
case heard at Whitby"

Home=Whitby, occupation=butter seller, sex=male match. Location/court=
Whitby, petty sessional division match. Crime type=false weights or
measures matches. New same-date batch (20 Dec 1808: 114 Robert Robson)
-- same market-inspection pattern, no shared incident.

**OK — no changes.**

---

**Progress: records 1-106 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 107

Text: "Summary conviction of William Allon of Whitby bacon seller for
having in his possession one three-pound eight-ounce weight and one
two-pound weight both of which were short by eight drams, one one-pound
weight which was short by three drams, and one eight-ounce weight which
was short by two drams. Offence committed at Whitby on 22 December
1808. Whitby Strand Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=bacon seller, sex=male match. Location/court=
Whitby, petty sessional division match. Crime type=false weights or
measures matches. New same-date batch (22 Dec 1808: 109 John Porrit) --
same market-inspection pattern, no shared incident.

**OK — no changes.**

---

**Progress: records 1-107 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 108

Text: "Summary conviction of Elizabeth Craven of Whitby grocer for
having in her possession two one-pound weights which were both short by
three drams, one eight-ounce weight which was short by two drams,
another eight-ounce weight which was short by three drams, and a small
brass weight which was also deficient. Offence committed at Whitby on
24 December 1808. Whitby Strand Petty Sessional division - case heard at
Whitby"

Home=Whitby, occupation=grocer, sex=female ("her possession") match.
Location/court=Whitby, petty sessional division match. Crime type=false
weights or measures matches. No same-date records, no related_
conviction.

**OK — no changes.**

---

**Progress: records 1-108 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 109

Text: "Summary conviction of John Porrit of Whitby bacon seller for
having in his possession one three-pound eight-ounce weight which was
short by eight drams, one two-pound weight which was short by seven
drams, one one-pound weight which was short by five drams and one
eight-ounce weight which was short by one dram. Offence committed at
Whitby on 22 December 1808. Whitby Strand Petty Sessional division -
case heard at Whitby"

Home=Whitby, occupation=bacon seller, sex=male match. Location/court=
Whitby, petty sessional division match. Crime type=false weights or
measures matches. Already cross-checked against record 107 (22 Dec
batch) -- correctly unrelated.

**OK — no changes.**

---

**Progress: records 1-109 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 110

Text: "Summary conviction of Robert Routledge of Whitby plumber for
having in his possession one one-pound weight which was short by 11
drams and another one-pound weight which was short by ten drams.
Offence committed at Whitby on 14 December 1808. Whitby Strand Petty
Sessional division - case heard at Whitby"

Home=Whitby, occupation=plumber, sex=male match. Location/court=Whitby,
petty sessional division match. Crime type=false weights or measures
matches. Part of the 14 Dec 1808 same-date batch, already resolved.

**OK — no changes.**

---

**Progress: records 1-110 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 111

Text: "Summary conviction of John Atkinson of Whitby baker for having
in his possession one eight-ounce weight which was short by seven
drams. Offence committed at Whitby on 14 December 1808. Whitby Strand
Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=baker, sex=male match. Location/court=Whitby,
petty sessional division match. Crime type=false weights or measures
matches. Part of the 14 Dec 1808 same-date batch, already resolved.

**OK — no changes.**

---

**Progress: records 1-111 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 112

Text: "Summary conviction of George Duck of Whitby butcher for having
in his possession one fifty-six pound weight which was short by one
ounce and 14 drams, another fifty-six pound weight which was short by
one ounce and 12 drams, one twenty-eight pound weight which was short
by two ounces and four drams, and one seven-pound weight which was
short by one ounce and eight drams. Offence committed at Whitby on 14
December 1808. Whitby Strand Petty Sessional division - case heard at
Whitby"

Home=Whitby, occupation=butcher, sex=male match. Location/court=Whitby,
petty sessional division match. Crime type=false weights or measures
matches. Part of the 14 Dec 1808 same-date batch, already resolved.

**OK — no changes.**

---

**Progress: records 1-112 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 113

Text: "Summary conviction of George Croft of Whitby painter for having
in his possession one eight -ounce weight which was short by three
drams. Offence committed at Whitby on 14 December 1808. Whitby Strand
Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=painter, sex=male match. Location/court=Whitby,
petty sessional division match. Crime type=false weights or measures
matches. Part of the 14 Dec 1808 same-date batch, already resolved.
(Trivial stray space in "eight -ounce" -- source-side artifact, not
meaning-affecting, no anomalies note needed.)

**OK — no changes.**

---

**Progress: records 1-113 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 114

Text: "Summary conviction of Robert Robson of Whitby grocer for having
in his possession one fourteen-pound weight which was short by one
ounce and two drams, and another fourteen-pound weight which was short
by eight drams. Offence committed at Whitby on 20 December 1808. Whitby
Strand Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=grocer, sex=male match. Location/court=Whitby,
petty sessional division match. Crime type=false weights or measures
matches. Already cross-checked against record 106 (20 Dec batch) --
correctly unrelated.

**OK — no changes.**

---

**Progress: records 1-114 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 115

Text: "Summary conviction of John Cockburn of Whitby tobacco dealer for
having in his possession one one-pound weight and one eight-ounce
weight both of which were short by two drams. Offence committed at
Whitby on 14 December 1808. Whitby Strand Petty Sessional division -
case heard at Whitby"

Home=Whitby, occupation=tobacco dealer, sex=male match. Location/court=
Whitby, petty sessional division match. Crime type=false weights or
measures matches. Part of the 14 Dec 1808 same-date batch, already
resolved.

**OK — no changes.**

---

**Progress: records 1-115 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 116

Text: "Summary conviction of John Oxley of Whitby bacon seller for
having in his possession two twenty-eight pound weights both of which
were short by two ounces. Offence committed at Whitby on 30 December
1808. Whitby Strand Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=bacon seller, sex=male match. Location/court=
Whitby, petty sessional division match. Crime type=false weights or
measures matches. New same-date batch (30 Dec 1808: 117 John Watson,
118 Ann Buck, 119 Charles Lamb) -- same market-inspection pattern, no
shared incident.

**OK — no changes.**

---

**Progress: records 1-116 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 117

Text: "Summary conviction of John Watson of Whitby for having in his
possession one fifty-six pound weight which was short by five ounces
and 14 drams, and one fourteen-pound weight which was short by one
ounce. Offence committed at Whitby on 30 December 1808. Whitby Strand
Petty Sessional division - case heard at Whitby"

Home=Whitby, sex=male match. No occupation stated in text, correctly
blank. Location/court=Whitby, petty sessional division match. Crime
type=false weights or measures matches. Already cross-checked against
record 116 (30 Dec batch).

**OK — no changes.**

---

**Progress: records 1-117 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 118

Text: "Summary conviction of Ann Buck of Whitby grocer for having in
her possession one two-pound weight which was short by four drams.
Offence committed at Whitby on 30 December 1808. Whitby Strand Petty
Sessional division - case heard at Whitby"

Home=Whitby, occupation=grocer, sex=female match. Location/court=
Whitby, petty sessional division match. Crime type=false weights or
measures matches. Already cross-checked against record 116 (30 Dec
batch).

**OK — no changes.**

---

**Progress: records 1-118 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 119

Text: "Summary conviction of Charles Lamb of Whitby worsted seller for
having in his possession one one-pound weight which was short by two
drams. Offence committed at Whitby on 30 December 1808. Whitby Strand
Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=worsted seller, sex=male match. Location/court=
Whitby, petty sessional division match. Crime type=false weights or
measures matches. Already cross-checked against record 116 (30 Dec
batch).

**OK — no changes.**

---

**Progress: records 1-119 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 120

Text: "Summary conviction of William Williamson of the parish of Lythe
butcher for having in his possession one pair of steelyard deficient in
weight. Offence committed at Whitby on 17 December 1808. Whitby Strand
Petty Sessional division - case heard at Whitby"

Home=Lythe, occupation=butcher, sex=male match. Location/court=Whitby,
petty sessional division match. Crime type=false weights or measures
matches. Already cross-checked against record 98 (17 Dec batch).

**OK — no changes.**

---

**Progress: records 1-120 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 121

Text: "Summary conviction of William Robenson of Whitby butcher for
having in his possession one pair of steelyard deficient in weight, one
twenty-eight pound weight which was short by one ounce four drams and
one seven-pound weight which was short by ten dramsone weight found to
be deficient and one pair of steelyard also deficient in weight Offence
committed at Whitby on 17 December 1808. Whitby Strand Petty Sessional
division - case heard at Whitby"

Home=Whitby, occupation=butcher, sex=male match. Existing anomalies
note ("...ten dramsone weight found...", run-together clause) verified
accurate against the raw text. Location/court=Whitby, petty sessional
division match. Crime type=false weights or measures matches. Already
cross-checked against record 98 (17 Dec batch).

**OK — no changes.**

---

**Progress: records 1-121 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 122

Text: "Summary conviction of James Sharpe for begging in Church Street.
Offence committed at the township of Whitby on 29 November 1876.
Whitby Strand - case heard at Whitby"

No home stated in text at all -- correctly left blank, no fabricated
inference here (unlike record 104's butcher-in-context case, nothing
here supports inferring a home). No occupation stated, correctly blank.
Church Street (26) -> East Cliff (6) -> Whitby (4), matches stated
township. Court=Whitby. Petty sessional division="whitby strand" --
text just says "Whitby Strand" without the fuller "Petty Sessional
division" phrase, but resolves to the same division. Crime
type=begging matches. No related_conviction, no same-date records.

**OK — no changes.**

---

**Progress: records 1-122 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 123

Text: "Summary conviction of John Barber for begging in Glaisdale town
street. Offence committed at the township of Glaisdale on 21 November
1876. Whitby Strand - case heard at Whitby"

No home stated, correctly blank. No occupation stated, correctly blank.
"Glaisdale town street" correctly resolves to Glaisdale itself (138),
matching stated township. Court/petty sessional division match. Crime
type=begging matches. related_conviction links to 127 and 253 present,
correct pattern-2 style (note: 253 is well beyond the current id range
-- a legitimate forward link already made in a prior pass, not an
error, will be independently re-verified when reaching it).

**OK — no changes.**

---

**Progress: records 1-123 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 124

Text: "Summary conviction of Thomas Binns for begging in Ellerby town
street. Offence committed at the township of Ellerby on 10 October
1876. Whitby Strand - case heard at Whitby"

No home stated, correctly blank. "Ellerby town street" resolves to
Ellerby itself (123), matching the stated offence township. **FIXED**:
Ellerby (123) was parented under Lythe (107) -- same node reused
consistently in records 18, 19, and here/126 -- but Ellerby is
historically a township in Hinderwell parish (already evidenced by the
existing "Hinderwell & Ellerby Highway" cross-parish node used in
17-19), not Lythe. Flagged to the user, confirmed as an error, fixed:
`UPDATE location SET parent_id=88 WHERE id=123;` Verified via SELECT:
Ellerby (123) now parent=88=Hinderwell. This is a pure hierarchy
correction -- it does not retroactively invalidate the earlier OK
verdicts for records 18/19/124, since in every case Ellerby's own node
name matched the stated offence township directly (Ellerby=Ellerby);
the parent only matters for other sites checking whether they reach a
stated township. Court/petty sessional division match. Crime
type=begging matches. related_conviction link to 126 present, correct
pattern-2 style.

**FIXED — 1 location hierarchy fix (Ellerby reparented Lythe -> Hinderwell).**

---

**Progress: records 1-124 done (restart #2, plus confirmed blacklist gap
at 87-88). 1 location fix.**

## Record 125

Text: "Summary conviction of Samuel Holmes for begging in Sandgate.
Offence committed at the township of Whitby on 30 October 1876. Whitby
Strand - case heard at Whitby"

No home stated, correctly blank. Sandgate (34) -> East Cliff (6) ->
Whitby (4), reaching stated township. Court/petty sessional division
match. Crime type=begging matches. Same-date records 423 and 1911
(far outside current range, unrelated defendants/charges) share
nothing with 125 -- correctly unrelated.

**OK — no changes.**

---

**Progress: records 1-125 done (restart #2, plus confirmed blacklist gap
at 87-88). 1 location fix.**

## Record 126

Text: "Summary conviction of Joseph Spence for begging in Ellerby town
street. Offence committed at the township of Ellerby on 10 October
1876. Whitby Strand - case heard at Whitby"

No home stated, correctly blank. "Ellerby town street" resolves to
Ellerby itself (123, now correctly parent=88=Hinderwell following the
fix at record 124). Court/petty sessional division match. Crime
type=begging matches. Already cross-checked against record 124 --
related_conviction link confirmed present.

**OK — no changes.**

---

**Progress: records 1-126 done (restart #2, plus confirmed blacklist gap
at 87-88). 1 location fix.**

## Record 127

Text: "Summary conviction of John Lindsay for begging in Glaisdale
town street. Offence committed at the township of Glaisdale on 21
November 1876. Whitby Strand - case heard at Whitby"

No home stated, correctly blank. "Glaisdale town street" resolves to
Glaisdale itself (138), matching stated township. Court/petty
sessional division match. Crime type=begging matches. Already
cross-checked against record 123 -- related_conviction link confirmed
present.

**OK — no changes.**

---

**Progress: records 1-127 done (restart #2, plus confirmed blacklist gap
at 87-88). 1 location fix.**

## Record 128

Text: "Summary conviction of John Gray of the township of Whitby
labourer for being drunk and disorderly on the Whitby and Guisborough
highway. Offence committed at the township of Aislaby on 18 November
1876. Whitby Strand - case heard at Whitby"

Home=Whitby, occupation=labourer, sex=male match. Cross-parish highway
alongside stated township Aislaby. Court/petty sessional division
match. Crime type=drunk and disorderly matches. FIXED: same-date check
found records 130, 478, 510 all share the exact same offence date (18
Nov 1876), road, and charge wording ("being drunk and disorderly on the
Whitby and Guisborough highway"), each with a different defendant --
raised to the user as a likely 4-man shared incident spanning a wide id
range. User confirmed: create the links. Checked precedent first (the
Palmer trespass trio, records 2/3/4) -- confirmed the established
pattern is ALL pairwise combinations linked, not a hub. Inserted the 5
missing pairs (128-130, 128-478, 128-510, 130-478, 130-510); 478-510
already existed from a prior pass with an equivalent note. Verified via
SELECT: all 6 pairs now present. Also noted (not touched, already
correct): 510-514 separately linked via the same-defendant/same-date
pattern (John Jones, a different fact from the 4-man highway incident).

**FIXED — 5 new related_conviction links created (128-130, 128-478,
128-510, 130-478, 130-510), confirmed by the user.**

---

**Progress: records 1-128 done (restart #2, plus confirmed blacklist gap
at 87-88). 1 location fix, 5 related_conviction links added.**

## Record 129

Text: "Summary conviction of John Rice of the township of Whitby rag
gatherer for being the owner of a horse found straying on the Whitby
and Hawsker highway. Offence committed at the township of Whitby on 11
October 1876. Whitby Strand - case heard at Whitby"

Home=Whitby, occupation=rag gatherer, sex=male match. Cross-parish
highway alongside stated township Whitby. Court/petty sessional
division match. Crime type=straying animals matches. FLAGGED (not yet
resolved): same-date record 220 has identical charge wording ("being
the owner of a horse found straying on the Whitby and Hawsker
highway"), different defendant (Cuthbert Wray) -- likely pattern-2
same-incident candidate, no related_conviction link exists yet. To
confirm/fix when reaching 220.

**OK — no changes (pending same-incident check at record 220).**

---

**Progress: records 1-129 done (restart #2, plus confirmed blacklist gap
at 87-88). 1 location fix, 5 related_conviction links added.**

## Record 130

Text: "Summary conviction of Anthony Waters of the township of Whitby
coal porter for being drunk and disorderly on the Whitby and
Guisborough highway. Offence committed at the township of Aislaby on
18 November 1876. Whitby Strand - case heard at Whitby"

Home=Whitby, occupation=coal porter, sex=male match. Same shape as
record 128 (cross-parish highway alongside Aislaby). Court/petty
sessional division match. Crime type=drunk and disorderly matches.
related_conviction links to 128/478/510 already confirmed present from
the fix at record 128.

**OK — no changes.**

---

**Progress: records 1-130 done (restart #2, plus confirmed blacklist gap
at 87-88). 1 location fix, 5 related_conviction links added.**

## Record 131

Text: "Summary conviction of John Thornton for lodging in a wooden hut
with no visible means of subsistence and not giving a good account of
himself. Offence committed at the township of Glaisdale on 18 November
1876. Whitby Strand - case heard at Whitby"

No home stated, correctly blank. Location of offence=Glaisdale, court=
Whitby, petty sessional division match. Crime type=vagrancy matches.
Already cross-checked against record 128 -- correctly unrelated
(different charge, no shared party).

**OK — no changes.**

---

**Progress: records 1-131 done (restart #2, plus confirmed blacklist gap
at 87-88). 1 location fix, 5 related_conviction links added.**

## Record 132

Text: "Summary conviction of Robert Arnold of the township of Whitby
soldier for assaulting Thomas Watson; on the oath of Joseph Philpot of
the township of Whitby jet worker. Offence committed at the township of
Whitby on 11 November 1876. Whitby Strand - case heard at Whitby"

Home=Whitby, occupation=soldier, sex=male match. Thomas Watson: victim,
correctly captured. Joseph Philpot: witness, home=Whitby, occupation=
jet worker, correctly attached to him (not misattributed to the
defendant). Location/court=Whitby, petty sessional division match.
Crime type=assault matches. related_conviction: 132-1977 and 132-1983
already present (both same-defendant/same-date, Robert Arnold appears
in both). NOTED, NOT YET RESOLVED: same-date check surfaced a much
larger, tangled cluster around "Thomas Watson['s] licensed premises" on
this date -- records 333, 447, 466, 482, 1971, 1974, 1977, 1980, 1983,
all sharing an overlapping recurring cast (Watson, Philpot, Thompson,
Speedy, Nawton, Harrison), some with abbreviated name variants
suggesting possible near-duplicate entries from the same court sitting.
This is far more complex than the 128/130/478/510 four-man case and
spans ids well beyond the current position. Deliberately NOT resolving
now, out of sequence -- will investigate properly when each of those
records is reached individually.

**RESOLVED** (user asked to investigate immediately rather than defer):
Pulled all 10 records' full raw_record text side by side. This is one
real historical incident at Thomas Watson's licensed premises, Whitby,
11 November 1876 -- NOT duplicates. 6 distinct defendants (Robert
Arnold, William Barrett, Robert Wilson, John Arnold, Richard Holmes,
Edward Barrett), one joint 4-defendant conviction (1983), 3 distinct
charge groupings (assaulting Thomas Watson: 132/333; assaulting Edward
Watson: 447/1983; disorderly on the licensed premises: 466/482/1971/
1974/1977/1980), same 7-person witness list throughout (abbreviated
name variants across records, same real people).

Digression: user asked whether `related_conviction` should be
remodeled as a cluster/incident table given the scale here. Checked
`qsrecords/models/core.py`'s `RelatedConviction` docstring first --
already documents "unbounded cardinality (up to 11 links per
conviction, verified)" as the reason it's pairwise, and states the
design is deliberately informal (`note` is for internal judgment only,
never surfaced to users). Decision: keep pairwise, park the cluster
idea for later (see project memory
`project_related_conviction_cluster_model_parked.md`).

All same-defendant (pattern-1) links were already fully correct
(Arnold's 3, Barrett's 3, Wilson/Holmes/E.Barrett's 2 each). Missing
different-defendant (pattern-2) links identified and created, all-pairs
style, matching precedent:
- 15 links among the six "disorderly on licensed premises" records
  (466, 482, 1971, 1974, 1977, 1980) -- one incident, six patrons.
- 1 link: 132-333 (Robert Arnold vs William Barrett, both "assaulting
  Thomas Watson").
- 1 link: 447-1983 (William Barrett alone vs the four jointly charged,
  both "assaulting Edward Watson") -- genuinely ambiguous whether same
  specific assault; asked the user, confirmed: link them.
17 new rows total, verified via SELECT (26 total related_conviction
rows now cover this cluster, up from 9 pre-existing).

**FIXED — 17 new related_conviction links created across the Watson-
premises cluster (132, 333, 447, 466, 482, 1971, 1974, 1977, 1980,
1983), confirmed by the user; cluster-model schema question parked as
a project decision.**

---

**Progress: records 1-132 done (restart #2, plus confirmed blacklist gap
at 87-88). 1 location fix, 5+17=22 related_conviction links added.**

## Record 133

Text: "Summary conviction of John Shaw of the township of Whitby jet
worker for being drunk and disorderly in Baxtergate. Offence committed
at the township of Whitby on 4 November 1876. Whitby Strand - case
heard at Whitby"

Home=Whitby, occupation=jet worker, sex=male match. Baxtergate -> West
Cliff -> Whitby reaches stated township. Court/petty sessional division
match. Crime type=drunk and disorderly matches. Same-date records (297,
363, 429, 441, 1965, 1968) share no party with 133 -- correctly
unrelated. NOTED for later: 363 and 441 share defendant Jacob Pearson
-- will check for a missing same-defendant related_conviction link when
those records are reached.

**OK — no changes.**

---

**Progress: records 1-133 done (restart #2, plus confirmed blacklist gap
at 87-88). 1 location fix, 22 related_conviction links added.**

## Record 134

Text: "Summary conviction of William Burkit of Glasgow in North Britain
for distributing hand bills or advertisements for selling drapery goods
at the King's Head Inn in Church Street in Whitby under the name of
John Spark and Co from Glasgow without the words \"Licensed Hawker\" and
the number on his licence being inserted in the advertisements; on the
information of Joseph Thornhill"

Home=Glasgow matches "of Glasgow in North Britain". Impersonation rule
correctly applied: "John Spark and Co" captured as its own row, role=
"company impersonated" (10340), not folded in as an alias. Joseph
Thornhill: informant, correctly captured. King's Head Inn (387) nests
under Church Street (26), matching "at the King's Head Inn in Church
Street in Whitby". No offence_date, court location, or petty sessional
division stated in the text at all -- correctly absent from the DB,
not a gap (this record predates the standard "Whitby Strand Petty
Sessional division - case heard at Whitby" phrasing seen elsewhere).
Crime type=licensing offence matches. No related_conviction (no
offence_date to cross-check against, and none exists for this id).

**OK — no changes.**

---

**Progress: records 1-134 done (restart #2, plus confirmed blacklist gap
at 87-88). 1 location fix, 22 related_conviction links added.**

## Record 135

Text: "Summary conviction of Harris Lyon for trading as a hawker
without a certificate, selling six silver teaspoons to William Bell of
the parish of Whitby excise officer; on the information of John Meek.
Offence committed at Whitby. With bill of prosecution expenses dated 24
September 1814 and an undated note relating to Lyon's fine"

Lyon: defendant, occupation=hawker (matches "trading as a hawker" --
the charge is doing so without a certificate, not that "hawker" itself
is fabricated), no home stated, correctly blank. William Bell: role=
buyer, home=Whitby, occupation=excise officer, correctly attached to
Bell not Lyon. John Meek: informant, no home/occupation stated,
correctly blank. Location of offence=Whitby matches. No court/petty
sessional division stated, correctly absent. Crime type=licensing
offence matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-135 done (restart #2, plus confirmed blacklist gap
at 87-88). 1 location fix, 22 related_conviction links added.**

## Record 136

Text: "Summary conviction of James Benson, John Barker, James Robinson
and Margaret his wife, and Joseph Grotes and Mary his wife, for
vagrancy; on the information of John Morley constable of the township
of Whitby. Offence committed at the township of Whitby on 26 January
1822. Case heard at Whitby"

Six defendants: Benson, Barker, James Robinson, Margaret Robinson,
Joseph Grotes, Mary Grotes -- all present as separate person rows.
Checked specifically for the duplicate-stub bug (per project memory):
Margaret (137) "wife" -> James Robinson (136), and Mary (139) "wife" ->
Joseph Grotes (138) -- both correctly point at the real co-defendant
rows already on this record, not a duplicate stub. John Morley:
informant, occupation="constable of the township of Whitby", correctly
captured. Location/court=Whitby. Crime type=vagrancy matches. No
related_conviction. [Wording corrected 2026-07-30: was miswritten as
"office"; verified correctly stored as occupation, no DB error.]

**OK — no changes.**

---

**Progress: records 1-136 done (restart #2, plus confirmed blacklist gap
at 87-88). 1 location fix, 22 related_conviction links added.**

## Record 137

Text: "Summary conviction of Francis Thompson of the township of
Hawsker cum Stainsacre farmer for driving two horses on the Whitby and
Pickering railway; on the information of Alfred Jefferson of the
township of Ruswarp collector of tolls on the Whitby and Pickering
railway. Offence committed at the township of Hawsker cum Stainsacre on
1 July 1839. Case heard at Whitby"

Home=Hawsker-cum-Stainsacre, occupation=farmer, sex=male match. Alfred
Jefferson: informant, home=Ruswarp, occupation="collector of tolls on
the Whitby and Pickering railway", correctly captured [wording
corrected 2026-07-30: was miswritten as "office"; verified correctly
stored as occupation, no DB error]. **FIXED**: location
of offence was missing the "Whitby & Pickering Railway" node (389,
Cross-Parish Railways) -- found by comparing against records 141 and
146, which have near-identical text (same charge, same date, same
informant) and already correctly link to 389 alongside the stated
township. Fixed: `INSERT INTO summary_conviction_location
(summary_conviction_id, location_id, role) VALUES (137, 389, 'location
of offence');` Verified via SELECT. Also created the missing
related_conviction links: 137, 141, and 146 are clearly one incident
(three men driving horses on the railway together, same date, same
informant) -- inserted all 3 pairwise links, matching the established
all-pairs precedent (Palmer trespass trio, etc.). Verified via SELECT.
Crime type=trespass matches.

**FIXED — 1 missing location link added, 3 new related_conviction
links created.**

---

**Progress: records 1-137 done (restart #2, plus confirmed blacklist gap
at 87-88). 2 location fixes, 25 related_conviction links added.**

## Record 138

Text: "Summary conviction of Thomas Argument of the township of Whitby
hawker for encamping on the public highway; on the information of
William Barton. Offence committed at the township of Sand Hutton on 28
August 1844. Case heard at Lobster House in the township of Claxton"

Home=Whitby, occupation=hawker, sex=male match. William Barton:
informant, no home/occupation stated, correctly blank. Location of
offence=Sand Hutton (300, top-level, distinct from the usual Whitby-
area townships) matches. Court location=Lobster House (394) -> Claxton
(333), matching this unusual out-of-area court venue exactly. Crime
type=obstructing the highway matches "encamping on the public highway".
No related_conviction.

**OK — no changes.**

---

**Progress: records 1-138 done (restart #2, plus confirmed blacklist gap
at 87-88). 2 location fixes, 25 related_conviction links added.**

(Record 139 confirmed blacklisted, expected gap.)

## Record 140

Text: "Summary conviction of Mary Egins, Peter Kelley, James Coil, John
Camble and John Thompson for vagrancy; on the information of John
Morley constable of the township of Whitby. Offence committed at the
township of Whitby in February 1822. Case heard at Whitby"

Five defendants, all separate person rows, none stated as married to
each other. John Morley: informant, office correctly captured (same
recurring officer as record 136, but different date/defendants --
correctly a separate, unrelated conviction). Location/court=Whitby.
Crime type=vagrancy matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-140 done (restart #2, plus confirmed blacklist gap
at 87-88, 139). 2 location fixes, 25 related_conviction links added.**

## Record 141

Text: "Summary conviction of George Jackson of the township of Sneaton
servant in husbandry for driving two horses on the Whitby and Pickering
railway; on the information of Alfred Jefferson of the township of
Ruswarp collector of tolls on the Whitby and Pickering railway. Offence
committed at the township of Hawsker cum Stainsacre on 1 July 1839.
Case heard at Whitby"

Home=Sneaton, occupation="servant in husbandry", sex=male match. Both
location-of-offence rows (Hawsker-cum-Stainsacre, Whitby & Pickering
Railway) already correctly present -- this was the record used as
precedent to fix 137. related_conviction links to 137/146 already
confirmed present. Crime type=trespass matches.

**OK — no changes.**

---

**Progress: records 1-141 done (restart #2, plus confirmed blacklist gap
at 87-88, 139). 2 location fixes, 25 related_conviction links added.**

## Record 142

Text: "Summary conviction of Jane Harrison of the township of Whitby
singlewoman for not maintaining her three bastard children, namely
Dorothy aged 10 years, William aged 7 years, and Jane aged 5 years,
whereby they became chargeable to the township of Whitby. Offence
committed at the township of Whitby on 6 April 1844. Case heard at
Whitby"

Jane Harrison (mother): home=Whitby, occupation=singlewoman, sex=female
match. Three children, birth_year correctly derived from stated ages
(1844 minus 10/7/5 = 1834/1837/1839), person_relationship "child" ->
Jane Harrison for all three, correct. **FIXED**: none of the three
children had `sex` set despite unambiguous given names -- Dorothy
(6517) -> female, William (6518) -> male, Jane (6519) -> female. Same
fix class as the earlier Duncanson/Corser records. Verified via
SELECT. Location/court=Whitby, crime type=failure to maintain bastard
children match. No related_conviction, no same-date records.

**FIXED — 3 sex fixes.**

---

**Progress: records 1-142 done (restart #2, plus confirmed blacklist gap
at 87-88, 139). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 143

Text: "Summary conviction of George Watson of the township of Whitby
labourer for cutting down 25 larch trees, the property of Henry Linton
of the township of Newholm cum Dunsley spirit merchant, and causing
ten-shillingsworth of damage. Offence committed at the township of
Hawsker cum Stainsacre on 29 July 1853. Case heard at Whitby"

Home=Whitby, occupation=labourer, sex=male match. Henry Linton: victim,
home=Newholm-cum-Dunsley, occupation=spirit merchant, correctly
captured with his own attributes. Location of offence=Hawsker-cum-
Stainsacre matches. Court=Whitby. Crime type=malicious/property damage
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-143 done (restart #2, plus confirmed blacklist gap
at 87-88, 139). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

(Record 144 confirmed blacklisted, expected gap.)

## Record 145

Text: "Summary conviction of Francis Wrightson labourer and Isaac
Harrison labourer, both of the parish of Sneaton, for using dogs and
guns to kill game. Offence committed at the parish of Sneaton on 26
December 1821. Case heard at Whitby"

Two co-defendants, both home=Sneaton, occupation=labourer, sex=male,
both on this one record (no cross-record link needed). Location/court
match. Crime type=poaching matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-145 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 146

Text: "Summary conviction of Thomas Beeforth the younger of the
township of Sneaton farmer for driving two horses on the Whitby and
Pickering railway; on the information of Alfred Jefferson of the
township of Ruswarp collector of tolls on the Whitby and Pickering
railway. Offence committed at the township of Hawsker cum Stainsacre on
1 July 1839. Case heard at Whitby"

Home=Sneaton, name_postfix="the younger" correctly captured, occupation
=farmer, sex=male match. Both location-of-offence rows already
correctly present -- this was the second record used as precedent to
fix 137. related_conviction links to 137/141 already confirmed. Crime
type=trespass matches.

**OK — no changes.**

---

**Progress: records 1-146 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 147

Text: "Summary conviction of James Guy and George Orton for begging.
Offence committed at the township of Ruswarp on 15 November 1844. Case
heard at Whitby"

Two co-defendants, no home stated for either, correctly blank. Location
of offence=Ruswarp, court=Whitby. Crime type=begging matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-147 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 148

Text: "Summary conviction of John Dixon of the township of Whitby
labourer for exposing himself and using very obscene and indecent
language in St Ann's Staith; on the oath of Edward Barker of the
township of Whitby assistant constable. Offence committed at the
township of Whitby on 4 August 1853. Case heard at Whitby"

Home=Whitby, occupation=labourer, sex=male match. St Ann's Staith ->
West Cliff -> Whitby reaches stated township. Edward Barker: informant,
home=Whitby, occupation="assistant constable", correctly captured.
Court=Whitby. Crime type=using obscene language matches. No
related_conviction. [Corrected 2026-07-30: originally miswritten as
"office" here -- verified against the DB, this was always correctly
stored as occupation; office is reserved for aristocratic/peerage
pedigree only, per the rule clarified at record 191.]

**OK — no changes.**

---

**Progress: records 1-148 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 149

Text: "Summary conviction of James Lovatt of Whitby gunsmith for using a
gun to kill game. Offence committed at Guisborough on 4 October 1819.
Case heard at Guisborough"

Home=Whitby, occupation=gunsmith, sex=male match. Both court location
and location of offence correctly Guisborough (278), an out-of-area
venue distinct from the usual Whitby-area townships. Crime
type=poaching matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-149 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 150

Text: "Summary conviction of John Taylor of the township of Loftus
labourer for having four pheasants for sale which he was not authorised
to have or sell. Offence committed at the township of Whitby on
Tuesday 15 January 1822"

Home=Loftus, occupation=labourer, sex=male match. Location of
offence=Whitby matches. Day-of-week ("Tuesday") preserved in
offence_date_raw -- no dedicated schema column for it, nothing further
needed. No court location stated at all in the text, correctly absent.
Crime type=poaching matches ("pheasants...not authorised to have or
sell"). No related_conviction.

**OK — no changes.**

---

**Progress: records 1-150 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

(Record 151 confirmed blacklisted, expected gap.)

## Record 152

Text: "Summary conviction of Robert Harrison for not maintaining his
family, whereby his three children became chargeable to the township
of Whitby Offence committed at the township of Whitby on 15 July 1844.
Case heard at Whitby"

No home stated, correctly blank. Children not named in this text
(unlike record 142's named Dorothy/William/Jane) -- correctly no child
person rows created, nothing to capture. Location/court=Whitby. Crime
type=failure to maintain family matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-152 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 153

Text: "Summary conviction of Thomas Rodgers of the township of
Hinderwell miner for assaulting Michael Theaker; on the oath of the
said Michael Theaker of the township of Hinderwell constable. Offence
committed at the township of Hinderwell on 1 September 1853. Case heard
at Whitby"

Home=Hinderwell, occupation=miner, sex=male match. Michael Theaker:
victim, home=Hinderwell, occupation=constable, correctly captured
despite being both the victim and the sworn witness ("the said Michael
Theaker"). Location of offence=Hinderwell, court=Whitby. Crime
type=assaulting a police officer matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-153 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 154

Text: "Summary conviction of Messrs Holt and Company of the township of
Whitby for having in their custody 13 x 56-pound weights, five 28-pound
weights, one 14-pound weight, two seven-pound weights, and one
three-and-a-half-pound weight, all of which were deficient in weight.
Offence committed at Whitby on 26 April 1818. Case heard at a Petty
Sessions for the division of Whitby Strand"

Defendant is a company ("Holt and Company"), captured with the company
name in last_name, first/middle name and sex correctly blank -- same
convention as the "company impersonated" case in record 134, applied
here to a genuine company defendant. Home=Whitby matches. Location/
court=Whitby, petty sessional division correctly resolved from "a
Petty Sessions for the division of Whitby Strand". Crime type=false
weights or measures matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-154 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 155

Text: "Summary conviction of Thomas Jackson of the township of Whitby
for having false weights in his possession, namely a half-pound weight,
a quarter-pound weight, a two-ounce weight, and a one-ounce weight.
Offence committed at Whitby on 27 March 1822. Whitby Strand Petty
Sessional division - case heard at Whitby"

Home=Whitby, sex=male match. No occupation stated, correctly blank.
Location/court=Whitby, petty sessional division match. Crime
type=false weights or measures matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-155 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 156

"Summary conviction of William Hamilton Irvin for playing a game of
chance in Ruswarp Street. Offence committed at the township of Ruswarp
on 8 July 1839. Case heard at Whitby" -- middle name Hamilton correct,
no home stated, correctly blank. Ruswarp Street nests directly under
Ruswarp (94), matching stated township. Crime type=gaming/gambling
offence matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-156 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 157

"Summary conviction of John Humphrey apprentice to Harrison Waller of
the township of Lythe shoemaker for misconduct and ill-behaviour
towards his master...absented himself...continued absent for a week.
Case heard at Whitby" -- Humphrey: occupation="apprentice shoemaker"
(15, existing precedent, matches). Waller: master, home=Lythe,
occupation=shoemaker, correctly attached to him not Humphrey.
person_relationship: "apprentice" -> Waller, correct. No offence
location stated (situational/ongoing absence, not a single-site
event), correctly absent. Court=Whitby, no petty sessional division
stated, correctly absent. Crime type=master and servant offence
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-157 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 158

"Summary conviction of Martha Dixon of the township of Whitby
singlewoman for assaulting Sarah Hardcastle; on the oath of the said
Sarah Hardcastle wife of William Hardcastle of the township of Whitby
labourer. Offence committed at the township of Whitby on 17 September
1853. Case heard at Whitby" -- Martha: home=Whitby, occupation=
singlewoman, sex=female match. Sarah Hardcastle: victim, female, no
occupation of her own (correct). William Hardcastle: "husband of
victim", home=Whitby, occupation=labourer, correctly attached to him.
person_relationship: Sarah "wife" -> William, correct direction.
Location/court=Whitby. Crime type=assault matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-158 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 159

"Summary conviction of Jane Holland of the township of Fylingdales for
having in her possession one seven-pound weight, one one-pound weight,
one quarter-pound weight, and one half-pound weight, all of which were
deficient in weight. Offence committed at Fylingdales on 18 June 1818.
Case heard at a Petty Sessions for the division of Whitby Strand" --
home=Fylingdales, sex=female match, no occupation stated correctly
blank. Location/court match, petty sessional division correctly
resolved. Crime type=false weights or measures matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-159 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 160

"Summary conviction of Sarah Tate of the township of Whitby for having
false weights in her possession...Offence committed at Whitby on 6
April 1822. Whitby Strand Petty Sessional division - case heard at
Whitby" -- home=Whitby, sex=female match, no occupation stated
correctly blank. Location/court/petty sessional division match. Crime
type=false weights or measures matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-160 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 161

"Summary conviction of William Bell of the township of Egton butcher
for assaulting Edward Turner of the township of Whitby cabinet maker,
striking him several times on the face with his fist. Offence committed
at the township of Whitby on 6 July 1839. Division of Whitby Strand -
case heard at Whitby" -- Bell: home=Egton, occupation=butcher, sex=male
match. Turner: victim, home=Whitby, occupation=cabinet maker, correctly
attached to him. Location/court=Whitby, "Division of Whitby Strand"
correctly resolves to whitby strand. Crime type=assault matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-161 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 162

"Summary conviction of John Thompson, Henry Harris and William Johnson
for begging. Offence committed at the township of Whitby on 11
December 1844. Case heard at Whitby" -- three co-defendants, no homes
stated, correctly blank. Location/court=Whitby. Crime type=begging
matches. No related_conviction (all three on this one record).

**OK — no changes.**

---

**Progress: records 1-162 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 163

"Summary conviction of William Peart of the township of Whitby
fisherman for assaulting Matthew Leadley; on the oath of the said
Matthew Leadley of the township of Whitby mariner. Offence committed at
the township of Whitby on 27 September 1853. Case heard at Whitby" --
Peart: home=Whitby, occupation=fisherman, sex=male match. Leadley:
victim, home=Whitby, occupation=mariner, correctly captured.
Location/court=Whitby. Crime type=assault matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-163 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 164

"Summary conviction of Jane Watson of the township of Fylingdales for
having in her possession a one-stone weight and one three-and-a-half-
pound weight, both of which were deficient in weight. Offence committed
at Fylingdales on 18 June 1818. Case heard at a Petty Sessions for the
division of Whitby Strand" -- home=Fylingdales, sex=female match.
Location/court/petty sessional division match. Crime type=false
weights or measures matches. Same-date batch (159, 169, 174, 179) --
independent traders, same market-inspection pattern, no shared
incident, correctly unlinked.

**OK — no changes.**

---

**Progress: records 1-164 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 165

"Summary conviction of Ann Marshall of the township of Whitby for
having a false one-stone weight in her possession. Offence committed at
Whitby on 26 March 1822. Whitby Strand Petty Sessional division - case
heard at Whitby" -- home=Whitby, sex=female match. Location/court/petty
sessional division match. Crime type=false weights or measures matches.
No same-date records, no related_conviction.

**OK — no changes.**

---

**Progress: records 1-165 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 166

"Summary conviction of Edward Smith Wormald of the township of Newholm
cum Dunsley farmer for assaulting William Thompson of the township of
Whitby butcher...Division of Whitby Strand - case heard at Whitby" --
middle name Smith correctly captured, home=Newholm-cum-Dunsley,
occupation=farmer, sex=male match. Thompson: victim, home=Whitby,
occupation=butcher, correctly captured. Location/court=Whitby, petty
sessional division match. Crime type=assault matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-166 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 167

"Summary conviction of John Reed of the township of Whitby blacksmith
for assaulting Jane Reed his wife, by striking her several times on the
head with great force and violence. Offence committed at the township
of Whitby on 6 September 1844. Case heard at Whitby" -- domestic
assault; John: home=Whitby, occupation=blacksmith, sex=male match.
Jane: victim, female, no occupation of her own, correct. person_
relationship: Jane "wife" -> John, correct direction. Location/court=
Whitby. Crime type=assault matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-167 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 168

"Summary conviction of Robert Brooks of the township of Eskdaleside
miner for having eight salmon trout in his possession which had been
caught in the river Esk during the close season; on the complaint of
William Wilkinson the younger of the township of Whitby superintendent
of police. Offence committed at the township of Eskdaleside on 8
October 1853. Case heard at Whitby" -- home=Eskdaleside-cum-Ugglebarnby
(shorthand "Eskdaleside" in text), occupation=miner, sex=male match.
River Esk (398) correctly modeled as a cross-parish "Rivers" category
node (397), added alongside the stated township -- same pattern as
highways/railways, first river-category record seen this pass. William
Wilkinson: complainant, home=Whitby, name_postfix="the younger",
occupation="superintendent of police", correctly captured [wording
corrected 2026-07-30: was miswritten as "office"; verified correctly
stored as occupation, no DB error]. Crime
type=poaching matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-168 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 169

"Summary conviction of Rebecca Harrison of the township of Fylingdales
having in her possession...deficient in weight. Offence committed at
Fylingdales on 18 June 1818. Case heard at a Petty Sessions for the
division of Whitby Strand" -- home=Fylingdales, sex=female match.
Location/court/petty sessional division match. Crime type=false
weights or measures matches. Already cross-checked against record 164
(18 June 1818 batch) -- correctly unrelated.

**OK — no changes.**

---

**Progress: records 1-169 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 170

"Summary conviction of William Wood of the township of Whitby for
having a false half-stone weight in his possession. Offence committed
at Whitby on 6 April 1822. Whitby Strand Petty Sessional division -
case heard at Whitby" -- home=Whitby, sex=male match. Location/court/
petty sessional division match. Crime type=false weights or measures
matches. Already cross-checked against record 165 (6 April 1822 batch).

**OK — no changes.**

---

**Progress: records 1-170 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 171

"Summary conviction of William Pinkney Whitby shipwright and John Young
sawyer, both of Whitby, for taking other than by angling five salmon
trout value 5s, from the river Esk where John Elgie of the township of
Ruswarp miller had a private right of fishing. Offence committed at the
township of Sneaton on 10 August 1839. Case heard at Whitby" -- Pinkney
and Young: both home=Whitby, occupations shipwright/sawyer correctly
attached to the right person, sex=male. John Elgie: role="owner of
private fishing right", home=Ruswarp, occupation=miller, correctly
captured. River Esk (398) cross-parish node alongside stated Sneaton
township. Crime type=poaching matches. No related_conviction (both
defendants on this one record).

**OK — no changes.**

---

**Progress: records 1-171 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 172

"Summary conviction of Edward Genning for begging. Offence committed at
the township of Whitby on 2 January 1845. Case heard at Whitby" -- no
home stated, correctly blank. Location/court=Whitby. Crime
type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-172 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 173

"Summary conviction of James Wilson late of the township of Aislaby
labourer for begging. Offence committed at the township of Aislaby on
7 April 1857. Case heard at Whitby" -- "late of" checked against
corpus-wide precedent (35 occurrences) -- established convention
stores the stated place as home_location_id regardless of "late"
meaning formerly resident, since it's the only location info given;
documented in rule book. Home=Aislaby, occupation=labourer, sex=male
match. Location/court match. Crime type=begging matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-173 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 174

"Summary conviction of Mathew Rickinson of the township of Fylingdales
for having in his possession a seven-pound weight that was deficient.
Offence committed at Fylingdales on 18 June 1818. Case heard at a Petty
Sessions for the division of Whitby Strand" -- **FIXED**: stored
first_name was "Matthew" (two T's) but this record's own raw_record
spells it "Mathew" (one T) -- unlike the earlier Cargill case (two
competing sources), there's only one source text here and the DB
simply didn't match it. `UPDATE person SET first_name='Mathew' WHERE
id=183;` Verified via SELECT. Home=Fylingdales matches. Location/court/
petty sessional division match. Crime type=false weights or measures
matches. Part of the 18 June 1818 same-date batch (159/164/169),
already resolved as independent traders, no shared incident.

**FIXED — 1 spelling fix.**

---

**Progress: records 1-174 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links,
3 sex fixes, 1 spelling fix.**

## Record 175

"Summary conviction of William Foster of the township of Whitby for
having false weights in his possession...Offence committed at Whitby
on 28 March 1822. Whitby Strand Petty Sessional division - case heard
at Whitby" -- home=Whitby, sex=male match. Location/court/petty
sessional division match. Crime type=false weights or measures matches.
No related_conviction.

**OK — no changes.**

---

**Progress: records 1-175 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links,
3 sex fixes, 1 spelling fix.**

## Record 176

"Summary conviction of Elizabeth Wood for being drunk; on the
information of William Taylor of the township of Whitby mariner.
Offence committed at the township of Whitby on 11 August 1839. Case
heard at Whitby" -- no home stated for Elizabeth, correctly blank, sex=
female. William Taylor: informant, home=Whitby, occupation=mariner,
correctly captured. Location/court=Whitby. Crime type=drunkenness
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-176 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links,
3 sex fixes, 1 spelling fix.**

## Record 177

"Summary conviction of George Robinson for entering at night on a
piece of woodland called Overdale Plantation belonging to and occupied
by the Marquis of Normanby, ad taking three pheasants Offence committed
at the township of Lythe at 11 p.m. on 23 January 1845. Case heard at
Whitby" -- George Robinson: no home stated, correctly blank. Marquis of
Normanby: Constantine Henry Phipps, office="1st Marquess of Normanby
(Viscount Normanby 1812 - 1831; Earl of Mulgrave 1831 - 1838)", matches
the established precedent exactly. Overdale Plantation (358) nests
under Lythe (107), matching stated township. offence_time="11 p.m."
correctly captured. **FIXED**: no anomalies note existed for the "ad
taking" scribal typo (should be "and taking") -- same class as
existing notes elsewhere (records 4, 78, 121). Added:
`UPDATE summary_conviction SET anomalies='Scribal typo in source text:
"ad taking" (missing letters, should be "and taking").' WHERE id=177;`
Verified via SELECT. Crime type=poaching matches. No related_conviction.

**FIXED — 1 missing anomalies note added.**

---

**Progress: records 1-177 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links,
3 sex fixes, 1 spelling fix, 1 anomalies note added.**

## Record 178

"Summary conviction of Ralph Storr apprentice to Sampson Storm of the
township of Ruswarp ship owner for absconding from the service of his
master. Offence committed on 7 April 1857. Case heard at Whitby" --
Storr (defendant) and Storm (master) correctly kept as distinct people
despite similar surnames -- read carefully, not conflated. Occupation=
apprentice, home not stated for Storr (correct). Storm: home=Ruswarp,
occupation=ship owner, correctly attached. person_relationship:
"apprentice" -> Storm, correct. No location of offence stated (no
township given for the offence itself). Crime type=master and servant
offence matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-178 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links,
3 sex fixes, 1 spelling fix, 1 anomalies note added.**

## Record 179

"Summary conviction of Thomas Newton of the township of Fylingdales for
having in his possession...deficient in weight. Offence committed at
Fylingdales on 18 June 1818. Case heard at a Petty Sessions for the
division of Whitby Strand" -- home=Fylingdales, sex=male match.
Location/court/petty sessional division match. Crime type=false
weights or measures matches. Already cross-checked against 164/174 (18
June 1818 batch) -- correctly unrelated.

**OK — no changes.**

---

**Progress: records 1-179 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links,
3 sex fixes, 1 spelling fix, 1 anomalies note added.**

## Record 180

"Summary conviction of Benjamin Day for having false weights in his
possession...Offence committed at Whitby on 28 March 1822. Whitby
Strand Petty Sessional division - case heard at Whitby" -- no home
stated, correctly blank, sex=male. Location/court/petty sessional
division match. Crime type=false weights or measures matches. Same
date as record 175 (28 March 1822) -- already cross-checked, correctly
unrelated (independent traders, market-inspection pattern).

**OK — no changes.**

---

**Progress: records 1-180 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links,
3 sex fixes, 1 spelling fix, 1 anomalies note added.**

## Record 181

"Summary conviction of Charles Alcrow apprentice to Thomas Marwood the
younger of the township of Ruswarp shipowner for absenting himself
from his master's service. Offence committed on 25 September 1839.
Case heard at Whitby" -- Alcrow: occupation=apprentice, home not
stated (correct). Marwood: master, name_postfix="the younger", home=
Ruswarp, occupation=shipowner, correctly attached. **FIXED**: found
this pair stored BOTH directions (190 apprentice->6536 AND 6536
master->190), unlike records 157/178's single-direction convention.
Corpus-wide check: only 8/586 person_relationship rows (4 pairs) were
stored bidirectionally like this -- a small minority, not the
established convention. Flagged to the user; confirmed: remove the
redundant reverse rows. Identified all 4 pairs precisely (190/6536
apprentice-master, 216/6551 apprentice-master, 223/6557 apprentice-
master, 6203/9779 wife-husband), verified each row's exact id (369,
371, 372, 536) before deleting, kept the primary direction matching
established precedent (apprentice->master, wife->husband) in each
case. `DELETE FROM person_relationship WHERE id IN (369,371,372,536);`
Verified via SELECT: 586 -> 582 total rows, record 181 now shows only
the single apprentice direction. Crime type=master and servant offence
matches. No related_conviction.

**FIXED — 4 redundant reciprocal relationship rows removed corpus-wide
(records 181, 216-area, 223-area, and one wife/husband pair).**

---

**Progress: records 1-181 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links,
3 sex fixes, 1 spelling fix, 1 anomalies note, 4 redundant relationship
rows removed.**

## Record 182

"Summary conviction of Wardale Harland for refusing to maintain his
family whereby his two children became chargeable to the township of
Whitby. Harland already had been convicted as an idle and disorderly
person on 21 December 1839. Offence committed at the township of
Whitby on 10 September 1842. Case heard at Whitby" -- no home stated,
correctly blank. Prior-conviction reference (1839) has no dedicated
schema field but is fully preserved verbatim in raw_record -- not a
gap. conviction_date (1845) considerably later than offence_date
(1842), consistent with the text's own account of a delayed hearing.
Location/court=Whitby. Crime type=failure to maintain family matches.
No related_conviction.

**OK — no changes.**

---

**Progress: records 1-182 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links,
3 sex fixes, 1 spelling fix, 1 anomalies note, 4 redundant relationship
rows removed.**

## Record 183

"Summary conviction of James Johnson late of the township of Whitby
labourer for begging. Offence committed at the township of Whitby on
18 April 1857. Case heard at Whitby" -- "late of" convention (per
record 173) applied consistently, home=Whitby, occupation=labourer,
sex=male match. Location/court=Whitby. Crime type=begging matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-183 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links,
3 sex fixes, 1 spelling fix, 1 anomalies note, 4 redundant relationship
rows removed.**

## Record 184

"Summary conviction dated 14 May 1818 of John Gardner of Hexham for
distributing handbills advertising a sale by auction, at the house of
William Harland at the sign of the Butchers Arms near the Fish Market
at Whitby...The words 'Licensed Hawker' etc...had not been inserted in
the advertisements. Information given by Henderson Skaife and John
Bulmer. Case heard at Whitby. Information dated 18 May 1818 of David
Hartley of Whitby pawnbroker, witness in the case against John Gardner"

Gardner: home=Hexham matches. Existing anomalies note ("Gardener" vs
"Gardner") verified accurate. William Harland: "householder/venue
keeper", home=Whitby, correctly captured. Skaife/Bulmer: informants.
David Hartley: witness, home=Whitby, occupation=pawnbroker, correct.
**FIXED**: no location node existed for "Butchers Arms"/Fish Market
despite the near-identical record 134 (King's Head Inn) getting a
specific site node for the same offence type. Raised to the user;
confirmed adding it. Created location 415 ("Butchers Arms (near the
Fish Market)"), initially under Whitby (4). User then asked to place it
on the correct street; checked existing candidates -- "Market Place"
(30, East Cliff) and "Old Market Place" (31, West Cliff) both exist,
but which one corresponds to this 1818 Fish Market is genuinely
unresolved. User's decision: leave nested under Whitby as a
placeholder, flagged via `notes_private` for follow-up research rather
than guessed. Linked as location of offence for this record. Crime
type=licensing offence matches.

**FIXED — 1 new location node created (flagged as needing a proper
street parent), linked to this record.**

---

**Progress: records 1-184 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes, 25 related_conviction links,
3 sex fixes, 1 spelling fix, 1 anomalies note, 4 redundant relationship
rows removed. 1 location flagged for follow-up (Butchers Arms street).**

## Record 185

"Summary conviction of Robert Vickers of the township of Whitby for
having false weights in his possession...Offence committed at Whitby on
28 March 1822. Whitby Strand Petty Sessional division - case heard at
Whitby" -- home=Whitby, sex=male match. Location/court/petty sessional
division match. Crime type=false weights or measures matches. Already
cross-checked against records 175/180 (28 March 1822 batch).

**OK — no changes.**

---

**Progress: records 1-185 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes, 25 related_conviction links,
3 sex fixes, 1 spelling fix, 1 anomalies note, 4 redundant relationship
rows removed. 1 location flagged for follow-up.**

## Record 186

"Summary conviction of Margaret Clark of the township of Whitby
singlewoman for assaulting John Adamson of the township of Whitby
shoemaker by striking him several times on the shoulder with a poker.
Offence committed at the township of Whitby on 26 September 1839.
Whitby Strand division - case heard at Whitby" -- Clark: home=Whitby,
occupation=singlewoman, sex=female match. Adamson: victim, home=
Whitby, occupation=shoemaker, correctly captured. Location/court/petty
sessional division match ("Whitby Strand division" resolves the same
as "Whitby Strand Petty Sessional division"). Crime type=assault
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-186 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes, 25 related_conviction links,
3 sex fixes, 1 spelling fix, 1 anomalies note, 4 redundant relationship
rows removed. 1 location flagged for follow-up.**

**RESOLVED (Butchers Arms, location 415)**: user confirmed it's on
Church Street, near Market Place (both under East Cliff). Reparented
415 from Whitby (4) to Church Street (26); `notes_private` flag
cleared. Follow-up note in reextraction-audit-notes.md updated to
reflect resolution.

## Record 187

"Summary conviction of William Ainger for lodging in a barn with no
visible means of subsistence and not giving a good account of himself.
Offence committed at the township of Barnby on 19 February 1845. Case
heard at Whitby" -- no home stated, correctly blank. Barnby nests
under Lythe (107), matching stated township. Court=Whitby. Crime
type=vagrancy matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-187 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (now resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed.**

## Record 188

"Summary conviction of Richard Eison for frequenting an enclosed yard
adjoining a highway for the purposes of committing a felony. Offence
committed at the township of Lythe on 23 April 1857. Case heard at
Whitby" -- no home stated, correctly blank. Location of offence=Lythe,
court=Whitby. Crime type=loitering/suspected person matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-188 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed.**

## Record 189

"Summary conviction of William Hansill of the township of Danby for
using one seven-pound defective weight and one two-pound defective
weight. Offence committed at Whitby on 29 August 1818. Case heard at
Whitby at a Petty Sessions for the division of Whitby Strand" -- home=
Danby, sex=male match. Location/court/petty sessional division match.
Crime type=false weights or measures matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-189 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed.**

## Record 190

"Summary conviction of Jonathan Sanders of the township of Whitby for
having a false quarter-pound weight in his possession. Offence
committed at Whitby on 2 April 1822. Whitby Strand Petty Sessional
division - case heard at Whitby" -- home=Whitby, sex=male match.
Location/court/petty sessional division match. Crime type=false
weights or measures matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-190 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed.**

## Record 191

"Summary conviction of David Elders of the township of Whitby pilot for
refusing to unmoor the vessel called the Canegrove of Whitby when
directed to do so by William Clark harbour master. Offence committed at
the township of Whitby on 15 April 1839. Case heard in the division of
Whitby Strand" -- Elders: home=Whitby, occupation=pilot, sex=male
match. William Clark: role="official", occupation="harbour master"
(id 176, an established occupation entry) -- initially miswrote this
as "office" in this entry; user caught it and clarified: `office` is
reserved for aristocratic/peerage pedigree only (per the Normanby
precedent), never job titles/police ranks. Verified against the DB
that Clark's row was always correctly stored via person_occupation,
not office -- no actual data error, just my own wording. Same wording
slip found and corrected in records 7/39/148 (Dobson, Barker) -- all
verified as correctly stored occupations, no DB fixes needed there
either. Rule clarified in audit-rulebook.md. Ship name "Canegrove" is
descriptive detail within the charge, not a separate entity to capture
-- consistent with existing occupation precedent where ship names
appear inline (e.g. "master of the fishing boat Thomas and William").
Location/court/petty sessional division match. Crime type=maritime
offence matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-191 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed. Wording correction: "office" vs
"occupation" mix-up found and fixed in 5 log entries (7, 39, 136, 137,
148, 168, 191) -- no actual DB errors, only my own descriptive wording;
rule clarified in audit-rulebook.md (office = aristocratic/peerage
pedigree only).**

## Record 192

"Summary conviction of Edward Binns of the township of Whitby joiner
for assaulting Emma Binns his wife by striking her several times on the
head with great force and violence. Offence committed at the township
of Whitby on 26 February 1845. Division of Whitby Strand - case heard
at Whitby" -- Edward: home=Whitby, occupation=joiner, sex=male match.
Emma: victim, female, no occupation of her own, correct.
person_relationship: Emma "wife" -> Edward, correct direction.
Location/court/petty sessional division match. Crime type=assault
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-192 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed.**

## Record 193

"Summary conviction of Henry Raw of the township of Whitby jeweller for
assaulting Margaret Croft; on the oath of the said Margaret Croft of
the township of Whitby widow. Offence committed at the township of
Whitby on 26 March 1857. Case heard at Whitby" -- Raw: home=Whitby,
occupation=jeweller, sex=male match. Croft: victim, home=Whitby, sex=
female match. [CORRECTED 2026-07-30: this entry originally claimed
"occupation=widow" but that was a misreading of the query output --
Croft actually had NO occupation link at all. Caught during a
corpus-wide check triggered at record 275, which found ~215 similar
gaps across the whole corpus (women whose text states singlewoman/
spinster/widow but it was never linked). Fixed here:
person_occupation link to "widow" (384) added for person 6544,
verified via SELECT. User's decision on the other ~214: fix only as
each is reached in the normal sequence, not as a batch now.]
Location/court=Whitby. Crime type=assault matches. No related_conviction.

**FIXED (corrected retroactively) — 1 missing occupation link added
(widow), after an earlier misreading of this same record.**

---

**Progress: records 1-193 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed.**

## Record 194

"Summary conviction of John Dowson of the township of Whitby for using
an unequal balance or steelyard. Offence committed at Whitby on 29
August 1818. Case heard at Whitby at a Petty Sessions for the division
of Whitby Strand" -- home=Whitby, sex=male match. Location/court/petty
sessional division match. Crime type=false weights or measures matches.
Already cross-checked against record 189 (29 August 1818 batch).

**OK — no changes.**

---

**Progress: records 1-194 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed.**

## Record 195

"Summary conviction of Alexander Willison of the township of Whitby for
having a false half-pound weight in his possession. Offence committed
at Whitby on 28 March 1822. Whitby Strand Petty Sessional division -
case heard at Whitby" -- home=Whitby, sex=male match. Location/court/
petty sessional division match. Crime type=false weights or measures
matches. Already cross-checked against records 175/180/185 (28 March
1822 batch).

**OK — no changes.**

---

**Progress: records 1-195 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed.**

## Record 196

"Summary conviction of John Laray hawker for selling books without a
licence; on the information of Robert Kirby. Offence committed at the
township of Whitby on 7 May 1839. Case heard at Whitby" -- no home
stated for Laray, occupation=hawker, sex=male match. Robert Kirby:
informant, no home/occupation stated, correctly blank. Location/court=
Whitby. Crime type=licensing offence matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-196 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed.**

## Record 197

"Summary conviction of Benjamin Granger of the township of Whitby
mariner for having the charge of the ship called the 'William' and
refusing to take up the anchor when directed by William Clark harbour
master of the port of Whitby. Offence committed at the township of
Whitby on 7 March 1845" -- Granger: home=Whitby, occupation=mariner,
sex=male match. William Clark: own person row (6546), separate from
record 191's Clark (6542) -- correct, no cross-conviction merge, even
though plausibly the same real harbour master. occupation=harbour
master correctly captured (matches the office/occupation clarification
from record 191). No court location stated in this text, correctly
absent. Crime type=maritime offence matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-197 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed.**

## Record 198

"Summary conviction of George Laverick of the township of Whitby
postman for being drunk in possession of a letter addressed to Edmund
Hall of Church Street in Whitby; on the oath of George Lee of the
township of Whitby letter carrier. Offence committed at the parish of
Whitby on 17 April 1857. Case heard at Whitby" -- Laverick: home=
Whitby, occupation=postman, sex=male match. Edmund Hall: role="letter
addressee", home=Church Street, correctly captured. George Lee:
witness, home=Whitby, occupation=letter carrier, correctly captured.
Location/court=Whitby. Crime type=drunkenness matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-198 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed.**

## Record 199

"Summary conviction of Robert Jackson of the township of Ugthorpe for
using an unequal balance or steelyard. Offence committed at Whitby on
29 August 1818. Case heard at Whitby at a Petty Sessions for the
division of Whitby Strand" -- home=Ugthorpe, sex=male match.
Location/court/petty sessional division match. Crime type=false
weights or measures matches. Already cross-checked against 189/194 (29
August 1818 batch).

**OK — no changes.**

---

**Progress: records 1-199 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed.**

## Record 200

"Summary conviction of Alice Welford of the township of Whitby for
having false weights in her possession...Offence committed at Whitby on
27 March 1822. Whitby Strand Petty Sessional division - case heard at
Whitby" -- home=Whitby, sex=female match. Location/court/petty
sessional division match. Crime type=false weights or measures matches.
Already cross-checked against record 155 (27 March 1822 batch).

**OK — no changes.**

---

**Progress: records 1-200 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed.**

## Record 201

"Summary conviction of James Ward of the township of Aislaby for
assaulting Ralph Dowson of the township of Goathland labourer by
striking him on the face with his fist several times. Offence committed
at the township of Aislaby on 8 May 1839. Case heard at Whitby" --
Ward: home=Aislaby, sex=male match. Dowson: victim, home=Goathland,
occupation=labourer, correctly captured. Location/court=Whitby/
Aislaby. Crime type=assault matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-201 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed.**

## Record 202

"Summary conviction of Joseph Misson and William McDerwent for begging.
Offence committed at the township of Ruswarp on 5 April 1845. Case
heard at Whitby" -- two co-defendants, no homes stated, correctly
blank. Location=Ruswarp, court=Whitby. Crime type=begging matches.
related_conviction link to 207 present: "Same defendant and same
offence date -- likely multiple charges from one arrest."

**OK — no changes.**

---

**Progress: records 1-202 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed.**

## Record 203

"Summary conviction of Edward Joy late of the township of Lythe petty
chapman and pedlar for trading without a licence. Offence committed at
the township of Lythe on 15 May 1857. Case heard at Whitby" -- "late
of" convention applied, home=Lythe, occupation="petty chapman and
pedlar" (existing compound-occupation precedent), sex=male match.
Location=Lythe, court=Whitby. Crime type=licensing offence matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-203 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed.**

## Record 204

"Summary conviction of Thomas Thompson of the township of Whitby for
using an unlawful balance or steelyard. Offence committed at Whitby on
29 August 1818. Case heard at Whitby at a Petty Sessions for the
division of Whitby Strand" -- home=Whitby, sex=male match. Location/
court/petty sessional division match. Crime type=false weights or
measures matches. Already cross-checked against 189/194/199 (29 August
1818 batch).

**OK — no changes.**

---

**Progress: records 1-204 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed.**

## Record 205

"Summary conviction of David Watson of Whitby hatter for breaking three
squares of glass value 5s in the window of Elen Stirling's house.
Offence committed at Whitby at midnight on Saturday 15 June 1822" --
Watson: home=Whitby, occupation=hatter, sex=male match. Elen Stirling:
role="owner of damaged property", sex=female (unambiguous), no
home/occupation stated, correct. Day-of-week ("Saturday") and
offence_time ("midnight") both correctly preserved. Crime type=
malicious/property damage matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-205 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed.**

## Record 206

"Summary conviction of William Pearson apprentice to William Burn of
the township of Whitby cabinet maker for absenting himself without
leave for three days. Offence committed on 3 June 1839. Case heard at
Whitby" -- this is one of the records affected by the record-181
relationship fix; confirmed the redundant reverse row is gone, only
"apprentice" -> Burn remains. **FIXED**: William Burn's role was
"unspecified" instead of "master" -- inconsistent with records 157/
178/181's established role convention for the same functional
relationship (apprentice's master). `UPDATE summary_conviction_person
SET role='master' WHERE id=6551;` Verified via SELECT. Home=Whitby,
occupation=cabinet maker, correctly attached to Burn. Crime type=master
and servant offence matches. No related_conviction check needed
separately (no offence_date stated beyond the day).

**FIXED — 1 role correction (unspecified -> master).**

---

**Progress: records 1-206 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed, 1 role correction.**

## Record 207

"Summary conviction of Joseph Misson and William McDerwent for begging.
Offence committed at the township of Ruswarp on 5 April 1845. Case
heard at Whitby" -- same text as record 202, own person rows (217/218),
correct no-cross-conviction merge. Crime type=begging matches.
related_conviction link to 202 already confirmed present.

**OK — no changes.**

---

**Progress: records 1-207 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed, 1 role correction.**

## Record 208

"Summary conviction of William Gash and Sidement Gardiner, both of the
township of Hinderwell miners, for threatening Michael Hodgson and
William Gazzard, miners employed by William Henry Palmer, and forcing
them to leave his employment; on the oath of Joseph Fairley of the
township of Hinderwell miner. Offence committed at the township of
Hinderwell on 27 May 1857. Case heard at Whitby" -- Gash and Gardiner:
co-defendants, home=Hinderwell, occupation=miner. Hodgson and Gazzard:
victims, occupation=miner. William Henry Palmer: employer, correctly
captured. Joseph Fairley: informant, home=Hinderwell, occupation=miner.
Location/court match. Crime type=breach of the peace matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-208 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed, 1 role correction.**

## Record 209

"Summary conviction of John Potts of the township of Whitby for using
one three-and-a-half-pound weight, a one-pound weight, a half-pound
weight, and a half-ounce weight that were all defective. Offence
committed at Whitby on 29 August 1818. Case heard at Whitby at a Petty
Sessions for the division of Whitby Strand" -- home=Whitby, sex=male
match. Location/court/petty sessional division match. Crime type=false
weights or measures matches. Already cross-checked against 189/194/
199/204 (29 August 1818 batch).

**OK — no changes.**

---

**Progress: records 1-209 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed, 1 role correction.**

## Record 210

"Summary conviction of Caral otherwise Charles Anderson for obtaining
money and clothes from Lars Kiersta of Whitby tailor by falsely
pretending to be a shipwrecked sailor. Offence committed at the
township of Whitby on 18 February 1824" -- "Caral otherwise Charles
Anderson" correctly captured as first_name="Caral", alias="Charles
Anderson" -- a genuine alias (contrast with the impersonation pattern,
"traded under the name of X", which gets its own separate person row
instead). Lars Kiersta: victim, home=Whitby, occupation=tailor,
correctly captured. Crime type=fraud/false pretences matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-210 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed, 1 role correction.**

## Record 211

"Summary conviction of Isaac Leadley Tose apprentice to William Burn of
the township of Whitby cabinet maker for absenting himself without
leave for three days. Offence committed on 3 June 1839. Case heard at
Whitby" -- one of the records affected by the record-181 relationship
fix; confirmed only "apprentice" -> Burn remains. Raised to the user:
Burn's role here was "employer" (a third variant, after 206's
"unspecified"), asked whether to normalize apprentice-master role
labels broadly or case-by-case. User's answer: case by case, master
usually correct -- saved as standing guidance. Evaluated this specific
case: same master (William Burn, different person row per no-merge),
same relationship type, near-identical text to already-fixed record
206 -- clearly supports "master" too. **FIXED**:
`UPDATE summary_conviction_person SET role='master' WHERE id=6557;`
Verified via SELECT. Occupation=apprentice cabinet maker (Tose),
cabinet maker (Burn, correctly attached). Crime type=master and
servant offence matches.

**FIXED — 1 role correction (employer -> master).**

---

**Progress: records 1-211 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed, 2 role corrections.**

## Record 212

"Summary conviction of Robert Smith for begging. Offence committed at
the township of Whitby on 28 May 1845. Case heard at Whitby" -- no home
stated, correctly blank. Location/court=Whitby. Crime type=begging
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-212 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed, 2 role corrections.**

## Record 213

"Summary conviction of William O'Grady late of the township of
Hinderwell labourer for assaulting Philip Pigg; on the oath of the said
Philip Pigg of the township of Hinderwell police constable. Offence
committed at the township of Hinderwell on 1 June 1857. Case heard at
Whitby" -- "late of" convention applied, home=Hinderwell, occupation=
labourer, sex=male match. Philip Pigg: victim, home=Hinderwell,
occupation=police constable, correctly captured. Location/court match.
Crime type=assaulting a police officer matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-213 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed, 2 role corrections.**

## Record 214

"Summary conviction of James Horsebrough of the township of Newholm cum
Dunsley for using an unequal balance or steelyard. Offence committed at
Whitby on 29 August 1818. Case heard at Whitby at a Petty Sessions for
the division of Whitby Strand" -- home=Newholm-cum-Dunsley, sex=male
match. Location/court/petty sessional division match. Crime type=false
weights or measures matches. Already cross-checked against 189/194/
199/204/209 (29 August 1818 batch).

**OK — no changes.**

---

**Progress: records 1-214 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed, 2 role corrections.**

## Record 215

"Summary conviction of George Wright, John Dring, Thomas Easton, George
Hardy, Daniel Johnson and John Turnbull for playing marbles on a
Sunday. Offence committed at the dock end in the parish of Whitby on 1
February 1824" -- six co-defendants, no homes stated, correctly blank.
Dock End (76) nests under East Cliff -> Whitby, matching stated parish.
No court location stated in text, correctly absent. Crime
type=sabbath breaking matches. No related_conviction (all six on this
one record).

**OK — no changes.**

---

**Progress: records 1-215 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed, 2 role corrections.**

## Record 216

"Summary conviction of George Bolton for being drunk; on the
information of Thomas Linskill of the township of Whitby policeman.
Offence committed at the township of Whitby on 2 June 1839. Case heard
at Whitby" -- no home stated for Bolton, correctly blank. Thomas
Linskill: informant, home=Whitby, occupation=policeman, correctly
captured. Location/court=Whitby. Crime type=drunkenness matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-216 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed, 2 role corrections.**

## Record 217

"Summary conviction of Elizabeth Wilson for begging. Offence committed
at the township of Ruswarp on 28 June 1842. Case heard at Whitby" -- no
home stated, sex=female match. Location=Ruswarp, court=Whitby. Crime
type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-217 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed, 2 role corrections.**

## Record 218

"Summary conviction of William Seymour of the township of Hinderwell
Innkeeper for opening his house for the sale of fermented liquors
before 6 p.m.; on the information and oath of Philip Pigg of the
township of Hinderwell police constable. Offence committed at the
township of Hinderwell on 31 May 1857. Case heard at Whitby" --
Seymour: home=Hinderwell, occupation=innkeeper, sex=male match. Philip
Pigg: own person row, separate from record 213's (correct, no cross-
conviction merge). Location/court match. Crime type=licensing offence
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-218 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed, 2 role corrections.**

## Record 219

"Summary conviction of John McGloin of the township of Whitby common
lodging house keeper for not thoroughly cleansing the bedding and bed
covers in use in his lodging house. Offence committed at the township
of Whitby on 20 December 1869. Whitby Strand - case heard at Whitby" --
home=Whitby, occupation=common lodging house keeper, sex=male match.
Location/court=Whitby. Crime type=public health offence matches. [Corrected
2026-07-30, retroactively, at record 270: same offence date and
identical charge wording as record 270 (John Taylor) -- related_
conviction link created when this pattern became visible at 270.]

**OK — no changes (related_conviction corrected retroactively, see
record 270).**

---

**Progress: records 1-219 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed, 2 role corrections.**

## Record 220

"Summary conviction of Cuthbert Wray of the township of Whitby
fruiterer for being the owner of a horse found straying on the Whitby
and Hawsker highway. Offence committed at the township of Whitby on 11
October 1876. Whitby Strand - case heard at Whitby" -- home=Whitby,
occupation=fruiterer, sex=male match. Cross-parish highway alongside
Whitby. Court/petty sessional division match. Crime type=straying
animals matches. **RESOLVES the flag from record 129**: same date,
road, and charge wording as 129, different defendant, no link existed
-- created it. `INSERT INTO related_conviction ... VALUES (129, 220,
...)`. Verified via SELECT.

**FIXED — 1 new related_conviction link created.**

---

**Progress: records 1-220 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed, 2 role corrections.**

## Record 221

"Summary conviction of John Fordney of the township of Hawsker cum
Stainsacre labourer for lodging in a field without any visible means of
subsistence and not giving a good account of himself. Offence committed
at the township of Hawsker cum Stainsacre on 29 June 1889. Whitby
Strand Petty Sessional division - case heard at Whitby" -- home=
Hawsker-cum-Stainsacre, occupation=labourer, sex=male match.
Location/court/petty sessional division match. Crime type=vagrancy
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-221 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed, 2 role corrections.**

## Record 222

"Summary conviction of Edward Turner of the township of Whitby for
using a half-stone weight and a quarter-stone weight, which were both
defective. Offence committed at Whitby on 29 August 1818. Case heard at
Whitby at a Petty Sessions for the division of Whitby Strand" -- home=
Whitby, sex=male match. Own person row, distinct from record 161's
Edward Turner (different date/context, correct no-merge). Location/
court/petty sessional division match. Crime type=false weights or
measures matches. Already cross-checked against 189/194/199/204/209/
214 (29 August 1818 batch).

**OK — no changes.**

---

**Progress: records 1-222 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed, 2 role corrections.**

## Record 223

"Summary conviction of George Lockey of the township of Whitby for
being drunk; on the information of William Wilkinson of the township of
Whitby" -- home=Whitby, sex=male match. William Wilkinson: informant,
home=Whitby, correctly captured. No offence_date stated in text at all,
correctly blank. Crime type=drunkenness matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-223 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed, 2 role corrections.**

## Record 224

"Summary conviction of William Bell, William Winspear and Joseph
Messenger for trespassing with three greyhounds in the daytime in
search of game on the lands of Robert Carey Elwes esquire. Offence
committed in the township of Egton on 28 September 1833. Case heard at
Whitby" -- three co-defendants, no homes stated, correctly blank.
Robert Carey Elwes: landowner, title correctly left blank -- checked
against corpus-wide precedent (24 records mention "esquire", vocabulary
only has "Sir"/"Bailiff") and the reextraction-audit-notes.md postmortem
confirming "esquire" was already resolved earlier in the audit as
deliberately not captured (not a title/occupation in the schema's
sense). Location=Egton, court=Whitby. Crime type=poaching matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-224 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed, 2 role corrections.**

## Record 225

"Summary conviction of Patrick Caulder Cawney of the city of Limerick
coachmaker for assaulting William Wilkinson of the township of Whitby
police officer by striking him on the head with his hands and kicking
him on the body with his feet. Offence committed at the township of
Egton on 1 July 1842. Case heard at Whitby" -- middle name Caulder,
home=Limerick (distant top-level location, correctly captured),
occupation=coachmaker, sex=male match. William Wilkinson: victim, home=
Whitby, occupation=police officer, own person row (separate from
record 223's Wilkinson, correct no-merge). Location=Egton, court=
Whitby. Crime type=assaulting a police officer matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-225 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed, 2 role corrections.**

## Record 226

"Summary conviction of Jane Thompson of the township of Whitby widow
for assaulting Ellen Moore; on the oath of the said Ellen Moore wife of
Joseph Moore of the township of Whitby widow [sic] Offence committed at
the township of Whitby on 31 May 1857. Case heard at Whitby" -- Jane:
home=Whitby, occupation=widow, sex=female match. Ellen Moore: victim,
occupation=widow (as stated), home=Whitby. Joseph Moore: "spouse of
victim", person_relationship: Ellen "wife" -> Joseph, correct
direction. **FIXED**: no anomalies note existed for the source's own
"[sic]" flag on the "wife...widow" contradiction (Ellen described as
both) -- added one, matching the established archival-oddity pattern.
Location/court=Whitby. Crime type=assault matches. No
related_conviction.

**FIXED — 1 missing anomalies note added.**

---

**Progress: records 1-226 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 2 anomalies notes, 4
redundant relationship rows removed, 2 role corrections.**

## Record 227

"Summary conviction of George Hoggarth of the township of Whitby
carpenter for being drunk. Offence committed at the township of
Ruswarp on 17 December 1869. Whitby Strand - case heard at Whitby" --
home=Whitby, occupation=carpenter, sex=male match. Location=Ruswarp
(differs from home, as stated), court=Whitby. Crime type=drunkenness
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-227 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 2 anomalies notes, 4
redundant relationship rows removed, 2 role corrections.**

## Record 228

"Summary conviction of John Watson Liddell of the township of Whitby
cartman for being drunk and disorderly on the Pier. Offence committed
at the township of Whitby on 14 December 1876. Whitby Strand - case
heard at Whitby" -- middle name Watson correctly captured, home=
Whitby, occupation=cartman, sex=male match. "the Pier" resolves to
"Piers" (104) nested under Seafront -> Whitby, matching stated
township. Court/petty sessional division match. Crime type=drunk and
disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-228 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 2 anomalies notes, 4
redundant relationship rows removed, 2 role corrections.**

## Record 229

"Summary conviction of John Pearson of the township of Whitby labourer
for assaulting Richard Cockerill. Offence committed at the township of
Whitby on 30 August 1889. Whitby Strand Petty Sessional division - case
heard at Whitby" -- home=Whitby, occupation=labourer, sex=male match.
Richard Cockerill: victim, correctly captured. Location/court/petty
sessional division match. Crime type=assault matches.
related_conviction link to 694 present (same defendant/date pattern),
matching what was seen in this conversation's very first related_
conviction sample query.

**OK — no changes.**

---

**Progress: records 1-229 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 2 anomalies notes, 4
redundant relationship rows removed, 2 role corrections.**

## Record 230

"Summary conviction of Francis Burnard of the township of Whitby for
using an unequal balance or scale beam. Offence committed at Whitby on
29 August 1818. Case heard at Whitby at a Petty Sessions for the
division of Whitby Strand" -- home=Whitby, sex=male ("Francis"
spelling) match. Location/court/petty sessional division match. Crime
type=false weights or measures matches. Already cross-checked against
the 29 August 1818 batch (189/194/199/204/209/214/222).

**OK — no changes.**

---

**Progress: records 1-230 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 2 anomalies notes, 4
redundant relationship rows removed, 2 role corrections.**

## Record 231

"Summary conviction of Neal Devers, Hugh Gallorhu and William Stevenson
for vagrancy and acting as pedlars without a licence. Offence committed
at the township of Whitby on 10 June 1824" -- three co-defendants, no
homes stated, correctly blank. Both crime types (vagrancy, licensing
offence) correctly captured, matching the dual charge. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-231 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 2 anomalies notes, 4
redundant relationship rows removed, 2 role corrections.**

## Record 232

"Summary conviction of Charles Goldsmith for assaulting William Lynass
of [Whitby] grocer. Offence committed at Whitby on the evening of
Sunday 19 January 1834. Whitby Strand division - case heard at Whitby"
-- Goldsmith: no home stated, correctly blank. William Lynass: victim,
home=Whitby (the editorially-bracketed "[Whitby]" correctly captured as
his home), occupation=grocer. Day-of-week ("Sunday") and offence_time
("evening") both preserved. Crime type=assault matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-232 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 2 anomalies notes, 4
redundant relationship rows removed, 2 role corrections.**

## Record 233

"Summary conviction of William Foxton for lodging in the open air with
no visible means of subsistence and not giving a good account of
himself. Offence committed at the township of Hinderwell on 7 July
1842. Case heard at Whitby" -- no home stated, correctly blank.
Location=Hinderwell, court=Whitby. Crime type=vagrancy matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-233 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 2 anomalies notes, 4
redundant relationship rows removed, 2 role corrections.**

## Record 234

"Summary conviction of Catherine Brown wife of George Brown late of the
township of Whitby labourer for using obscene and indecent language in
Flowergate; on the oath of Robert Nickson of the township of Whitby
constable. Offence committed at the township of Whitby on 14 June 1857.
Case heard at Whitby" -- Catherine: defendant, female, no occupation of
her own (correct, labourer belongs to George). George Brown: "husband
of defendant", "late of" home=Whitby, occupation=labourer, correctly
attached. person_relationship: Catherine "wife" -> George, correct
direction. Robert Nickson: informant, home=Whitby, occupation=
constable. Flowergate -> West Cliff -> Whitby reaches stated township.
Crime type=using obscene language matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-234 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 2 anomalies notes, 4
redundant relationship rows removed, 2 role corrections.**

## Record 235

"Summary conviction of John Jones of the township of Whitby coal porter
for being drunk and riotous in Baxtergate. Offence committed at the
township of Whitby on 25 December 1869. Whitby Strand - case heard at
Whitby" -- home=Whitby, occupation=coal porter, sex=male match.
Location/court=Whitby. Crime type=drunk and disorderly matches
("drunk and riotous"). No related_conviction.

**OK — no changes.**

---

**Progress: records 1-235 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 2 anomalies notes, 4
redundant relationship rows removed, 2 role corrections.**

## Record 236

"Summary conviction of John Eccles of the township of Whitby sailor for
assaulting Ann Hustler; on the oath of [blank] Smith of the township of
Whitby. Offence committed at the township of Whitby on 20 November
1876. Whitby Strand - case heard at Whitby" -- Eccles: home=Whitby,
occupation=sailor, sex=male match. Ann Hustler: victim, sex=female,
correct. "[blank] Smith": witness, first_name=NULL, home=Whitby,
correctly matches the established blank-first-name convention.
Location/court=Whitby. Crime type=assault matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-236 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 2 anomalies notes, 4
redundant relationship rows removed, 2 role corrections.**

## Record 237

"Summary conviction of John Ward of the township of Egton miner for
playing pitch and toss in Ruswarp town street. Offence committed at the
township of Ruswarp on 7 July 1889. Whitby Strand Petty Sessional
division - case heard at Whitby" -- home=Egton, occupation=miner,
sex=male match. "Ruswarp town street" correctly resolves to Ruswarp
itself, matching stated township. Court/petty sessional division
match. Crime type=gaming/gambling offence matches. related_conviction
link to 254 present: "Same offence date, street, and charge wording,
different defendants -- likely several convictions from one recorded
incident."

**OK — no changes.**

---

**Progress: records 1-237 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 2 anomalies notes, 4
redundant relationship rows removed, 2 role corrections.**

## Record 238

"Summary conviction of Michael Trowsdale of the township of Ellerby for
using an unequal balance or steelyard. Offence committed at Whitby on
29 August 1818. Case heard at Whitby at a Petty Sessions for the
division of Whitby Strand" -- home=Ellerby, correctly showing the fixed
parent (88=Hinderwell) from the record-124 fix. Sex=male match.
Location/court/petty sessional division match. Crime type=false weights
or measures matches. Already cross-checked against the 29 August 1818
batch.

**OK — no changes.**

---

**Progress: records 1-238 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 2 anomalies notes, 4
redundant relationship rows removed, 2 role corrections.**

## Record 239

"Summary conviction of James Smith, James Broughton, Thomas Hart and
Mary Hart for begging; on the information of John Morley of Whitby
constable. Offence committed at the township of Whitby on 3 October
1818" -- four co-defendants, no homes stated, correctly blank. Thomas
Hart and Mary Hart correctly kept as separate people with no fabricated
relationship despite shared surname (text just lists them together, no
relationship stated) -- same principle as the earlier Holmes/Tinley
cases. John Morley: own person row, separate from records 136/140's
Morley (correct no-merge). Location/court=Whitby. Crime type=begging
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-239 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 2 anomalies notes, 4
redundant relationship rows removed, 2 role corrections.**

## Record 240

"Summary conviction of Ann Devers for vagrancy and not giving a good
account of herself. Offence committed at the township of Whitby on 10
June 1824" -- no home stated, sex=female match. Shares surname "Devers"
and exact date with record 231 (Neal Devers, part of a 3-man pedlar
group) -- but the specific charge wording differs ("not giving a good
account of herself" vs "acting as pedlars without a licence"), so this
reads as the same broad vagrancy sweep catching different people with
different specific facts, not one shared incident (same shape as the
truancy/workhouse same-date coincidences) -- correctly unlinked. No
kinship assumed from the shared surname either, per established
precedent. Crime type=vagrancy matches.

**OK — no changes.**

---

**Progress: records 1-240 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 2 anomalies notes, 4
redundant relationship rows removed, 2 role corrections.**

## Record 241

"Summary conviction of Taylor Clemett of Lythe retailer of beer for
selling beer between 10 p.m. and 4 a.m. Offence committed at the
township of Lythe on 8 February 1834. Whitby Strand division - case
heard at Whitby" -- home=Lythe, occupation=retailer of beer, sex=male
match. Location/court/petty sessional division match. Crime
type=licensing offence matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-241 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 2 anomalies notes, 4
redundant relationship rows removed, 2 role corrections.**

## Record 242

"Summary conviction of Charles Bradley and Catherine Bradley for
begging. Offence committed at the township of Whitby on 15 July 1842.
Case heard at Whitby" -- two co-defendants, no homes stated, correctly
blank, sex=male/female. No relationship fabricated despite shared
surname (text doesn't state one). Location/court=Whitby. Crime
type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-242 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 2 anomalies notes, 4
redundant relationship rows removed, 2 role corrections.**

## Record 243

"Summary conviction of John Dillaney of the township of Whitby labourer
for begging. Offence committed at the township of Whitby on 22 October
1859. Case heard at Whitby" -- home=Whitby, occupation=labourer,
sex=male match. Location/court=Whitby. Crime type=begging matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-243 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 2 anomalies notes, 4
redundant relationship rows removed, 2 role corrections.**

## Record 244

"Summary conviction of Henry Smith of the township of Whitby fruiterer
for being drunk and riotous on the Fish Pier. Offence committed at the
township of Whitby on 25 December 1869. Whitby Strand - case heard at
Whitby" -- home=Whitby, occupation=fruiterer, sex=male match. Fish Pier
(68) -> Piers (105) -> Seafront -> Whitby, reaching stated township.
Court/petty sessional division match. Crime type=drunk and disorderly
matches. Same date as record 235 but different specific location/
defendant -- no related_conviction, correctly unrelated.

**OK — no changes.**

---

**Progress: records 1-244 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 2 anomalies notes, 4
redundant relationship rows removed, 2 role corrections.**

## Record 245

"Summary conviction of Peter Gorley of the township of Whitby jet
worker for being drunk and disorderly in St Ann's Staith. Offence
committed at the township of Whitby on 31 October 1876. Whitby Strand -
case heard at Whitby[Dated November on dorse]" -- home=Whitby,
occupation=jet worker, sex=male match. St Ann's Staith -> West Cliff ->
Whitby reaches stated township. Court/petty sessional division match.
**FIXED**: no anomalies note existed for the "[Dated November on
dorse]" archival annotation -- this is one of the 24 "dated X but
endorsed Y" cases noted in reextraction-audit-notes.md as
documentational, worth noting whenever convenient. Added. Verified via
SELECT. Crime type=drunk and disorderly matches. No related_conviction.

**FIXED — 1 missing anomalies note added.**

---

**Progress: records 1-245 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections.**

## Record 246

"Summary conviction of Annie Booth of the township of Fylingdales
singlewoman for assaulting Emma Coates. Offence committed at the
township of Fylingdales on 16 July 1889. Whitby Strand Petty Sessional
division - case heard at Whitby" -- home=Fylingdales, sex=female match.
**FIXED**: no occupation was linked at all despite the text stating
"singlewoman" (established marital-status-as-occupation precedent, id
337). `INSERT INTO person_occupation (person_id, occupation_id) VALUES
(271, 337);` Verified via SELECT. Emma Coates: victim, correctly
captured. Location/court/petty sessional division match. Crime
type=assault matches. No related_conviction.

**FIXED — 1 missing occupation link added.**

---

**Progress: records 1-246 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 247

"Summary conviction of Margaret Bretton, Isabella Bretton, Margaret
Bretton junior and Rebecca Robinson for going door-to-door as petty
chapmen without being licensed; on the information of John Morley of
Whitby constable. Offence committed at the township of Whitby on 3
October 1818" -- four co-defendants, no homes stated, correctly blank.
"Margaret Bretton junior" correctly captured with name_postfix="junior"
(274), distinct person row from the first Margaret Bretton (272). John
Morley: own person row, separate from 136/140/239's Morley rows.
Location/court=Whitby. Crime type=licensing offence matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-247 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 248

"Summary conviction of Robert Kirby, Lucy Kirby, Mary Ann Kirby and
Harriett Kirby for vagrancy and acting as pedlars without a licence.
Offence committed at the township of Whitby on 10 June 1824" -- four
co-defendants, all Kirby surname, no homes stated, no relationship
fabricated (text doesn't state one, even though plausibly a family
group). Both crime types (vagrancy, licensing offence) match. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-248 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 249

"Summary conviction of James Toms late of the township of Whitby hawker
for selling pots without a licence; on the information of Robert Kirby
of Whitby sub-distributor of stamps. The offence was committed at the
township of Fylingdales on 14 February 1834. Case heard at Whitby" --
"late of" convention applied, home=Whitby, occupation=hawker, sex=male
match. Robert Kirby: informant, own person row (separate from
records 196/248's Kirby rows, correct no-merge), occupation=sub-
distributor of stamps. Location=Fylingdales (differs from home, as
stated), court=Whitby. Crime type=licensing offence matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-249 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 250

"Summary conviction of David Storrey of the township of Whitby
blacksmith for assaulting Elizabeth Trueman wife of Charles Trueman of
the township of Whitby mariner by striking her on the face and body
with his hands. Offence committed at the township of Whitby on 19 July
1842. Case heard at Whitby" -- Storrey: home=Whitby, occupation=
blacksmith, sex=male match. Elizabeth: victim, no occupation of her
own, correct. Charles Trueman: "spouse of victim", home=Whitby,
occupation=mariner, correctly attached. person_relationship: Elizabeth
"wife" -> Charles, correct direction. Location/court=Whitby. Crime
type=assault matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-250 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 251

"Summary conviction of Thomas Pattison alehouse keeper for opening his
premises for the sale of beer before 12.30 p.m. on a Sunday. Offence
committed at the township of Ruswarp at 11.35 a.m. on 23 October 1859.
Case heard at Whitby" -- no home stated, occupation=alehouse keeper,
sex=male match. offence_time="11.35 a.m." correctly captured.
Location=Ruswarp, court=Whitby. Crime type=licensing offence matches.
No related_conviction.

**OK — no changes.**

---

**Progress: records 1-251 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 252

"Summary conviction of John Bakehouse of the township of Whitby jet
worker for being drunk on the licensed premises of Sovina Short and
refusing to leave when asked by Thomas Ridley a constable of the North
Riding. Offence committed at the township of Whitby on 24 December
1869. Whitby Strand - case heard at Whitby" -- Bakehouse: home=Whitby,
occupation=jet worker, sex=male match. Sovina Short: licensee, sex=
female (unambiguous given name), occupation=licensee. Thomas Ridley:
informant, occupation="constable of the North Riding". Location/court=
Whitby. Crime types=drunkenness, refusal to quit licensed premises
match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-252 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 253

"Summary conviction of Andrew Cobbing for begging in Glaisdale town
street. Offence committed at the township of Glaisdale on 21 November
1876. Whitby Strand - case heard at Whitby" -- no home stated,
correctly blank. "Glaisdale town street" resolves to Glaisdale itself,
matching stated township. Court/petty sessional division match. Crime
type=begging matches. related_conviction: full triangle confirmed
(123-127, 123-253, 127-253) -- resolves the flag raised at record 123.

**OK — no changes.**

---

**Progress: records 1-253 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 254

"Summary conviction of George Raw of the township of Ruswarp cartman
for playing pitch and toss in Ruswarp town street. Offence committed at
the township of Ruswarp on 7 July 1889. Whitby Strand Petty Sessional
division - case heard at Whitby" -- home=Ruswarp, occupation=cartman,
sex=male match. "Ruswarp town street" resolves to Ruswarp itself.
Court/petty sessional division match. Crime type=gaming/gambling
offence matches. related_conviction link to 237 confirmed present --
resolves the flag from record 237.

**OK — no changes.**

---

**Progress: records 1-254 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 255

"Summary conviction of Ralph Coulson for laying dung and filth in an
open alley. Offence committed at the town of Whitby on 27 May 1824" --
no home stated, correctly blank. Crime type=public nuisance matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-255 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 256

"Summary conviction of John Hodgson late of the township of Whitby
hawker for selling tea trays without a licence; on the information of
Robert Kirby of Whitby sub-distributor of stamps. Offence committed at
the township of Fylingdales on 14 February 1834. Case heard at Whitby"
-- "late of" convention applied, home=Whitby, occupation=hawker,
sex=male match. Robert Kirby: informant, own person row (separate from
record 249's), occupation=sub-distributor of stamps. **FIXED**: same
informant, date, and offence township as record 249 (selling pots
without a licence) -- matching the established "same official, one
enforcement sweep" pattern from the railway case (137/141/146), no link
existed. Created it. Verified via SELECT. Location=Fylingdales,
court=Whitby. Crime type=licensing offence matches.

**FIXED — 1 new related_conviction link created.**

---

**Progress: records 1-256 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 27 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 257

"Summary conviction of Thomas Barrick of the township of Whitby a
labourer for being drunk whilst being maintained in Whitby Union
workhouse Offence committed at Whitby workhouse on 21 July 1842. Case
heard at Whitby" -- home=Whitby, occupation=labourer, sex=male match.
Union Workhouse correctly linked to the established node (81, Green
Lane). Court=Whitby. Crime type=drunkenness matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-257 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 27 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 258

"Summary conviction of John Ryan of the township of Whitby tailor for
assaulting John Clemmett; on the oath of the said John Clemmett of the
township of Hawsker cum Stainsacre labourer. Offence committed at the
township of Whitby on 3 November 1859. Case heard at Whitby" -- Ryan:
home=Whitby, occupation=tailor, sex=male match. Clemmett: victim, home=
Hawsker-cum-Stainsacre, occupation=labourer, correctly captured.
Location/court=Whitby. Crime type=assault matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-258 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 27 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 259

"Summary conviction of William Brunton of Lealholm Bridge butcher for
having a one-pound weight that was four drams short on his stall in the
market place. Offence committed at Whitby on 26 June 1824. Whitby
Strand Petty Sessional division- case heard at Whitby" -- home=
Lealholm Bridge, occupation=butcher, sex=male match. **FIXED**: no
location link existed for "the market place" -- raised to the user
(same style question as Butchers Arms), confirmed: link to the
existing Market Place node (30, East Cliff). `INSERT INTO
summary_conviction_location (summary_conviction_id, location_id, role)
VALUES (259, 30, 'location of offence');` Verified via SELECT. Rule
documented in audit-rulebook.md for the other pending case (record
266). Court/petty sessional division match. Crime type=false weights
or measures matches. No related_conviction.

**FIXED — 1 new location link added.**

---

**Progress: records 1-259 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 4 location fixes (resolved), 27 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 260

"Summary conviction of William Hobson of Whitby hawker and pedlar for
selling spectacles without a licence; on the information of Robert
Kirby of Whitby sub-distributor of stamps. Offence committed at the
township of Whitby on 1 March 1834. Case heard at Whitby" -- home=
Whitby, occupation="hawker and pedlar" (compound-occupation precedent),
sex=male match. Robert Kirby: own person row, different date from the
249/256 pair -- correctly a separate enforcement action, no link
needed. Crime type=licensing offence matches.

**OK — no changes.**

---

**Progress: records 1-260 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 4 location fixes (resolved), 27 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 261

"Summary conviction of John Jackson for attempting to gather alms by
exposing wounds and other deformities. Offence committed at the
township of Ruswarp on 24 July 1842. Whitby Strand division - case
heard at Whitby" -- no home stated, correctly blank. Location=Ruswarp,
court=Whitby, petty sessional division correctly resolved. Crime
type=vagrancy matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-261 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 4 location fixes (resolved), 27 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 262

"Summary conviction of John Watson for taking a blanket that was
wreck-washed from a ship called the 'Dilligence' of the port of
Whitby, stranded and wrecked on the seashore. Offence committed at the
parish of Whitby on 30 October 1859. Case heard at Whitby" -- no home
stated, correctly blank. Ship name "Dilligence" correctly treated as
descriptive detail, not a separate entity. Location/court=Whitby. Crime
type=theft matches. [Corrected 2026-07-30, retroactively, at record
269: this record is part of a 4-person wreck-scavenging cluster (262,
269, 276, 283), all taking different items from the same wrecked ship
on the same date -- related_conviction links to all three now exist,
created when the full cluster became visible at record 269.]

**OK — no changes (related_conviction corrected retroactively, see
record 269).**

---

**Progress: records 1-262 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 4 location fixes (resolved), 27 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 263

"Summary conviction of James Filburn of the township of Ruswarp jet
worker for being drunk. Offence committed at the township of Whitby on
25 December 1869. Whitby Strand - case heard at Whitby" -- home=
Ruswarp, occupation=jet worker, sex=male match. Location/court=Whitby.
Crime type=drunkenness matches. Same date as records 235/244 -- no
shared party, correctly unrelated.

**OK — no changes.**

---

**Progress: records 1-263 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 4 location fixes (resolved), 27 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 264

"Summary conviction of Thomas Howard of the township of Whitby
fisherman for assaulting Mary Jane Howard. Offence committed at the
township of Whitby on 29 October 1876. Whitby Strand - case heard at
Whitby" -- Thomas: home=Whitby, occupation=fisherman, sex=male match.
Mary Jane: victim, middle name Jane correctly captured, no relationship
fabricated despite shared surname (text doesn't state one). Location/
court=Whitby. Crime type=assault matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-264 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 4 location fixes (resolved), 27 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 265

"Summary conviction of Mary Pritchard wife of Thomas Pritchard of the
township of Ruswarp pedlar for being drunk and disorderly in St
Hilda's Terrace. Offence committed at the township of Ruswarp on 20
June 1889. Whitby Strand Petty Sessional division - case heard at
Whitby" -- Mary: defendant, female, no occupation of her own. Thomas:
"spouse of offender", home=Ruswarp, occupation=pedlar, correctly
attached. person_relationship: Mary "wife" -> Thomas, correct
direction. St Hilda's Terrace nests under West Cliff, same cliff-
boundary pattern as records 32/53, correctly alongside Ruswarp.
Court/petty sessional division match. Crime type=drunk and disorderly
matches. related_conviction link to 304 present -- noting for
verification when reaching that record.

**OK — no changes.**

---

**Progress: records 1-265 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 4 location fixes (resolved), 27 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 266

"Summary conviction of John Pickering of Saltersgate butcher for having
a one-stone weight that was one and a half ounces short on his stall in
the market place. Offence committed at Whitby on 25 June 1824. Whitby
Strand Petty Sessional division- case heard at Whitby" -- home=
Saltersgate, occupation=butcher, sex=male match. **FIXED**: same "his
stall in the market place" gap as record 259, resolved with the same
Market Place link (30, East Cliff), per the user's earlier confirmation.
Verified via SELECT. Court/petty sessional division match. Crime
type=false weights or measures matches. No related_conviction.

**FIXED — 1 new location link added.**

---

**Progress: records 1-266 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 5 location fixes (resolved), 27 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 267

"Summary conviction of Joseph Thompson of Sheffield in the West Riding
hawker and pedlar for selling books without a licence; on the
information of Robert Kirby of Whitby sub-distributor of stamps.
Offence committed at the township of Whitby on 22 March 1834. Case
heard at Whitby" -- home=Sheffield (distant top-level location,
correctly captured), occupation="hawker and pedlar", sex=male match.
Robert Kirby: own person row, different date from prior Kirby records,
correctly unlinked. Crime type=licensing offence matches.

**OK — no changes.**

---

**Progress: records 1-267 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 5 location fixes (resolved), 27 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 268

"Summary conviction of Joseph Nunn of the township of Whitby mariner
for frequenting the river Esk and the avenues leading there with intent
to commit felony. Offence committed at the township of Whitby on 24
July 1842. Case heard at Whitby" -- home=Whitby, occupation=mariner,
sex=male match. River Esk (398) already correctly linked alongside
stated Whitby township. Crime type=loitering/suspected person matches.
No related_conviction.

**OK — no changes.**

---

**Progress: records 1-268 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 5 location fixes (resolved), 27 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 269

"Summary conviction of George Watson for taking a pair of man's drawers
value 3s that were wreck-washed from a ship called the 'Dilligence' of
the port of Whitby, stranded and wrecked on the seashore. Offence
committed at the parish of Whitby on 30 October 1859. Case heard at
Whitby" -- no home stated, correctly blank. **FIXED**: same-date check
found 4 people (262 John Watson, 269 George Watson, 276 Jane Stangway,
283 William Lill) all taking different items from the same wrecked
ship "Dilligence" on the same date -- clearly one shared wreck-
scavenging incident, no related_conviction links existed at all.
Created all 6 pairwise links matching the established all-pairs
precedent. Verified via SELECT. **Note**: this also retroactively
corrects record 262's earlier "no related_conviction" verdict --
noted here since 262 was checked before this cluster was fully visible
(276/283 hadn't been reached/fetched yet at that point). Crime
type=theft matches.

**FIXED — 6 new related_conviction links created (retroactively also
resolves record 262).**

---

**Progress: records 1-269 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 5 location fixes (resolved), 33 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 270

"Summary conviction of John Taylor of the township of Whitby common
lodging house keeper for not thoroughly cleansing the bedding and bed
covers in use in his lodging house. Offence committed at the township
of Whitby on 20 December 1869. Whitby Strand - case heard at Whitby" --
home=Whitby, occupation=common lodging house keeper, sex=male match.
**FIXED**: identical charge wording and exact same date as record 219
(John McGloin) -- a health inspection sweep catching two lodging house
keepers, no link existed. Created it. Verified via SELECT. Location/
court=Whitby. Crime type=public health offence matches.

**FIXED — 1 new related_conviction link created (retroactively also
resolves record 219).**

---

**Progress: records 1-270 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 5 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 271

"Summary conviction of James Winspear of the township of Whitby
fisherman for being drunk on the licensed premises of William
Dowthwaite and refusing to leave when asked by Thomas Merryweather a
police constable. Offence committed at the township of Whitby on 2
October 1876. Whitby Strand - case heard at Whitby" -- Winspear: home=
Whitby, occupation=fisherman, sex=male match. Dowthwaite: licensee.
Merryweather: informant, occupation=police constable. Location/court=
Whitby. Crime types=drunkenness, refusal to quit licensed premises
match. No same-date records, no related_conviction.

**OK — no changes.**

---

**Progress: records 1-271 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 5 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 272

"Summary conviction of John Midgeley of the township of Hinderwell
fisherman for being drunk on the licensed premises of Robert Ashworth.
Offence committed at the township of Hinderwell on 10 June 1889. Whitby
Strand Petty Sessional division - case heard at Whitby" -- home=
Hinderwell, occupation=fisherman, sex=male match. Ashworth: licensee.
Location/court/petty sessional division match. Crime type=drunkenness
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-272 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 5 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 273

"Summary conviction of Thomas Anderson of the township of Ruswarp for
having in his mill a four-stone weight that was three ounces short,
another four-stone weight that was an ounce and a half short, and a
half-stone weight that was six drams short. Offence committed at
Ruswarp on 5 July 1824. Whitby Strand Petty Sessional division- case
heard at Whitby" -- home=Ruswarp, sex=male match. No occupation stated
in the text (only implied by "his mill" -- "miller" is not literally
stated), correctly left blank per the no-fabrication rule.
Location/court/petty sessional division match. Crime type=false
weights or measures matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-273 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 5 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 274

"Summary conviction of John Brown for begging. Offence committed at
the township of Whitby on 26 April 1833" -- no home stated, correctly
blank. Crime type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-274 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 5 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 275

"Summary conviction of Jeremiah Eskdale of the township of Whitby block
and mast maker for assaulting Ann Scott of the township of Ruswarp
singlewoman. Offence committed at the township of Whitby on 8 August
1842. Case heard at Whitby" -- Eskdale: home=Whitby, occupation="block
and mast maker" (compound-occupation precedent), sex=male match. Ann
Scott: victim, home=Ruswarp, sex=female match. **FIXED**: no
occupation link existed for Ann Scott despite the text stating
"singlewoman" -- same gap class as record 246, but checking directly
this time (not trusting the wide join) revealed this is a MASSIVE
corpus-wide gap, ~215 records total. Fixed this specific record:
`INSERT INTO person_occupation (person_id, occupation_id) VALUES
(6586, 337);` Verified via SELECT. Immediately flagged the full
corpus-wide finding to the user (see below) rather than continuing
silently. Location/court=Whitby. Crime type=assault matches. No
related_conviction.

**FIXED — 1 missing occupation link added; triggered a corpus-wide
flag (see notes file) for ~215 similar gaps, user decided: fix only as
each is reached in sequence, not as a batch.**

---

**Progress: records 1-275 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 5 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 3 occupation
fixes (246, 275, and retroactively 193).**

## Record 276

"Summary conviction of Jane Stangway for taking a blue Guernsey frock,
a cap and a paint pot that were wreck-washed from a ship called the
'Dilligence' of the port of Whitby, stranded and wrecked on the
seashore. Offence committed at the parish of Whitby on 30 October
1859. Case heard at Whitby" -- no home or occupation stated, correctly
blank (not affected by the marital-status gap -- no such word here).
related_conviction links to 262/269/283 already confirmed present.
Crime type=theft matches.

**OK — no changes.**

---

**Progress: records 1-276 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 5 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 3 occupation
fixes.**

## Record 277

"Summary conviction of George Patton of the township of Hinderwell
fisherman for assaulting George Taylor; on the oath of the said George
Taylor of the township of Hinderwell fisherman. Offence committed at
the township of Hinderwell on 19 December 1869. Whitby Strand - case
heard at Whitby" -- both correctly captured with matching home/
occupation despite sharing occupation type. Location/court match.
Crime type=assault matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-277 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 5 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 3 occupation
fixes.**

## Record 278

"Summary conviction of George Fullock of the township of Whitby
fisherman for being drunk and disorderly in New Quay. Offence committed
at the township of Whitby on 1 October 1876. Whitby Strand - case heard
at Whitby" -- home=Whitby, occupation=fisherman, sex=male match. New
Quay nests under West Cliff -> Whitby, reaching stated township.
Court/petty sessional division match. Crime type=drunk and disorderly
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-278 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 5 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 3 occupation
fixes.**

## Record 279

"Summary conviction of Timothius Marshall of the township of Whitby
iron worker for being drunk and disorderly in Church Street. Offence
committed at the township of Ruswarp on 23 June 1889. Whitby Strand
Petty Sessional division - case heard at Whitby" -- home=Whitby,
occupation=iron worker, sex=male match. **FIXED**: Church Street nests
under East Cliff -> Whitby, not reaching the stated offence township
Ruswarp -- per the established cliff-boundary pattern (records 20, 32,
46, 53, 60, 66, 81, 84, 265), a separate Ruswarp location row should
exist alongside Church Street, but it was missing entirely. `INSERT
INTO summary_conviction_location (summary_conviction_id, location_id,
role) VALUES (279, 94, 'location of offence');` Verified via SELECT.
Court/petty sessional division match. Crime type=drunk and disorderly
matches. No related_conviction.

**FIXED — 1 missing location link added (Ruswarp, cliff-boundary
pattern).**

---

**Progress: records 1-279 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 3 occupation
fixes.**

## Record 280

"Summary conviction of Jane Holland of the township of Robin Hood's
Bay in the parish of Fylingdales widow for having defective balances in
a cellar under her dwelling house. Offence committed at the township of
Robin Hood's Bay on 1 July 1824. Whitby Strand Petty Sessional
division- case heard at Whitby" -- home=Robin Hood's Bay (93) -> Fyling
dales (126), matches. sex=female match. **FIXED**: one of the tracked
marital-status occupation gaps (id 280 on the list from record 275) --
confirmed via dedicated query, no occupation link existed despite
"widow" stated. `INSERT INTO person_occupation (person_id,
occupation_id) VALUES (311, 384);` Verified via SELECT. Court/petty
sessional division match. Crime type=false weights or measures matches.
No related_conviction.

**FIXED — 1 tracked occupation gap resolved (widow).**

---

**Progress: records 1-280 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 4 occupation
fixes.**

## Record 281

"Summary conviction of Samuel Nash for begging. Offence committed at
Whitby on 26 April 1833" -- no home stated, correctly blank. Crime
type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-281 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 4 occupation
fixes.**

## Record 282

"Summary conviction of Joseph Williamson for refusing to maintain
himself and his family, whereby his wife and five children became
chargeable to the township of Fylingdales. Offence committed at the
township of Fylingdales on 3 August 1842. Case heard at Whitby" -- no
home stated, correctly blank. Wife/children not named, correctly no
separate person rows. Location=Fylingdales, court=Whitby. Crime
type=failure to maintain family matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-282 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 4 occupation
fixes.**

## Record 283

"Summary conviction of William Lill for taking a piece of hempen rope,
a rope strap, a lead line, a wooden bucket and two pieces of canvass
sheet from a ship called the Dilligence of the port of Whitby, stranded
and wrecked on the seashore. Offence committed at the parish of Whitby
on 30 October 1859. Case heard at Whitby" -- no home stated, correctly
blank. related_conviction links to 262/269/276 already confirmed
present -- completes the full shipwreck cluster. Crime type=theft
matches.

**OK — no changes.**

---

**Progress: records 1-283 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 4 occupation
fixes.**

## Record 284

"Summary conviction of George Wastill of the township of Whitby jet
worker for obstructing Church Street. Offence committed at the
township of Whitby on 4 October 1869. Whitby Strand - case heard at
Whitby" -- home=Whitby, occupation=jet worker, sex=male match. Church
Street -> East Cliff -> Whitby reaches stated township. Court/petty
sessional division match. Crime type=obstructing the highway matches.
No related_conviction.

**OK — no changes.**

---

**Progress: records 1-284 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 4 occupation
fixes.**

## Record 285

"Summary conviction of Douglas Munroe of the township of Ruswarp
hawker for being drunk on the licensed premises of William Knaggs and
refusing to leave when asked by Andrew Thompson a police constable; on
the oath of Andrew Thompson police constable for the North Riding.
Offence committed at the township of Ruswarp on 22 August 1876. Whitby
Strand - case heard at Whitby" -- Munroe: home=Ruswarp, occupation=
hawker, sex=male match. Knaggs: licensee. Thompson: informant,
occupation="police constable for the North Riding". Location/court
match. Crime types=drunkenness, refusal to quit licensed premises
match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-285 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 4 occupation
fixes.**

## Record 286

"Summary conviction of John Backhouse of the township of Whitby jet
worker for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 15 June 1889. Whitby Strand
Petty Sessional division - case heard at Whitby" -- home=Whitby,
occupation=jet worker, sex=male match. Location/court/petty sessional
division match. Crime type=drunk and disorderly matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-286 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 4 occupation
fixes.**

## Record 287

"Summary conviction of Edward Morris hawker for selling unstamped
medicine without a licence; on the information of Robert Kirby of
Whitby sub-distributor of stamps. Offence committed at Whitby on 24 May
1833. Case heard at Whitby" -- no home stated, occupation=hawker,
sex=male match. Robert Kirby: own person row, different date from
prior Kirby records, correctly unlinked. Crime type=licensing offence
matches.

**OK — no changes.**

---

**Progress: records 1-287 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 4 occupation
fixes.**

## Record 288

"Summary conviction of John Swales of the township of Whitby labourer
for assaulting James Pearson of the township of Hawsker cum Stainsacre
labourer by striking him on the arm and body. Offence committed at the
township of Hawsker cum Stainsacre on 15 September 1842. Division of
Whitby Strand - case heard at Whitby" -- Swales: home=Whitby,
occupation=labourer, sex=male match. Pearson: victim, home=Hawsker-
cum-Stainsacre, occupation=labourer, correctly captured. Location/
court/petty sessional division match. Crime type=assault matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-288 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 4 occupation
fixes.**

## Record 289

"Summary conviction of James Brown late of the township of Whitby
mariner for begging. Offence committed at the township of Whitby on 14
November 1859. Case heard at Whitby" -- "late of" convention applied,
home=Whitby, occupation=mariner, sex=male match. Location/court=
Whitby. Crime type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-289 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 4 occupation
fixes.**

## Record 290

"Summary conviction of Hannah Palmer of the township of Whitby
singlewoman for being drunk; on the oath of [blank] Harnby of the
township of Whitby police constable. Offence committed at the township
of Whitby on 8 October 1869. Whitby Strand - case heard at Whitby" --
home=Whitby, sex=female match. **FIXED**: tracked marital-status
occupation gap (id 290 on the list) -- confirmed via dedicated query,
fixed. `INSERT INTO person_occupation (person_id, occupation_id)
VALUES (321, 337);` Verified via SELECT. "[blank] Harnby": informant,
correctly captured with first_name=NULL. Location/court=Whitby. Crime
type=drunkenness matches. [Corrected 2026-07-30, retroactively, at
record 302: same date/informant/charge as record 302 (Dorothy Kirby) --
related_conviction link created when this pattern became visible.]

**FIXED — 1 tracked occupation gap resolved (singlewoman); related_
conviction corrected retroactively, see record 302.**

---

**Progress: records 1-290 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 5 occupation
fixes.**

## Record 291

"Summary conviction of George Harrison jet worker and Francis Harrison
stonemason, both of the township of Newholm cum Dunsley, for
trespassing in the daytime in search of conies in a close of land in
the possession and occupation of William Burnett. Offence committed at
township of Newholm cum Dunsley on 24 September 1876. Whitby Strand -
case heard at Whitby" -- both co-defendants correctly captured with
distinct occupations (jet worker/stonemason), sex=male ("Francis"
spelling, male form). William Burnett: landowner, correctly captured.
Location/court match. Crime type=poaching matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-291 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 5 occupation
fixes.**

## Record 292

"Summary conviction of William Dixon of the township of Whitby jet
worker for being drunk and disorderly at the Court House Offence
committed at the township of Ruswarp on 25 June 1889. Whitby Strand
Petty Sessional division - case heard at Whitby" -- home=Whitby,
occupation=jet worker, sex=male match. The Court House (235) nests
under West Cliff (5), same cliff-boundary shape as prior records,
correctly alongside stated Ruswarp. Court/petty sessional division
match. Crime type=drunk and disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-292 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 5 occupation
fixes.**

## Record 293

"Summary conviction of Henry Hodgson of Whitby pilot for wilfully
disobeying the orders of the harbour master of the port of Whitby.
Offence committed on 25 May 1833" -- home=Whitby, occupation=pilot,
sex=male match. No named harbour master here (generic reference, no
name given), correctly no separate person row. Crime type=maritime
offence matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-293 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 5 occupation
fixes.**

## Record 294

"Summary conviction of Elizabeth Wood of the township of Whitby
singlewoman for assaulting Sarah Hudson wife of John Hudson of the
township of Whitby labourer by striking her on the head with his
hands. Offence committed at the township of Whitby on 1 October 1842.
Division of Whitby Strand - case heard at Whitby" -- Elizabeth: home=
Whitby, sex=female match. **FIXED**: tracked marital-status occupation
gap (id 294, defendant entry) -- confirmed via dedicated query, fixed.
`INSERT INTO person_occupation (person_id, occupation_id) VALUES (326,
337);` Verified via SELECT. Sarah Hudson: victim, correctly has no
occupation of her own (the id 294 "victim" entry on the tracked list
was a false read -- labourer correctly belongs to husband John, not a
gap). John Hudson: "spouse of victim", home=Whitby, occupation=
labourer, correctly attached. person_relationship: Sarah "wife" -> John,
correct. Location/court/petty sessional division match. Crime
type=assault matches. No related_conviction.

**FIXED — 1 tracked occupation gap resolved (singlewoman); confirmed
the victim-role list entry for this record was not actually a gap.**

---

**Progress: records 1-294 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 6 occupation
fixes.**

## Record 295

"Summary conviction of William Stephenson, Thomas Hebron and Isaac Tose
for assaulting John Grainger one of the constables for the North Riding
in the execution of his duty. Offence committed at the township of
Hinderwell on 9 November 1859. Case heard at Whitby" -- three co-
defendants, no homes stated, correctly blank. Isaac Tose here is a
distinct person row (329), separate from record 211's Isaac Tose (223)
-- correct, no cross-conviction merge despite matching name. John
Grainger: victim, occupation="constable for the North Riding". Location/
court match. Crime type=assaulting a police officer matches. [Corrected
2026-07-30, retroactively, at record 301: a fourth man (Joseph Crispin,
record 301) was prosecuted separately for the same assault -- related_
conviction link created when this became visible at 301.]

**OK — no changes (related_conviction corrected retroactively, see
record 301).**

---

**Progress: records 1-295 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 6 occupation
fixes.**

## Record 296

"Summary conviction of Thomas Dixon of the township of Whitby labourer
for being drunk and riotous in Church Street. Offence committed at the
township of Whitby on 9 October 1869. Whitby Strand - case heard at
Whitby" -- home=Whitby, occupation=labourer, sex=male match. Church
Street -> East Cliff -> Whitby reaches stated township. Court=Whitby.
Crime type=drunk and disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-296 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 6 occupation
fixes.**

## Record 297

"Summary conviction of Joseph Tose of the township of Hinderwell rag
gatherer for being drunk and disorderly in Staithes town street.
Offence committed at the township of Hinderwell on 4 November 1876.
Whitby Strand - case heard at Whitby" -- home=Hinderwell, occupation=
rag gatherer, sex=male match. "Staithes town street" resolves to
Staithes itself, under Hinderwell, matching stated township.
Court/petty sessional division match. Crime type=drunk and disorderly
matches. Already cross-checked against record 133's same-date query --
correctly unrelated to 363/429/441/1965/1968. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-297 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 6 occupation
fixes.**

## Record 298

"Summary conviction of Thomas Crake the younger of the township of
Hinderwell fisherman for being drunk on the licensed premises of Thomas
Spink. Offence committed at the township of Hinderwell on 10 June 1889.
Whitby Strand Petty Sessional division - case heard at Whitby" -- home=
Hinderwell, name_postfix="the younger", occupation=fisherman, sex=male
match. Spink: licensee, different premises from record 272's Ashworth
-- same date/township but a genuinely separate incident, correctly
unlinked. Court/petty sessional division match. Crime
type=drunkenness matches. [Corrected 2026-07-30, retroactively, at
record 310: another patron (Thomas Headley Robinson, record 310) was
caught drunk at the same premises (Spink) on the same date --
related_conviction link created when this became visible.]

**OK — no changes (related_conviction corrected retroactively, see
record 310).**

---

**Progress: records 1-298 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 6 occupation
fixes.**

## Record 299

"Summary conviction of Edward Jacobs hawker for selling watch seals,
spectacles and printing types without a licence; on the information of
Robert Kirby of Whitby sub-distributor of stamps. Offence committed at
Whitby on 4 June 1833. Case heard at Whitby" -- no home stated,
occupation=hawker, sex=male match. Robert Kirby: own person row,
different date, correctly unlinked. Crime type=licensing offence
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-299 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 6 occupation
fixes.**

## Record 300

"Summary conviction of William Thompson of the township of Whitby
butcher for assaulting William Brunton of the township of Whitby
butcher by striking him several times on the body and kicking him with
his feet with great force and violence. Offence committed at the
township of Whitby on 29 September 1842. Division of Whitby Strand -
case heard at Whitby" -- Thompson: home=Whitby, occupation=butcher,
sex=male match. Brunton: victim, home=Whitby, occupation=butcher, own
separate person row (distinct from record 259's Brunton, correct
no-merge). Location/court/petty sessional division match. Crime
type=assault matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-300 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 6 occupation
fixes.**

## Record 301

"Summary conviction of Joseph Crispin for assaulting John Grainger one
of the constables for the North Riding in the execution of his duty.
Offence committed at the township of Hinderwell on 9 November 1859.
Case heard at Whitby" -- no home stated, correctly blank. John
Grainger: own person row, occupation="constable for the North Riding".
**FIXED**: same date, victim, township, and charge wording as record
295's three co-defendants -- no link existed for this fourth man
prosecuted separately. Created it. Verified via SELECT. Crime
type=assaulting a police officer matches. [Retroactively corrects
record 295's earlier verdict.]

**FIXED — 1 new related_conviction link created (retroactively also
resolves record 295).**

---

**Progress: records 1-301 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 35 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 6 occupation
fixes.**

## Record 302

"Summary conviction of Dorothy Kirby of the township of Whitby
singlewoman for being drunk; on the oath of [blank] Harnby of the
township of Whitby police constable. Offence committed at the township
of Whitby on 8 October 1869. Whitby Strand - case heard at Whitby" --
home=Whitby, sex=female match. **FIXED**: tracked marital-status
occupation gap (id 302) -- fixed. `INSERT INTO person_occupation
(person_id, occupation_id) VALUES (336, 337);` **FIXED**: same date,
informant ([blank] Harnby), and charge as record 290 -- no
related_conviction link existed. Created it. Both verified via SELECT.
Crime type=drunkenness matches. [Retroactively corrects record 290's
earlier verdict.]

**FIXED — 1 tracked occupation gap resolved (singlewoman), 1 new
related_conviction link created (retroactively also resolves record
290).**

---

**Progress: records 1-302 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 36 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 7 occupation
fixes.**

## Record 303

"Summary conviction of William Sadler of the township of Whitby hawker
for being drunk and disorderly in New Way Ghaut. Offence committed at
the township of Whitby on 30 September 1876. Whitby Strand - case heard
at Whitby" -- home=Whitby, occupation=hawker, sex=male match. New Way
Ghaut (64) nests under Church Street (26) -> East Cliff -> Whitby,
reaching stated township. Court/petty sessional division match. Crime
type=drunk and disorderly matches. related_conviction link to 309
present -- noting for verification when reached.

**OK — no changes.**

---

**Progress: records 1-303 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 36 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 7 occupation
fixes.**

## Record 304

"Summary conviction of Thomas Pritchard of the township of Ruswarp
pedlar for being drunk and disorderly in St Hilda's Terrace. Offence
committed at the township of Ruswarp on 20 June 1889. Whitby Strand
Petty Sessional division - case heard at Whitby" -- home=Ruswarp,
occupation=pedlar, sex=male match. This is Thomas Pritchard's own
defendant conviction (338), separate person row from the "spouse of
offender" mention in record 265 (9898, Mary Pritchard's husband) --
correct, no cross-conviction merge, even though clearly the same real
couple caught drunk together the same night. St Hilda's Terrace
cliff-boundary pattern matches. related_conviction link to 265
confirmed present.

**OK — no changes.**

---

**Progress: records 1-304 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 36 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 7 occupation
fixes.**

## Record 305

"Summary conviction of Christopher White of Whitby common brewer for
trespassing in search or pursuit of game on waste or moor land. Offence
committed on 12 August 1834 at the township of Moorsholm in the manor
of Skelton of which John Wharton esquire is lord of the manor. Case
heard at Guisborough" -- White: home=Whitby, occupation=common brewer,
sex=male match. John Wharton: landowner, occupation="lord of the manor
of Skelton" (existing precedent, id 230, matches exactly). "Esquire"
correctly not separately captured, per the established resolution.
Location=Moorsholm, court=Guisborough (out-of-area venue). Crime
type=poaching matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-305 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 36 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 7 occupation
fixes.**

## Record 306

"Summary conviction of Margaret Gathsides common prostitute for
behaving riotously and indecently in Grape Lane Offence committed at
the township of Whitby on 2 October 1842 Case heard at Whitby" -- no
home stated, occupation="common prostitute" (stated as-is, no
fabrication), sex=female match. Grape Lane -> East Cliff -> Whitby
reaches stated township. Court=Whitby. Crime type=breach of the peace
matches. related_conviction link to 312 present -- noting for
verification when reached.

**OK — no changes.**

---

**Progress: records 1-306 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 36 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 7 occupation
fixes.**

## Record 307

"Summary conviction of Thomas Pattison alehouse keeper for opening his
premises for the sale of spirits before 12.30 p.m. on a Sunday. Offence
committed at the township of Ruswarp at 11 a.m. on 27 November 1859.
Case heard at Whitby" -- no home stated, occupation=alehouse keeper,
sex=male match. Own person row, different date from record 251's
Pattison -- correct no-merge, same recurring-offence pattern. offence_
time="11 a.m." correctly captured. Location=Ruswarp, court=Whitby.
Crime type=licensing offence matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-307 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 36 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 7 occupation
fixes.**

## Record 308

"Summary conviction of Henry Smith of the township of Whitby fruiterer
for being drunk. Offence committed at the township of Whitby on 31
October 1869. Whitby Strand - case heard at Whitby" -- home=Whitby,
occupation=fruiterer, sex=male match. Own separate person row, different
date from record 244's Smith -- correct no-merge. Location/court=
Whitby. Crime type=drunkenness matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-308 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 36 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 7 occupation
fixes.**

## Record 309

"Summary conviction of Charles Sadler of the township of Whitby hawker
for being drunk and disorderly in New Way Ghaut. Offence committed at
the township of Whitby on 30 September 1876. Whitby Strand - case heard
at Whitby" -- home=Whitby, occupation=hawker, sex=male match. Shares
surname with record 303's William Sadler but no relationship
fabricated, matching established precedent. Location/court match. Crime
type=drunk and disorderly matches. related_conviction link to 303
already confirmed present -- resolves the flag from record 303.

**OK — no changes.**

---

**Progress: records 1-309 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 36 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 7 occupation
fixes.**

## Record 310

"Summary conviction of Thomas Headley Robinson of the township of
Hinderwell fisherman for being drunk on the licensed premises of Thomas
Spink. Offence committed at the township of Hinderwell on 10 June 1889.
Whitby Strand Petty Sessional division - case heard at Whitby" --
middle name Headley, home=Hinderwell, occupation=fisherman, sex=male
match. Spink: own person row, same licensee as record 298 (different
patron). **FIXED**: same date/licensee/charge as record 298 -- no link
existed. Created it. Verified via SELECT. Crime type=drunkenness
matches. [Retroactively corrects record 298's earlier verdict.]

**FIXED — 1 new related_conviction link created (retroactively also
resolves record 298).**

---

**Progress: records 1-310 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 7 occupation
fixes.**

(Record 311 confirmed blacklisted, expected gap.)

## Record 312

"Summary conviction of Jane Robertson common prostitute for behaving
riotously and indecently in Grape Lane. Offence committed at the
township of Whitby on 2 October 1842. Case heard at Whitby" -- no home
stated, occupation="common prostitute" (as stated), sex=female match.
Location/court=Whitby. Crime type=breach of the peace matches.
related_conviction link to 306 already confirmed present -- resolves
the flag from record 306.

**OK — no changes.**

---

**Progress: records 1-312 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 7 occupation
fixes.**

## Record 313

"Summary conviction of Richard Knaggs of the township of Ellerby
labourer for trespassing in the daytime in search and pursuit of game
on land in the possession and occupation of William Hodgson; on the
information of Henry William Siggs of the township of Lythe
gamekeeper. Offence committed at the township of Ellerby at 3 p.m. on
20 June 1857. Case heard at Whitby" -- home=Ellerby, correctly showing
the fixed parent (88=Hinderwell) from the record-124 fix. Occupation=
labourer, sex=male match. William Hodgson: landowner, correctly
captured. Henry William Siggs: informant, home=Lythe, occupation=
gamekeeper, correctly captured. Location of offence=Ellerby matches.
Court=Whitby. offence_time="3 p.m." correctly captured. Crime
type=poaching matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-313 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 7 occupation
fixes.**

## Record 314

"Summary conviction of Hannah Palmer of the township of Whitby
singlewoman for being drunk; on the oath of Francis Selby of the
township of Whitby police constable. Offence committed at the township
of Whitby on 14 October 1869. Whitby Strand - case heard at Whitby" --
home=Whitby, sex=female match. Own separate person row from record
290's Hannah Palmer -- correct no-merge, recurring offender. **FIXED**:
tracked marital-status occupation gap (id 314) -- fixed. `INSERT INTO
person_occupation (person_id, occupation_id) VALUES (347, 337);`
Verified via SELECT. Francis Selby: informant, correctly captured.
Location/court=Whitby. Crime type=drunkenness matches. No
related_conviction.

**FIXED — 1 tracked occupation gap resolved (singlewoman).**

---

**Progress: records 1-314 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 8 occupation
fixes.**

## Record 315

"Summary conviction of Matthew Tose of the township of Whitby jet
worker for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 3 October 1876. Whitby Strand -
case heard at Whitby" -- home=Whitby, occupation=jet worker, sex=male
match. Church Street -> East Cliff -> Whitby reaches stated township.
Court=Whitby. Crime type=drunk and disorderly matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-315 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 8 occupation
fixes.**

## Record 316

"Summary conviction of Louis Cleeton of the township of Whitby for
assaulting Mary Cleeton. Offence committed at the township of Whitby on
11 June 1889. Whitby Strand Petty Sessional division - case heard at
Whitby" -- Louis: home=Whitby, sex=male match. Mary: victim, sex=
female. No relationship fabricated despite shared surname (text
doesn't state one). Location/court/petty sessional division match.
Crime type=assault matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-316 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 8 occupation
fixes.**

## Record 317

"Summary conviction of Samuel Morris for having medicines called Dutch
Drops and Riga Balsams for sale without the products being labelled; on
the information of Robert Kirby of the township of Whitby sub-
distributor of stamps, and on the oath of William Wilkinson. Offence
committed in Whitby on 30 May 1834. Case heard at Whitby" -- no home
stated for Morris, correctly blank. Robert Kirby: informant, own person
row, different date, correctly unlinked. William Wilkinson: witness,
own person row. Crime type=licensing offence matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-317 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 8 occupation
fixes.**

## Record 318

"Summary conviction of John Scott and George Thompson for begging.
Offence committed at the township of Hawsker cum Stainsacre on 4
January 1848. Case heard at Whitby" -- two co-defendants, no homes
stated, correctly blank. Location=Hawsker-cum-Stainsacre, court=
Whitby. Crime type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-318 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 8 occupation
fixes.**

## Record 319

"Summary conviction of Henry Webster of the township of Whitby labourer
for assaulting and resisting Hugh MacGregor in the execution of his
office; on the oath of the said Hugh MacGregor of the township of
Ruswarp superintendent of police and constable. Offence committed at
the township of Whitby on 4 July 1857. Case heard at Whitby" --
defendant Henry Webster (Whitby, labourer), victim Hugh MacGregor
(Ruswarp, superintendent of police and constable -- occupation field,
not "office"; "in the execution of his office" is period phrasing for
on-duty, not our aristocratic-pedigree office field). Locations and
crime types (assaulting a police officer / obstructing-resisting a
constable) match. Already correctly linked via related_conviction to
325 (same defendant/offence date pattern) from a prior pass.

**OK — no changes.**

---

**Progress: records 1-319 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 8 occupation
fixes.**

## Record 320

"Summary conviction of Dorothy Kirby of the township of Whitby
singlewoman for being drunk; on the oath of Francis Selby of the
township of Whitby police constable. Offence committed at the
township of Whitby on 14 October 1869. Whitby Strand - case heard at
Whitby" -- defendant Dorothy Kirby (Whitby), informant Francis Selby
(Whitby, police constable). Locations correct (court/offence=Whitby,
petty sessional division=Whitby Strand). Crime type=drunkenness
matches. No related_conviction.

Dorothy Kirby's own text states "singlewoman" but `person_occupation`
had no link -- another instance of the tracked corpus-wide marital-
status-occupation gap (not previously on the known-ids list; found
fresh via the standard per-person occupation check).

**FIXED — added missing occupation link: person 354 (Dorothy Kirby) →
occupation 337 (singlewoman). Verified via direct query.**

---

**Progress: records 1-320 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes.**

## Record 321

"Summary conviction of Edward Jameson Ayre of the township of Whitby
jet worker for being drunk and disorderly on Boulby Bank. Offence
committed at the township of Whitby on 26 July 1876. Whitby Strand -
case heard at Whitby" -- defendant Edward Jameson Ayre (first/middle/
last all captured correctly), occupation jet worker matches. Location
of offence = Boulby Bank (70), already correctly parented under East
Cliff (6) → Whitby (4), pre-existing precedent, no change needed.
Court=Whitby, petty sessional division=Whitby Strand. Crime type=drunk
and disorderly matches.

**OK — no changes.** [Corrected 2026-07-30: record 393 (Edward Ayre,
same offence date, no middle name stated there but clearly the same
person) surfaced a same-defendant/same-date link; related_conviction
321-393 added when 393 was reached.]

---

**Progress: records 1-321 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes.**

## Record 322

"Summary conviction of John Burnside of the township of Whitby hawker
for being drunk and disorderly in The New Quay. Offence committed at
the township of Whitby on 9 August 1889. Whitby Strand Petty Sessional
division - case heard at Whitby" -- defendant John Burnside (Whitby,
hawker) matches. Location of offence = New Quay (80), correctly
parented under West Cliff (5) → Whitby, pre-existing precedent. Court=
Whitby, petty sessional division=Whitby Strand. Crime type=drunk and
disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-322 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes.**

## Record 323

"Summary conviction of Mutchoff Ponotowski for having medicines called
Dutch Drops and Riga Balsams for sale without the products being
labelled; on the information of Robert Kirby of the township of Whitby
sub-distributor of stamps, and on the oath of John Moody. Offence
committed in Whitby on 30 May 1834. Case heard at Whitby" -- defendant
Mutchoff Ponotowski, no home/occupation stated in text, correctly
blank. Informant Robert Kirby (Whitby, sub-distributor of stamps)
matches existing occupation precedent (id 350). Witness John Moody, no
details stated. Location=Whitby, crime type=licensing offence (correct
for unlabelled medicine sale). No related_conviction.

**OK — no changes.**

---

**Progress: records 1-323 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes.**

## Record 324

"Summary conviction of John Williams for refusing to work while being
relieved in the Whitby Union workhouse. Offence committed at the
township of Hawsker cum Stainsacre on 5 January 1848. Case heard at
Whitby" -- defendant John Williams, no home/occupation stated,
correctly blank. Location of offence has two rows: Union Workhouse
(81, Green Lane → East Cliff → Whitby, the physical building) and
Hawsker-cum-Stainsacre (the stated township) -- both legitimately
captured since the text states both the workhouse and the township
separately (poor-law settlement quirk: defendant's chargeable/home
township differs from the workhouse's physical location). Crime type
= refusing workhouse labour, correct. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-324 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes.**

## Record 325

"Summary conviction of Henry Webster of the township of Whitby
labourer for assaulting and resisting George Jackson in the execution
of his office; on the oath of the said George Jackson of the township
of Whitby police constable. Offence committed at the township of
Whitby on 4 July 1857. Case heard at Whitby" -- companion record to
319 (same defendant Henry Webster, same offence date, different
victim/officer -- George Jackson here vs. Hugh MacGregor there).
Henry Webster correctly given a separate person row (359) per the
no-cross-conviction-merge principle. George Jackson (Whitby, police
constable) matches. Locations and crime types match. Already correctly
linked via related_conviction to 319.

**OK — no changes.**

---

**Progress: records 1-325 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes.**

## Record 326

"Summary conviction of John Wilson of the township of Whitby tailor
for being drunk; on the oath of Francis Selby of the township of
Whitby police constable. Offence committed at the township of Whitby
on 15 October 1869. Whitby Strand - case heard at Whitby" -- defendant
John Wilson (Whitby, tailor), informant Francis Selby (same police
constable as record 320, but different offence date -- 15 Oct vs. 320's
14 Oct -- and different defendant, so a separate arrest, not the same
incident; no related_conviction link warranted). Locations and crime
type (drunkenness) match.

**OK — no changes.**

---

**Progress: records 1-326 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes.**

## Record 327

"Summary conviction of James Bennett of the township of Egton miner
for assaulting Andrew Harland; on the oath of the said Andrew Harland
and John Green both of the township of Eskdaleside miners. Offence
committed at the township of Eskdaleside on 22 January 1876. Whitby
Strand - case heard at Whitby" -- defendant James Bennett (Egton,
miner); victim Andrew Harland and witness John Green (both Eskdaleside-
cum-Ugglebarnby, miners). Location of offence matches existing
precedent (id 8). Crime type=assault matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-327 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes.**

## Record 328

"Summary conviction of Ralph Cole of the township of Hinderwell
fisherman for being drunk on the licensed premises of Thomas Spink.
Offence committed at the township of Hinderwell on 10 June 1889.
Whitby Strand Petty Sessional division - case heard at Whitby" --
defendant Ralph Cole (Hinderwell, fisherman), licensee Thomas Spink.
Locations and crime type (drunkenness) match.

**OK — no changes.** [Corrected 2026-07-30: record 334 (George Hart,
same licensee/premises/date) surfaced the same-incident pattern
between these two records; related_conviction link 328-334 added when
334 was reached.]

---

**Progress: records 1-328 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes.**

## Record 329

"Summary conviction of John Campion of the township of Ruswarp mariner
for assaulting Robert Howard apprentice to Thomas Yeoman of Whitby
druggist. Offence committed at the township of Whitby on the morning
of Sunday 1 February 1835. Case heard at Whitby" -- defendant John
Campion (Ruswarp, mariner); victim Robert Howard, apprentice to master
Thomas Yeoman (Whitby, druggist) -- apprentice/person_relationship
link present, master role label correct per established convention.
Thomas Yeoman's sex left blank in the DB -- correct, since the text
gives no pronoun for him (unlike some other master-role records where
a stated "his" justified sex=male); leaving it blank rather than
inferring from the name alone matches the no-fabrication-beyond-text
rule, so no fix needed. Locations and crime type (assault) match. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-329 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes.**

## Record 330

"Summary conviction of John Ripley for wilfully destroying his own
clothes while being relieved in the Whitby Union workhouse. Offence
committed at the township of Hawsker cum Stainsacre on 6 January 1848.
Case heard at Whitby" -- defendant John Ripley, no home/occupation
stated, correctly blank. Locations: Union Workhouse (81) + Hawsker-
cum-Stainsacre, same legitimate dual-location pattern as record 324.

Crime type surfaced a real corpus-wide taxonomy fragmentation: 41
records with this identical offence text ("destroying own clothes
whilst being relieved in the Whitby Union workhouse") were tagged
`malicious/property damage`, and 14 more with the same offence text
were tagged `workhouse offence` -- same offence, two different
existing leaves. Flagged to user; user's decision: **create a new,
separate crime_type leaf** rather than merging into either existing
one. New leaf: id 73, "destroying own clothes", parented under "poor
law & family maintenance" (8) -- alongside sibling leaves "refusing
workhouse labour" (31) and "workhouse offence" (47), per user's choice
of category placement.

Per the established "fix only as reached in sequence" convention (same
as the marital-status occupation gap), only record 330 itself is
retagged now. 54 more records with this same offence text (40 tagged
malicious/property damage, 14 tagged workhouse offence) remain to be
retagged to crime_type 73 only as the linear audit reaches them --
full id list logged in reextraction-audit-notes.md.

**FIXED — new crime_type leaf 73 "destroying own clothes" created
under 8; record 330 retagged from 60 (malicious/property damage) to
73. Verified via direct query.**

---

**Progress: records 1-330 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes, 1 new crime_type leaf created (1 record retagged so far).**

## Record 331

"Summary conviction of Thomas Walker apprentice by an indenture dated
11 May 1857 to John Milburn of the township of Ruswarp shipowner, for
absconding from his master's service. Offence committed on 11 May
1857. Case heard at Whitby" -- defendant Thomas Walker (apprentice),
master John Milburn (Ruswarp, shipowner) -- apprentice relationship
link present, master role correct. No offence location stated in
text, correctly no "location of offence" row (court=Whitby only).
Crime type = master and servant offence, correct for absconding from
apprenticeship. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-331 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes, 1 new crime_type leaf created (1 record retagged so far).**

## Record 332

"Summary conviction of Thomas Atkinson of the township of Whitby
innkeeper for allowing disorderly conduct on his licensed premises.
Offence committed at the township of Whitby on 16 October 1869. Whitby
Strand - case heard at Whitby" -- defendant Thomas Atkinson (Whitby,
innkeeper). Locations and crime type (licensing offence) match.
Already correctly linked via related_conviction to 368 (same
defendant/offence date pattern).

**OK — no changes.**

---

**Progress: records 1-332 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes, 1 new crime_type leaf created (1 record retagged so far).**

## Record 333

"Summary conviction of William Barrett of the township of Whitby jet
worker for assaulting Thomas Watson; on the oath of Joseph Philpot of
the township of Whitby jet worker. Offence committed at the township
of Whitby on 11 November 1876. Whitby Strand - case heard at Whitby"
-- defendant William Barrett (Whitby, jet worker), victim Thomas
Watson (no details stated, correctly blank), witness Joseph Philpot
(Whitby, jet worker). Locations and crime type (assault) match. This
is part of the previously-investigated Thomas Watson assault cluster:
already correctly linked via related_conviction to 447 and 1974 (same
defendant/offence date) and to 132 (same offence date/victim,
different defendant -- same incident, separately prosecuted).

**OK — no changes.**

---

**Progress: records 1-333 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes, 1 new crime_type leaf created (1 record retagged so far).**

## Record 334

"Summary conviction of George Hart of the township of Hinderwell
fisherman for being drunk on the licensed premises of Thomas Spink.
Offence committed at the township of Hinderwell on 10 June 1889.
Whitby Strand Petty Sessional division - case heard at Whitby" --
defendant George Hart (Hinderwell, fisherman), licensee Thomas Spink.
Locations and crime type (drunkenness) match. Same licensee, premises,
and offence date as record 328 (Ralph Cole) -- same-incident pattern,
different defendant, prosecuted separately.

**FIXED — added related_conviction link 328-334 (same premises/date,
separate defendants). Record 328's log entry retroactively annotated.**

---

**Progress: records 1-334 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 38 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes, 1 new crime_type leaf created (1 record retagged so far).**

## Record 335

"Summary conviction of Nathaniel Gardiner of Whitby innkeeper for
keeping his house open during the hours of divine service between
10.30 a.m. and 12 o'clock. Offence committed at Whitby on Sunday 1
February 1835. Case heard at Whitby" -- defendant Nathaniel Gardiner
(Whitby, innkeeper). Locations and crime type (licensing offence)
match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-335 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 38 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes, 1 new crime_type leaf created (1 record retagged so far).**

## Record 336

"Summary conviction of William Davis for begging. Offence committed at
the township of Egton on 5 January 1848. Case heard at Whitby" --
defendant William Davis, no home/occupation stated, correctly blank.
Location=Egton, court=Whitby. Crime type=begging matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-336 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 38 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes, 1 new crime_type leaf created (1 record retagged so far).**

## Record 337

"Summary conviction of Ralph Nunn of the township of Whitby ship
carpenter for assaulting John Mason of the township of Whitby butcher;
on the oath of the said John Mason and another. Offence committed at
the township of Whitby on 19 July 1857. Case heard at Whitby" --
defendant Ralph Nunn (Whitby, ship carpenter), victim John Mason
(Whitby, butcher). "And another" is an unnamed witness, correctly not
given a person row (no name to capture). Locations and crime type
(assault) match.

**OK — no changes.** [Corrected 2026-07-30: record 343 (George Wilson,
same victim John Mason, same offence date 19 July 1857) surfaced the
same-incident pattern; related_conviction link 337-343 added when 343
was reached.]

---

**Progress: records 1-337 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 38 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes, 1 new crime_type leaf created (1 record retagged so far).**

## Record 338

"Summary conviction of Samuel Carr of the township of Glaisdale miner
for having an unseasonable salmon in his possession. Offence committed
at the township of Glaisdale on 14 November 1869. Whitby Strand - case
heard at Whitby" -- defendant Samuel Carr (Glaisdale, miner). Location
and crime type (poaching) match; species detail ("unseasonable
salmon") preserved verbatim in charge_description -- no dedicated
game_species field exists to check against (per the tracked, unfixed
schema watch item), so nothing lost. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-338 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 38 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes, 1 new crime_type leaf created (1 record retagged so far).**

## Record 339

"Summary conviction of Thomas Gaines of the township of Whitby
fisherman for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 4 October 1876. Whitby Strand -
case heard at Whitby" -- defendant Thomas Gaines (Whitby, fisherman).
Location of offence = Church Street (East Cliff → Whitby), existing
precedent. Crime type=drunk and disorderly matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-339 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 38 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes, 1 new crime_type leaf created (1 record retagged so far).**

## Record 340

"Summary conviction of Mary Dryden wife of William Dryden of the
township of Whitby fisherman for assaulting Jane Harland. Offence
committed at the township of Whitby on 22 July 1889. Whitby Strand
Petty Sessional division - case heard at Whitby" -- defendant Mary
Dryden, spouse William Dryden (Whitby, fisherman, wife relationship
present), victim Jane Harland. Locations and crime type (assault)
match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-340 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 38 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes, 1 new crime_type leaf created (1 record retagged so far).**

## Record 341

"Summary conviction of Robert Dixon, Thomas Graham, Joseph Gath,
Thomas Storr and William Storr, all of the township of Whitby, for
assaulting Robert Stevenson, Jonathan Harrison and Margaret Short, all
of the township of Hawsker cum Stainsacre. Offence committed at the
township of Whitby on the night of Sunday 22 February 1835. Case heard
at Whitby" -- five defendants (all Whitby) and three victims (all
Hawsker-cum-Stainsacre), all correctly captured with matching homes;
no occupations stated, correctly blank. Location and crime type
(assault) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-341 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 38 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes, 1 new crime_type leaf created (1 record retagged so far).**

## Record 342

"Summary conviction of John Coholl for begging. Offence committed at
the township of Egton on 5 January 1848. Case heard at Whitby" --
defendant John Coholl, no home/occupation stated, correctly blank.
Location=Egton, crime type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-342 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 38 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes, 1 new crime_type leaf created (1 record retagged so far).**

## Record 343

"Summary conviction of George Wilson of the township of Whitby ship
carpenter for assaulting John Mason of the township of Whitby butcher;
on the oath of the said John Mason and others. Offence committed at
the township of Whitby on 19 July 1857. Case heard at Whitby" --
defendant George Wilson (Whitby, ship carpenter), victim John Mason
(Whitby, butcher). Same victim and offence date as record 337 (Ralph
Nunn) -- same-incident pattern, different defendant, prosecuted
separately. Locations and crime type (assault) match.

**FIXED — added related_conviction link 337-343 (same victim/date,
separate defendants). Record 337's log entry retroactively annotated.**

---

**Progress: records 1-343 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 39 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes, 1 new crime_type leaf created (1 record retagged so far).**

## Record 344

"Summary conviction of John Hodgson of the township of Whitby
fisherman for being drunk and riotous in Sandgate. Offence committed
at the township of Whitby on 18 December 1869. Whitby Strand - case
heard at Whitby" -- defendant John Hodgson (Whitby, fisherman).
Location of offence = Sandgate (34, East Cliff → Whitby), existing
precedent. Crime type=drunk and disorderly matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-344 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 39 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes, 1 new crime_type leaf created (1 record retagged so far).**

## Record 345

"Summary conviction of John Shaw of the township of Whitby jet worker
for being drunk and disorderly in Church Street. Offence committed at
the township of Whitby on 7 October 1876. Whitby Strand - case heard
at Whitby" -- defendant John Shaw (Whitby, jet worker). Location of
offence = Church Street (East Cliff → Whitby), existing precedent.
Crime type=drunk and disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-345 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 39 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes, 1 new crime_type leaf created (1 record retagged so far).**

## Record 346

"Summary conviction of Robert Steel of the township of Whitby jet
worker for being drunk and disorderly at the Cragg. Offence committed
at the township of Whitby on 27 July 1889. Whitby Strand Petty
Sessional division - case heard at Whitby" -- defendant Robert Steel
(Whitby, jet worker). Location of offence = The Cragg (74, West Cliff
→ Whitby), existing precedent. Crime type=drunk and disorderly
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-346 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 39 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes, 1 new crime_type leaf created (1 record retagged so far).**

## Record 347

"Summary conviction of Robert Cunningham late of Kirby Moorside for
selling spectacles from house to house without a licence; on the
information of Robert Kirby of the township of Whitby sub-distributor
of stamps. Offence committed at the township of Sneaton on 5 March
1835. Case heard at Whitby" -- defendant Robert Cunningham, home
correctly resolved to Kirkbymoorside (id 292) in person.home_location_id
despite raw text's "Kirby Moorside" spelling. Informant Robert Kirby
(Whitby, sub-distributor of stamps) matches precedent. Location of
offence=Sneaton, court=Whitby, crime type=licensing offence, all
correct. No related_conviction.

Title field was wrong: read "Summary conviction: Robert Cunningham of
Whitby" despite the text saying "late of Kirby Moorside" and the DB's
own home_location_id already correctly resolving to Kirkbymoorside.
Checked precedent -- every other "late of X" record in the corpus (173,
183, 203, 213, 234, 249, 256, 289, 365, etc.) titles correctly as "X
late of [township]"; only this record broke the pattern.

**FIXED — corrected title to "Summary conviction: Robert Cunningham
late of Kirkbymoorside", matching the established "late of X" title
convention and the record's own correct home_location_id. Verified via
direct query.**

---

**Progress: records 1-347 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 39 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3 anomalies
notes, 4 redundant relationship rows removed, 2 role corrections, 9
occupation fixes, 1 new crime_type leaf created (1 record retagged so
far).**

## Record 348

"Summary conviction of Shaddrack Hind for begging. Offence committed
at the township of Egton on 5 January 1848. Case heard at Whitby" --
defendant Shaddrack Hind, no home/occupation stated, correctly blank.
Location=Egton, crime type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-348 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 39 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3 anomalies
notes, 4 redundant relationship rows removed, 2 role corrections, 9
occupation fixes, 1 new crime_type leaf created (1 record retagged so
far).**

## Record 349

"Summary conviction of Thomas Jackson a reputed thief, for frequenting
Whitby harbour for the purpose of committing felony. Offence committed
at the parish of Whitby on 24 July 1857. Case heard at Whitby" --
defendant Thomas Jackson, no home stated, correctly blank. "A reputed
thief" checked against name_postfix precedent -- that field is
reserved for generational qualifiers (the younger/elder/junior), not
descriptive character labels, so correctly not force-fit there;
already preserved verbatim in charge_description/raw_record, nothing
lost. Locations and crime type (vagrancy, correct for the "frequenting
for purpose of felony" statutory offence) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-349 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 39 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3 anomalies
notes, 4 redundant relationship rows removed, 2 role corrections, 9
occupation fixes, 1 new crime_type leaf created (1 record retagged so
far).**

## Record 350

"Summary conviction of George Gray hawker, pedlar and petty chapman,
for selling pairs of scissors without a proper licence. Offence
committed at the township of Ruswarp on 8 December 1869. Whitby Strand
- case heard at Whitby" -- defendant George Gray, no home stated,
correctly blank. Occupation stored as the single compound string
"hawker, pedlar and petty chapman" -- checked precedent, this matches
the established convention for combined-phrase occupations ("hawker
and pedlar", "petty chapman and pedlar", "labourer and hawker" all
exist as single occupation strings), not an error. Locations and crime
type (licensing offence) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-350 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 39 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3 anomalies
notes, 4 redundant relationship rows removed, 2 role corrections, 9
occupation fixes, 1 new crime_type leaf created (1 record retagged so
far).**

## Record 351

"Summary conviction of John Watson Liddell of the township of Whitby
cartman for being disorderly on the licensed premises of Bailiff
Appleton and refusing to leave when asked by Mary Ann Appleton agent
of the said Bailiff Appleton. Offence committed at the township of
Whitby on 5 October 1876. Whitby Strand - case heard at Whitby" --
defendant John Watson Liddell (full name incl. middle name captured
correctly), licensee Bailiff Appleton (first_name blank, title=
"Bailiff", last_name=Appleton), informant/agent Mary Ann Appleton
(female, no relationship link stated in text between her and Bailiff
Appleton -- text only says "agent", not wife, correctly not linked).

Flagged an ambiguity: "Bailiff Appleton" recurs across 4 records
(this one, 1113, 5985, plus id 6206 elsewhere) as what looks like the
same real Whitby cab driver/licensee, but is captured two different
ways -- title="Bailiff" (3 instances, incl. this record) vs. literal
first_name="Bailiff" (1 instance, person 6206). The `title` field
otherwise only ever holds "Sir". User's decision: leave as-is, keep
the majority title-field convention, don't touch either version.
Record 351 already matches that majority convention, so no fix needed
here. Locations and crime types (breach of the peace, refusal to quit
licensed premises) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-351 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 39 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3 anomalies
notes, 4 redundant relationship rows removed, 2 role corrections, 9
occupation fixes, 1 new crime_type leaf created (1 record retagged so
far).**

## Record 352

"Summary conviction of Thomas Wellbury of the township of Whitby
seaman for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 23 July 1889. Whitby Strand
Petty Sessional division - case heard at Whitby" -- defendant Thomas
Wellbury (Whitby, seaman). Location of offence = Church Street
(East Cliff → Whitby), existing precedent. Crime type=drunk and
disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-352 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 39 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3 anomalies
notes, 4 redundant relationship rows removed, 2 role corrections, 9
occupation fixes, 1 new crime_type leaf created (1 record retagged so
far).**

## Record 353

"Summary conviction of Robert Plowman of Whitby the township of
Whitby mariner for assaulting Mary Plowman of Whitby spinster.
Offence committed at the township of Whitby on the morning of Sunday 8
March 1835. Case heard at Whitby" -- pre-existing anomaly note
correctly flags the doubled "of Whitby the township of Whitby" phrase
as a harmless source-side duplication. Defendant Robert Plowman
(Whitby, mariner), victim Mary Plowman (Whitby) -- shared surname but
no relationship stated in text, correctly no person_relationship link
fabricated. Locations and crime type (assault) match. No
related_conviction.

This was on the tracked marital-status-occupation-gap list (record
353 flagged at record 275): Mary Plowman's text states "spinster" but
`person_occupation` had no link.

**FIXED — added missing occupation link: person 6631 (Mary Plowman) →
occupation 406 (spinster). Verified via direct query.**

---

**Progress: records 1-353 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 39 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3 anomalies
notes, 4 redundant relationship rows removed, 2 role corrections, 10
occupation fixes, 1 new crime_type leaf created (1 record retagged so
far).**

## Record 354

"Summary conviction of John Walker for begging. Offence committed at
the township of Whitby on 1 January 1848. Case heard at Whitby" --
defendant John Walker, no home/occupation stated, correctly blank.
Location=Whitby, crime type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-354 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 39 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3 anomalies
notes, 4 redundant relationship rows removed, 2 role corrections, 10
occupation fixes, 1 new crime_type leaf created (1 record retagged so
far).**

## Record 355

"Summary conviction of Esther Anthony wife of Joyce Anthony of the
township of Whitby mariner for using obscene and indecent language in
Church Street; on the oath of Robert Nickson of the township of
Whitby police constable. Offence committed at the township of Whitby
on 26 July 1857. Case heard at Whitby" -- defendant Esther Anthony
(female), spouse Joyce Anthony (correctly sex=male despite the name
reading as traditionally female -- correctly derived from the "wife
of" relationship rather than the given name), informant Robert Nickson
(Whitby, police constable). Wife relationship link present. Location
of offence = Church Street (East Cliff → Whitby). Crime type=using
obscene language matches.

**OK — no changes.** [Corrected 2026-07-30: record 361 (James Farrah,
same street/date/informant/offence) surfaced the same-beat pattern;
related_conviction link 355-361 added when 361 was reached.]

---

**Progress: records 1-355 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 39 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3 anomalies
notes, 4 redundant relationship rows removed, 2 role corrections, 10
occupation fixes, 1 new crime_type leaf created (1 record retagged so
far).**

## Record 356

"Summary conviction of James Filburn of the township of Aislaby jet
worker for resisting Charles Tempest Clarkson one of the constables
for the North Riding in the execution of his duty. Offence committed
at the township of Whitby on 16 October 1869. Whitby Strand - case
heard at Whitby" -- defendant James Filburn (Aislaby, jet worker),
victim Charles Tempest Clarkson (full name incl. middle name captured,
occupation "constable for the North Riding"). Locations and crime type
(obstructing/resisting a constable) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-356 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 39 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3 anomalies
notes, 4 redundant relationship rows removed, 2 role corrections, 10
occupation fixes, 1 new crime_type leaf created (1 record retagged so
far).**

## Record 357

"Summary conviction of John Telford of Brotton miner for being drunk
on the licensed premises of Samuel Adams and refusing to leave when
asked by the said Samuel Adams; on the oath of William Hammond of the
township of Hinderwell police constable. Offence committed at the
township of Hinderwell on 7 October 1876. Whitby Strand division -
case heard at Whitby" -- defendant John Telford (home=Brotton, id
282), correctly distinct from offence location Hinderwell. Licensee
Samuel Adams, informant William Hammond (Hinderwell, police
constable). Locations and crime types (drunkenness, refusal to quit
licensed premises) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-357 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 39 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3 anomalies
notes, 4 redundant relationship rows removed, 2 role corrections, 10
occupation fixes, 1 new crime_type leaf created (1 record retagged so
far).**

## Record 358

"Summary conviction of William Tose of Imperial Yard in the township
of Whitby for maliciously killing five young ducks, the property of
William Spence. Offence committed at the parish of Whitby on 1 July
1889. Whitby Strand Petty Sessional division - case heard at Whitby"
-- defendant William Tose, home=Imperial Yard (352, under Whitby id
4), existing precedent. Property owner William Spence, no
home/occupation stated, correctly blank. Locations and crime type
(malicious/property damage, correct -- this is ordinary property
destruction against someone else's property, not the workhouse-clothes
pattern from record 330) match.

**OK — no changes.** [Corrected 2026-07-30: record 382 (William Agar,
same owner/ducks/date) surfaced the same-incident pattern;
related_conviction link 358-382 added when 382 was reached.]

---

**Progress: records 1-358 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 39 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3 anomalies
notes, 4 redundant relationship rows removed, 2 role corrections, 10
occupation fixes, 1 new crime_type leaf created (1 record retagged so
far).**

(Record 359 confirmed blacklisted/no row exists in summary_conviction,
expected gap -- same pattern as 87-88, 139, 144, 151, 311.)

## Record 360

"Summary conviction of John Roberts for wilfully destroying his own
clothes while being relieved in the Whitby Union workhouse. Offence
committed at the township of Hawsker cum Stainsacre on 12 January
1848. Case heard at Whitby" -- defendant John Roberts, no home/
occupation stated, correctly blank. Locations: Union Workhouse (81) +
Hawsker-cum-Stainsacre, same dual-location pattern as records 324/330.
On the tracked "destroying own clothes" crime_type list (was tagged
60 malicious/property damage).

**FIXED — retagged crime_type from 60 to 73 (destroying own clothes),
per the record-330 decision. Verified via direct query.**

---

**Progress: records 1-360 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 39
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 10 occupation fixes, 1 new crime_type leaf created (2
records retagged so far).**

## Record 361

"Summary conviction of James Farrah of the township of Whitby labourer
for using obscene and indecent language in Church Street; on the oath
of Robert Nickson of the township of Whitby police constable. Offence
committed at the township of Whitby on 26 July 1857. Case heard at
Whitby" -- defendant James Farrah (Whitby, labourer), informant Robert
Nickson (Whitby, police constable). Locations and crime type (using
obscene language) match. Same informant, offence, street, and date as
record 355 (Esther Anthony) -- flagged to user as a new sub-pattern
(same beat constable, no shared named victim/premises); user confirmed
this counts as Pattern 2. New precedent established and saved.

**FIXED — added related_conviction link 355-361 (same officer/date/
street/offence). Record 355's log entry retroactively annotated.**

---

**Progress: records 1-361 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 40
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 10 occupation fixes, 1 new crime_type leaf created (2
records retagged so far).**

## Record 362

"Summary conviction of Margaret Corner of the township of Whitby
singlewoman for being drunk; on the oath of Simpson Harnby of the
township of Whitby police constable. Offence committed at the
township of Whitby on 22 October 1869. Whitby Strand - case heard at
Whitby" -- defendant Margaret Corner (Whitby), informant Simpson
Harnby (Whitby, police constable). Locations and crime type
(drunkenness) match. Margaret Corner's text states "singlewoman" but
`person_occupation` had no link -- another instance of the tracked
marital-status-occupation gap.

**FIXED — added missing occupation link: person 399 (Margaret Corner)
→ occupation 337 (singlewoman). Verified via direct query.**

---

**Progress: records 1-362 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 40
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 11 occupation fixes, 1 new crime_type leaf created (2
records retagged so far).**

## Record 363

"Summary conviction of Jacob Pearson and William Sanders for
assaulting Joseph Watson. Offence committed at the township of
Hinderwell on 4 November 1876. Whitby Strand - case heard at Whitby"
-- two co-defendants (Jacob Pearson, William Sanders), no home/
occupation stated for either, correctly blank. Victim Joseph Watson
(unrelated to the earlier Thomas Watson assault cluster -- different
name and township). Locations and crime type (assault) match. Already
correctly linked via related_conviction to 441 (same defendant/offence
date).

**OK — no changes.**

---

**Progress: records 1-363 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 40
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 11 occupation fixes, 1 new crime_type leaf created (2
records retagged so far).**

## Record 364

"Summary conviction of George Ward of the township of Whitby labourer
for being drunk and disorderly in Church Street. Offence committed at
the township of Whitby on 26 July 1889. Whitby Strand Petty Sessional
division - case heard at Whitby" -- defendant George Ward (Whitby,
labourer). Location of offence = Church Street (East Cliff → Whitby),
existing precedent. Crime type=drunk and disorderly matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-364 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 40
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 11 occupation fixes, 1 new crime_type leaf created (2
records retagged so far).**

## Record 365

"Summary conviction of James Grants late of the township of Whitby
labourer and hawker for selling knives from door to door without a
licence; on the information of Robert Kirby of Whitby esquire sub-
distributor of stamps. Offence committed at the township of Whitby on
27 June 1835. Case heard at Whitby" -- defendant James Grants (Whitby,
labourer and hawker -- compound occupation string, matches convention).
Informant Robert Kirby (Whitby, sub-distributor of stamps). Flagged
"esquire" (Robert Kirby's honorific here) since title field had no
precedent for it; user's decision: meaningless courtesy, ignore it
completely everywhere it's found -- blanket, corpus-wide, not just
this record. Locations and crime type (licensing offence) match. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-365 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 40
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 11 occupation fixes, 1 new crime_type leaf created (2
records retagged so far).**

## Record 366

"Summary conviction of Robert Stephenson of the township of
Fylingdales farmer for trespassing in the daytime in search of game on
waste or common land belonging to George Cholmley esquire as lord of
the manor of Fylingdales. Offence committed at the township of
Fylingdales on 20 December 1847. Case heard at Whitby" -- defendant
Robert Stephenson (Fylingdales, farmer). Landowner George Cholmley
(person 6641, separate row per no-cross-merge, correct). "Esquire"
ignored per the settled blanket decision. "Lord of the manor of
Fylingdales" flagged as a new office-field candidate (no precedent
existed); user's decision: add to office. Locations and crime type
(poaching) match. No related_conviction.

**FIXED — set person 6641 (George Cholmley) office = "Lord of the
Manor of Fylingdales". Verified via direct query.** [Corrected
2026-07-30: record 372 (George Wellburn, same landowner/offence date)
surfaced both the office fix for person 6645 and a related_conviction
link 366-372, applied when 372 was reached.]

---

**Progress: records 1-366 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 40
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 11 occupation fixes, 1 office fix, 1 new crime_type leaf
created (2 records retagged so far).**

## Record 367

"Summary conviction of Mary Ashton for trading as a petty chapman
without being licensed. Offence committed at the township of Whitby on
5 August 1857. Case heard at Whitby" -- defendant Mary Ashton, no home
stated, correctly blank. Location=Whitby, crime type=licensing offence
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-367 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 40
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 11 occupation fixes, 1 office fix, 1 new crime_type leaf
created (2 records retagged so far).**

## Record 368

"Summary conviction of Thomas Atkinson of the township of Whitby
innkeeper for assaulting Charles Tempest Clarkson one of the
constables for the North Riding in the execution of his duty. Offence
committed at the township of Whitby on 16 October 1869. Whitby Strand
- case heard at Whitby" -- defendant Thomas Atkinson (Whitby,
innkeeper), victim Charles Tempest Clarkson (full name incl. middle
name captured, occupation constable for the North Riding). Locations
and crime type (assaulting a police officer) match. Already correctly
linked via related_conviction to 332 (same defendant/offence date).

**OK — no changes.**

---

**Progress: records 1-368 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 40
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 11 occupation fixes, 1 office fix, 1 new crime_type leaf
created (2 records retagged so far).**

## Record 369

"Summary conviction of Francis Fewster of the township of Whitby jet
worker for being drunk and disorderly in Baxtergate; on the oath of
William Holmes of the township of Whitby police constable. Offence
committed at the township of Whitby on 14 October 1876. Whitby Strand
- case heard at Whitby" -- defendant Francis Fewster (Whitby, jet
worker), informant William Holmes (Whitby, police constable).
Location of offence = Baxtergate (West Cliff → Whitby), existing
precedent. Crime type=drunk and disorderly matches. Already correctly
linked via related_conviction to 1959 (same date/street/charge, same-
beat pattern).

**OK — no changes.**

---

**Progress: records 1-369 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 40
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 11 occupation fixes, 1 office fix, 1 new crime_type leaf
created (2 records retagged so far).**

## Record 370

"Summary conviction of Ralph Jordison of the township of Whitby
labourer for playing booking (a game of chance) in the New Quay.
Offence committed at the township of Whitby on 27 July 1889. Whitby
Strand Petty Sessional division - case heard at Whitby" -- defendant
Ralph Jordison (Whitby, labourer). Location of offence = New Quay
(West Cliff → Whitby), existing precedent. Crime type=gaming/gambling
offence, correct for "booking". Already part of a larger existing
same-incident cluster (related_conviction to 400, 412, 430, 442 --
same date/street/charge, likely one gambling raid, several people
prosecuted).

**OK — no changes.**

---

**Progress: records 1-370 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 40
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 11 occupation fixes, 1 office fix, 1 new crime_type leaf
created (2 records retagged so far).**

## Record 371

"Summary conviction of William Stonehouse for assaulting Thomas Skerry
of Whitby flaxdresser, by striking him several blows over the head and
arms. Offence committed at the township of Whitby on the morning of
Sunday 19 July 1835. Division of Whitby Strand - case heard at Whitby"
-- defendant William Stonehouse, no home stated, correctly blank.
Victim Thomas Skerry (Whitby, flaxdresser). Locations and crime type
(assault) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-371 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 40
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 11 occupation fixes, 1 office fix, 1 new crime_type leaf
created (2 records retagged so far).**

## Record 372

"Summary conviction of George Wellburn of the township of Fylingdales
farmer for trespassing in the daytime in search of game on waste or
common land belonging to George Cholmley esquire as lord of the manor
of Fylingdales. Offence committed at the township of Fylingdales on 20
December 1847. Case heard at Whitby" -- defendant George Wellburn
(Fylingdales, farmer). Landowner George Cholmley (person 6645,
separate row per no-cross-merge). Same landowner, offence, and offence
date as record 366 (Robert Stephenson) -- Pattern 2, one incident, two
men prosecuted separately. Locations and crime type (poaching) match.

**FIXED — set person 6645 (George Cholmley) office = "Lord of the
Manor of Fylingdales" (per the record-366 precedent); added
related_conviction link 366-372. Record 366's log entry retroactively
annotated.**

---

**Progress: records 1-372 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 41
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 11 occupation fixes, 2 office fixes, 1 new crime_type
leaf created (2 records retagged so far).**

## Record 373

"Summary conviction of Thomas Jackson a suspected person and reputed
thief for frequenting the river Esk with intent to commit felony.
Offence committed at the parish of Whitby on 11 September 1857. Case
heard at Whitby" -- defendant Thomas Jackson (person 411, separate row
per no-cross-merge, even though likely the same recurring individual
as record 349's Thomas Jackson -- correctly not linked/merged, and no
related_conviction fabricated since these are different offence
dates/incidents). "A suspected person and reputed thief" -- same
descriptive-label pattern as 349, correctly not force-fit into
name_postfix. Location of offence includes River Esk (397, under a
"Rivers" node), consistent with the established named-rivers cross-
parish handling. Crime type=vagrancy, correct for the "frequenting...
with intent to commit felony" statutory offence.

**OK — no changes.**

---

**Progress: records 1-373 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 41
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 11 occupation fixes, 2 office fixes, 1 new crime_type
leaf created (2 records retagged so far).**

## Record 374

"Summary conviction of John McCloine of the township of Whitby common
lodging house keeper for not thoroughly cleansing the bedding and bed
covers in use in his lodging house. Offence committed at the township
of Whitby on 19 October 1869. Whitby Strand - case heard at Whitby" --
defendant John McCloine (Whitby, common lodging house keeper).
Locations match. Crime type was wrong: tagged "licensing offence" (23)
while 6 other identical "not cleansing lodging house bedding" records
(219, 270, 1486, 1895, 5642, 5695) all use "public health offence"
(37) -- clear precedent, this was the sole outlier.

**FIXED — retagged crime_type from 23 (licensing offence) to 37
(public health offence). Verified via direct query.**

---

**Progress: records 1-374 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 41
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 11 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (2 records
retagged so far).**

## Record 375

"Summary conviction of Robert Foster of the township of Whitby coal
porter for being drunk and disorderly in Haggersgate; on the oath of
George Hewison and John Alderson Wallace both of the township of
Whitby police constables. Offence committed at the township of Whitby
on 14 October 1876. Whitby Strand - case heard at Whitby" -- defendant
Robert Foster (Whitby, coal porter), both informants captured (George
Hewison, John Alderson Wallace incl. middle name). Location of offence
= Haggersgate (West Cliff → Whitby), existing precedent. Crime
type=drunk and disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-375 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 41
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 11 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (2 records
retagged so far).**

## Record 376

"Summary conviction of Thomas Walker of the township of Whitby tailor
for being drunk and disorderly in St Ann's Staith. Offence committed
at the township of Whitby on 28 July 1889. Whitby Strand Petty
Sessional division - case heard at Whitby" -- defendant Thomas Walker
(person 414, separate row from record 331's Thomas Walker per no-
cross-merge -- different conviction, different occupation, clearly a
different real person). Location of offence = St Ann's Staith (West
Cliff → Whitby), existing precedent. Crime type=drunk and disorderly
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-376 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 41
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 11 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (2 records
retagged so far).**

## Record 377

"Summary conviction of Fanny Mackey for assaulting Eleanor Law of
Whitby singlewoman. Offence committed at the township of Whitby on 1
August 1835. Costs paid to William Wilkinson constable of Whitby.
Division of Whitby Strand - case heard at Whitby" -- defendant Fanny
Mackey, no home stated, correctly blank. Victim Eleanor Law (Whitby).
William Wilkinson correctly captured with role "recipient of costs
payment" (occupation constable of Whitby). Locations and crime type
(assault) match. No related_conviction.

Eleanor Law's text states "singlewoman" but `person_occupation` had no
link -- another instance of the tracked marital-status-occupation gap.

**FIXED — added missing occupation link: person 6648 (Eleanor Law) →
occupation 337 (singlewoman). Verified via direct query.**

---

**Progress: records 1-377 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 41
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 12 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (2 records
retagged so far).**

## Record 378

"Summary conviction of James Newton of the township of Egton for
assaulting Luke Hoggart of the township of Egton by seizing him by his
thigh and threatening to throw him behind the fire in his [Hoggart's]
dwelling house. Offence committed at the township of Egton on 14
January 1848. Division of Whitby Strand - case heard at Whitby" --
defendant James Newton (Egton), victim Luke Hoggart (Egton). Locations
and crime type (assault) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-378 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 41
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 12 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (2 records
retagged so far).**

## Record 379

"Summary conviction of Mark Herbert of the township of Fylingdales
farmer for being drunk; on the oath of George Bushell of the township
of Fylingdales police constable. Offence committed at the township of
Fylingdales on 11 September 1857. Case heard at Whitby" -- defendant
Mark Herbert (Fylingdales, farmer), informant George Bushell
(Fylingdales, police constable). Locations and crime type
(drunkenness) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-379 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 41
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 12 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (2 records
retagged so far).**

## Record 380

"Summary conviction of Joseph Priestley [Priestly] for assaulting
Thomas Bowron a police constable in the execution of his duty. Offence
committed at the township of Egton on 5 November 1869. Whitby Strand -
case heard at Whitby" -- defendant Joseph Priestley, bracketed
alternate spelling "Priestly" correctly captured in the alias field.
Victim Thomas Bowron (police constable). Locations and crime type
(assaulting a police officer) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-380 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 41
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 12 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (2 records
retagged so far).**

## Record 381

"Summary conviction of Douglas Munroe of the township of Ruswarp
hawker for being drunk and disorderly in Baxtergate. Offence committed
at the township of Whitby on 21 October 1876. Whitby Strand - case
heard at Whitby" -- defendant Douglas Munroe (home=Ruswarp, correctly
distinct from offence location). Location of offence = Baxtergate
(West Cliff → Whitby), existing precedent. Crime type=drunk and
disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-381 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 41
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 12 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (2 records
retagged so far).**

## Record 382

"Summary conviction of William Agar of Blacksmith's Arms Yard in the
township of Whitby for maliciously killing five young ducks, the
property of William Spence. Offence committed at the parish of Whitby
on 1 July 1889. Whitby Strand Petty Sessional division - case heard at
Whitby" -- defendant William Agar, home=Blacksmith's Arms Yard (39,
existing precedent under Church Street/East Cliff). Same property
owner, ducks, and offence date as record 358 (William Tose) -- Pattern
2, one incident, two men prosecuted separately. Crime type=malicious/
property damage matches.

**FIXED — added related_conviction link 358-382 (same owner/property/
date). Record 358's log entry retroactively annotated.**

---

**Progress: records 1-382 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 42
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 12 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (2 records
retagged so far).**

## Record 383

"Summary conviction of Thomas Hill of Whitby joiner for assaulting
Sarah Turner of Ruswarp singlewoman. Offence committed at the township
of Ruswarp on 24 July 1835. Division of Whitby Strand - case heard at
Whitby" -- defendant Thomas Hill (Whitby, joiner), victim Sarah Turner
(Ruswarp). Locations and crime type (assault) match. On the tracked
marital-status-occupation-gap list: Sarah Turner's text states
"singlewoman" but `person_occupation` had no link.

**FIXED — added missing occupation link: person 6654 (Sarah Turner) →
occupation 337 (singlewoman). Verified via direct query.**

---

**Progress: records 1-383 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 42
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 13 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (2 records
retagged so far).**

## Record 384

"Summary conviction of John Smith and Patrick Cock, both of the
township of Hinderwell labourers, for wilfully breaking a pane of
glass value 1s in the window of the dwelling house of John Peacock
overseer of the poor of the township of Hinderwell. Offence committed
at the township of Hinderwell on 16 January 1848. Case heard at
Whitby" -- two co-defendants (John Smith, Patrick Cock, both
Hinderwell labourers). Property owner John Peacock, "overseer of the
poor of the township of Hinderwell" already captured as occupation
(matches existing convention -- parochial offices go in occupation,
not the aristocratic-pedigree office field). Locations and crime type
(malicious/property damage, correct -- ordinary glass-breaking, not
the workhouse-clothes pattern) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-384 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 42
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 13 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (2 records
retagged so far).**

## Record 385

"Summary conviction of John Furniss late of the parish of Hartlepool
in county Durham fisherman for wilfully damaging two herring nets
value £5, the property of Robert Harrison; on the oath of the said
Robert Harrison of the parish of Durham [sic] fisherman. Offence
committed at the parish of Whitby on 28 September 1857. Case heard at
Whitby" -- defendant John Furniss (home=Hartlepool), property owner
Robert Harrison (home=Durham, captured literally as the text states --
the "[sic]" appears to flag the original clerk's own inconsistency
between "county Durham" for Furniss vs. "parish of Durham" for
Harrison, not an extraction error; captured as stated rather than
corrected, matching the no-fabrication rule). Locations and crime type
(malicious/property damage, correct -- ordinary net damage) match. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-385 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 42
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 13 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (2 records
retagged so far).**

## Record 386

"Summary conviction of Catherine Hunt of the township of Whitby tramp
for being drunk; on the oath of Charles Albert Martindale of the
township of Whitby police constable. Offence committed at the
township of Whitby on 4 November 1869. Whitby Strand - case heard at
Whitby" -- defendant Catherine Hunt, occupation "tramp" matches
established occupation category (id 373). Informant Charles Albert
Martindale (full name incl. middle name captured). Locations and crime
type (drunkenness) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-386 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 42
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 13 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (2 records
retagged so far).**

## Record 387

"Summary conviction of John McCloin of the township of Whitby hawker
for being drunk and disorderly in Henrietta Street. Offence committed
at the township of Whitby on 29 October 1876. Whitby Strand - case
heard at Whitby" -- defendant John McCloin (hawker) -- distinct from
record 374's John McCloine (common lodging house keeper, different
date/offence) despite similar spelling; correctly kept as a separate
person, no fabricated merge. Location of offence = Henrietta Street
(East Cliff → Whitby), existing precedent. Crime type=drunk and
disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-387 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 42
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 13 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (2 records
retagged so far).**

## Record 388

"Summary conviction of Eleanor Olliver wife of Robert Olliver of the
township of Hawsker cum Stainsacre iron worker for assaulting Mary Ann
Corser. Offence committed at the township of Hawsker cum Stainsacre on
6 July 1889. Whitby Strand Petty Sessional division - case heard at
Whitby" -- defendant Eleanor Olliver, spouse Robert Olliver
(Hawsker-cum-Stainsacre, iron worker, wife relationship present),
victim Mary Ann Corser (full name incl. middle name captured).
Locations and crime type (assault) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-388 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 42
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 13 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (2 records
retagged so far).**

## Record 389

"Summary conviction of Thomas Millighan for selling needles without
having a hawker's licence; on the information of Robert Kirby of
Whitby sub-distributor of stamps. Offence committed at the township of
Scarborough on 10 September 1835. Case heard at Whitby" -- defendant
Thomas Millighan, no home stated, correctly blank. Informant Robert
Kirby (Whitby, sub-distributor of stamps) matches precedent. Location
of offence = Scarborough (255), existing precedent. Crime
type=licensing offence matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-389 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 42
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 13 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (2 records
retagged so far).**

## Record 390

"Summary conviction of Joseph Evans for wilfully destroying his own
clothes while being relieved in the Whitby Union workhouse. Offence
committed at the township of Hawsker cum Stainsacre on 14 January
1848. Case heard at Whitby" -- defendant Joseph Evans, no home/
occupation stated, correctly blank. Locations: Union Workhouse (81) +
Hawsker-cum-Stainsacre, same dual-location pattern as records 324/330/
360. On the tracked "destroying own clothes" crime_type list (was
tagged 60 malicious/property damage).

**FIXED — retagged crime_type from 60 to 73 (destroying own clothes).
Verified via direct query.**

---

**Progress: records 1-390 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 42
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 13 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 391

"Summary conviction of James Haley late of the township of Whitby
labourer for assaulting and resisting Hugh McGregor in the execution
of his office; on the oath of the said Hugh McGregor of the township
of Ruswarp superintendent of police and constable for the North
Riding. Offence committed at the township of Whitby on 22 September
1857. Case heard at Whitby" -- defendant James Haley (Whitby,
labourer), victim Hugh McGregor (Ruswarp, superintendent of police and
constable for the North Riding -- occupation field, "in the execution
of his office" is period phrasing, not our office field). Spelling
"McGregor" matches this record's own text exactly (distinct from
record 319's "MacGregor" -- different person row, correctly not
merged). Locations and crime types match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-391 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 42
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 13 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 392

"Summary conviction of John Wilks of the township of Lythe farm
servant for trespassing in the daytime in pursuit of conies on land in
the possession and occupation of Joseph Cranston. Offence committed at
the township of Lythe on 31 October 1869. Whitby Strand - case heard
at Whitby" -- defendant John Wilks (Lythe, farm servant), landowner
Joseph Cranston. Locations and crime type (poaching) match; species
detail ("conies" = rabbits) preserved in charge_description, no
dedicated game_species field to check against. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-392 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 42
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 13 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 393

"Summary conviction of Edward Ayre of the township of Whitby jet
worker for assaulting Sarah Ann Readman; on the oath of the said Sarah
Ann Readman of the township of Whitby singlewoman. Offence committed
at the township of Whitby on 26 July 1876. Whitby Strand - case heard
at Whitby" -- defendant Edward Ayre, same offence date/occupation/
township as record 321's Edward Jameson Ayre (this record's text just
doesn't state the middle name) -- clearly the same real person, same
arrest, different charge. Victim Sarah Ann Readman (full name incl.
middle name captured). On the tracked marital-status-occupation-gap
list: her text states "singlewoman" but `person_occupation` had no
link.

**FIXED — added missing occupation link: person 6662 (Sarah Ann
Readman) → occupation 337 (singlewoman). Added related_conviction link
321-393 (same defendant/offence date). Record 321's log entry
retroactively annotated.**

---

**Progress: records 1-393 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 43
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 394

"Summary conviction of John Parkin of the township of Whitby labourer
for being drunk and disorderly in St Ann's Staith. Offence committed
at the township of Whitby on 27 July 1889. Whitby Strand Petty
Sessional division - case heard at Whitby" -- defendant John Parkin
(Whitby, labourer). Location of offence = St Ann's Staith (West Cliff
→ Whitby), existing precedent. Crime type=drunk and disorderly
matches. Already correctly linked via related_conviction to 418
(same-beat pattern).

**OK — no changes.**

---

**Progress: records 1-394 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 43
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 395

"Summary conviction of William Collins late of Cumberland labourer for
selling spoons, razors and braces without having a hawker's licence;
on the information of Robert Kirby of Whitby sub-distributor of
stamps. Offence committed at the township of Whitby on 19 September
1835. Case heard at Whitby" -- defendant William Collins (home=
Cumberland, id 310, existing precedent). Informant Robert Kirby
(Whitby, sub-distributor of stamps) matches. Locations and crime type
(licensing offence) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-395 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 43
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 396

"Summary conviction of James Cunningham apprentice to John Smith of
the township of Whitby ship owner, for absenting himself from the
service of his master for about ten hours; on the information of the
said John Smith. Offence committed on 19 February 1848. Case heard at
Whitby" -- defendant James Cunningham (apprentice), John Smith
(Whitby, ship owner) -- apprentice relationship link present. Role for
John Smith is "informant" rather than "master"; checked precedent --
records 402 and 450 use the identical "on the information of the said
[master]" phrasing and are also role=informant, so this is a
consistent, textually-justified distinction (not the bare "his
master's service" framing that gets role=master, e.g. record 331), not
an inconsistency. Crime type=master and servant offence, correct.

**OK — no changes.**

---

**Progress: records 1-396 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 43
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 397

"Summary conviction of Richard Hill the younger of the township of
Newholm cum Dunsley labourer for killing a hare; on the information of
Henry William Siggs of the township of Lythe gamekeeper and others.
Offence committed at the township of Lythe on Sunday 13 September
1857. Case heard at Whitby" -- defendant Richard Hill, name_postfix
"the younger" matches established generational-qualifier convention.
Informant Henry William Siggs (full name incl. middle name captured,
Lythe, gamekeeper). "And others" correctly has no fabricated person
row. Locations and crime type (poaching) match.

**OK — no changes.** [Corrected 2026-07-30: record 403 (Joseph
Breckon, same gamekeeper/offence/location/date) surfaced the same-beat
pattern; related_conviction 397-403 added when 403 was reached. Also,
record 409 (Robert Goodwill, same gamekeeper/location/date) added a
third related_conviction link, 397-409, when 409 was reached.]

---

**Progress: records 1-397 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 43
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 398

"Summary conviction of James Chappel of the township of Eskdaleside
miner for assaulting Joseph Robinson; on the oath of the said Joseph
Robinson of the township of Eskdaleside manager of ironstone mines.
Offence committed at the township of Eskdaleside on 3 December 1869.
Whitby Strand - case heard at Whitby" -- defendant James Chappel
(Eskdaleside, miner), victim Joseph Robinson (Eskdaleside, manager of
ironstone mines). Locations and crime type (assault) match. Already
correctly linked via related_conviction to 525 (same defendant/offence
date).

**OK — no changes.**

---

**Progress: records 1-398 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 43
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 399

"Summary conviction of William Cuthbert of Runswick in the township of
Hinderwell for trespassing in the daytime in search of conies in a
close of land in the possession and occupation of Thomas Vaughan.
Offence committed at the township of Barnby on 18 November 1876.
Whitby Strand - case heard at Whitby" -- defendant William Cuthbert,
home=Runswick (298, under Hinderwell 88), existing precedent. Landowner
Thomas Vaughan. Locations (offence at Barnby, under Hinderwell) and
crime type (poaching) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-399 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 43
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 400

"Summary conviction of Harold Parkinson of the township of Whitby jet
worker for playing booking (a game of chance) in the New Quay. Offence
committed at the township of Whitby on 27 July 1889. Whitby Strand
Petty Sessional division - case heard at Whitby" -- defendant Harold
Parkinson (Whitby, jet worker). Location of offence = New Quay
(existing precedent). Crime type=gaming/gambling offence matches.
Already part of the existing gambling-raid cluster (related_conviction
to 370, 412, 430, 442).

**OK — no changes.**

---

**Progress: records 1-400 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 43
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 401

"Summary conviction of Thomas Warrener of Pickering common carrier for
having 34 salmon in his possession; on the complaint of William
Wilkinson of the township of Whitby police officer. Offence committed
at the township of Whitby on 10 October 1835. Case heard at Whitby" --
defendant Thomas Warrener, home=Pickering (277), existing precedent.
Informant William Wilkinson (Whitby, police officer). Crime
type=poaching, correct for unlawful possession of salmon (species
detail preserved in charge_description). Locations match. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-401 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 43
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 402

"Summary conviction of George Borrows apprentice to Paul Stokill of
the township of Ruswarp ship owner, for absenting himself from the
service of his master for about ten hours; on the information of the
said Paul Stokill. Offence committed on 19 February 1848. Case heard
at Whitby" -- defendant George Borrows (apprentice), Paul Stokill
(Ruswarp, ship owner), role=informant already checked as correct
precedent at record 396. Apprentice relationship link present. Crime
type=master and servant offence, correct. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-402 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 43
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 403

"Summary conviction of Joseph Breckon of the township of Whitby
stonemason for killing a hare; on the information of Henry William
Siggs of the township of Lythe gamekeeper and others. Offence
committed at the township of Lythe on Sunday 13 September 1857. Case
heard at Whitby" -- defendant Joseph Breckon (Whitby, stonemason).
Same informant/gamekeeper, offence, location, and date as record 397
(Richard Hill) -- same-beat pattern, different defendant. Locations
and crime type (poaching) match.

**FIXED — added related_conviction link 397-403 (same gamekeeper/
offence/location/date). Record 397's log entry retroactively
annotated.** [Corrected 2026-07-30: record 409 (Robert Goodwill, same
gamekeeper/location/date) added a third related_conviction link,
403-409, when 409 was reached -- full all-pairs linking for this
three-record cluster.]

---

**Progress: records 1-403 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 44
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 404

"Summary conviction of Catherine Dowse of the township of Whitby
hawker for being drunk. Offence committed at the township of Whitby on
3 December 1869. Whitby Strand - case heard at Whitby" -- defendant
Catherine Dowse (Whitby, hawker). Locations and crime type
(drunkenness) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-404 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 44
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 405

"Summary conviction of Thomas Dixon of the township of Whitby cartman
for trespassing in the daytime in search of game in a close of land in
the possession and occupation of Robert Robinson the younger. Offence
committed at the township of Hutton Mulgrave on 25 September 1876.
Whitby Strand - case heard at Whitby" -- defendant Thomas Dixon
(Whitby, cartman). Landowner Robert Robinson, name_postfix "the
younger" matches established precedent (same person id 6671 seen
before). Location of offence = Hutton Mulgrave (274, under Lythe),
existing precedent. Crime type=poaching matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-405 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 44
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 406

"Summary conviction of John Dean of the township of Ruswarp for
stealing a quantity of peas value 2s 6d, the property of William
Gibbons and growing in his garden. Offence committed at the township
of Ruswarp on 11 July 1889. Whitby Strand Petty Sessional division -
case heard at Whitby" -- defendant John Dean (Ruswarp), no occupation
stated, correctly blank. Property owner William Gibbons. Locations and
crime type (theft) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-406 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 44
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 407

"Summary conviction of William Tyerman of Whitby innkeeper for opening
his premises between 10.30 and 12 o'clock on a Sunday morning during
the time of divine service in church. Offence committed at the parish
of Whitby on 12 October 1834. Endorsed "26 October 1834"" -- defendant
William Tyerman (Whitby, innkeeper). No court location captured,
correctly matches text -- this "Endorsed [date]" ending (instead of
"case heard at X") is a known recurring document structure, 23 records
use it corpus-wide, not unique to this one. Crime type=licensing
offence matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-407 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 44
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 408

"Summary conviction of David Miller for lodging in an outhouse or open
shed with no visible means of subsistence. Offence committed at the
township of Ruswarp on 20 February 1848. Case heard at Whitby" --
defendant David Miller, no home/occupation stated, correctly blank.
Locations and crime type (vagrancy) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-408 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 44
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 409

"Summary conviction of Robert Goodwill of the township of Whitby
stonemason for using a gun to kill game; on the information of Henry
William Siggs of the township of Lythe gamekeeper and others. Offence
committed at the township of Lythe on Sunday 13 September 1857. Case
heard at Whitby" -- defendant Robert Goodwill (Whitby, stonemason).
Same informant/gamekeeper, location, and date as records 397/403 --
same-beat pattern, third member of this cluster. Locations and crime
type (poaching) match.

**FIXED — added related_conviction links 397-409 and 403-409 (full
all-pairs linking for the three-record cluster). Records 397 and 403's
log entries retroactively annotated.**

---

**Progress: records 1-409 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 410

"Summary conviction of Daniel George Robinson of the township of
Whitby labourer for being drunk; on the oath of Charles Tempest
Clarkson of the township of Whitby police superintendent. Offence
committed at the township of Whitby on 27 November 1869. Whitby Strand
- case heard at Whitby" -- defendant Daniel George Robinson (full name
incl. middle name), informant Charles Tempest Clarkson (same officer
as records 356/368, here "police superintendent" per this record's own
wording). Locations and crime type (drunkenness) match. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-410 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 411

"Summary conviction of Blanche Wellburn of the township of Whitby for
being drunk and disorderly in Middle Walk; on the oath of John
Alderson Wallace of the township of Whitby police constable. Offence
committed at the township of Whitby on 31 October 1876. Whitby Strand
- case heard at Whitby" -- defendant Blanche Wellburn, no occupation
stated, correctly blank. Informant John Alderson Wallace (full name
incl. middle name captured). Location of offence = Middle Walk (90,
under Church Street 26), existing precedent. Crime type=drunk and
disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-411 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 412

"Summary conviction of Albert Pearson of the township of Whitby jet
worker for playing booking (a game of chance) in the New Quay. Offence
committed at the township of Whitby on 27 July 1889. Whitby Strand
Petty Sessional division - case heard at Whitby" -- defendant Albert
Pearson (Whitby, jet worker). Location and crime type (gaming/gambling
offence) match. Full all-pairs linking already present within the
gambling cluster (370, 400, 430, 442).

**OK — no changes.**

---

**Progress: records 1-412 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 413

"Summary conviction of Joseph Jackson of Whitby innkeeper for opening
his premises between 10.30 and 12 o'clock on a Sunday morning during
the time of divine service in church. Offence committed at the parish
of Whitby on 19 October 1834. Endorsed "8 October 1834"" -- defendant
Joseph Jackson (Whitby, innkeeper). Part of a batch of ~11 near-
identical "opening premises during divine service" convictions
(407/413/419/425/431/437/443/449/455/459/464), all convicted 1834-10-
28. 9 of the 11 share the identical "Endorsed '8 October 1834'" text
despite differing offence dates (12/19 October) -- a genuine but
faithfully-preserved historical oddity (no dedicated endorsed-date
schema field exists), not an extraction error. No named informant/
officer stated in any of these records' text, so there's no shared
identifiable party to justify a related_conviction link under the
established same-beat criteria -- correctly left unlinked despite the
surface similarity. Location and crime type (licensing offence) match.

**OK — no changes.**

---

**Progress: records 1-413 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 414

"Summary conviction of Thomas Golding for begging. Offence committed
at the township of Whitby on 4 March 1848. Case heard at Whitby" --
defendant Thomas Golding, no home/occupation stated, correctly blank.
Location=Whitby, crime type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-414 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 415

"Summary conviction of Isaac Patton late of the township of Hinderwell
labourer for killing three hares at night on Runswick Lane. Offence
committed at the township of Mickleby on 3 October 1857. Case heard at
Whitby" -- defendant Isaac Patton (home=Hinderwell). Both stated
locations captured: Mickleby (175, the offence township) and Runswick
Lane (390, the specific site, under Runswick/Hinderwell) -- consistent
with the dual-location convention. Crime type=poaching matches.
Already correctly linked via related_conviction to 421 and 427 (same-
beat cluster).

**OK — no changes.**

---

**Progress: records 1-415 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 416

"Summary conviction of Thomas Joyce of the township of Whitby jet
worker for wilfully damaging the glass of windows, the property of
Benjamin Garminsway; on the oath of John Ryder of the township of
Whitby inspector of police and others. Offence committed at the
township of Whitby on 8 December 1869. Whitby Strand - case heard at
Whitby" -- defendant Thomas Joyce (Whitby, jet worker), property owner
Benjamin Garminsway, informant John Ryder (Whitby, inspector of
police). Locations and crime type (malicious/property damage) match.
No related_conviction.

**OK — no changes.**

---

**Progress: records 1-416 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 417

"Summary conviction of Charles Wright, William Beckham and John
Appleby, all of Liverton miners, for trespassing in the daytime in
search of conies on a parcel of land in the possession and occupation
of William Pearson and others. Offence committed at the township of
Roxby on 23 October 1876. Whitby Strand - case heard at Whitby" --
three co-defendants (home=Liverton, id 334, miners). Landowner William
Pearson; "and others" correctly not fabricated. Location of offence =
Roxby (161, under Hinderwell 88), existing precedent. Crime
type=poaching matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-417 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 418

"Summary conviction of Hannah Mary Pearson wife of William Pearson of
the township of Whitby labourer for being drunk and disorderly in St
Ann's Staith. Offence committed at the township of Whitby on 27 July
1889. Whitby Strand Petty Sessional division - case heard at Whitby"
-- defendant Hannah Mary Pearson (full name incl. middle name), spouse
William Pearson (Whitby, labourer -- unrelated to record 417's
landowner William Pearson, correctly separate person, no fabricated
link). Wife relationship present. Location of offence = St Ann's
Staith (West Cliff → Whitby), existing precedent. Crime type=drunk and
disorderly matches. Already correctly linked via related_conviction to
394 (same-beat pattern).

**OK — no changes.**

---

**Progress: records 1-418 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 419

"Summary conviction of Robert Harrison of Whitby innkeeper for opening
his premises between 10.30 and 12 o'clock on a Sunday morning during
the time of divine service in church. Offence committed at the parish
of Whitby on 12 October 1834. Endorsed "8 October 1834"" -- defendant
Robert Harrison (Whitby, innkeeper). Part of the same "opening
premises during divine service" batch as 413 -- no named informant, so
correctly left unlinked per the reasoning already established there.
Location and crime type (licensing offence) match.

**OK — no changes.**

---

**Progress: records 1-419 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 420

"Summary conviction of Abraham Brown and Dennis Hyde for begging.
Offence committed at the township of Ruswarp on 4 March 1848. Case
heard at Whitby" -- two co-defendants, no home/occupation stated,
correctly blank. Location=Ruswarp, crime type=begging matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-420 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 421

"Summary conviction of John Craven late of the township of Hinderwell
labourer for killing three hares at night on Runswick Lane. Offence
committed at the township of Mickleby on 3 October 1857. Case heard at
Whitby" -- defendant John Craven (Hinderwell). Both stated locations
captured (Mickleby, Runswick Lane). Crime type=poaching matches.
Already correctly linked to both 415 and 427 within the cluster.

**OK — no changes.**

---

**Progress: records 1-421 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 422

"Summary conviction of Richard Wastill of the township of Whitby jet
worker for being drunk. Offence committed at the township of Whitby on
31 October 1869. Whitby Strand - case heard at Whitby" -- defendant
Richard Wastill (Whitby, jet worker). Locations and crime type
(drunkenness) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-422 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 423

"Summary conviction of Andrew Hill of the township of Whitby jet
worker for being drunk on the licensed premises of Joseph Garside
Rhodes and refusing to leave when asked by John Alderson Wallace a
police constable. Offence committed at the township of Whitby on 30
October 1876. Whitby Strand - case heard at Whitby" -- defendant
Andrew Hill (Whitby, jet worker), licensee Joseph Garside Rhodes
(full name incl. middle name), informant John Alderson Wallace (full
name incl. middle name, same constable as record 411/375). Locations
and crime types (drunkenness, refusal to quit licensed premises)
match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-423 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 424

"Summary conviction of George Porritt of the township of Hinderwell
fisherman for being drunk and disorderly in Staithes town street.
Offence committed at the township of Hinderwell on 14 September 1889.
Whitby Strand Petty Sessional division - case heard at Whitby" --
defendant George Porritt (Hinderwell, fisherman). "Staithes town
street" boilerplate correctly resolves to Staithes (163, under
Hinderwell), matching the established "X town street" convention.
Crime type=drunk and disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-424 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 425

"Summary conviction of George Frank of Whitby innkeeper for opening
his premises between 10.30 and 12 o'clock on a Sunday morning during
the time of divine service in church. Offence committed at the parish
of Whitby on 19 October 1834. Endorsed "8 October 1834"" -- defendant
George Frank (Whitby, innkeeper). Same batch as 413/419, no named
informant, correctly left unlinked. Location and crime type (licensing
offence) match.

**OK — no changes.**

---

**Progress: records 1-425 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 426

"Summary conviction of James Wilson for begging. Offence committed at
the township of Whitby on 3 March 1848. Case heard at Whitby" --
defendant James Wilson, no home/occupation stated, correctly blank.
Location=Whitby, crime type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-426 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 427

"Summary conviction of John Calvert late of the township of Hinderwell
for killing three hares at night on Runswick Lane. Offence committed
at the township of Mickleby on 3 October 1857. Case heard at Whitby"
-- defendant John Calvert (Hinderwell), no occupation stated, correctly
blank. Both stated locations captured. Crime type=poaching matches.
Already correctly linked to both 415 and 421 (fully linked cluster).

**OK — no changes.**

---

**Progress: records 1-427 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 428

"Summary conviction of George Jackson of the township of Lythe
carpenter for assaulting Arthur Hood. Offence committed at the
township of Lythe on 10 October 1869. Whitby Strand - case heard at
Whitby" -- defendant George Jackson (Lythe, carpenter), victim Arthur
Hood. Locations and crime type (assault) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-428 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 429

"Summary conviction of John Kilton of the township of Ruswarp
gentleman for being drunk and disorderly in North Road. Offence
committed at the township of Whitby on 4 November 1876. Whitby Strand
- case heard at Whitby" -- defendant John Kilton (Ruswarp), occupation
"gentleman" matches established occupation category (id 165). Location
of offence = North Road (91, West Cliff → Whitby), existing precedent.
Crime type=drunk and disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-429 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 430

"Summary conviction of Harry Webster of the township of Whitby jet
worker for playing booking (a game of chance) in the New Quay.
Offence committed at the township of Whitby on 27 July 1889. Whitby
Strand Petty Sessional division - case heard at Whitby" -- defendant
Harry Webster (Whitby, jet worker). Location and crime type
(gaming/gambling offence) match. Fully linked within the gambling
cluster (370, 400, 412, 442).

**OK — no changes.**

---

**Progress: records 1-430 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 431

"Summary conviction of Thomas Marshall of Whitby innkeeper for opening
his premises between 10.30 and 12 o'clock on a Sunday morning during
the time of divine service in church. Offence committed at the parish
of Whitby on 19 October 1834. Endorsed "8 October 1834"" -- defendant
Thomas Marshall (Whitby, innkeeper). Same batch as 413/419/425, no
named informant, correctly left unlinked. Location and crime type
(licensing offence) match.

**OK — no changes.**

---

**Progress: records 1-431 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 432

"Summary conviction of Ann Butler wife of Patrick Butler for begging.
Offence committed at the township of Whitby on 6 March 1848. Case
heard at Whitby" -- defendant Ann Butler, spouse Patrick Butler, wife
relationship present. Locations and crime type (begging) match. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-432 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

(Record 433 confirmed blacklisted/no row exists in summary_conviction,
expected gap -- same pattern as prior confirmed gaps.)

## Record 434

"Summary conviction of William Corpes of the township of Whitby jet
worker for being drunk. Offence committed at the township of Whitby on
2 October 1869. Whitby Strand - case heard at Whitby" -- defendant
William Corpes (Whitby, jet worker). Locations and crime type
(drunkenness) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-434 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 435

"Summary conviction of Richard Purvis of the township of Whitby
shoemaker for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 8 November 1876. Whitby Strand
- case heard at Whitby" -- defendant Richard Purvis (Whitby,
shoemaker). Location of offence = Church Street (East Cliff → Whitby),
existing precedent. Crime type=drunk and disorderly matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-435 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 436

"Summary conviction of Edward Ruehorn of the township of Whitby
labourer for assaulting William Lee one of the constables of the North
Riding in the execution of his duty. Offence committed at the township
of Whitby on 27 July 1889. Whitby Strand Petty Sessional division -
case heard at Whitby" -- defendant Edward Ruehorn (Whitby, labourer),
victim William Lee (constable of the North Riding). Locations and
crime type (assaulting a police officer) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-436 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 437

"Summary conviction of Henry Atley of Whitby innkeeper for opening his
premises between 10.30 and 12 o'clock on a Sunday morning during the
time of divine service in church. Offence committed at the parish of
Whitby on 19 October 1834. Endorsed "8 October 1834"" -- defendant
Henry Atley (Whitby, innkeeper). Same batch as 413/419/425/431, no
named informant, correctly left unlinked. Location and crime type
(licensing offence) match.

**OK — no changes.**

---

**Progress: records 1-437 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 438

"Summary conviction of Joseph Thompson for begging. Offence committed
at the township of Ruswarp on 6 March 1848. Case heard at Whitby" --
defendant Joseph Thompson, no home/occupation stated, correctly blank.
Location=Ruswarp, crime type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-438 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 439

"Summary conviction of Thomas Edwards of the township of Whitby sawyer
for assaulting Jane Wilmot of the township of Whitby widow. Offence
committed at the township of Whitby on 26 October 1855. Case heard at
Whitby" -- defendant Thomas Edwards (Whitby, sawyer), victim Jane
Wilmot (Whitby). Locations and crime type (assault) match. On the
tracked marital-status-occupation-gap list: Jane Wilmot's text states
"widow" but `person_occupation` had no link.

**FIXED — added missing occupation link: person 6683 (Jane Wilmot) →
occupation 384 (widow). Verified via direct query.**

---

**Progress: records 1-439 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**
